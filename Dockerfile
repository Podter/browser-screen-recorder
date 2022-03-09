FROM python:alpine
WORKDIR /app
RUN pip install simple-http-server
COPY . .
CMD python -m SimpleHTTPServer $PORT
