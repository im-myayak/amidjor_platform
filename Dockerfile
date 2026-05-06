# Dockerfile for Amidjor Backend (Django)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy entire project
COPY . /app/

# Set working directory to backend
WORKDIR /app/backend

# Create startup script
RUN echo '#!/bin/bash\npython manage.py collectstatic --noinput\npython manage.py migrate\ngunicorn config.wsgi:application --bind 0.0.0.0:$PORT' > /app/start.sh && chmod +x /app/start.sh

# Expose port
EXPOSE 8000

# Start command
CMD ["/app/start.sh"]
