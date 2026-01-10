from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

MODEL = "dccuchile/distilbert-base-spanish-uncased"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModel.from_pretrained(MODEL)
model.eval()

CATEGORIES = {
    "trabajo": "me siento desmotivado en el trabajo",
    "amor": "mis relaciones amorosas no van bien",
    "futuro": "el futuro me preocupa mucho",
    "salud": "tengo problemas de salud que me afectan",
}

def embed(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        output = model(**inputs)
    return output.last_hidden_state.mean(dim=1)

CATEGORY_EMBEDS = {k: embed(v) for k, v in CATEGORIES.items()}

class Input(BaseModel):
    text: str

@app.get("/classify")
def classify(text: str):
    e = embed(text)
    scores = {
        k: float(cosine_similarity(e, v)[0][0])
        for k, v in CATEGORY_EMBEDS.items()
    }
    label = max(scores, key=scores.get)
    return {"label": label, "scores": scores}