import { ChatGroq } from "@langchain/groq";
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {ChatPromptTemplate} from "@langchain/core/prompts";
const conversations = new Map<string, BaseMessage[]>();

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
       
        if (req.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        if (req.method === 'POST') {
            try {
                const body = await req.json();
                const { message, threadId, isNewChat } = body;

               
                const currentThreadId = isNewChat ? uuidv4() : (threadId || uuidv4());

                const llm = new ChatGroq({
                    apiKey: process.env.GROQ_API_KEY,
                    model: "mixtral-8x7b-32768",
                    temperature: 0
                });

              
                let conversationHistory = conversations.get(currentThreadId) || [];
                
                if (isNewChat) {
                    
                    conversationHistory = [];
                }

               
                const userMessage = new HumanMessage(message);
                conversationHistory.push(userMessage);

                const promptTemplate = ChatPromptTemplate.fromMessages([
                    [
                        "system",
                        `You are a JavaScript assistant that responds only in MDX format. Your responses must include mdx syntax, such as headings, code blocks, and lists. Ensure your code is wrapped in proper code blocks using the language tag 'javascript' for syntax highlighting
                        The code blocks should have proper spacing and indentation. 
                        .`
                    ]
                ])

                const callModel = async (state: any) => {
                    const prompt = await promptTemplate.invoke(state);
                    
                    
                    const messages = [
                        ...conversationHistory.map((message) => ({
                            role: message instanceof HumanMessage ? "user" : "assistant",
                            content: message.content,
                        })),
                        { role: "system", content: prompt.toString() } 
                    ];

                  
                    const response = await llm.invoke(messages); 
                    return { messages: [response] }; 
                };

                const workflow = new StateGraph(MessagesAnnotation)
                    .addNode("model", callModel)
                    .addEdge(START, "model")
                    .addEdge("model", END);

                const memory = new MemorySaver();
                const appGraph = workflow.compile({ checkpointer: memory });
                const config = { configurable: { thread_id: currentThreadId } };

                const response = await appGraph.invoke({ messages: [userMessage] }, config);
                
               
                if (!response.messages || !Array.isArray(response.messages) || response.messages.length === 0) {
                    throw new Error("Invalid response format from model");
                }

                const lastMessage = response.messages[response.messages.length - 1];
                if (!(lastMessage instanceof AIMessage)) {
                    throw new Error("Expected AIMessage in response");
                }

            
                conversationHistory.push(lastMessage);
                conversations.set(currentThreadId, conversationHistory);

                const aiResponse = {
                    success: true,
                    data: {
                        role: "assistant",
                        content: lastMessage.content,
                        metadata: {
                            tokenUsage: lastMessage.additional_kwargs?.tokenUsage || 
                                      lastMessage.response_metadata?.tokenUsage,
                            finish_reason: lastMessage.additional_kwargs?.finish_reason || 
                                         lastMessage.response_metadata?.finish_reason
                        }
                    },
                    threadId: currentThreadId
                };

                return new Response(
                    JSON.stringify(aiResponse),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }
                    }
                );

            } catch (error) {
                console.error("Chat error:", error);
                return new Response(
                    JSON.stringify({ 
                        success: false, 
                        error: "Failed to process chat message",
                        details: error instanceof Error ? error.message : "Unknown error"
                    }),
                    {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }
                    }
                );
            }
        }

        return new Response('Not Found', { status: 404 });
    },
});

console.log(`Server running at http://localhost:${server.port}`);