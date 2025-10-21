import React from 'react';

interface FloatingActionsProps {
  onVoiceCommand: () => void;
  onAIAssistant: () => void;
  onAnalytics: () => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  onVoiceCommand,
  onAIAssistant,
  onAnalytics
}) => {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
      <button
        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 relative"
        onClick={onVoiceCommand}
      >
        🎤
        <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
      </button>
      
      <button
        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        onClick={onAIAssistant}
      >
        🧠
      </button>
      
      <button
        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        onClick={onAnalytics}
      >
        📊
      </button>
    </div>
  );
};

export default FloatingActions;