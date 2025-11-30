import { motion } from 'framer-motion';
import { Flame, Server, ShieldAlert, Trophy } from 'lucide-react';

interface GameTimelineProps {
  currentCrisis: 'fire' | 'server' | 'cyber' | 'victory';
  currentQuestion?: number; // 0-2 for each crisis
}

export function GameTimeline({ currentCrisis, currentQuestion = 0 }: GameTimelineProps) {
  // Total: 3 crises × 3 questions = 9 steps
  const totalSteps = 9;
  
  // Calculate current step (0-8)
  let currentStep = 0;
  if (currentCrisis === 'fire') {
    currentStep = currentQuestion;
  } else if (currentCrisis === 'server') {
    currentStep = 3 + currentQuestion;
  } else if (currentCrisis === 'cyber') {
    currentStep = 6 + currentQuestion;
  } else if (currentCrisis === 'victory') {
    currentStep = 9;
  }

  const crises = [
    {
      name: 'آتش‌سوزی',
      icon: Flame,
      color: 'red',
      steps: [0, 1, 2],
    },
    {
      name: 'ارور سرور',
      icon: Server,
      color: 'orange',
      steps: [3, 4, 5],
    },
    {
      name: 'حمله سایبری',
      icon: ShieldAlert,
      color: 'red',
      steps: [6, 7, 8],
    },
  ];

  const getColorClasses = (color: string, isActive: boolean, isCompleted: boolean) => {
    if (isCompleted) {
      return 'bg-green-600 border-green-500 text-green-200';
    }
    if (isActive) {
      if (color === 'red') return 'bg-red-600 border-red-500 text-red-200';
      if (color === 'orange') return 'bg-orange-600 border-orange-500 text-orange-200';
    }
    return 'bg-gray-700 border-gray-600 text-gray-400';
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900/20 backdrop-blur-lg border-t border-gray-700 py-2 px-4 z-30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Compact Progress Bar */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400 text-xs whitespace-nowrap">پیشرفت</span>
          
          {/* Progress Bar */}
          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-600 to-green-500"
            />
          </div>

          {/* Crisis Icons - Compact */}
          <div className="flex items-center gap-4">
            {crises.map((crisis, index) => {
              const isCompleted = currentStep > crisis.steps[2];
              const isActive = currentStep >= crisis.steps[0] && currentStep <= crisis.steps[2];
              const Icon = crisis.icon;
              
              return (
                <div key={index} className="flex items-center gap-1">
                  {/* Crisis Icon */}
                  <motion.div
                    animate={{
                      scale: isActive ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                    }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center ${getColorClasses(
                      crisis.color,
                      isActive,
                      isCompleted
                    )}`}
                  >
                    {isCompleted ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </motion.div>

                  {/* Question Dots */}
                  <div className="flex gap-0.5">
                    {crisis.steps.map((step) => (
                      <div
                        key={step}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          currentStep > step
                            ? 'bg-green-500'
                            : currentStep === step
                            ? crisis.color === 'orange'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Victory Icon */}
            <motion.div
              animate={{
                scale: currentCrisis === 'victory' ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: currentCrisis === 'victory' ? Infinity : 0,
              }}
              className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                currentCrisis === 'victory'
                  ? 'bg-yellow-600 border-yellow-500 text-yellow-200'
                  : 'bg-gray-700 border-gray-600 text-gray-400'
              }`}
            >
              <Trophy className="w-4 h-4" />
            </motion.div>
          </div>

          <span className="text-gray-300 text-xs whitespace-nowrap">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default GameTimeline;