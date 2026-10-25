/**
 * AI Service for Prompt Vault AI
 * Handles AI prompt enhancement with real AI provider integration (Gemini / OpenAI)
 * and an intelligent, deterministic fallback heuristic engine when no API key is provided.
 */

// Heuristic fallback enhancer
const generateHeuristicImprovement = (promptText, preferredCategory, preferredModel) => {
  const text = (promptText || '').trim();
  const lower = text.toLowerCase();

  // Determine category if not explicitly provided
  let category = preferredCategory && preferredCategory !== 'All' ? preferredCategory : 'Development';
  if (!preferredCategory || preferredCategory === 'All' || preferredCategory === 'Other') {
    if (lower.includes('photo') || lower.includes('image') || lower.includes('render') || lower.includes('camera') || lower.includes('lighting') || lower.includes('midjourney')) {
      category = 'Image Generation';
    } else if (lower.includes('code') || lower.includes('website') || lower.includes('react') || lower.includes('python') || lower.includes('bug') || lower.includes('api') || lower.includes('css') || lower.includes('database')) {
      category = 'Development';
    } else if (lower.includes('market') || lower.includes('ad ') || lower.includes('copy') || lower.includes('sales') || lower.includes('conversion') || lower.includes('landing')) {
      category = 'Marketing';
    } else if (lower.includes('meeting') || lower.includes('email') || lower.includes('schedule') || lower.includes('organize') || lower.includes('workflow')) {
      category = 'Productivity';
    } else if (lower.includes('explain') || lower.includes('teach') || lower.includes('learn') || lower.includes('tutor') || lower.includes('study')) {
      category = 'Education';
    } else if (lower.includes('story') || lower.includes('essay') || lower.includes('poem') || lower.includes('article') || lower.includes('book')) {
      category = 'Writing';
    }
  }

  // Calculate original quality score based on brevity and missing attributes
  let originalScore = 32;
  if (text.length > 50) originalScore += 12;
  if (text.length > 150) originalScore += 15;
  if (lower.includes('act as') || lower.includes('you are')) originalScore += 12;
  if (lower.includes('format') || lower.includes('output:')) originalScore += 10;
  if (text.includes('{') && text.includes('}')) originalScore += 10;
  originalScore = Math.min(originalScore, 65);

  let improvedPrompt = '';
  let suggestedTitle = '';
  let suggestedTags = [];
  let suggestions = [];

  // Tailor improvements based on category
  if (category === 'Image Generation') {
    suggestedTitle = `Hyper-Detailed ${text.split(' ').slice(0, 4).join(' ') || 'Cinematic Subject'} Render`;
    suggestedTags = ['Photorealistic', 'Cinematic', 'Lighting', '8k', 'Midjourney'];
    improvedPrompt = `Create a cinematic, photorealistic visual of ${text || '{Subject}'} captured with a 35mm anamorphic prime lens at f/1.4. Features: dramatic volumetric lighting, subtle rim illumination, intricate textural micro-details, ultra-shallow depth of field, and dark ambient studio aesthetics. Mood: atmospheric, premium, hyper-detailed, 8K resolution, photorealistic octane render --ar 16:9 --v 6.0`;
    suggestions = [
      'Added lens specifications (35mm anamorphic f/1.4) for cinematic focal depth',
      'Specified volumetric and rim lighting conditions for studio quality',
      'Configured aspect ratio and resolution flags for generation engines',
      'Eliminated vague adjectives with tactile micro-texture descriptions'
    ];
  } else if (category === 'Marketing') {
    suggestedTitle = `High-Converting ${text.split(' ').slice(0, 4).join(' ') || 'Direct-Response'} Campaign`;
    suggestedTags = ['Copywriting', 'Conversion', 'SaaS', 'Marketing', 'Headlines'];
    improvedPrompt = `You are a world-class direct response copywriter and conversion strategist. Your objective is to create high-converting copy for: "${text}".

Please deliver the response adhering to the following structure:
1. Core Value Proposition: A bold, benefit-driven hook addressing the primary user pain point.
2. Benefit Matrix: 3 key bullet points structured as Feature -> Immediate Benefit -> Emotional Relief.
3. Social Proof Callout: A convincing metric or trust marker.
4. Primary Call to Action (CTA): High-urgency, frictionless action verb.
5. Objection Handling: Preemptively counter the top 2 buyer hesitations.

Constraints: Avoid corporate buzzwords and generic filler. Maintain an authoritative yet conversational tone.`;
    suggestions = [
      'Defined elite direct-response copywriter persona',
      'Structured response into high-converting copywriting framework',
      'Added explicit constraints to prevent corporate jargon and fluff',
      'Included objection-handling section to increase conversion efficacy'
    ];
  } else if (category === 'Education') {
    suggestedTitle = `Socratic Mastery Guide for ${text.split(' ').slice(0, 4).join(' ') || 'Complex Concept'}`;
    suggestedTags = ['Education', 'SocraticMethod', 'Interactive', 'Tutor', 'DeepLearning'];
    improvedPrompt = `You are a patient, distinguished university professor and Socratic mentor specializing in pedagogy. 
Topic to explore: "${text}".

Interaction Protocol:
1. Do NOT dump long explanations or answers immediately.
2. Assess my current baseline knowledge with one foundational, thought-provoking question.
3. Wait for my answer, validate what I got right, gently correct misconceptions, and ask the next sequential guiding question.
4. Use vivid real-world analogies (e.g. everyday mechanics) when explaining counterintuitive principles.
5. Conclude with a quick 3-question mastery check once core concepts are established.`;
    suggestions = [
      'Shifted passive reading into an interactive Socratic dialogue',
      'Enforced step-by-step turn-taking to prevent cognitive overload',
      'Mandated intuitive real-world analogies for retention',
      'Added concluding mastery verification questions'
    ];
  } else if (category === 'Writing') {
    suggestedTitle = `Engaging Editorial Framework: ${text.split(' ').slice(0, 4).join(' ') || 'Polished Article'}`;
    suggestedTags = ['Writing', 'Editorial', 'Storytelling', 'Structure', 'Content'];
    improvedPrompt = `Act as an award-winning senior editor and storytelling expert. I need a compelling, publication-ready piece based on the following premise: "${text}".

Writing Requirements:
- Tone & Voice: Sophisticated, insightful, rhythmic, and punchy.
- Narrative Arc: Hook the reader in the opening 2 sentences with an intriguing paradox or bold observation.
- Body Sections: Use descriptive subheadings with concrete real-life examples and data placeholders.
- Flow: Vary sentence lengths to build momentum and eliminate passive voice.
- Conclusion: Deliver a memorable closing takeaway that resonates without relying on clichéd summaries.`;
    suggestions = [
      'Defined editorial persona and voice tonality guidelines',
      'Created a narrative hook requirement to engage readers instantly',
      'Banned passive voice and mandated variable sentence cadence',
      'Replaced cliché summaries with actionable, memorable takeaways'
    ];
  } else if (category === 'Productivity') {
    suggestedTitle = `Executive Action Plan & Workflow for ${text.split(' ').slice(0, 3).join(' ') || 'Operations'}`;
    suggestedTags = ['Productivity', 'ExecutiveSummary', 'Workflow', 'ActionItems', 'Efficiency'];
    improvedPrompt = `Adopt the role of an Agile Operations Specialist and Executive Chief of Staff. Process the following input: "${text}".

Deliverables:
1. Executive Brief: 3 concise bullet points summarizing the objective and stakes.
2. Critical Path Roadmap: Sequential checklist of tasks ordered by dependency and impact.
3. Action Item Matrix in a Markdown Table:
   | Task ID | Action Item | Assigned Owner | Priority (P0-P2) | Estimated Effort | Acceptance Criteria |
4. Risk & Blocker Mitigation: Identify 2 potential failure modes and mitigation strategies.`;
    suggestions = [
      'Framed role as Agile Operations Specialist & Chief of Staff',
      'Structured action items into a clean Markdown matrix table',
      'Added Priority (P0-P2) and Acceptance Criteria requirements',
      'Included proactive risk and blocker mitigation protocols'
    ];
  } else {
    // Default Development
    suggestedTitle = `Production-Ready Architecture Prompt: ${text.split(' ').slice(0, 4).join(' ') || 'Fullstack Application'}`;
    suggestedTags = ['Development', 'CleanCode', 'Architecture', 'TypeScript', 'BestPractices'];
    improvedPrompt = `You are a Principal Software Engineer and System Architect. I need an end-to-end, production-grade implementation for: "${text}".

Technical Constraints & Specifications:
1. Architecture: Follow SOLID principles, Clean Architecture, and strict separation of concerns.
2. Code Standards: Provide clean, idiomatic, fully-typed code with explanatory comments on complex logic.
3. Robust Error Handling: Include comprehensive input validation, defensive bounds checking, and graceful failure fallbacks.
4. Security: Adhere to OWASP standards (sanitize inputs, prevent injection vulnerabilities, secure headers).
5. Testing: Provide automated unit test suites covering the happy path, edge cases, and error boundaries.

Output Format: Step-by-step code blocks with clear filenames and explanation of architectural decisions.`;
    suggestions = [
      'Specified Principal Software Engineer persona with architecture focus',
      'Enforced SOLID and Clean Architecture standards',
      'Mandated OWASP security practices and defensive input validation',
      'Required automated test cases covering edge cases and error boundaries'
    ];
  }

  return {
    originalPrompt: text,
    originalScore,
    improvedPrompt,
    qualityScore: 94,
    suggestedTitle,
    suggestedCategory: category,
    suggestedTags,
    suggestions,
    provider: 'prompt-vault-heuristic-engine'
  };
};

