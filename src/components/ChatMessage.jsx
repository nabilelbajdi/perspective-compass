import { User, Bot } from 'lucide-react'

export default function ChatMessage({ message, persona, showPersonaSwitch, isDarkMode }) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Persona switch indicator */}
      {showPersonaSwitch && !isUser && (
        <div className="flex items-center justify-center my-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            isDarkMode 
              ? 'bg-secondary/20 text-text-muted' 
              : 'bg-purple-100 text-gray-600'
          }`}>
            <span>Switched to {persona.name}</span>
          </div>
        </div>
      )}
      
      <div className={`flex animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[75%]`}>
          {!isUser && (
            <div className={`text-xs font-medium mb-2 flex items-center gap-1.5 ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}>
              {persona.avatar ? (
                <img 
                  src={persona.avatar} 
                  alt={persona.name}
                  className="w-3 h-3 rounded-full object-cover object-center"
                />
              ) : persona.id === 'wise-friend' ? (
                <persona.icon className="w-3 h-3 text-[#98002e]" fill="currentColor" />
              ) : persona.id === 'cbt-therapist' ? (
                <persona.icon className="w-3 h-3 text-[#f3b5b8]" fill="currentColor" />
              ) : persona.id === 'critical-thinker' ? (
                <persona.icon className="w-3 h-3 text-[#A9A9A9]" fill="currentColor" />
              ) : persona.id === 'inner-child' ? (
                <span className="text-xs">🧸</span>
              ) : persona.id === 'practical-advisor' ? (
                <persona.icon className="w-3 h-3 text-orange-500" fill="currentColor" />
              ) : (
                <persona.icon className="w-3 h-3" />
              )}
              <span>{persona.name}</span>
            </div>
          )}
          
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-gradient-to-r from-primary to-blue-500 text-white'
                : isDarkMode
                  ? 'bg-surface border border-neutral-border/50 text-text-main'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
            }`}
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 