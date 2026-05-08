import axios from 'axios';

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

/**
 * Sends a grounded prompt to the Mistral model via Hugging Face Inference API.
 * The AI will ONLY answer questions about ISS data and news on the dashboard.
 *
 * @param {string} userMessage - The user's question
 * @param {object} dashboardData - Current dashboard context
 * @param {object} dashboardData.iss - ISS data (latitude, longitude, speed, location)
 * @param {Array} dashboardData.astronauts - Array of { name, craft }
 * @param {Array} dashboardData.news - Array of news article summaries
 * @returns {Promise<string>} The AI's response text
 */
export async function sendChatMessage(userMessage, dashboardData) {
  const token = import.meta.env.VITE_AI_TOKEN;

  if (!token) {
    return generateLocalResponse(userMessage, dashboardData);
  }

  const systemPrompt = buildSystemPrompt(dashboardData);

  const prompt = `<s>[INST] ${systemPrompt}\n\nUser question: ${userMessage} [/INST]`;

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.3,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const generated = response.data?.[0]?.generated_text?.trim();
    return generated || 'I was unable to generate a response. Please try again.';
  } catch (error) {
    console.warn('HF API error, using local response:', error.message);
    return generateLocalResponse(userMessage, dashboardData);
  }
}

/**
 * Builds the strict system prompt that grounds the AI to dashboard data only.
 */
function buildSystemPrompt(data) {
  const { iss, astronauts, news } = data;

  const issInfo = iss
    ? `ISS Current Data:
- Latitude: ${iss.latitude?.toFixed(4) || 'N/A'}
- Longitude: ${iss.longitude?.toFixed(4) || 'N/A'}
- Speed: ${iss.speed?.toFixed(1) || 'N/A'} km/h
- Location: ${iss.location || 'N/A'}
- Tracked Positions: ${iss.positionCount || 0}`
    : 'ISS data is currently unavailable.';

  const astronautInfo = astronauts?.length
    ? `People in Space (${astronauts.length} total):\n${astronauts.map((a) => `- ${a.name} on ${a.craft}`).join('\n')}`
    : 'Astronaut data is currently unavailable.';

  const newsInfo = news?.length
    ? `Recent News Articles:\n${news
        .slice(0, 8)
        .map((n, i) => `${i + 1}. "${n.title}" by ${n.author} (${n.source})`)
        .join('\n')}`
    : 'News data is currently unavailable.';

  return `You are an AI assistant for the ISS Live Tracker & News Dashboard. You MUST answer ONLY using the following dashboard data. If the user asks anything unrelated to ISS tracking or dashboard news, respond exactly with: "I can only answer questions related to ISS tracking and dashboard news data."

${issInfo}

${astronautInfo}

${newsInfo}

Rules:
1. Only use the data above to answer questions.
2. Do not make up information.
3. Be concise and helpful.
4. If asked about something not in the dashboard data, refuse politely with the exact message above.`;
}

/**
 * Provides intelligent local responses when the HF API is unavailable.
 * Parses the user message and responds using available dashboard data.
 */
function generateLocalResponse(message, data) {
  const lower = message.toLowerCase();
  const { iss, astronauts, news } = data;

  // ISS location questions
  if (lower.includes('where') && (lower.includes('iss') || lower.includes('station'))) {
    if (iss) {
      return `The ISS is currently at latitude ${iss.latitude?.toFixed(4)}, longitude ${iss.longitude?.toFixed(4)}, over the ${iss.location || 'ocean'}. It's traveling at approximately ${iss.speed?.toFixed(1) || 'N/A'} km/h.`;
    }
    return 'ISS location data is currently being fetched. Please try again in a moment.';
  }

  // Speed questions
  if (lower.includes('speed') || lower.includes('fast') || lower.includes('velocity')) {
    if (iss?.speed) {
      return `The ISS is currently traveling at approximately ${iss.speed.toFixed(1)} km/h (about ${(iss.speed / 1.609).toFixed(1)} mph). The ISS typically orbits Earth at around 27,600 km/h.`;
    }
    return 'Speed data is being calculated. Please wait for a few position updates.';
  }

  // Astronaut questions
  if (lower.includes('astronaut') || lower.includes('people') || lower.includes('crew') || lower.includes('who')) {
    if (astronauts?.length) {
      const grouped = {};
      astronauts.forEach((a) => {
        if (!grouped[a.craft]) grouped[a.craft] = [];
        grouped[a.craft].push(a.name);
      });
      let response = `There are currently ${astronauts.length} people in space:\n`;
      Object.entries(grouped).forEach(([craft, names]) => {
        response += `\n🚀 ${craft}: ${names.join(', ')}`;
      });
      return response;
    }
    return 'Astronaut data is currently being fetched.';
  }

  // News questions
  if (lower.includes('news') || lower.includes('article') || lower.includes('headline')) {
    if (news?.length) {
      const top = news.slice(0, 5);
      let response = `Here are the latest headlines on the dashboard:\n`;
      top.forEach((n, i) => {
        response += `\n${i + 1}. "${n.title}" — ${n.source}`;
      });
      return response;
    }
    return 'News data is currently being loaded.';
  }

  // Latitude/longitude questions
  if (lower.includes('latitude') || lower.includes('longitude') || lower.includes('coordinates') || lower.includes('position')) {
    if (iss) {
      return `The ISS current coordinates are: Latitude ${iss.latitude?.toFixed(4)}, Longitude ${iss.longitude?.toFixed(4)}.`;
    }
    return 'Position data is being fetched. Please try again shortly.';
  }

  // General ISS question
  if (lower.includes('iss') || lower.includes('station') || lower.includes('space')) {
    if (iss) {
      return `The ISS is currently over the ${iss.location || 'ocean'} at coordinates (${iss.latitude?.toFixed(4)}, ${iss.longitude?.toFixed(4)}), traveling at ${iss.speed?.toFixed(1) || 'N/A'} km/h. There are ${astronauts?.length || 'unknown number of'} people aboard.`;
    }
    return 'ISS data is being loaded. Please check back in a moment.';
  }

  // Unrelated question
  return 'I can only answer questions related to ISS tracking and dashboard news data.';
}
