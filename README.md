# Running SomaAI

## Installing necessary programs
1. Download and install NodeJS from https://nodejs.org/en/download/
2. Download and install Python from https://www.python.org/downloads/

## Adding API keys
1. Download the repository through git or GitHub desktop
2. In the Backend directory, create a file named .env and paste the following text:

OPENROUTER_API_KEY_PRIMARY=
OPENROUTER_API_KEY_SECONDARY=
YOUTUBE_API_KEY=
ENABLE_TTS=true
ALLOWED_LANGS=en,fr,pt,sw,es,hi


3. Visit https://openrouter.ai/mistralai/mistral-nemo:free and get an API key, then paste it after OPENROUTER_API_KEY_PRIMARY=
4. Visit https://openrouter.ai/meta-llama/llama-3.3-70b-instruct:free and get an API key, then paste it after OPENROUTER_API_KEY_PRIMARY=
5. Get a Youtube API key and paste it after YOUTUBE_API_KEY= (optional)


## Installing dependencies
1. Open a terminal window in the project directory, then run `cd Backend` to enter the Backend directory
2. In the terminal, run `pip install -r requirements.txt` to install python dependencies
3. In the terminal, run `cd ..` to return to the root directory
4. In the terminal, run `cd Frontend` to enter the Frontend directory
5. In the terminal, run `npm install` to install node dependencies

## Running the app
1. In the terminal, still in the Frontend directory, run `npm start` to start running the Frontend local server
2. Open another terminal window in the project directory, then run `cd Backend` to enter the Backend directory
3. In the terminal, still in the Backend directory, run `python app.py` to start running the Backend local server

## And voila!
The website should be fully operational
