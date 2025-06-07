import { User, Bot, ArrowRight } from 'lucide-react'

export default function ChatMessage({ message, persona, showPersonaSwitch }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Persona switch indicator */}
      {showPersonaSwitch && !isUser && (
        <div className="flex items-center justify-center my-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/20 rounded-full text-xs text-text-muted">
            <ArrowRight className="w-3 h-3" />
            <span>Switched to {persona.name}</span>
          </div>
        </div>
      )}
      
      <div className={`flex gap-4 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        
        <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
          {!isUser && (
            <div className="text-sm text-text-muted mb-2 flex items-center gap-2">
              <persona.icon className="w-4 h-4" />
              <span>{persona.name}</span>
              <span className="text-xs">•</span>
              <span className="text-xs">{persona.style}</span>
            </div>
          )}
          
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-gradient-to-r from-primary to-blue-500 text-white'
                : 'bg-surface/80 backdrop-blur-md border border-neutral-border/50 text-text-main'
            }`}
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
          
          <div className="text-xs text-text-muted mt-2 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        
        {isUser && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-neutral-border/50 flex items-center justify-center">
              <User className="w-5 h-5 text-text-muted" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 