import React, { useState, useEffect } from 'react';
import { fetchGeminiData } from './Gemini';
import './App.css';
import robot from "./assets/robot.gif";

// Speech recognition API setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

let utterance = null; // Global variable for speech synthesis

const App = () => {
  const [response, setResponse] = useState(null);
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [videoId, setVideoId] = useState(null); // Store YouTube Video ID
  const [timeoutId, setTimeoutId] = useState(null);
  const [weather, setWeather] = useState("")
  const [math,setMath] = useState("")
  const [joke,setJoke] = useState("")

  // Speak function
  const speak = (text) => {
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  // Greet the user on page load
  const wishMe = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      speak("Good Morning Boss...");
    } else if (hour < 17) {
      speak("Good Afternoon Boss... Had Your Lunch?");
    } else {
      speak("Good Evening Sir... Had Your Coffee?");
    }
  };

  useEffect(() => {
    wishMe();
  }, []);

  // Handle speech recognition
  const toggleMic = (e) => {
    e.preventDefault();
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    setInputData(transcript);
    
    // Auto-submit after 2 seconds
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      takeCommand(transcript);
    }, 2000);
    setTimeoutId(newTimeoutId);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
  };

  // Execute voice commands
  const takeCommand = (message) => {
    console.log(message)
    if (message.includes("hey") || message.includes("hello")|| message.includes("hi") || message.includes("jarvis")) {
      speak("Hello Sir, How may I assist you?");
    }else if (message.includes("open x")) {
      openURL("https://x.com", "X");
    } else if (message.includes("open google")) {
      openURL("https://google.com", "Google");
    } else if (message.includes("play")) {
      playSong(message.replace("play", "").replace("song", "").trim());
    } else if (message.includes("open youtube")) {
      openURL("https://youtube.com", "YouTube");
  } else if (message.includes("open facebook")) {
      openURL("https://facebook.com", "Facebook");
  } else if (message.includes("open twitter")) {
      openURL("https://twitter.com", "Twitter");
  }else if (message.includes("open instagram")) {
      openURL("https://instagram.com", "Instagram");
  } else if (message.includes("open linkedin")) {
      openURL("https://linkedin.com", "LinkedIn");
  } else if (message.includes('time')) {
      const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
      speak(time);
  } else if (message.includes('date')) {
      const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
      speak(date);
  } else if (message.includes('calculator')) {
      window.open('Calculator:///');
      speak("Opening Calculator");
  } else if (message.includes('weather in')) {
    const location = message.split('weather in').pop().trim().split(' ').pop();
    getWeather(location);  
  } else if (message.includes('tell me a joke')) {
      tellJoke();
  } else if (message.includes('calculate')) {
      const expression = message.replace('calculate', '').trim();
      calculateMath(expression);
  } else if (message.includes('set reminder')) {
      setReminder(message);
  } else {
      handleFetchData(); // Gemini handles unknown queries
    }
  }

  // Fetch AI response
  const handleFetchData = async () => {
    try {
      setLoading(true);
      const data = { prompt: inputData };
      const result = await fetchGeminiData(data);
      setResponse(result);
      setLoading(false);
      speak(result.text);
    } catch (error) {
      setResponse({ error: "Something went wrong" });
      setLoading(false);
    }
  };

  // Open URLs
  const openURL = (url, name) => {
    window.open(url, "_blank");
    speak(`Opening ${name}...`);
  };

  // Fetch weather data
  const getWeather = (location) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=fd567f58abe28cf6525b57ce2049cc53&units=metric`)
      .then(response => response.json())
      .then(data => {
        const weatherInfo = `The weather in ${location} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
        speak(weatherInfo);
        setWeather(weatherInfo)
      })
      .catch(() => {
        const errorMsg = "Sorry, I couldn't fetch the weather.";
        speak(errorMsg);
      });
  };

  const playSong = (query) => {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API;
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&type=video`)
      .then(response => response.json())
      .then(data => {
        if (data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          setVideoId(videoId);
          speak(`Playing ${query} on YouTube.`);
        } else {
          speak("Sorry, I couldn't find that song.");
        }
      })
      .catch(() => speak("Sorry, an error occurred while searching for the song."));
  };

  // Tell a joke
  const tellJoke = () => {
    fetch('https://official-joke-api.appspot.com/random_joke')
      .then(response => response.json())
      .then(data => {
        const Joke=`${data.setup}... ${data.punchline}`
        speak(Joke);
        setJoke(Joke)
      })
      .catch(() => speak("Sorry, I couldn't fetch a joke."));
  };

  // Perform calculations
  const calculateMath = (expression) => {
    try {
      const calculation =`The result is ${eval(expression)}`
      speak(calculation);
      setMath(calculation)
    } catch {
      speak("Sorry, I couldn't calculate that.");
    }
  };

  // Format AI responses
  const formatText = (text) => {
    let formattedText = text.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
      const codeLines = codeContent.split('\n');
      const heading = codeLines[0];
      const code = codeLines.slice(1).join('\n');

      return `<div class="code-block">
                <h3 class="code-heading">${heading}</h3>
                <pre class="code-para"><code>${code}</code></pre>
              </div>`;
    });

    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    formattedText = formattedText.replace(/\*(.*?)\n/g, "<br />• $1");
    formattedText = formattedText.replace(/(.*?):(.*?)(?=\s|$)/g, "<div>$1: $2</div>");
    formattedText = formattedText.replace(/`([^`]+)`/g, "<b>$1</b>");

    return formattedText;
  };

  const copyToClipboard = (text) => {
    // Create a temporary textarea element to copy the text
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  
    // Optionally, show a confirmation message
    speak("Response copied to clipboard.");
  };  

  return (
    <div className="app-container">
      <h1 className='gemini-jarvis'>J.A.R.V.I.S.<br/> <pre className="AI">-The AI</pre></h1>
      
      <form className='gemini-form'>
        <textarea
          className='gemini-textarea'
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Enter your input"
        />
        <button onClick={toggleMic} className="gemini-mic-logo">
          {listening ? <i className="fa-solid fa-microphone-slash"></i> : <i className="fa-solid fa-microphone"></i>}
        </button>
      </form>
      
      <div>
        <button onClick={()=>takeCommand(inputData)} className='gemini-loading-logo'>
          {loading ? <div className='loader'></div> : <i className="fa-solid fa-paper-plane"></i>}
        </button>
      </div>

      {/* Speak & Stop Buttons */}
      {response && (
        <div className="speech-buttons">
          {!speaking ? (
            <button onClick={() => speak(response.text)} className="gemini-speak-btn">
              <i className="fa-solid fa-volume-high"></i>
            </button>
          ) : (
            <button onClick={stopSpeaking} className="gemini-speak-btn">
              <i className="fa-solid fa-stop"></i>
            </button>
          )}
        </div>
      )}
<div className="answer-container">

  {weather &&(
    <h3 style={{textAlign:"center"}}>{weather}</h3>
  )
  }

{joke &&(
    <h3 style={{textAlign:"center"}}>{joke}</h3>
  )
  }

{math &&(
    <h3 style={{textAlign:"center"}}>{math}</h3>
  )
  }
  {/* Display the response if it exists */}
  {response && (
    <div className="response">
      <button onClick={() => copyToClipboard(response.text)} className="copy-button">
        <i className="fa-solid fa-copy"></i>
      </button>
      <div dangerouslySetInnerHTML={{ __html: formatText(response.text) }} />
    </div>
  )}

  {/* Display the video if it exists */}
  {videoId && (
    <div className="video-container">
      <h3>Now Playing:</h3>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        autoPlay
      ></iframe>
    </div>
  )}

  {/* If neither response nor video exist, display the robot */}
  {!response && !videoId && !weather && !math && !joke &&(
    <div className="robot-container">
      <h2>Ask Me Anything...!!!</h2>
      <img src={robot} alt="" className="robot-img" />
    </div>
  )}
</div>
    </div>
  );
};

export default App;
