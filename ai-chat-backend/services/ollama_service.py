import requests
from config import Config

if Config.USE_OPENAI:
    import openai
    openai.api_key = Config.OPENAI_API_KEY

def generate_reply(prompt):
    if Config.USE_OPENAI:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error: {str(e)}"
    else:
        # Use local Ollama LLM via API
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": Config.MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 150
                    }
                }
            )
            if response.status_code == 200:
                data = response.json()
                response_text = data.get("response", "").strip()
                if not response_text:
                    return "I'm sorry, I couldn't generate a response at this time."
                return response_text
            else:
                return f"Error: Ollama API returned {response.status_code}"
        except requests.exceptions.RequestException as e:
            return f"Error: Unable to connect to Ollama service. Please ensure Ollama is installed and running. {str(e)}"

# Backwards-compatible name expected by routes
def ask_llm(prompt):
    return generate_reply(prompt)