/**
 * Main AI Improvement service
 * Calls external AI provider (Gemini / OpenAI) if key is provided, or uses smart heuristic engine.
 */
const improvePrompt = async ({ prompt, category, aiModel }) => {
  if (!prompt || !prompt.trim()) {
    throw new Error('Prompt content is required to improve');
  }

  const apiKey =
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY;

  // If no external key configured, use deterministic smart heuristic engine
  if (!apiKey || apiKey === 'your_ai_api_key' || apiKey === 'mock') {
    return generateHeuristicImprovement(prompt, category, aiModel);
  }

  // If Gemini or OpenAI key is configured, call external provider
  try {
    if (process.env.OPENAI_API_KEY || apiKey.startsWith('sk-')) {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert prompt engineer. Analyze the user prompt, optimize it for maximum clarity, structure, and quality, and respond ONLY in valid JSON matching this schema: {"originalPrompt": string, "originalScore": number, "improvedPrompt": string, "qualityScore": number, "suggestedTitle": string, "suggestedCategory": string, "suggestedTags": string[], "suggestions": string[]}'
            },
            {
              role: 'user',
              content: `Original prompt to improve:\n"${prompt}"\nPreferred Category: ${category || 'auto'}\nTarget AI Model: ${aiModel || 'ChatGPT'}`
            }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      return {
        ...parsed,
        provider: 'openai'
      };
    } else {
      // Call Google Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const systemInstruction = `You are an expert prompt engineer. Refine the given prompt into a high-grade prompt. Return ONLY a single JSON object with these fields:
{
  "originalPrompt": string,
  "originalScore": number between 20 and 60,
  "improvedPrompt": string,
  "qualityScore": number between 88 and 98,
  "suggestedTitle": string,
  "suggestedCategory": string (one of Development, Writing, Marketing, Image Generation, Productivity, Education, Other),
  "suggestedTags": array of 4-6 strings,
  "suggestions": array of 4 bullet points explaining what was improved
}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstruction}\n\nUser prompt to improve:\n"${prompt}"`
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        provider: 'gemini'
      };
    }
  } catch (apiError) {
    console.warn(`[AIService] External provider call failed (${apiError.message}). Falling back to heuristic engine.`);
    return generateHeuristicImprovement(prompt, category, aiModel);
  }
};

module.exports = {
  improvePrompt
};
