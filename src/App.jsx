import { useState } from 'react'
import { 
  Brain, 
  Heart, 
  Search, 
  Sparkles, 
  Building, 
  Zap,
  Send,
  MessageCircle,
  AlertCircle
} from 'lucide-react'
import { getPersonaPerspective, getPersonaInfo } from './services/openai'
import ChatMessage from './components/ChatMessage'

function App() {
  const [input, setInput] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('cbt-therapist')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
      description: 'Wisdom, acceptance, and philosophical perspective',
      color: 'from-gray-500 to-slate-400'
    },
    { 
      id: 'practical-advisor', 
      name: 'Practical Advisor', 
      icon: Zap, 
      description: 'Action-oriented, solution-focused guidance',
      color: 'from-orange-500 to-red-400'
    }
  ]

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
      // Get conversation history for context (longer history for better conversations)
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
    <div className="min-h-screen bg-background font-sans">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-surface to-background animate-gradient-x opacity-50" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-neutral-border/50 backdrop-blur-md bg-surface/80">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-semibold text-text-main mb-1">
                  Perspective Compass
                </h1>
                <p className="text-text-muted">
                  Gain insights from different therapeutic perspectives
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Persona Selector Sidebar */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="bg-surface/80 backdrop-blur-md rounded-2xl border border-neutral-border/50 p-6">
                <h3 className="text-lg font-medium text-text-main mb-4">
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
                        className={`w-full p-4 rounded-xl border transition-all duration-300 text-left group ${
                          isSelected
                            ? 'border-primary/50 bg-gradient-to-r ' + persona.color + ' shadow-glow-blue'
                            : 'border-neutral-border hover:border-neutral-border/80 bg-surface/50 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected 
                              ? 'bg-white/20' 
                              : 'bg-neutral-border/50 group-hover:bg-white/10'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              isSelected ? 'text-white' : 'text-text-muted'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className={`font-medium ${
                              isSelected ? 'text-white' : 'text-text-main'
                            }`}>
                              {persona.name}
                            </div>
                            <div className={`text-sm mt-1 ${
                              isSelected ? 'text-white/80' : 'text-text-muted'
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
              <div className="bg-surface/80 backdrop-blur-md rounded-2xl border border-neutral-border/50 min-h-[500px]">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center px-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-text-main mb-2">
                      Share what's on your mind
                    </h3>
                    <p className="text-text-muted max-w-md">
                      Your selected perspective will offer personalized insights and guidance 
                      tailored to help you understand your situation better.
                    </p>
                    
                    {/* Current selection indicator */}
                    <div className="mt-8 p-4 bg-neutral-border/20 rounded-lg border border-neutral-border/30">
                      <div className="flex items-center space-x-3">
                        <selectedPersonaData.icon className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm font-medium text-text-main">
                            Currently selected: {selectedPersonaData.name}
                          </div>
                          <div className="text-xs text-text-muted">
                            {selectedPersonaData.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-6 max-h-[500px] overflow-y-auto">
                      {messages.map((message, index) => {
                        // Detect persona switch for visual indicator
                        const prevMessage = index > 0 ? messages[index - 1] : null
                        const showPersonaSwitch = message.role === 'assistant' && 
                          prevMessage && 
                          prevMessage.role === 'assistant' && 
                          prevMessage.persona !== message.persona

                        return (
                          <ChatMessage 
                            key={index} 
                            message={message} 
                            persona={message.role === 'assistant' ? selectedPersonaData : null}
                            showPersonaSwitch={showPersonaSwitch}
                          />
                        )
                      })}
                      
                      {/* Loading indicator */}
                      {isLoading && (
                        <div className="flex gap-4 justify-start animate-slide-up">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                              <selectedPersonaData.icon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="max-w-[70%]">
                            <div className="text-sm text-text-muted mb-2 flex items-center gap-2">
                              <selectedPersonaData.icon className="w-4 h-4" />
                              <span>{selectedPersonaData.name} is thinking...</span>
                            </div>
                            <div className="bg-surface/80 backdrop-blur-md border border-neutral-border/50 rounded-2xl px-4 py-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
              <form onSubmit={handleSubmit} className="bg-surface/80 backdrop-blur-md rounded-2xl border border-neutral-border/50 p-6">
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
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What's on your mind? Share your thoughts, feelings, or any situation you'd like perspective on..."
                    className="w-full p-4 bg-background/50 border border-neutral-border rounded-xl resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-text-main placeholder-text-muted transition-all duration-200"
                    rows="4"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-text-muted">
                      <selectedPersonaData.icon className="w-4 h-4" />
                      <span>
                        Asking <span className="text-text-main font-medium">{selectedPersonaData.name}</span>
                      </span>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-500 text-white rounded-xl font-medium hover:shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 