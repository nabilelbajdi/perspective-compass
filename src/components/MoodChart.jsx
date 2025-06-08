import { getEmotionColor, getEmotionEmoji } from '../services/sentiment'

export default function MoodChart({ sentiments, isDarkMode }) {
  if (!sentiments || sentiments.length === 0) {
    return (
      <div className={`rounded-xl border p-6 text-center ${
        isDarkMode 
          ? 'bg-surface border-neutral-border/50' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary opacity-60"></div>
        </div>
        <h3 className={`font-medium mb-2 ${
          isDarkMode ? 'text-text-main' : 'text-gray-900'
        }`}>
          Emotional Insights
        </h3>
        <p className={`text-sm ${
          isDarkMode ? 'text-text-muted' : 'text-gray-600'
        }`}>
          Your emotional patterns will appear here as you engage with the perspectives
        </p>
      </div>
    )
  }

  // Calculate meaningful insights instead of raw stats
  const recentSentiments = sentiments.slice(-7) // Last week of emotions
  const totalSessions = sentiments.length
  
  // Positive vs challenging emotions (more therapeutic framing)
  const supportiveEmotions = ['happy', 'excited', 'peaceful']
  const growthEmotions = ['confused', 'anxious', 'frustrated', 'sad', 'overwhelmed', 'angry'] // Reframe as growth opportunities
  
  const supportiveCount = sentiments.filter(s => supportiveEmotions.includes(s.emotion)).length
  const growthCount = sentiments.filter(s => growthEmotions.includes(s.emotion)).length
  
  // Recent emotional diversity (variety is good)
  const recentEmotions = [...new Set(recentSentiments.map(s => s.emotion))]
  const emotionalRange = recentEmotions.length
  
  // Intensity insights
  const avgIntensity = sentiments.reduce((sum, s) => sum + s.intensity, 0) / sentiments.length
  const recentAvgIntensity = recentSentiments.reduce((sum, s) => sum + s.intensity, 0) / recentSentiments.length
  
  // Trend analysis
  const isIntensityIncreasing = recentAvgIntensity > avgIntensity
  const intensityTrend = Math.abs(recentAvgIntensity - avgIntensity)

  return (
    <div className={`rounded-xl border p-6 ${
      isDarkMode 
        ? 'bg-surface border-neutral-border/50' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary opacity-70"></div>
        </div>
        <h3 className={`font-medium ${
          isDarkMode ? 'text-text-main' : 'text-gray-900'
        }`}>
          Emotional Insights
        </h3>
      </div>

      {/* Supportive Insights */}
      <div className="space-y-4">
        {/* Emotional Range Insight */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-neutral-border/20' : 'bg-gray-50'
        }`}>
          <div className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-text-main' : 'text-gray-900'
          }`}>
            Emotional Range
          </div>
          <div className={`text-xs mb-2 ${
            isDarkMode ? 'text-text-muted' : 'text-gray-600'
          }`}>
            {emotionalRange >= 4 
              ? "You're experiencing a healthy variety of emotions" 
              : emotionalRange >= 2 
              ? "You're processing different emotional states"
              : "You're working through consistent feelings"
            }
          </div>
          <div className="flex gap-1">
            {recentEmotions.slice(0, 5).map((emotion, index) => (
              <div 
                key={index}
                className="w-2 h-2 rounded-full opacity-60"
                style={{ backgroundColor: getEmotionColor(emotion) }}
              ></div>
            ))}
          </div>
        </div>

        {/* Growth & Support Balance */}
        {totalSessions >= 3 && (
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-neutral-border/20' : 'bg-gray-50'
          }`}>
            <div className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-text-main' : 'text-gray-900'
            }`}>
              Journey Balance
            </div>
            <div className={`text-xs mb-3 ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}>
              {supportiveCount > growthCount * 1.5
                ? "You've been experiencing more supportive emotions lately"
                : growthCount > supportiveCount * 1.5
                ? "You're working through some challenging feelings - that takes courage"
                : "You're experiencing a natural balance of emotions"
              }
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500"
                  style={{ width: `${Math.max(20, (supportiveCount / totalSessions) * 100)}%` }}
                ></div>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-purple-400 transition-all duration-500"
                  style={{ width: `${Math.max(20, (growthCount / totalSessions) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Intensity Insight */}
        {totalSessions >= 5 && (
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-neutral-border/20' : 'bg-gray-50'
          }`}>
            <div className={`text-sm font-medium mb-2 ${
              isDarkMode ? 'text-text-main' : 'text-gray-900'
            }`}>
              Emotional Intensity
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}>
              {intensityTrend < 0.1 
                ? "Your emotional intensity has been fairly consistent"
                : isIntensityIncreasing
                ? "Your emotions have been feeling more intense recently"
                : "Your emotional intensity has been settling"
              }
            </div>
          </div>
        )}
      </div>

      {/* Gentle Session Counter */}
      <div className={`mt-5 pt-4 border-t text-center ${
        isDarkMode ? 'border-neutral-border/30' : 'border-gray-200'
      }`}>
        <div className={`text-xs ${
          isDarkMode ? 'text-text-muted' : 'text-gray-500'
        }`}>
          {totalSessions} reflection{totalSessions !== 1 ? 's' : ''} • Building self-awareness
        </div>
      </div>
    </div>
  )
} 