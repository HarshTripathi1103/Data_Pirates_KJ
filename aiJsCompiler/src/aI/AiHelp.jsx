import { useState,useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import * as runtime from "react/jsx-runtime";
import  * as provider from "@mdx-js/react";
import {evaluate} from "@mdx-js/mdx";
const components = {
  pre: (props) => <div className="bg-gray-800 text-white p-4 rounded-md my-4 overflow-auto" {...props} />,
  code: (props) => <code className="bg-gray-100 text-red-500 p-1 rounded-md" {...props} />,
  h1: (props) => <h1 className="text-2xl font-bold mb-2" {...props} />,
  h2: (props) => <h2 className="text-xl font-semibold mb-2" {...props} />,
  p: (props) => <p className="mb-2" {...props} />,
  ul: (props) => <ul className="list-disc list-inside mb-2" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside mb-2" {...props} />,
  li: (props) => <li className="mb-1" {...props} />,
};
const MdxRender = ({ content }) => {
  const [mdxContent, setMdxContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const compileMdx = async () => {
      if (!content) return;
      
      try {
        const { default: Content } = await evaluate(content, {
          ...provider,
          ...runtime
        });
        setMdxContent(() => Content);
        setError(null);
      } catch (err) {
        console.error("MDX compilation error:", err);
        setError(err.message);
        setMdxContent(null);
      }
    };

    compileMdx();
  }, [content]);

  if (error) {
    return <div className="text-red-500">Error rendering content: {error}</div>;
  }

  if (!mdxContent) {
    return <div>Loading...</div>;
  }

  const MDXContent = mdxContent;
  return <MDXContent components={components} />;
};
const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={docco}>
      {value}
    </SyntaxHighlighter>
  );
};

const MessageContent = ({ content }) => {
  if (!content) return null;

  if (content.includes("```")) {
    return content.split("```").map((part, i) => {
      if (i % 2 === 1) {
        return <CodeBlock key={i} language="javascript" value={part} />;
      }
      return <MdxRender key={i} content={part} />;
    });
  }

  return <MdxRender content={content} />;
};

const AiHelp = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);

  // Send a message to the assistant
  const handleSend = async (isNewChat = false) => {
    if (!input.trim() && !isNewChat) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          threadId,
          isNewChat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (isNewChat) {
          setOutput([]);
        }

        setThreadId(data.threadId);
        setOutput((prev) => [
          ...prev,
          { role: "user", content: input },
          data.data,
        ]);
        setInput("");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setOutput((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setInput("");
    handleSend(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          New Chat
        </button>
      </div>

      <div className="space-y-4 mb-4">
        {output.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === "user" ? "bg-blue-100 ml-auto max-w-[80%]" : "bg-gray-100 mr-auto max-w-[80%]"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="prose">
                <MessageContent content={msg.content} />
              </div>
            ) : (
              <div>{msg.content}</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(false)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend(false)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AiHelp;
