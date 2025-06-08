import { ArrowLeft, TrendingUp, Heart, Brain, Calendar } from 'lucide-react'
import { getEmotionColor, getEmotionEmoji } from '../services/sentiment'

export default function EmotionalInsights({ sentiments, isDarkMode, onBack }) {
  if (!sentiments || sentiments.length === 0) {
    return (
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-black text-text-main' 
          : 'bg-white text-gray-900'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <button
            onClick={onBack}
            className={`flex items-center gap-2 mb-8 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-70 ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Conversations
          </button>

          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary/60" />
            </div>
            <h1 className="text-2xl font-semibold mb-4">Your Emotional Journey</h1>
            <p className={`text-lg max-w-md mx-auto ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}>
              Share your thoughts with the AI to start tracking your emotions and patterns.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate simple insights
  const totalMessages = sentiments.length
  const recentMessages = sentiments.slice(-7) // Last week
  
  // Simple emotion grouping
  const positiveEmotions = ['happy', 'excited', 'peaceful']
  const challengingEmotions = ['confused', 'anxious', 'frustrated', 'sad', 'overwhelmed', 'angry']
  const neutralEmotions = ['neutral']
  
  // Count each type
  const positiveCount = sentiments.filter(s => positiveEmotions.includes(s.emotion)).length
  const challengingCount = sentiments.filter(s => challengingEmotions.includes(s.emotion)).length
  const neutralCount = sentiments.filter(s => neutralEmotions.includes(s.emotion)).length
  
  // How many different emotions they've experienced
  const differentEmotions = [...new Set(sentiments.map(s => s.emotion))]
  
  // Recent emotion strength (average intensity)
  const avgStrength = sentiments.reduce((sum, s) => sum + s.intensity, 0) / sentiments.length
  const recentAvgStrength = recentMessages.length > 0 
    ? recentMessages.reduce((sum, s) => sum + s.intensity, 0) / recentMessages.length 
    : avgStrength
  
  // Is emotional strength changing?
  const strengthChange = recentAvgStrength - avgStrength
  
  // Time tracking
  const firstDate = new Date(sentiments[0].timestamp)
  const lastDate = new Date(sentiments[sentiments.length - 1].timestamp)
  const daysBetween = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24))

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-black text-text-main' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 mb-6 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-70 ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Conversations
          </button>
          
          <h1 className="text-3xl font-semibold mb-2">Your Emotional Journey</h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-text-muted' : 'text-gray-600'
          }`}>
            Based on {totalMessages} conversation{totalMessages !== 1 ? 's' : ''} over {daysBetween === 0 ? '1 day' : `${daysBetween} days`}
          </p>
        </div>

        {/* Simple Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Different Emotions */}
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-surface border-neutral-border/50' 
              : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Different Emotions</h3>
            </div>
            <div className="text-2xl font-bold mb-2">{differentEmotions.length} types</div>
                          <p className={`text-sm ${
                isDarkMode ? 'text-text-muted' : 'text-gray-600'
              }`}>
                {differentEmotions.length >= 6 
                  ? "Wide emotional variety"
                  : differentEmotions.length >= 3
                  ? "Normal emotional range" 
                  : "Consistent emotions"
                }
              </p>
          </div>

          {/* Positive vs Challenging */}
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-surface border-neutral-border/50' 
              : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-semibold">Emotion Balance</h3>
            </div>
            <div className="text-2xl font-bold mb-2">
              {Math.round((positiveCount / totalMessages) * 100)}% positive
            </div>
            <p className={`text-sm ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}>
              {challengingCount} challenging moments
            </p>
          </div>

          {/* Emotional Strength */}
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-surface border-neutral-border/50' 
              : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Emotional Strength</h3>
            </div>
            <div className="text-2xl font-bold mb-2">
              {Math.abs(strengthChange) < 0.1 ? 'Steady' : strengthChange > 0 ? 'Stronger' : 'Gentler'}
            </div>
                          <p className={`text-sm ${
                isDarkMode ? 'text-text-muted' : 'text-gray-600'
              }`}>
                Intensity of your emotions lately
              </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Emotion Types */}
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-surface border-neutral-border/50' 
              : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <h3 className="text-lg font-semibold mb-6">Types of Emotions</h3>
            
            <div className="space-y-4">
              {/* Positive */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-600">Positive emotions</span>
                  <span className="text-sm">{positiveCount} times</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.max(5, (positiveCount / totalMessages) * 100)}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 ${
                  isDarkMode ? 'text-text-muted' : 'text-gray-500'
                }`}>
                  Happy, excited, peaceful feelings
                </div>
              </div>

              {/* Challenging */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-orange-600">Challenging emotions</span>
                  <span className="text-sm">{challengingCount} times</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                    style={{ width: `${Math.max(5, (challengingCount / totalMessages) * 100)}%` }}
                  ></div>
                </div>
                <div className={`text-xs mt-1 ${
                  isDarkMode ? 'text-text-muted' : 'text-gray-500'
                }`}>
                  Sad, anxious, frustrated, angry feelings
                </div>
              </div>

              {/* Neutral */}
              {neutralCount > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Neutral emotions</span>
                    <span className="text-sm">{neutralCount} times</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400 transition-all duration-500"
                      style={{ width: `${Math.max(5, (neutralCount / totalMessages) * 100)}%` }}
                    ></div>
                  </div>
                  <div className={`text-xs mt-1 ${
                    isDarkMode ? 'text-text-muted' : 'text-gray-500'
                  }`}>
                    Calm, stable feelings
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent History */}
          <div className={`p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-surface border-neutral-border/50' 
              : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <h3 className="text-lg font-semibold mb-6">Recent Emotions</h3>
            
            <div className="space-y-3">
              {sentiments.slice(-5).reverse().map((sentiment, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getEmotionColor(sentiment.emotion) }}
                    ></div>
                    <div>
                      <div className="text-sm font-medium capitalize">{sentiment.emotion}</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-text-muted' : 'text-gray-500'
                      }`}>
                        {sentiment.summary}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-text-muted' : 'text-gray-500'
                  }`}>
                    {new Date(sentiment.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Summary */}
        {totalMessages >= 5 && (
          <div className={`mt-8 p-6 rounded-xl border ${
            isDarkMode 
              ? 'bg-surface border-neutral-border/50' 
              : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <h3 className="text-lg font-semibold mb-4">What This Means</h3>
            <div className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-text-muted' : 'text-gray-600'
            }`}>
              <p className="mb-3">
                You've shared {totalMessages} thoughts with the AI over {daysBetween === 0 ? 'today' : `${daysBetween} days`}. 
                {positiveCount > challengingCount && " Most of your emotions have been positive, which suggests you're in a good emotional space right now."} 
                {challengingCount > positiveCount && " You've been working through some tough emotions - this takes real courage and shows you're not avoiding difficult feelings."} 
                {positiveCount === challengingCount && " You've experienced a balanced mix of different emotions, which is completely normal and healthy."}
              </p>
              
              <p className="mb-3">
                {differentEmotions.length >= 6 && "You've experienced a wide variety of emotions, which shows excellent emotional awareness. This emotional range indicates you're processing life authentically rather than suppressing feelings."} 
                {differentEmotions.length >= 3 && differentEmotions.length < 6 && "You feel a good range of emotions, which shows you're emotionally connected and aware of your inner state."} 
                {differentEmotions.length < 3 && "You tend to experience consistent emotions, which could mean you're in a stable phase or that certain feelings are dominating your experience right now."}
              </p>
              
              <p>
                {Math.abs(strengthChange) < 0.1 && "Your emotional intensity has been steady lately, suggesting a stable emotional state."} 
                {strengthChange > 0.1 && "Your emotions have been feeling stronger recently. This could indicate you're going through an important period of growth or facing significant life changes."} 
                {strengthChange < -0.1 && "Your emotions have been gentler lately, which might mean you're finding more peace or developing better emotional regulation."} 
                {totalMessages >= 10 && " The fact that you're regularly checking in with yourself shows real commitment to understanding your emotional patterns."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 