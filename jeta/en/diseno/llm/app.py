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
    "motivacion": "me siento desmotivado en el trabajo",
    "estres": "tengo demasiado estrés laboral",
    "conflicto": "problemas con compañeros de trabajo"
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
# def classify(data: Input):
def classify():
    # e = embed(data.text)
    e = embed("Mis compañeros son unos idiotas")
    scores = {
        k: float(cosine_similarity(e, v)[0][0])
        for k, v in CATEGORY_EMBEDS.items()
    }
    label = max(scores, key=scores.get)
    return {"label": label, "scores": scores}