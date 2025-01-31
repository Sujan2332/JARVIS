<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>J.A.R.V.I.S. - AI Assistant</title>
</head>
<body>
  <h1>Welcome to J.A.R.V.I.S.<br><span class="AI">- The AI Assistant</span></h1>
  
  <p><i>J.A.R.V.I.S. is a versatile AI assistant designed to respond to voice commands and help with various tasks like playing songs, providing weather updates, setting reminders, and much more. It's powered by the Gemini API for intelligent responses!</i></p>

  <h3>Features:</h3>
  <ul>
    <li><i>Voice Command Integration</i> - Use your voice to control the AI assistant.</li>
    <li><i>Weather Updates</i> - Ask about the weather in any city.</li>
    <li><i>Play Music</i> - Get your favorite songs played directly from YouTube.</li>
    <li><i>Set Reminders</i> - Create and manage reminders.</li>
    <li><i>AI Response Fetching</i> - Ask anything, and J.A.R.V.I.S. will use Gemini to provide intelligent responses.</li>
    <li><i>Jokes and Fun</i> - Ask J.A.R.V.I.S. to tell a joke and enjoy!</li>
    <li><i>Math Calculations</i> - Perform quick math calculations through voice commands.</li>
  </ul>

  <h3>How It Works:</h3>
  <ul>
    <li><i>Speech Recognition</i> - The assistant listens for commands through the microphone.</li>
    <li><i>Text-to-Speech</i> - It responds to you through speech synthesis.</li>
    <li><i>Gemini API</i> - Fetches responses for general queries.</li>
  </ul>

  <h3>Installation:</h3>
  <ul>
    <li><i>Clone the repository:</i> `git clone https://github.com/username/JARVIS-AI.git`</li>
    <li><i>Install dependencies:</i> `npm install`</li>
    <li><i>Run the app:</i> `npm start`</li>
  </ul>

  <h3>Example Commands:</h3>
  <ul>
    <li><i>"Hey J.A.R.V.I.S., what's the weather in New York?"</i></li>
    <li><i>"J.A.R.V.I.S., play a song by The Beatles."</i></li>
    <li><i>"Set a reminder to call mom at 6 PM."</i></li>
    <li><i>"J.A.R.V.I.S., tell me a joke."</i></li>
  </ul>

  <p><i>Feel free to explore more and interact with the assistant!</i></p>

  <h3>Code Example:</h3>
  <div class="code-block">
    <h3>React Speech Recognition Setup</h3>
    <pre><code>const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;</code></pre>
  </div>

  <p><i>For more details, visit the official documentation or contribute to the project!</i></p>
</body>
</html>
