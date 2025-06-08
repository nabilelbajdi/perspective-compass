import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

// Analyze sentiment of user input
export async function analyzeSentiment(text) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Analyze the emotional sentiment of the user's text. Return ONLY a JSON object with this exact format:
{
  "emotion": "happy|sad|anxious|angry|neutral|excited|frustrated|overwhelmed|peaceful|confused",
  "intensity": 0.1-1.0,
  "confidence": 0.1-1.0,
  "summary": "brief 2-3 word description"
}

Focus on the primary emotion. Be precise with intensity (0.1=barely detectable, 1.0=extremely intense).`
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 100,
      temperature: 0.1
    })

    const result = JSON.parse(response.choices[0].message.content.trim())
    
    return {
      success: true,
      sentiment: {
        emotion: result.emotion,
        intensity: Math.round(result.intensity * 10) / 10, // Round to 1 decimal
        confidence: Math.round(result.confidence * 10) / 10,
        summary: result.summary,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Sentiment analysis failed:', error)
    return {
      success: false,
      error: 'Failed to analyze sentiment',
      sentiment: {
        emotion: 'neutral',
        intensity: 0.5,
        confidence: 0.1,
        summary: 'unknown',
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Get color for emotion visualization
export function getEmotionColor(emotion) {
  const colors = {
    happy: '#22C55E',
    excited: '#F59E0B',
    peaceful: '#06B6D4',
    neutral: '#6B7280',
    confused: '#8B5CF6',
    sad: '#3B82F6',
    anxious: '#F97316',
    frustrated: '#EF4444',
    angry: '#DC2626',
    overwhelmed: '#EC4899'
  }
  return colors[emotion] || colors.neutral
}

// Get emotion emoji for display
export function getEmotionEmoji(emotion) {
  const emojis = {
    happy: '😊',
    excited: '🤩',
    peaceful: '😌',
    neutral: '😐',
    confused: '😕',
    sad: '😢',
    anxious: '😰',
    frustrated: '😤',
    angry: '😠',
    overwhelmed: '🤯'
  }
  return emojis[emotion] || emojis.neutral
} 