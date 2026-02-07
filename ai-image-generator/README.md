# 🤖 AI Image Generator

A beautiful, fully-functional AI image generator web application powered by OpenAI's DALL-E 3 API. Transform your text descriptions into stunning, high-quality images with just a few clicks.

![AI Image Generator](https://img.shields.io/badge/AI-Image%20Generator-blueviolet?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge)

## ✨ Features

- 🎨 **DALL-E 3 Integration** - Generate high-quality images using OpenAI's latest image generation model
- 📝 **Smart Prompt Enhancement** - See how your prompts are enhanced by AI for better results
- 🖼️ **Multiple Aspect Ratios** - Choose from Square, Landscape, or Portrait orientations
- 🎭 **Style Options** - Select between Vivid (hyper-real) or Natural styles
- 💎 **Quality Settings** - Standard (faster) or HD (higher detail) quality options
- 🎲 **Surprise Me** - Get random creative prompts with one click
- 💾 **Download Images** - Save your generated images locally
- 📱 **Responsive Design** - Works beautifully on desktop and mobile devices
- 🌙 **Dark Theme** - Modern, eye-friendly dark UI design

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or download this project:**
   ```bash
   cd ai-image-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📝 Usage

1. **Enter your prompt** - Describe the image you want to generate
2. **Choose options** (optional):
   - **Size**: Square (1024x1024), Landscape (1792x1024), or Portrait (1024x1792)
   - **Style**: Vivid (hyper-real) or Natural
   - **Quality**: Standard or HD
3. **Click "Generate Image"** - Wait 10-20 seconds for the magic to happen
4. **Download** - Save your masterpiece!

### Example Prompts

- "A serene Japanese garden with cherry blossoms, a wooden bridge over a koi pond, morning light"
- "A futuristic cyberpunk city at night with neon lights and flying cars"
- "A cozy magical cottage in an enchanted forest with glowing mushrooms"

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application interface |
| `/api/health` | GET | Check API status |
| `/api/generate` | POST | Generate an image |
| `/api/sizes` | GET | Get available image sizes |
| `/api/styles` | GET | Get available styles |
| `/api/qualities` | GET | Get available quality settings |

### POST /api/generate

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "size": "1024x1024",
  "style": "vivid",
  "quality": "standard"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://...",
  "revisedPrompt": "A breathtaking sunset...",
  "originalPrompt": "A beautiful sunset...",
  "metadata": {
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "model": "dall-e-3"
  }
}
```

## 🏗️ Project Structure

```
ai-image-generator/
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling
│   └── script.js           # Frontend JavaScript
├── server.js               # Express server & API
├── package.json            # Dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `PORT` | Server port (default: 3000) | No |

### Options Reference

**Sizes:**
- `1024x1024` - Square (best for social media)
- `1792x1024` - Landscape (best for desktop)
- `1024x1792` - Portrait (best for mobile)

**Styles:**
- `vivid` - Hyper-real and dramatic images
- `natural` - More natural, less hyper-real

**Qualities:**
- `standard` - Faster generation, lower cost
- `hd` - Higher detail, slower generation

## 💰 Pricing

This application uses the OpenAI DALL-E 3 API. Image generation costs:

| Quality | 1024x1024 | 1792x1024 | 1024x1792 |
|---------|-----------|-----------|-----------|
| Standard | $0.04 | $0.08 | $0.08 |
| HD | $0.08 | $0.12 | $0.12 |

*Prices are per image. Check [OpenAI's pricing page](https://openai.com/pricing) for current rates.*

## 🔒 Security Notes

- ⚠️ **Never commit your `.env` file** - It contains your API key
- ⚠️ **Protect your API key** - Don't expose it in client-side code
- ✅ The API key is only used server-side in this application
- ✅ Input validation is implemented to prevent abuse

## 🐛 Troubleshooting

### "OPENAI_API_KEY is not set"
- Make sure you created a `.env` file
- Ensure your API key is correctly set in the file
- Restart the server after adding the key

### "Rate limit exceeded"
- You're making too many requests. Wait a moment and try again
- Consider implementing rate limiting for production use

### "Content policy violation"
- Your prompt was rejected by OpenAI's content filter
- Try rephrasing your description

### Images not downloading
- Some browsers block automatic downloads
- Try right-clicking the image and selecting "Save image as"

## 📄 License

MIT License - feel free to use this for personal or commercial projects!

## 🙏 Credits

- Built with [OpenAI](https://openai.com/) DALL-E 3
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

**Enjoy creating amazing AI art! 🎨✨**
