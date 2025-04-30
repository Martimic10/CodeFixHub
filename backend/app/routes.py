from fastapi import APIRouter
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()


class CodeRequest(BaseModel):
    code: str
    language: str

@router.post("/analyze")
async def analyze_code(request: CodeRequest):
    try:
        prompt = (
            f"You are an expert {request.language} developer. "
            f"Review the following code and fix any bugs, syntax issues, or logic errors. "
            f"Also explain what was fixed:\n\n{request.code}"
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a senior software engineer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )

        result = response.choices[0].message["content"]
        return {"result": result}

    except Exception as e:
        return {"error": str(e)}