const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const multer = require('multer'); // Multer for file uploads
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const path = require('path');
const pdfParse = require('pdf-parse'); // PDF parser for reading resume content
const fs = require('fs'); // Import fs to delete the file

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // To handle JSON body data

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be uploaded to the 'uploads' directory

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Roast Generation Function
async function generateRoast(roastLevel, resumeText) {
  let prompt;
  console.log("Received raw roastLevel:", roastLevel);

  const normalizedRoastLevel = (roastLevel || "").trim().toLowerCase();
  console.log("Normalized roastLevel:", normalizedRoastLevel); 
  if (normalizedRoastLevel === "mild") {
    prompt = `Generate a 100-word praise about the resume. Here's the resume content: ${resumeText}`;
  } else if (normalizedRoastLevel === "medium") {
    prompt = `
      Generate a roast within 150 words. Roast it brutally honest & abusive. Strictly use cuss words also and don't censor them, use them fully.
      Here's the resume content: ${resumeText}.
    `;
  } else {
    throw new Error("Invalid roast level khbkh specified.");

  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4', depending on your access
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    throw new Error('Error generating roast.');
  }
}

// POST route to handle profile submission and resume upload
app.post('/api/submit-profile', upload.single('resume'), async (req, res) => {
  const { roastLevel } = req.body;
  const resumeFile = req.file; // Access the uploaded resume file

  // Check if resume is uploaded
  if (!resumeFile) {
    return res.status(400).json({ error: 'Resume file is required' });
  }

  try {
    // Read the uploaded resume and convert it to text
    const resumeBuffer = await pdfParse(resumeFile.path); // Extract text from PDF
    const resumeText = resumeBuffer.text; // Get the extracted text from the PDF
    console.log('Extracted Resume Text:', resumeText); // Log for debugging

    // Generate the roast or praise, including the resume content
    const roast = await generateRoast(roastLevel, resumeText);

    // Delete the resume file after processing it
    fs.unlink(resumeFile.path, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
      } else {
        console.log('Resume file deleted');
      }
    });

    // Return roast or praise to the frontend
    res.json({ roast });
  } catch (error) {
    console.error('Error generating roast:', error.message);
    res.status(500).json({ error: 'Error generating roast' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


















//code for resume, roast level and linked in profile links input

// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cors = require('cors');
// const multer = require('multer'); // Multer for file uploads
// const { OpenAI } = require('openai');
// const dotenv = require('dotenv');
// const path = require('path');
// const pdfParse = require('pdf-parse'); // PDF parser for reading resume content
// const fs = require('fs'); // Import fs to delete the file

// dotenv.config(); // Load environment variables

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json()); // To handle JSON body data

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' }); // Files will be uploaded to the 'uploads' directory

// // OpenAI Setup
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Roast Generation Function
// async function generateRoast(profileData, roastLevel, resumeText) {
//   const { name, headline, experience } = profileData;

//   const prompt = `
//     Generate a roast within 150 words. for the name (only use first name given in resume). Roast it brutally honest & abusive. Strictly use cuss words also and don't censor cuss words, use them fully.
//     Here's the resume content: ${resumeText}.

//   `;

//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo', // Or 'gpt-4', depending on your access
//       messages: [{ role: 'user', content: prompt }],
//     });

//     return response.choices[0].message.content.trim();
//   } catch (error) {
//     throw new Error('Error generating roast.');
//   }
// }

// // POST route to handle profile submission and resume upload
// app.post('/api/submit-profile', upload.single('resume'), async (req, res) => {
//   const { linkedinURL, roastLevel } = req.body;
//   const resumeFile = req.file; // Access the uploaded resume file

//   if (!linkedinURL) {
//     return res.status(400).json({ error: 'LinkedIn URL is required' });
//   }

//   if (!resumeFile) {
//     return res.status(400).json({ error: 'Resume file is required' });
//   }

//   try {
//     // Read the uploaded resume and convert it to text
//     const resumeBuffer = await pdfParse(resumeFile.path); // Extract text from PDF
//     const resumeText = resumeBuffer.text; // Get the extracted text from the PDF
//     console.log('Extracted Resume Text:', resumeText); // Log for debugging

//     // Simulate LinkedIn profile scraping (or use actual scraping)
//     const profileData = { name: "Noel", headline: "Paul", experience: "Software Engineer" };

//     // Generate the roast, including the resume content
//     const roast = await generateRoast(profileData, roastLevel, resumeText);

//     // Delete the resume file after processing it
//     fs.unlink(resumeFile.path, (err) => {
//       if (err) {
//         console.error('Error deleting the file:', err);
//       } else {
//         console.log('Resume file deleted');
//       }
//     });

//     // Return roast to the frontend
//     res.json({ roast });
//   } catch (error) {
//     console.error('Error generating roast:', error.message);
//     res.status(500).json({ error: 'Error generating roast' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });






















// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cors = require('cors');
// const multer = require('multer'); // Multer for file uploads
// const { OpenAI } = require('openai');
// const dotenv = require('dotenv');
// const path = require('path');
// const pdfParse = require('pdf-parse'); // PDF parser for reading resume content

// dotenv.config(); // Load environment variables

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json()); // To handle JSON body data

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' }); // Files will be uploaded to the 'uploads' directory

// // OpenAI Setup
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Roast Generation Function
// async function generateRoast(profileData, roastLevel, resumeText) {
//   const { name, headline, experience } = profileData;

//   const prompt = `
//     Generate a roast, Make it witty, humorous, and brutally honest, for the the resume content: ${resumeText}
//   `;

//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo', // Or 'gpt-4', depending on your access
//       messages: [{ role: 'user', content: prompt }],
//     });

//     return response.choices[0].message.content.trim();
//   } catch (error) {
//     throw new Error('Error generating roast.');
//   }
// }

// // POST route to handle profile submission and resume upload
// app.post('/api/submit-profile', upload.single('resume'), async (req, res) => {
//   const { linkedinURL, roastLevel } = req.body;
//   const resumeFile = req.file; // Access the uploaded resume file

//   if (!linkedinURL) {
//     return res.status(400).json({ error: 'LinkedIn URL is required' });
//   }

//   if (!resumeFile) {
//     return res.status(400).json({ error: 'Resume file is required' });
//   }

//   try {
//     // Read the uploaded resume and convert it to text
//     const resumeBuffer = await pdfParse(resumeFile.path); // Extract text from PDF

//     const resumeText = resumeBuffer.text; // Get the extracted text from the PDF
//     console.log('Extracted Resume Text:', resumeText); // Log for debugging

//     // Simulate LinkedIn profile scraping (or use actual scraping)
//     const profileData = { name: "Noel", headline: "Paul", experience: "Software Engineer" };

//     // Generate the roast, including the resume content
//     const roast = await generateRoast(profileData, roastLevel, resumeText);

//     // Return roast to the frontend
//     res.json({ roast });
//   } catch (error) {
//     console.error('Error generating roast:', error.message);
//     res.status(500).json({ error: 'Error generating roast' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
























