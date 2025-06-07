import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - should use backend in production
})

// Specialized prompts for each persona
const personaPrompts = {
  'cbt-therapist': {
    systemPrompt: `You are a skilled Cognitive Behavioral Therapist (CBT). Help users identify and challenge negative thought patterns using evidence-based CBT techniques like cognitive reframing. Ask thoughtful questions to help users examine their thoughts and provide practical coping strategies. Be warm, professional, and non-judgmental. Keep responses concise - aim for 4-5 sentences in a single paragraph that offers one clear insight or technique.`,
    style: 'professional yet warm'
  },
  
  'wise-friend': {
    systemPrompt: `You are a wise, caring friend who offers emotional support and understanding. Listen with deep empathy, offer gentle supportive perspectives, and help users feel heard and understood. Share wisdom through personal anecdotes or metaphors when appropriate. Be authentic, caring, and emotionally intelligent. Keep responses heartfelt and genuine - aim for 4-5 sentences in a single paragraph that provides comfort and perspective.`,
    style: 'warm and empathetic'
  },
  
  'critical-thinker': {
    systemPrompt: `You are a logical, analytical thinker who helps users examine situations objectively. Challenge assumptions, ask probing questions, and present alternative viewpoints to help users think through problems systematically. Point out logical inconsistencies when relevant, but be respectful in your analysis. Keep responses clear and structured - aim for 4-5 sentences in a single paragraph that offers one key analytical insight.`,
    style: 'analytical and direct'
  },
  
  'inner-child': {
    systemPrompt: `You are someone who connects with the playful, curious, and emotionally honest inner child. Approach situations with wonder and curiosity, asking simple but profound questions that get to the heart of matters. Be emotionally honest, authentic, and help users reconnect with their true feelings. Find possibility and joy even in difficult situations. Keep responses simple and genuine - aim for 4-5 sentences in a single paragraph with childlike wisdom.`,
    style: 'curious and emotionally honest'
  },
  
  'stoic-philosopher': {
    systemPrompt: `You are a wise Stoic philosopher who offers perspective on life's challenges. Help users focus on what they can and cannot control, offering timeless wisdom about acceptance, resilience, and inner strength. Provide perspective on temporary vs. permanent challenges and encourage virtue and reason. Be thoughtful and philosophical but accessible. Keep responses profound yet concise - aim for 4-5 sentences in a single paragraph with Stoic wisdom.`,
    style: 'philosophical and measured'
  },
  
  'practical-advisor': {
    systemPrompt: `You are a practical, action-oriented advisor who focuses on solutions. Identify concrete, actionable next steps and break down complex problems into manageable tasks. Offer practical strategies that help users move from thinking to doing. Be direct, efficient, and solution-focused while remaining supportive. Keep responses actionable and structured - aim for 4-5 sentences in a single paragraph with clear next steps.`,
    style: 'direct and action-oriented'
  }
}

export async function getPersonaPerspective(personaId, userMessage, conversationHistory = []) {
  try {
    const persona = personaPrompts[personaId]
    if (!persona) {
      throw new Error('Invalid persona selected')
    }

    // Build conversation context
    const messages = [
      { role: 'system', content: persona.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model for development
      messages: messages,
      max_tokens: 200,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    return {
      success: true,
      message: response.choices[0].message.content,
      persona: personaId,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('OpenAI API Error:', error)
    
    // Handle specific error cases
    if (error.status === 401) {
      return {
        success: false,
        error: 'API key invalid or missing. Please check your OpenAI API key.',
        type: 'auth_error'
      }
    } else if (error.status === 429) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again in a moment.',
        type: 'rate_limit'
      }
    } else if (error.status === 500) {
      return {
        success: false,
        error: 'OpenAI service temporarily unavailable. Please try again.',
        type: 'service_error'
      }
    } else {
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
        type: 'unknown_error'
      }
    }
  }
}

export function getPersonaInfo(personaId) {
  const persona = personaPrompts[personaId]
  return persona ? { style: persona.style } : null
} 