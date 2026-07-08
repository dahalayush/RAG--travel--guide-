from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_llm(question, context, location, permit):

    prompt = f"""
You are an expert Peru travel guide.

Traveller Information:
- Current Location: {location}
- Permit Status: {permit}

Instructions:
- Answer only using the provided context.
- If the answer is not available in the context, say:
  "I do not have enough information in my knowledge base."
- Keep answers clear and tourist-friendly.

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content


def guide_advice(location_name, description, permit):

    permit_text = (
        "The traveller already has a permit."
        if permit
        else
        "The traveller does not have a permit yet."
    )

    prompt = f"""
You are a professional Peru trekking guide.

Location:
{location_name}

Description:
{description}

Permit Status:
{permit_text}

Provide:

1. A short overview of this location.
2. One interesting fact.
3. One travel tip.
4. Advice before moving to the next location.

Keep the response under 150 words.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.5
    )

    return response.choices[0].message.content