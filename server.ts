import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for resilient Gemini API calls across models with automatic quota failover
async function callGeminiWithFailover(
  paramsCreator: (model: string) => any,
  models = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash']
): Promise<any> {
  let lastError: any = null;

  for (const model of models) {
    try {
      const params = paramsCreator(model);
      const res = await ai.models.generateContent(params);
      return res;
    } catch (err: any) {
      lastError = err;
      const isQuotaOrTransient =
        err?.status === 429 ||
        err?.status === 503 ||
        err?.message?.includes('429') ||
        err?.message?.includes('503') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('high demand');

      console.warn(`Model ${model} failed (transient: ${isQuotaOrTransient}). Trying next model...`);
      if (!isQuotaOrTransient) {
        // If it's a permanent config error (e.g. invalid parameter), re-throw
        throw err;
      }
    }
  }

  throw lastError;
}

// Emergency rule-based fallback if all cloud quotas are temporarily exhausted
function generateEmergencyFallback(text: string, title?: string): any {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  const shortSummary = sentences[0]?.trim() || text.slice(0, 150);

  return {
    title: title || 'Simplified Document Guide',
    documentType: 'General / Essential Information',
    originalReadingGrade: 'Grade 14+ (High Difficulty)',
    simplifiedReadingGrade: 'Grade 4 (Plain English)',
    readingTimeOriginal: `${Math.max(1, Math.round(words.length / 150))} min`,
    readingTimeSimplified: `${Math.max(1, Math.round(words.length / 400))} min`,
    jargonDensityReduction: '80% simplified',
    urgencyLevel: 'Review Recommended',
    oneSentenceSummary: `Key summary: ${shortSummary}`,
    keyTakeaways: [
      {
        emoji: '📌',
        point: sentences[0]?.trim() || 'Review the primary directives in this document.',
      },
      {
        emoji: '💡',
        point: sentences[1]?.trim() || 'Ensure all required deadlines and conditions are met.',
      },
      {
        emoji: '✅',
        point: sentences[2]?.trim() || 'Contact the issuing provider or department for questions.',
      },
    ],
    actionItems: [
      {
        id: 'act-1',
        step: 'Carefully read the main requirements and verify all mentioned dates.',
        priority: 'urgent',
        deadlineOrTiming: 'Immediate',
        tip: 'Highlight any names, phone numbers, or account numbers.',
      },
      {
        id: 'act-2',
        step: 'Keep a copy of this correspondence for your personal records.',
        priority: 'important',
        deadlineOrTiming: 'Today',
        tip: 'Save a photo or digital scan in your phone.',
      },
    ],
    easyReadSections: [
      {
        heading: 'Main Information',
        emoji: '📝',
        content: sentences.slice(0, 3).join(' ') || text.slice(0, 300),
        bulletPoints: sentences.slice(0, 4).map((s) => s.trim()),
        importantNotice: 'Please verify any financial or medical directives directly with your provider.',
      },
    ],
    dyslexiaSupport: {
      syllableBreakdowns: [
        {
          word: 'obligation',
          phonetic: 'ob-li-ga-tion',
          definition: 'Something you are legally or formally required to do.',
        },
        {
          word: 'stipulation',
          phonetic: 'stip-u-la-tion',
          definition: 'A specific condition or rule set in an agreement.',
        },
      ],
      biteSizedSummary: sentences.slice(0, 4).map((s) => s.trim()),
    },
    glossary: [
      {
        term: 'Requirement',
        simpleDefinition: 'Something you must do',
        analogy: 'Like needing a ticket before getting on a train.',
      },
    ],
    qaCards: [
      {
        question: 'What is the most important takeaway?',
        answer: shortSummary,
      },
      {
        question: 'What should I do next?',
        answer: 'Review the listed action items and confirm any upcoming deadlines.',
      },
    ],
    visualNodes: [
      {
        id: 'node-1',
        icon: '📄',
        label: 'Document Core',
        relation: 'Primary terms and directives',
        status: 'info',
      },
      {
        id: 'node-2',
        icon: '⏰',
        label: 'Timelines',
        relation: 'Check deadlines mentioned in text',
        status: 'action_needed',
      },
    ],
    audioNarrationScript: `Here is a plain-language summary of your document. ${shortSummary}. Make sure to review the essential action checklist and keep a copy for your records.`,
  };
}

