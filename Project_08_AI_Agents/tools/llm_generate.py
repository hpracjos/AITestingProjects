import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_test_plan(issues_file, provider="groq"):
    if not os.path.exists(issues_file):
        print(json.dumps({"error": f"Issues file {issues_file} not found."}))
        sys.exit(1)
        
    with open(issues_file, 'r') as f:
        issues = json.load(f)
        
    context = "\n".join([f"Key: {i['key']}\nSummary: {i['summary']}\nDescription: {i['description']}" for i in issues])
    
    prompt = f"Generate a professional 12-section test plan for the following user stories:\n{context}\nMake sure to include Scope, Strategy, and Entry/Exit Criteria."
    
    try:
        if provider == "groq":
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise Exception("Missing GROQ_API_KEY in .env")
                
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}]
            }
            res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload, timeout=30)
            res.raise_for_status()
            result_text = res.json()["choices"][0]["message"]["content"]
            
        elif provider == "ollama":
            base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            payload = {
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            }
            res = requests.post(f"{base_url}/api/generate", json=payload, timeout=60)
            res.raise_for_status()
            result_text = res.json()["response"]
            
        else:
            raise Exception(f"Unsupported provider: {provider}")
            
        os.makedirs('.tmp', exist_ok=True)
        output_file = '.tmp/test_plan.md'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(result_text)
            
        print(json.dumps({"status": "success", "output_file": output_file}))
        
    except requests.exceptions.HTTPError as e:
        print(json.dumps({"error": str(e), "details": e.response.text}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python llm_generate.py <issues_json_file> [provider]"}))
        sys.exit(1)
        
    file_path = sys.argv[1]
    prov = sys.argv[2] if len(sys.argv) > 2 else "groq"
    generate_test_plan(file_path, prov)
