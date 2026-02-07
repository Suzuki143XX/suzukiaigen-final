const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Create public folder if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

app.use(express.static('public'));
app.use(express.json());

// Generate image with fallback
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  console.log(`Generating image for: "${prompt}"`);

  try {
    // Try Pollinations first (FREE - no API key)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${Date.now()}`;
    
    console.log('Trying Pollinations.ai...');
    
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      timeout: 60000, // 60 second timeout
      maxRedirects: 5
    });

    const filename = `generated-${Date.now()}.png`;
    const filepath = path.join(__dirname, 'public', filename);
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    writer.on('finish', () => {
      console.log('Success: Image generated via Pollinations');
      res.json({ 
        success: true, 
        imageUrl: `/${filename}`,
        prompt: prompt,
        source: 'Pollinations.ai'
      });
    });

    writer.on('error', (err) => {
      console.error('File write error:', err);
      res.status(500).json({ error: 'Failed to save image' });
    });

  } catch (error) {
    console.log('Pollinations failed, trying Hugging Face...');
    
    try {
      // Fallback: Hugging Face Inference API (FREE tier)
      const hfResponse = await axios({
        method: 'post',
        url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
        headers: {
          'Authorization': 'Bearer hf_demo', // Public demo key
          'Content-Type': 'application/json'
        },
        data: { 
          inputs: prompt,
          parameters: {
            width: 1024,
            height: 1024
          }
        },
        responseType: 'arraybuffer',
        timeout: 120000 // 2 minutes timeout (HF can be slow)
      });
      
      if (hfResponse.data && hfResponse.data.byteLength > 0) {
        const buffer = Buffer.from(hfResponse.data, 'binary');
        const filename = `generated-${Date.now()}.png`;
        const filepath = path.join(__dirname, 'public', filename);
        
        fs.writeFileSync(filepath, buffer);
        
        console.log('Success: Image generated via Hugging Face');
        res.json({
          success: true,
          imageUrl: `/${filename}`,
          prompt: prompt,
          source: 'Hugging Face'
        });
      } else {
        throw new Error('Empty response from Hugging Face');
      }
      
    } catch (hfError) {
      console.error('Both services failed:', hfError.message);
      res.status(500).json({ 
        error: 'Both image services are currently busy. Please try again in a few moments.' 
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Image Generator running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});