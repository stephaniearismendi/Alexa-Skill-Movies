<h1 align="center">🍿 Movie Recommendation Skill for Alexa 🎬</h1>

<p align="center">
  This Alexa skill uses the MovieDB API to provide movie recommendations based on favorite directors, actors, or genres. 🎥🌟🎞️
</p>

<h2>Features ✨</h2>

- Filter movies by favorite director, actor, or genre
- Get movie recommendations based on specific directors, actors, or genres
- Voice commands to interact with the skill

<h2>Prerequisites 📋</h2>

To use this skill, you will need the following:

- An Amazon Alexa-enabled device 🗣️
- An API key from the MovieDB API (https://www.themoviedb.org/) 🔑

<h2>Setup ⚙️</h2>

1. Clone this repository or download the code.

2. Install the required dependencies by running the following command:

npm install


3. Set up your environment variables:

- Create a `.env` file in the project root directory.
- Add the following environment variables to the `.env` file:

  ```
  API_KEY=your_movie_db_api_key
  ```

4. Deploy the skill code to your preferred hosting platform or AWS Lambda.

5. Configure the Alexa skill:

- Go to the Amazon Developer Console (https://developer.amazon.com/alexa/console/ask).
- Create a new skill.
- Configure the skill invocation name, interaction model, and endpoint to point to your deployed skill code.
- Enable the required permissions to access user preferences and speech recognition.

6. Test the skill on your Alexa-enabled device or the Alexa Developer Console.

<h2>Usage 🚀</h2>

### Filter movies by favorite director, actor, or genre

- "Alexa, ask Movie Recommendations to find movies by director." 🎥🎬👨‍💼
- "Alexa, ask Movie Recommendations to find movies with my favorite actor." 🎥🎭🌟
- "Alexa, ask Movie Recommendations to find movies in a specific genre." 🎥🎞️🎭

### Get movie recommendations based on specific directors, actors, or genres

- "Alexa, ask Movie Recommendations for movie recommendations by director." 🎥🎬👨‍💼
- "Alexa, ask Movie Recommendations for movie recommendations with my favorite actor." 🎥🎭🌟
- "Alexa, ask Movie Recommendations for movie recommendations in a specific genre." 🎥🎞️🎭
