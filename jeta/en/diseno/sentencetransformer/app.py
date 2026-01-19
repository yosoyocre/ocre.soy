from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
model = SentenceTransformer(MODEL_NAME)

# Problemas que se resuelven con...
CATEGORIES = {
    # ACTITUD
    "me siento poco motivado": "actitud",
    # PASIÓN
    "mi sueldo es muy bajo": "pasión",
    # TRABAJO
    "no soy capaz de superar mis obstáculos": "trabajo",
    # TRABAJO EN EQUIPO
    "no tengo buenos compañeros": "equipo",
    # ÉXITO
    "no sé qué hacer con mi vida": "éxito"
}


class SemanticClassifier:
    def __init__(self, labels):
        """
        labels: lista de strings que describen las categorías
        """
        self.labels = labels
        self.label_embeddings = model.encode(
            labels,
            normalize_embeddings=True
        )

    def embed(self, text: str):
        return model.encode(
            text,
            normalize_embeddings=True
        )

@app.get("/classify")
def classify(text: str):
    classifier = SemanticClassifier(list(CATEGORIES.keys()))

    print(f"Classifying text: {text}")
    e = classifier.embed(text)
    scores = {
        k: float(cosine_similarity(e.reshape(1, -1), v.reshape(1, -1))[0][0])
        for k, v in zip(classifier.labels, classifier.label_embeddings)
    }
    label = max(scores, key=scores.get)
    solution = CATEGORIES[label]
    return {"label": label, "solution": solution, "scores": scores}