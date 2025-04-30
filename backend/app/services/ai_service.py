import openai
import os
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_code(code: str, language: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"You are an expert at debugging, explaining, and optimizing {language} code."
                },
                {
                    "role": "user",
                    "content": f"Please analyze and fix this {language} code:\n\n{code}"
                }
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"An error occurred while analyzing the code: {str(e)}"