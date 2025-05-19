import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

export async function generateSound(text: string): Promise<string> {
  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Eleven Labs API key');
  }

  try {
    // Call Eleven Labs API to generate sound
    // Using a placeholder voice ID - you would replace this with your voice ID from ElevenLabs
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      {
        text: text,
        voice_settings: { stability: 0.75, similarity_boost: 0.75 }
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer', // Get the sound as binary data
      }
    );

    // Save the sound file
    const soundFileName = `${text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}.mp3`;
    const soundPath = path.join(__dirname, '..', 'public', 'sounds', soundFileName);
    
    // Make sure directory exists
    await fs.mkdir(path.dirname(soundPath), { recursive: true });
    
    // Write the file
    await fs.writeFile(soundPath, response.data);

    // Return a URL the app can use
    return `/sounds/${soundFileName}`;
  } catch (error) {
    console.error('Error generating sound:', error);
    throw new Error('Failed to generate sound with Eleven Labs API');
  }
}
