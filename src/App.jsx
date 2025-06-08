import { useState, useEffect } from 'react'
import { 
  Brain, 
  Heart, 
  Search, 
  Sparkles, 
  Building, 
  ListCheck,
  Send,
  MessageCircle,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react'
import { getPersonaPerspective, getPersonaInfo } from './services/openai'
import ChatMessage from './components/ChatMessage'
import { saveConversation, loadConversation, clearConversation, getConversationInfo } from './utils/storage'

function App() {
  const [input, setInput] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('cbt-therapist')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Load conversation on startup
  useEffect(() => {
    const savedConversation = loadConversation()
    if (savedConversation && savedConversation.messages.length > 0) {
      setMessages(savedConversation.messages)
    }
  }, [])

  // Auto-save conversation whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation(messages)
    }
  }, [messages])

  const personas = [
    { 
      id: 'cbt-therapist', 
      name: 'CBT Therapist', 
      icon: Brain, 
      description: 'Cognitive reframing and evidence-based insights',
      color: 'from-primary to-blue-400'
    },
    { 
      id: 'wise-friend', 
      name: 'Wise Friend', 
      icon: Heart, 
      description: 'Empathetic support and emotional understanding',
      color: 'from-success to-green-400'
    },
    { 
      id: 'critical-thinker', 
      name: 'Critical Thinker', 
      icon: Search, 
      description: 'Logical analysis and challenging assumptions',
      color: 'from-secondary to-purple-400'
    },
    { 
      id: 'inner-child', 
      name: 'Inner Child', 
      icon: Sparkles, 
      description: 'Playful curiosity and emotional intelligence',
      color: 'from-yellow-500 to-orange-400'
    },
    { 
      id: 'stoic-philosopher', 
      name: 'Stoic Philosopher', 
      icon: Building, 
      avatar: '/stoic.png',
      description: 'Wisdom, acceptance, and philosophical perspective',
      color: 'from-gray-500 to-slate-400'
    },
    { 
      id: 'practical-advisor', 
      name: 'Practical Advisor', 
      icon: ListCheck, 
      description: 'Action-oriented, solution-focused guidance',
      color: 'from-orange-500 to-red-400'
    }
  ]

  const handleClearConversation = () => {
    setShowClearConfirm(true)
  }

  const confirmClearConversation = () => {
    setMessages([])
    clearConversation()
    setError(null)
    setShowClearConfirm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      persona: selectedPersona
    }

    // Add user message immediately
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Get conversation history for context
      const conversationHistory = messages.slice(-12).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Get AI response
      const response = await getPersonaPerspective(
        selectedPersona,
        userMessage.content,
        conversationHistory
      )

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.message,
          persona: response.persona,
          timestamp: response.timestamp
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        // Handle error
        setError(response.error)
        console.error('AI Response Error:', response)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPersonaData = personas.find(p => p.id === selectedPersona)

  return (
    <div className={`min-h-screen font-sans relative ${
      isDarkMode 
        ? 'bg-black text-text-main' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Gradient accent line */}
      <div className="fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className={`border-b ${
          isDarkMode 
            ? 'border-neutral-border/50 bg-surface' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                  Perspective Compass
                </h1>
                <p className={`${
                  isDarkMode ? 'text-text-muted' : 'text-gray-600'
                }`}>
                  Gain insights from different therapeutic perspectives
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-surface hover:bg-white/5 text-text-muted' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Persona Selector Sidebar */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className={`rounded-2xl border p-6 ${
                isDarkMode 
                  ? 'bg-surface border-neutral-border/50' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <h3 className={`text-lg font-medium mb-4 ${
                  isDarkMode ? 'text-text-main' : 'text-gray-900'
                }`}>
                  Choose Your Perspective
                </h3>
                
                <div className="space-y-3">
                  {personas.map((persona) => {
                    const IconComponent = persona.icon
                    const isSelected = selectedPersona === persona.id
                    
                    return (
                      <button
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-300 text-left group cursor-pointer ${
                          isSelected
                            ? 'border-primary/50 bg-gradient-to-r ' + persona.color + ' shadow-glow-blue'
                            : isDarkMode
                              ? 'border-neutral-border hover:border-neutral-border/80 bg-surface/50 hover:bg-white/5'
                              : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center justify-center">
                            {persona.avatar ? (
                              <img 
                                src={persona.avatar} 
                                alt={persona.name}
                                className="w-7 h-7 rounded-full object-cover object-center"
                              />
                            ) : persona.id === 'wise-friend' ? (
                              <IconComponent 
                                className={`w-6 h-6 ${
                                  isSelected 
                                    ? 'text-white' 
                                    : 'text-[#98002e]'
                                }`} 
                                fill="currentColor"
                              />
                            ) : persona.id === 'cbt-therapist' ? (
                              <IconComponent 
                                className={`w-6 h-6 ${
                                  isSelected 
                                    ? 'text-white' 
                                    : 'text-[#f3b5b8]'
                                }`} 
                                fill="currentColor"
                              />
                            ) : persona.id === 'critical-thinker' ? (
                              <IconComponent 
                                className={`w-6 h-6 ${
                                  isSelected 
                                    ? 'text-white' 
                                    : 'text-[#A9A9A9]'
                                }`} 
                                fill="currentColor"
                              />
                            ) : persona.id === 'inner-child' ? (
                              <span className="text-xl">🧸</span>
                            ) : persona.id === 'practical-advisor' ? (
                              <IconComponent 
                                className={`w-6 h-6 ${
                                  isSelected 
                                    ? 'text-white' 
                                    : 'text-orange-500'
                                }`} 
                                fill="currentColor"
                              />
                            ) : (
                              <div className={`p-2 rounded-lg ${
                                isSelected 
                                  ? 'bg-white/20' 
                                  : isDarkMode
                                    ? 'bg-neutral-border/50 group-hover:bg-white/10'
                                    : 'bg-gray-200 group-hover:bg-gray-300'
                              }`}>
                                <IconComponent className={`w-5 h-5 ${
                                  isSelected 
                                    ? 'text-white' 
                                    : isDarkMode 
                                      ? 'text-text-muted' 
                                      : 'text-gray-600'
                                }`} />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className={`font-medium ${
                              isSelected 
                                ? 'text-white' 
                                : isDarkMode 
                                  ? 'text-text-main' 
                                  : 'text-gray-900'
                            }`}>
                              {persona.name}
                            </div>
                            <div className={`text-sm mt-1 ${
                              isSelected 
                                ? 'text-white/80' 
                                : isDarkMode 
                                  ? 'text-text-muted' 
                                  : 'text-gray-600'
                            }`}>
                              {persona.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="space-y-6">
              {/* Chat Messages */}
              <div className={`rounded-2xl border min-h-[500px] relative ${
                isDarkMode 
                  ? 'bg-surface border-neutral-border/50' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center px-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-xl font-medium mb-2 ${
                      isDarkMode ? 'text-text-main' : 'text-gray-900'
                    }`}>
                      Share what's on your mind
                    </h3>
                    <p className={`max-w-md ${
                      isDarkMode ? 'text-text-muted' : 'text-gray-600'
                    }`}>
                      Your selected perspective will offer personalized insights and guidance 
                      tailored to help you understand your situation better.
                    </p>
                    
                    {/* Current selection indicator */}
                    <div className={`mt-8 p-4 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-neutral-border/20 border-neutral-border/30' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        {selectedPersonaData.avatar ? (
                          <img 
                            src={selectedPersonaData.avatar} 
                            alt={selectedPersonaData.name}
                            className="w-5 h-5 rounded-full object-cover object-center"
                          />
                        ) : selectedPersonaData.id === 'wise-friend' ? (
                          <selectedPersonaData.icon className="w-5 h-5 text-[#98002e]" fill="currentColor" />
                        ) : selectedPersonaData.id === 'cbt-therapist' ? (
                          <selectedPersonaData.icon className="w-5 h-5 text-[#f3b5b8]" fill="currentColor" />
                        ) : selectedPersonaData.id === 'critical-thinker' ? (
                          <selectedPersonaData.icon className="w-5 h-5 text-[#A9A9A9]" fill="currentColor" />
                        ) : selectedPersonaData.id === 'inner-child' ? (
                          <span className="text-base">🧸</span>
                        ) : selectedPersonaData.id === 'practical-advisor' ? (
                          <selectedPersonaData.icon className="w-5 h-5 text-orange-500" fill="currentColor" />
                        ) : (
                          <selectedPersonaData.icon className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <div className={`text-sm font-medium ${
                            isDarkMode ? 'text-text-main' : 'text-gray-900'
                          }`}>
                            Currently selected: {selectedPersonaData.name}
                          </div>
                          <div className={`text-xs ${
                            isDarkMode ? 'text-text-muted' : 'text-gray-600'
                          }`}>
                            {selectedPersonaData.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide">
                      {messages.map((message, index) => {
                        // Detect persona switch for visual indicator
                        const prevMessage = index > 0 ? messages[index - 1] : null
                        const showPersonaSwitch = message.role === 'assistant' && 
                          prevMessage && 
                          prevMessage.role === 'assistant' && 
                          prevMessage.persona !== message.persona

                        const messagePersona = message.role === 'assistant' 
                          ? personas.find(p => p.id === message.persona) 
                          : null
                        
                        return (
                          <ChatMessage 
                            key={index} 
                            message={message} 
                            persona={messagePersona}
                            showPersonaSwitch={showPersonaSwitch}
                            isDarkMode={isDarkMode}
                          />
                        )
                      })}
                      
                      {/* Loading indicator */}
                      {isLoading && (
                        <div className="flex justify-start animate-slide-up">
                          <div className="max-w-[70%]">
                            <div className={`text-sm mb-2 ${
                              isDarkMode ? 'text-text-muted' : 'text-gray-600'
                            }`}>
                              <span>{selectedPersonaData.name} is thinking...</span>
                            </div>
                            <div className={`border rounded-2xl px-4 py-3 ${
                              isDarkMode 
                                ? 'bg-surface border-neutral-border/50' 
                                : 'bg-white border-gray-200'
                            }`}>
                              <div className="flex space-x-1">
                                <div className={`w-2 h-2 rounded-full animate-bounce ${
                                  isDarkMode ? 'bg-text-muted' : 'bg-gray-400'
                                }`}></div>
                                <div className={`w-2 h-2 rounded-full animate-bounce ${
                                  isDarkMode ? 'bg-text-muted' : 'bg-gray-400'
                                }`} style={{animationDelay: '0.1s'}}></div>
                                <div className={`w-2 h-2 rounded-full animate-bounce ${
                                  isDarkMode ? 'bg-text-muted' : 'bg-gray-400'
                                }`} style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                

              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 ${
                isDarkMode 
                  ? 'bg-surface border-neutral-border/50' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                {/* Error display */}
                {error && (
                  <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      // Auto-resize textarea
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
                    }}
                    onKeyDown={(e) => {
                      // Submit on Enter (but allow Shift+Enter for new lines)
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (input.trim() && !isLoading) {
                          handleSubmit(e)
                        }
                      }
                    }}
                    placeholder="Share your thoughts or feelings..."
                    className={`w-full p-3 border rounded-xl resize-none focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/30 transition-all duration-200 min-h-[44px] max-h-[200px] scrollbar-hide ${
                      isDarkMode 
                        ? 'bg-background/50 border-neutral-border text-text-main placeholder-text-muted' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    rows="1"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-3 text-sm ${
                      isDarkMode ? 'text-text-muted' : 'text-gray-600'
                    }`}>
                      {selectedPersonaData.avatar ? (
                        <img 
                          src={selectedPersonaData.avatar} 
                          alt={selectedPersonaData.name}
                          className="w-4 h-4 rounded-full object-cover object-center"
                        />
                      ) : selectedPersonaData.id === 'wise-friend' ? (
                        <selectedPersonaData.icon className="w-4 h-4 text-[#98002e]" fill="currentColor" />
                      ) : selectedPersonaData.id === 'cbt-therapist' ? (
                        <selectedPersonaData.icon className="w-4 h-4 text-[#f3b5b8]" fill="currentColor" />
                      ) : selectedPersonaData.id === 'critical-thinker' ? (
                        <selectedPersonaData.icon className="w-4 h-4 text-[#A9A9A9]" fill="currentColor" />
                      ) : selectedPersonaData.id === 'inner-child' ? (
                        <span className="text-sm">🧸</span>
                      ) : selectedPersonaData.id === 'practical-advisor' ? (
                        <selectedPersonaData.icon className="w-4 h-4 text-orange-500" fill="currentColor" />
                      ) : (
                        <selectedPersonaData.icon className="w-4 h-4" />
                      )}
                      <span>
                        Asking <span className={`font-medium ${
                          isDarkMode ? 'text-text-main' : 'text-gray-900'
                        }`}>{selectedPersonaData.name}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      {/* Clear conversation button */}
                      {messages.length > 0 && (
                        <button
                          onClick={handleClearConversation}
                          className={`text-xs font-medium cursor-pointer transition-all duration-200 hover:opacity-70 ${
                            isDarkMode 
                              ? 'text-text-muted hover:text-red-900' 
                              : 'text-gray-500 hover:text-red-900'
                          }`}
                        >
                          Clear Conversation
                        </button>
                      )}
                      
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-500 text-white rounded-xl font-medium hover:shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Getting perspective...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Get Perspective</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 max-w-md mx-4 ${
            isDarkMode 
              ? 'bg-surface border border-neutral-border' 
              : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-lg font-medium mb-3 ${
              isDarkMode ? 'text-text-main' : 'text-gray-900'
            }`}>
              Clear Conversation
            </h3>
            <p className={`text-sm mb-6 ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}>
              Are you sure you want to clear the conversation? This cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-neutral-border/20 text-text-muted hover:bg-neutral-border/30' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmClearConversation}
                className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{ 
                  backgroundColor: '#D2042D',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8032A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#D2042D'}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App 