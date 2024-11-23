import dotenv
import os

# Laden der .env-Datei
dotenv.load_dotenv()

# Zugriff auf die Umgebungsvariable
api_key = os.getenv('API_KEY')
print(api_key)
