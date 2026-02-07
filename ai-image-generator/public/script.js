// AI Image Generator - Frontend JavaScript

// DOM Elements
const promptInput = document.getElementById('prompt-input');
const charCount = document.getElementById('char-count');
const surpriseMeBtn = document.getElementById('surprise-me-btn');
const sizeSelect = document.getElementById('size-select');
const styleSelect = document.getElementById('style-select');
const qualitySelect = document.getElementById('quality-select');
const generateBtn = document.getElementById('generate-btn');
const btnText = generateBtn.querySelector('.btn-text');
const btnLoading = generateBtn.querySelector('.btn-loading');

const resultSection = document.getElementById('result-section');
const generatedImage = document.getElementById('generated-image');
const imageOverlay = document.getElementById('image-overlay');
const originalPrompt = document.getElementById('original-prompt');
const revisedPrompt = document.getElementById('revised-prompt');
const revisedPromptContainer = document.getElementById('revised-prompt-container');
const metadataTags = document.getElementById('metadata-tags');
const downloadBtn = document.getElementById('download-btn');
const newImageBtn = document.getElementById('new-image-btn');

const errorSection = document.getElementById('error-section');
const errorTitle = document.getElementById('error-title');
const errorMessage = document.getElementById('error-message');
const tryAgainBtn = document.getElementById('try-again-btn');

// Descriptions for options
const sizeDescriptions = {
    '1024x1024': 'Best for social media posts',
    '1792x1024': 'Best for desktop wallpapers',
    '1024x1792': 'Best for mobile wallpapers'
};

const styleDescriptions = {
    'vivid': 'Hyper-real and dramatic images',
    'natural': 'More natural, less hyper-real looking images'
};

const qualityDescriptions = {
    'standard': 'Faster generation, lower cost',
    'hd': 'Higher detail, slower generation'
};

// Surprise me prompts
const surprisePrompts = [
    "A futuristic cyberpunk city at night with neon lights reflecting on wet streets, flying cars, and holographic advertisements",
    "A cozy cottage in a magical forest with glowing mushrooms, fireflies, and a mystical fog",
    "An astronaut riding a horse on Mars with Earth visible in the red sky, cinematic lighting",
    "A steampunk airship floating above Victorian London at sunset, detailed mechanical gears visible",
    "A serene underwater city with bioluminescent plants, manta rays swimming, and glass domes",
    "A dragon made of stained glass flying through a cathedral, light refracting through its wings",
    "A Japanese street food market at night with glowing lanterns, steam rising from food stalls",
    "A library inside a giant tree with bookshelves spiraling up the trunk, sunlight filtering through leaves",
    "A retro-futuristic diner on the moon with Earth in the background, chrome and neon aesthetic",
    "A wizard's tower floating on a cloud with waterfalls cascading down, rainbow bridges connecting"
];

// Update character count
promptInput.addEventListener('input', () => {
    const count = promptInput.value.length;
    charCount.textContent = `${count} / 4000`;
    charCount.style.color = count > 4000 ? '#ef4444' : '#71717a';
});

// Update option descriptions
sizeSelect.addEventListener('change', () => {
    document.getElementById('size-description').textContent = sizeDescriptions[sizeSelect.value];
});

styleSelect.addEventListener('change', () => {
    document.getElementById('style-description').textContent = styleDescriptions[styleSelect.value];
});

qualitySelect.addEventListener('change', () => {
    document.getElementById('quality-description').textContent = qualityDescriptions[qualitySelect.value];
});

// Surprise me button
surpriseMeBtn.addEventListener('click', () => {
    const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    promptInput.value = randomPrompt;
    promptInput.dispatchEvent(new Event('input'));
    promptInput.focus();
});

// Generate image
async function generateImage() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showError('Empty Prompt', 'Please enter a description for the image you want to generate.');
        promptInput.focus();
        return;
    }

    if (prompt.length > 4000) {
        showError('Prompt Too Long', 'Your prompt must be less than 4000 characters.');
        return;
    }

    // Hide any previous errors
    errorSection.style.display = 'none';
    
    // Show loading state
    setLoading(true);
    
    // Show result section with loading overlay
    resultSection.style.display = 'block';
    imageOverlay.style.display = 'flex';
    generatedImage.src = '';
    
    // Scroll to result section
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                size: sizeSelect.value,
                style: styleSelect.value,
                quality: qualitySelect.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to generate image');
        }

        // Display the generated image
        generatedImage.src = data.imageUrl;
        
        // Wait for image to load before hiding overlay
        generatedImage.onload = () => {
            imageOverlay.style.display = 'none';
        };

        // Show prompts
        originalPrompt.textContent = data.originalPrompt;
        
        if (data.revisedPrompt && data.revisedPrompt !== data.originalPrompt) {
            revisedPrompt.textContent = data.revisedPrompt;
            revisedPromptContainer.style.display = 'block';
        } else {
            revisedPromptContainer.style.display = 'none';
        }

        // Show metadata tags
        metadataTags.innerHTML = `
            <span class="tag"><i class="fas fa-expand"></i> ${data.metadata.size}</span>
            <span class="tag"><i class="fas fa-palette"></i> ${data.metadata.style}</span>
            <span class="tag"><i class="fas fa-gem"></i> ${data.metadata.quality}</span>
            <span class="tag"><i class="fas fa-robot"></i> ${data.metadata.model}</span>
        `;

    } catch (error) {
        console.error('Error:', error);
        showError('Generation Failed', error.message || 'An unexpected error occurred. Please try again.');
        resultSection.style.display = 'none';
    } finally {
        setLoading(false);
    }
}

// Set loading state
function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'flex';
    btnLoading.style.display = isLoading ? 'flex' : 'none';
}

// Show error
function showError(title, message) {
    errorTitle.textContent = title;
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Download image
async function downloadImage() {
    const imageUrl = generatedImage.src;
    if (!imageUrl) return;

    try {
        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `ai-image-${timestamp}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
        // Fallback: open in new tab
        window.open(imageUrl, '_blank');
    }
}

// Event listeners
generateBtn.addEventListener('click', generateImage);

// Allow Ctrl+Enter to generate
promptInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        generateImage();
    }
});

downloadBtn.addEventListener('click', downloadImage);

newImageBtn.addEventListener('click', () => {
    promptInput.value = '';
    promptInput.dispatchEvent(new Event('input'));
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    promptInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

tryAgainBtn.addEventListener('click', () => {
    errorSection.style.display = 'none';
    generateImage();
});

// Check API health on load
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('API Health:', data);
    } catch (error) {
        console.error('API Health check failed:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    promptInput.focus();
});
