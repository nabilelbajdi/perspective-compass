import { useState } from 'react'
import { 
  Brain, 
  Heart, 
  Search, 
  Sparkles, 
  Building, 
  Zap,
  Send,
  MessageCircle
} from 'lucide-react'

function App() {
  const [input, setInput] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('cbt-therapist')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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
    if (!input.trim()) return

    // TODO: Add OpenAI integration
    console.log('Submitting:', input, 'to persona:', selectedPersona)
    setInput('')
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
                  <div className="p-6 space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className="animate-slide-up">
                        {/* TODO: Render chat messages */}
                        <div className="p-4 bg-neutral-border/20 rounded-lg">
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="bg-surface/80 backdrop-blur-md rounded-2xl border border-neutral-border/50 p-6">
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