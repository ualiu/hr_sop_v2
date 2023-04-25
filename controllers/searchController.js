const axios = require('axios')
const openai = require('openai');
const sopDocuments = require('../sop_documents.json');

// Set up OpenAI API client
const openaiApiKey = process.env.OPENAI_API_KEY;
openai.apiKey = openaiApiKey;

// Define search function
exports.search = async (req, res) => {
  const query = req.body.query;

  // Format SOP documents into a string for the OpenAI API
  const sopDocumentsString = sopDocuments.sections.map((section, index) => `SOP Section ${index + 1}: ${section.content}`).join('\n\n');

  // Modify the prompt to include the SOP documents and the user's query
  const prompt = `Here are the HR SOP documents:\n\n${sopDocumentsString}\n\nResearch HR SOPs for: ${query}`;

  try {
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        prompt: prompt,
        max_tokens: 200,
        n: 1,
        stop: null,
        temperature: 0.7,
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    const result = response.data.choices[0].text;
    res.render('results', { query, result });

  } catch (error) {
    console.error('Error occurred while processing your request:', error.message);
    console.error('Error details:', error.response ? error.response.data : 'No additional details');
    res.status(500).send('Error occurred while processing your request');
  }
}