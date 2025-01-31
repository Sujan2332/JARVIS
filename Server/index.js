const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = 5000;

const MAX_REQUESTS_PER_MINUTE = 15;
const MAX_TOKENS_PER_MINUTE = 150000;
const MAX_REQUESTS_PER_DAY = 1500;

let requestCount = 0;
let tokenCount = 0;
let dailyRequestCount = 0;

const API_KEY = process.env.GEMINI_API;  // API Key from .env file

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);  // Pass API key here
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });  // Specify Gemini model

app.use(cors());
app.use(express.json()); // To parse incoming JSON payloads

// Middleware to handle rate-limiting
app.use((req, res, next) => {
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: "Rate limit exceeded for this minute" });
  }

  if (dailyRequestCount >= MAX_REQUESTS_PER_DAY) {
    return res.status(429).json({ error: "Rate limit exceeded for the day" });
  }

  next();
});

app.post('/request-gemini', async (req, res) => {
  try {
    if (tokenCount >= MAX_TOKENS_PER_MINUTE) {
      return res.status(429).json({ error: "Token limit exceeded for this minute" });
    }

    const prompt = req.body.prompt || "Default prompt";  // Example prompt
    const result = await model.generateContent(prompt);

    // Assuming the response contains the text result
    const responseText = result.response.text();

    // Update rate-limiting counts
    requestCount++;
    tokenCount += result.response.tokensUsed || 0;  // Assuming the response contains token usage
    dailyRequestCount++;

    setTimeout(() => {
      requestCount = 0;
      tokenCount = 0;
    }, 60000); // Reset the counters after a minute

    return res.json({ text: responseText });
  } catch (error) {
    console.error('Error during API request:', error);
    
    if (error.response) {
      console.error('Error response:', error.response.data);
      return res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error('Error request:', error.request);
      return res.status(500).json({ error: "No response from Gemini API" });
    } else {
      console.error('General Error:', error.message);
      return res.status(500).json({ error: "Error calling Gemini API" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
