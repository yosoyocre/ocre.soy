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
    "no me siento apreciado": "pasión",
    # DINERO
    "el sueldo que me pagan es muy bajo": "dinero",
    # TRABAJO
    "tengo demasiadas cosas que hacer": "trabajo",
    "no soy capaz de superar mis obstáculos": "trabajo",
    # TRABAJO EN EQUIPO
    "no estoy contento con mi jefe": "equipo",
    "mis compañeros no trabajan bien en equipo": "equipo",
    # ÉXITO
    "no sé qué objetivos seguir": "éxito",
    "tengo miedo de que me despidan": "éxito"
}

# Concatenamos la frase "en mi trabajo" a cada categoría para mayor contexto
CATEGORIES = {"en mi trabajo " + k: v for k, v in CATEGORIES.items()}


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