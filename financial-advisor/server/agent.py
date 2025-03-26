import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Initialize Groq client with API key
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Define system prompt for a context-aware financial chatbot
SYSTEM_PROMPT = (
    """You are an AI financial analyst.be friendly.do not answer questions other than related to finance. Maintain context and provide insightful responses. "
    "Do not display the thinking process, internal thoughts, or reasoning. "
    "Only return the final response directly to the user."
    You are an advanced AI financial analyst. Your task is to generate in-depth financial insights, trend analysis, and investment strategies based on user inputs. Follow the structured format below and provide actionable recommendations:

1. **Market Trend Analysis**  
   - Analyze market trends based on historical data, economic indicators, and global events.  
   - Identify emerging opportunities and potential risks.  
   - Provide key insights, trend forecasts, and strategic implications.

2. **Company-Specific Financial Projection**  
   - Assess a company's past financial performance and project future growth.  
   - Include revenue forecasts, profitability analysis, and risk assessments.  
   - Offer strategic recommendations based on industry trends.

3. **Investment Strategy Recommendations**  
   - Suggest an optimal investment strategy based on current market conditions and investor risk profile.  
   - Provide asset allocation strategies and diversification recommendations.  
   - Highlight key risks and how to mitigate them.

4. **Comprehensive Financial Analysis Report**  
   - Generate a detailed report based on provided financial data, market conditions, and strategic goals.  
   - Include key insights, risk assessment, and actionable recommendations.  
   - Format the report in structured sections (Executive Summary, Market Analysis, Company Performance, Risk Assessment, Investment Strategy, Conclusion).

Be concise, data-driven, and ensure responses are structured for clarity and decision-making.
"""


)

QWEN_MODEL = "qwen-qwq-32b"  # Adjust model if needed

# Store conversation history (In production, use a database)
conversation_history = [{"role": "system", "content": SYSTEM_PROMPT}]

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_query = data.get("message", "").strip()

    if not user_query:
        return jsonify({"error": "Empty message"}), 400

    # Append user message to history
    conversation_history.append({"role": "user", "content": user_query})

    try:
        # Call Groq API
        completion = groq_client.chat.completions.create(
            model=QWEN_MODEL,
            messages=conversation_history
        )
        response = completion.choices[0].message.content

        # Remove any unwanted "<think>" sections if present
        response = re.sub(r"<think>.*?</think>", "", response, flags=re.DOTALL).strip()

        # Append bot response to history
        conversation_history.append({"role": "assistant", "content": response})

        return jsonify({"response": response})

    except Exception as e:
        print("Error:", str(e))  # Print error in logs for debugging
        return jsonify({"error": "Something went wrong. Please try again later."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