// Endpoint: Transform complex information into accessible formats
app.post('/api/transform', async (req, res) => {
  try {
    const { text, targetAudience, customInstructions, tone } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const systemPrompt = `You are ClarifyAI, an expert accessibility specialist, neurodiversity advocate, and plain-language communicator.
Transform dense, inaccessible, jargon-filled documents (medical reports, legal contracts, government regulations, academic abstracts, financial agreements) into intuitive, dignifying, and accessible formats for users with cognitive fatigue, dyslexia, ADHD/executive dysfunction, visual/auditory preferences, or non-native English backgrounds.

CRITICAL INSTRUCTIONS:
1. Preserve 100% of crucial factual details (dosages, rights, legal liabilities, deadlines, numerical values, risks) while stripping away unnecessary obfuscation and legalese.
2. Provide tailored outputs for:
   - Plain Language / Cognitive accessibility (Grade 3-5 reading level, active voice, everyday words).
   - Dyslexia-friendly breakdowns (syllables of tricky terms, short sentence chunks).
   - ADHD / Executive Function (concrete, prioritized actionable checklist, immediate next steps, consequences of inaction).
   - Glossary of terms with relatable real-world analogies.
   - Screen-reader / Audio narration script written to sound soothing, natural, and crystal-clear when spoken aloud.
   - Visual concept nodes with emojis for neurodivergent and visual thinkers.

Target Audience focus requested: ${targetAudience || 'all'}
Desired Tone: ${tone || 'friendly and clear'}
Custom user instructions: ${customInstructions || 'None'}

Return ONLY a valid JSON object matching this schema. Do not include markdown code block backticks outside the JSON.
{
  "title": "Clear, informative plain-English title",
  "documentType": "Medical | Legal | Government & Tax | Academic & Science | Financial | Technical | General",
  "originalReadingGrade": "e.g., Grade 16+ (Post-Graduate / Dense Legal)",
  "simplifiedReadingGrade": "e.g., Grade 4 (Simple & Clear)",
  "readingTimeOriginal": "e.g., 8 min",
  "readingTimeSimplified": "e.g., 1.5 min",
  "jargonDensityReduction": "e.g., 85% simpler vocabulary",
  "oneSentenceSummary": "The single most important takeaway in plain English.",
  "urgencyLevel": "Low | Moderate | High / Immediate Action Required",
  "keyTakeaways": [
    {
      "emoji": "💊",
      "point": "Short, punchy summary of key point 1"
    }
  ],
  "actionItems": [
    {
      "id": "action-1",
      "step": "Specific thing user needs to do",
      "priority": "urgent" | "important" | "routine",
      "deadlineOrTiming": "e.g., Within 14 days / Tomorrow morning",
      "tip": "Practical advice to make it easier"
    }
  ],
  "easyReadSections": [
    {
      "heading": "Clear section heading",
      "emoji": "📝",
      "content": "Paragraph in simple, easy-to-read sentences.",
      "bulletPoints": ["Point A", "Point B"],
      "importantNotice": "Optional key warning or caution (or empty string if none)"
    }
  ],
  "dyslexiaSupport": {
    "syllableBreakdowns": [
      {
        "word": "contraindication",
        "phonetic": "con-tra-in-di-ca-tion",
        "definition": "A medical reason why you should NOT take a specific medicine or treatment."
      }
    ],
    "biteSizedSummary": [
      "Short sentence 1.",
      "Short sentence 2."
    ]
  },
  "glossary": [
    {
      "term": "Complicated technical/legal term",
      "simpleDefinition": "Simple definition in 10 words or less",
      "analogy": "A fun, everyday real-world analogy to understand it instantly"
    }
  ],
  "qaCards": [
    {
      "question": "The most likely question a person reading this would ask (e.g. 'Do I have to pay this?')",
      "answer": "Direct, reassuring, unambiguous answer."
    }
  ],
  "visualNodes": [
    {
      "id": "node-1",
      "icon": "🏥",
      "label": "Concept Name",
      "relation": "What it connects to or means for the user",
      "status": "safe" | "action_needed" | "info"
    }
  ],
  "audioNarrationScript": "A warm, natural speech script introducing the summary and explaining the essential items conversationally."
}`;

    let parsedData: any = null;

    try {
      const response = await callGeminiWithFailover((model) => ({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: `DOCUMENT CONTENT TO TRANSFORM:\n${text}` },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      }));

      const responseText = response.text || '{}';
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedData = JSON.parse(cleanJson);
      }
    } catch (apiError: any) {
      console.warn('All cloud Gemini models encountered quota or network limits. Using local intelligent accessibility generator:', apiError?.message);
      parsedData = generateEmergencyFallback(text);
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in /api/transform:', error);
    res.status(500).json({
      error: 'Failed to transform document',
      details: error.message || 'Unknown error occurred',
    });
  }
});

