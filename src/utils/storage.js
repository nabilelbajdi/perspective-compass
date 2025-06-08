const STORAGE_KEY = 'perspective_compass_data'
const SENTIMENT_KEY = 'perspective_compass_sentiments'

export function saveConversations(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch (error) {
    console.error('Failed to save conversations:', error)
  }
}

export function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to load conversations:', error)
    return []
  }
}

export function clearConversations() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear conversations:', error)
  }
}

// Sentiment data storage
export function saveSentiments(sentiments) {
  try {
    localStorage.setItem(SENTIMENT_KEY, JSON.stringify(sentiments))
  } catch (error) {
    console.error('Failed to save sentiments:', error)
  }
}

export function loadSentiments() {
  try {
    const saved = localStorage.getItem(SENTIMENT_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to load sentiments:', error)
    return []
  }
}

export function addSentiment(sentiment) {
  try {
    const sentiments = loadSentiments()
    sentiments.push(sentiment)
    saveSentiments(sentiments)
    return sentiments
  } catch (error) {
    console.error('Failed to add sentiment:', error)
    return loadSentiments()
  }
}

export function clearSentiments() {
  try {
    localStorage.removeItem(SENTIMENT_KEY)
  } catch (error) {
    console.error('Failed to clear sentiments:', error)
  }
}

export function clearAllData() {
  clearConversations()
  clearSentiments()
} 