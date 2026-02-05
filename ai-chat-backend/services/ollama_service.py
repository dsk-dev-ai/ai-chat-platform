import subprocess

OLLAMA_PATH = r"C:\Users\kacha\AppData\Local\Programs\Ollama\ollama.exe"

def ask_ai(prompt):
    result = subprocess.run(
        [OLLAMA_PATH, "run", "llama3", prompt],
        capture_output=True,
        text=True,
        encoding="utf-8"
    )
    return result.stdout