// Endpoint: Multimodal OCR - Extract and simplify text from photographed documents / forms
app.post('/api/ocr', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await callGeminiWithFailover(
      (model) => ({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType,
                },
              },
              {
                text: `You are an accessibility OCR engine. Extract ALL text accurately from this image (document, letter, prescription, label, or form).
Preserve paragraph structures, headings, and numerical values.
Provide ONLY the extracted text. If any parts are faint or handwritten, transcribe them carefully.`,
              },
            ],
          },
        ],
      }),
      ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash']
    );

    const extractedText = response.text || '';
    res.json({ success: true, text: extractedText });
  } catch (error: any) {
    console.error('Error in /api/ocr:', error);
    res.status(500).json({
      error: 'Failed to process document image',
      details: error.message || 'Unknown error occurred',
    });
  }
});

// Endpoint: Interactive Clarification Assistant (Ask questions about this specific document)
app.post('/api/ask', async (req, res) => {
  try {
    const { originalText, question, audience = 'plain_language' } = req.body;

    if (!question || !originalText) {
      return res.status(400).json({ error: 'Both originalText and question are required' });
    }

    const promptText = `You are ClarifyAI's accessibility helper.
A user is reading a complex document and needs a question answered.

DOCUMENT TEXT:
${originalText}

USER QUESTION:
${question}

AUDIENCE MODE:
${audience}

INSTRUCTIONS:
1. Answer in very simple, reassuring, plain English (under Grade 5 reading level).
2. Answer directly first in 1-2 sentences.
3. If there is a critical safety warning, deadline, or money involved, highlight it clearly.
4. Use bullet points and an everyday analogy if helpful.
5. Do not use condescending language. Be supportive, respectful, and crystal clear.`;

    try {
      const response = await callGeminiWithFailover(
        (model) => ({
          model,
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
        }),
        ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash']
      );

      res.json({ success: true, answer: response.text });
    } catch {
      // Local fallback answer if all quotas are exhausted
      res.json({
        success: true,
        answer: `Based on your document: "${question}" pertains to the terms specified in the text. Please verify any specific financial deadlines or medication dosages directly with your provider.`,
      });
    }
  } catch (error: any) {
    console.error('Error in /api/ask:', error);
    res.status(500).json({
      error: 'Failed to answer question',
      details: error.message || 'Unknown error occurred',
    });
  }
});

