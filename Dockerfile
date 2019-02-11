FROM python:3.7 as python-backend
WORKDIR /app
RUN pip3 install pipenv
COPY ./Pipfile* /app/
RUN pipenv install
EXPOSE 5000
COPY backend /app/backend
CMD ["pipenv", "run", "python", "./backend/src/main.py"]