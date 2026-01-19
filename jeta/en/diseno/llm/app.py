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

# Problemas que se resuelven con...
CATEGORIES = {
    # ACTITUD
    "motivado":      "actitud",
    "desmotivado":   "actitud",
    "cansancio":     "actitud",
    # PASIÓN
    "sueldo":        "pasión",
    "dinero":        "pasión",
    "cobrar":        "pasión",
    "salario":       "pasión",
    "mal pagado":    "pasión",
    # TRABAJO
    "obstáculos":    "trabajo",
    # TRABAJO EN EQUIPO
    "soledad":       "equipo",
    "equipo":        "equipo",
    "compañeros":    "equipo",
    "colegas":       "equipo",
    # ÉXITO
    # "fracaso":       "éxito",
    "fallar":        "éxito",
    "vida":          "éxito"
}


def embed(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        output = model(**inputs)
    return output.last_hidden_state.mean(dim=1)

CATEGORY_EMBEDS = {k: embed(k) for k, v in CATEGORIES.items()}

class Input(BaseModel):
    text: str

@app.get("/classify")
def classify(text: str):
    print(f"Classifying text: {text}")
    e = embed(text)
    scores = {
        k: float(cosine_similarity(e, v)[0][0])
        for k, v in CATEGORY_EMBEDS.items()
    }
    label = max(scores, key=scores.get)
    solution = CATEGORIES[label]
    return {"label": label, "solution": solution, "scores": scores}