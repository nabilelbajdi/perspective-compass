const STORAGE_KEY = 'perspective-compass-conversations'

export function saveConversation(messages) {
  try {
    const conversationData = {
      messages,
      lastUpdated: new Date().toISOString(),
      messageCount: messages.length
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationData))
    return true
  } catch (error) {
    console.error('Failed to save conversation:', error)
    return false
  }
}

export function loadConversation() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    
    const data = JSON.parse(saved)
    
    // Validate the data structure
    if (data.messages && Array.isArray(data.messages)) {
      return {
        messages: data.messages,
        lastUpdated: data.lastUpdated,
        messageCount: data.messageCount || data.messages.length
      }
    }
    return null
  } catch (error) {
    console.error('Failed to load conversation:', error)
    return null
  }
}

export function clearConversation() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear conversation:', error)
    return false
  }
}

export function getConversationInfo() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    
    const data = JSON.parse(saved)
    return {
      messageCount: data.messageCount || 0,
      lastUpdated: data.lastUpdated,
      hasConversation: data.messages && data.messages.length > 0
    }
  } catch (error) {
    console.error('Failed to get conversation info:', error)
    return null
  }
} 