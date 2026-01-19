# Imagen base ligera
FROM python:3.14-slim

# Variables de entorno para Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Directorio de trabajo
WORKDIR /jeta/en/diseno/sentencetransformer

# Instalación de dependencias del sistema mínimas
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiamos solo requirements primero para aprovechar cache
COPY /jeta/en/diseno/sentencetransformer/requirements.txt .

# Instalamos dependencias Python (sin caché)
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copiamos el resto de la aplicación
COPY /jeta/en/diseno/sentencetransformer/app.py .

# Exponemos el puerto
EXPOSE 5000

# Comando de arranque
CMD ["uvicorn", "jeta.en.diseno.sentencetransformer.app:app", "--host", "0.0.0.0", "--port", "5000"]