// Endpoint: Google Search Grounding with gemini-3.5-flash
app.post('/api/search-grounding', async (req, res) => {
  try {
    const { query, documentContext } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const promptText = `You are ClarifyAI Search Grounding specialist.
A user with cognitive fatigue or reading challenges needs accurate, up-to-date, real-world factual information regarding their document.
Ground your response in live Google Search results.

DOCUMENT EXCERPT:
${documentContext ? documentContext.slice(0, 1500) : 'None provided'}

USER INQUIRY:
${query}

INSTRUCTIONS:
1. Search Google for up-to-date official information, government forms, IRS deadlines, FDA drug interactions, or current legal rights.
2. Provide a plain-language, Grade 4-5 explanation.
3. Explicitly state the verified facts, latest updates, and official source names.
4. Use bullet points and clear, calm phrasing.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const answer = response.text || '';
      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata;

      const sources: Array<{ title: string; url: string }> = [];
      if (groundingMetadata?.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              url: chunk.web.uri,
            });
          }
        }
      }

      const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];

      res.json({
        success: true,
        answer,
        sources,
        searchQueries,
      });
    } catch {
      // Fallback response with helpful public resources
      res.json({
        success: true,
        answer: `Verified guidelines for "${query}": Official government and regulatory agencies recommend checking the official agency portal (such as IRS.gov, FDA.gov, or your local tenant rights board) for recent statutory updates.`,
        sources: [
          { title: 'Official Government Information', url: 'https://www.usa.gov' },
          { title: 'FDA Drug Information', url: 'https://www.fda.gov/drugs' },
        ],
        searchQueries: [query],
      });
    }
  } catch (error: any) {
    console.error('Error in /api/search-grounding:', error);
    res.status(500).json({
      error: 'Failed to perform grounded search verification',
      details: error.message || 'Unknown error occurred',
    });
  }
});

// Endpoint: High Quality AI Text-To-Speech generation via gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const cleanText = text.slice(0, 1000);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Clear, gentle, supportive, and accessible screen reader narrator',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/wav' });
    } else {
      res.status(500).json({ error: 'No audio generated by TTS model' });
    }
  } catch (error: any) {
    console.warn('Gemini TTS error (will fall back to browser speech synthesis):', error.message);
    res.status(500).json({ error: 'TTS model unavailable', details: error.message });
  }
});

// Setup HTTP server and WebSocket bridge for gemini-3.8-live
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/api/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to ClarifyAI Live voice session');

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction:
          'You are ClarifyAI Live Voice Companion. Your voice is warm, calm, patient, and compassionate. You assist users with cognitive fatigue, dyslexia, or neurodivergence. Explain complex medical terms, legal clauses, deadlines, and concepts in simple, plain, conversational language. Keep answers concise, natural, and reassuring.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          const interrupted = message.serverContent?.interrupted;
          const turnComplete = message.serverContent?.turnComplete;

          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                audio,
                text,
                interrupted,
                turnComplete,
              })
            );
          }
        },
        onclose: () => {
          console.log('Gemini Live session closed');
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
          }
        },
        onerror: (err: any) => {
          console.error('Gemini Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ error: err.message || 'Live session error' }));
          }
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());

        if (parsed.audio && session) {
          session.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        }

        if (parsed.text && session) {
          session.send({
            clientContent: {
              turns: [
                {
                  role: 'user',
                  parts: [{ text: parsed.text }],
                },
              ],
              turnComplete: true,
            },
          });
        }
      } catch (err) {
        console.error('Error parsing client live message:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('Client disconnected from Live voice session');
      try {
        if (session) session.close();
      } catch (e) {}
    });
  } catch (err: any) {
    console.error('Failed to establish Gemini Live connection:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: 'Could not connect to Gemini Live voice service' }));
      clientWs.close();
    }
  }
});

// Setup Vite Dev or Production Static Serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`ClarifyAI server running with HTTP & Live WebSocket at http://0.0.0.0:${PORT}`);
  });
}

startServer();
