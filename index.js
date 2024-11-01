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
async function generateRoast(profileData, roastLevel, resumeText) {
  const { name, headline, experience } = profileData;

  const prompt = `
    Generate a roast within 150 words. for the name (only use first name given in resume). Roast it brutally honest & abusive. Strictly use cuss words also and don't censor cuss words, use them fully.
    Here's the resume content: ${resumeText}.

  `;

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
  const { linkedinURL, roastLevel } = req.body;
  const resumeFile = req.file; // Access the uploaded resume file

  if (!linkedinURL) {
    return res.status(400).json({ error: 'LinkedIn URL is required' });
  }

  if (!resumeFile) {
    return res.status(400).json({ error: 'Resume file is required' });
  }

  try {
    // Read the uploaded resume and convert it to text
    const resumeBuffer = await pdfParse(resumeFile.path); // Extract text from PDF
    const resumeText = resumeBuffer.text; // Get the extracted text from the PDF
    console.log('Extracted Resume Text:', resumeText); // Log for debugging

    // Simulate LinkedIn profile scraping (or use actual scraping)
    const profileData = { name: "Noel", headline: "Paul", experience: "Software Engineer" };

    // Generate the roast, including the resume content
    const roast = await generateRoast(profileData, roastLevel, resumeText);

    // Delete the resume file after processing it
    fs.unlink(resumeFile.path, (err) => {
      if (err) {
        console.error('Error deleting the file:', err);
      } else {
        console.log('Resume file deleted');
      }
    });

    // Return roast to the frontend
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




























// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cors = require('cors');
// const multer = require('multer'); // Multer for file uploads
// const { OpenAI } = require('openai');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config(); // Load environment variables

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json()); // To handle JSON body data

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' }); // Files will be uploaded to the 'uploads' directory

// // Test route to check the server
// app.get('/', (req, res) => {
//   res.send('Roastfully Backend is running!');
// });

// // OpenAI Setup
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Roast Generation Function
// async function generateRoast(profileData, roastLevel) {
//   const { name, headline, experience } = profileData;

//   const prompt = `
//     Generate a roast for the name Noel.
//     Make it witty, humorous, and brutally honest.
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
//     // Simulate LinkedIn profile scraping
//     const profileData = { name: "Noel", headline: "Paul", experience: "Software Engineer" };

//     // Generate the roast
//     const roast = await generateRoast(profileData, roastLevel);

//     console.log('Resume file path:', resumeFile.path); // Path where the resume is stored

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
// const { OpenAI } = require('openai');  // Correct import for openai@4.x
// const dotenv = require('dotenv');

// dotenv.config(); // Load environment variables

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json()); // To handle JSON body data

// // OpenAI Setup with v4.x
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Test route to check the server
// app.get('/', (req, res) => {
//   res.send('Roastfully Backend is running!');
// });

// // Function to simulate getting LinkedIn profile data
// async function getLinkedInProfile(linkedinURL) {
//   try {
//     // Using placeholder values for testing
//     const name = "govind";
//     const headline = "Paul";
//     const experience = "Software Engineer";

//     return { name, headline, experience };
//   } catch (error) {
//     throw new Error('Error scraping LinkedIn profile.');
//   }
// }
// // async function generateRoast(profileData, roastLevel) {
// //     const { name, headline, experience } = profileData;
  
// //     // Mock roast data for testing while OpenAI quota is exceeded
// //     const mockRoast = `
// //       Hey ${name}, Software Engineer? That's a fancy way of saying "I know how to Google stuff."
// //       Keep up the good work... or at least try to!
// //     `;
  
// //     console.log('Returning mock roast due to OpenAI quota limit.');
// //     return mockRoast.trim();  // Return mock roast
// //   }

// //Roast Generation Function
// async function generateRoast(profileData, roastLevel) {
//     const { name, headline, experience } = profileData;
  
//     const prompt = `
//       Generate a roast for the Govind name. Make it  ${roastLevel} short, most viscioral, add cuss words also. dont censor cuss words, use them fully
//       This is the resume of Govind-Software Engineer, RoomieHub LLC, Phoenix, United States June 2024 - Pesent
//  Led the development of 2 major components: User Profile Navigation and Progress Tracking using React Native, AWS, and Redux.
// Deployed the user profile microservice on AWS EC2 for efficient resource utilization for the backend. Created intuitive navigation components for user profile using React Navigation, improving user flow with 4 new features.
//  Developed home screen functionality, supporting image uploads up to 10 MB and enhancing state management using Redux.
      
