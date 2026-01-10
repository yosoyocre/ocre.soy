from fastapi import FastAPI

app = FastAPI(title="Python ML Service")

@app.get("/health")
def health():
    return {
        "status": "ok",
    }