//     `;
  
//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo', // Or 'gpt-4', depending on your access
//         messages: [{ role: 'user', content: prompt }],
//       });
  
//       console.log('OpenAI response:', response);  // Log the full response for debugging
  
//       return response.choices[0].message.content.trim();
//     } catch (error) {
//       console.error('Error generating roast with OpenAI:', error.response ? error.response.data : error.message);
//       throw new Error('Error generating roast.');
//     }
//   }

// // async function generateRoast(profileData, roastLevel) {
// //   const { name, headline, experience } = profileData;

// //   const prompt = `
// //     Generate a roast for the name Noel.
// //     Make it witty, humorous, and brutally honest.
// //   `;

// //   try {
// //     const response = await openai.chat.completions.create({
// //       model: 'gpt-3.5-turbo', // Or 'gpt-4', depending on your access
// //       messages: [{ role: 'user', content: prompt }],
// //     });

// //     console.log('OpenAI response:', response);  // Log the full response for debugging

// //     return response.choices[0].message.content.trim();
// //   } catch (error) {
// //     console.error('Error generating roast with OpenAI:', error.response ? error.response.data : error.message);
// //     throw new Error('Error generating roast.');
// //   }
// // }

// // POST route to handle profile submission and roast generation
// app.post('/api/submit-profile', async (req, res) => {
//   const { linkedinURL, roastLevel } = req.body;

//   if (!linkedinURL) {
//     return res.status(400).json({ error: 'LinkedIn URL is required' });
//   }

//   try {
//     // Simulate LinkedIn profile scraping
//     const profileData = await getLinkedInProfile(linkedinURL);

//     // Generating roast
//     const roast = await generateRoast(profileData, roastLevel);

//     // Sending roast to the frontend
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


// /*
// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cors = require('cors');
// const { OpenAI } = require('openai');  // Correct import for openai@4.x
// const dotenv = require('dotenv');

// dotenv.config(); // Load environment variables

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json()); // To handle JSON body data

// // Test route to check the server
// app.get('/', (req, res) => {
//   res.send('Roastfully Backend is running!');
// });

// // LinkedIn Profile Scraping Function
// async function getLinkedInProfile(linkedinURL) {
// //   try {
// //     const { data } = await axios.get(linkedinURL);
// //     const $ = cheerio.load(data);

// //     // Extract relevant fields like name, headline, experience
// //     const name = $('h1').text().trim();  // Placeholder selector
// //     const headline = $('h2').text().trim(); // Placeholder selector
// //     const experience = [];

// //     $('section#experience .experience').each((i, el) => {
// //       const title = $(el).find('h3').text().trim();
// //       const company = $(el).find('p.company').text().trim();
// //       experience.push({ title, company });
// //     });
// try {
//  //   const { data } = await axios.get(linkedinURL);
//    // const $ = cheerio.load(data);

//     // Extract relevant fields like name, headline, experience
//     const name = "Noel";  // Placeholder selector
//     const headline ="paul"; // Placeholder selector
//     const experience ="soft ware engineer";

   

//     return { name, headline, experience };
//   } catch (error) {
//     throw new Error('Error scraping LinkedIn profile.');
//   }
// }

// // OpenAI Setup with v4.x
// async function generateRoast(profileData, roastLevel) {
//     const { name, headline, experience } = profileData;
  
//     const prompt = `
//       Generate a roast for the name Noel.
//       Make it witty, humorous, and brutally honest.
//     `;
  
//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo', // Or 'gpt-4', depending on your access
//         messages: [{ role: 'user', content: prompt }],
//       });
  
//       console.log('OpenAI response:', response);  // Log the full response for debugging
  
//       return response.choices[0].message.content.trim();
//     } catch (error) {
//       console.error('Error generating roast with OpenAI:', error.response ? error.response.data : error.message);
//       throw new Error('Error generating roast.');
//     }
//   }

// // POST route to handle profile submission and roast generation
// app.post('/api/submit-profile', async (req, res) => {
//   const { linkedinURL, roastLevel } = req.body;

//   if (!linkedinURL) {
//     return res.status(400).json({ error: 'LinkedIn URL is required' });
//   }

//   try {
//     // Scraping LinkedIn profile
//     const profileData = await getLinkedInProfile(linkedinURL);

//     // Generating roast
//     const roast = await generateRoast(profileData, roastLevel);

//     // Sending roast to the frontend
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
// */