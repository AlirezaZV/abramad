import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";
import { Button } from './ui/button';

interface FireCrisisProps {
  onComplete: () => void;
  onQuestionChange?: (questionIndex: number) => void;
  firstName: string;
}

interface Question {
  id: number;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  correctFeedback: string;
  incorrectFeedback: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'اینجا اتاق سرور یه سازمان بزرگه که تمام داده‌های شرکت رو پردازش می‌کرد. فکر می‌کنی حالا با از دست‌رفتن این رک‌ها، حدوداً روزی چقدر خسارت می‌بینن؟',
    options: [
      { text: '۵۰۰ میلیون تومان', isCorrect: false },
      { text: '۵۳۰ میلیون تومان', isCorrect: false },
      { text: '۶۴۵ میلیون تومان', isCorrect: false },
      { text: '۷۲۰ میلیون تومان', isCorrect: true },
    ],
    correctFeedback: 'درسته. همین‌قدر ویرانگر!',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
  {
    id: 2,
    question: 'فکر می‌کنی با وجود این خسارت، چند درصد امکان داره که این شرکت همچنان بتونه به کارش ادامه بده؟',
    options: [
      { text: '۷۰٪ احتمال ادامهٔ فعالیت', isCorrect: false },
      { text: '۵۰٪ احتمال ادامهٔ فعالیت', isCorrect: false },
      { text: '۳۰٪ احتمال ادامهٔ فعالیت', isCorrect: true },
      { text: '۱۰٪ احتمال ادامهٔ فعالیت', isCorrect: false },
    ],
    correctFeedback: 'درسته. این شرکت حدود ۷۰٪ احتمال داره تا پنج سال آینده ورشکسته بشه!',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
  {
    id: 3,
    question: 'به‌نظرت این شرکت از قبل باید چیکار می‌کرد تا بتونه حتی با وجود این آتش‌سوزی، در لحظه به کسب‌وکارش ادامه بده؟',
    options: [
      { text: 'یه نسخه از اطلاعات رو روی یه سرور دیگه نگه می‌داشت', isCorrect: false },
      { text: 'یه بکاپ دوره‌ای از تمام اطلاعات می‌گرفت', isCorrect: false },
      { text: 'یه زیرساخت جایگزین آماده و جدا از این ساختمون می‌داشت', isCorrect: true },
      { text: 'داده‌ها رو روی فضای ذخیره‌سازی ابری آرشیو می‌کرد', isCorrect: false },
    ],
    correctFeedback: 'درسته. فقط با داشتن یه زیرساختِ ثانویه‌ست که سرویس‌ها همون لحظه دوباره بالا میان.',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
];

export function FireCrisis({ onComplete, onQuestionChange, firstName }: FireCrisisProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isAlarmOn, setIsAlarmOn] = useState(true);
  const [direction, setDirection] = useState(0);
  const [fireAnimationData, setFireAnimationData] = useState(null);
  const alarmAudioRef = useRef<HTMLAudioElement>(null);
  const fireAudioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/lotties/test2.json')
      .then(res => res.json())
      .then(data => setFireAnimationData(data))
      .catch(err => console.error("Failed to load fire animation", err));
  }, []);

  // Play audio files in loop with initial fade in
  useEffect(() => {
    const alarmAudio = alarmAudioRef.current;
    const fireAudio = fireAudioRef.current;

    if (alarmAudio && fireAudio) {
      // Start with volume at 0 for fade in effect
      alarmAudio.volume = 0;
      fireAudio.volume = 0;
      alarmAudio.play().catch(err => console.error("Failed to play alarm audio", err));
      fireAudio.play().catch(err => console.error("Failed to play fire audio", err));

      // Fade in audio when component mounts
      let currentVolume = 0;
      const initialFadeInterval = setInterval(() => {
        currentVolume += 0.05;
        if (currentVolume >= 1) {
          currentVolume = 1;
          clearInterval(initialFadeInterval);
        }
        alarmAudio.volume = currentVolume;
        fireAudio.volume = currentVolume;
      }, 50);
    }

    // Cleanup: stop audio when component unmounts
    return () => {
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }
      if (fireAudio) {
        fireAudio.pause();
        fireAudio.currentTime = 0;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // Fade audio in/out based on feedback state
  useEffect(() => {
    const alarmAudio = alarmAudioRef.current;
    const fireAudio = fireAudioRef.current;

    if (!alarmAudio || !fireAudio) return;

    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (feedback?.type === 'correct') {
      // Fade out when correct answer is shown
      let currentVolume = alarmAudio.volume;
      fadeIntervalRef.current = setInterval(() => {
        currentVolume -= 0.05;
        if (currentVolume <= 0) {
          currentVolume = 0;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        }
        alarmAudio.volume = currentVolume;
        fireAudio.volume = currentVolume;
      }, 50);
    } else if (feedback === null) {
      // Fade in when moving to next question
      let currentVolume = alarmAudio.volume;
      if (currentVolume < 1) {
        fadeIntervalRef.current = setInterval(() => {
          currentVolume += 0.05;
          if (currentVolume >= 1) {
            currentVolume = 1;
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            }
          }
          alarmAudio.volume = currentVolume;
          fireAudio.volume = currentVolume;
        }, 50);
      }
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };
  }, [feedback]);

  // Auto-transition intro after 3 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Blinking red alarm effect
  useEffect(() => {
    if (!showIntro && currentQuestion < 3) {
      const interval = setInterval(() => {
        setIsAlarmOn(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [showIntro, currentQuestion]);

  // Notify parent about question change
  useEffect(() => {
    if (!showIntro && onQuestionChange) {
      onQuestionChange(currentQuestion);
    }
  }, [currentQuestion, showIntro, onQuestionChange]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleAnswerSelect = (index: number) => {
    // Prevent selecting while feedback is showing
    if (feedback) return;

    const question = questions[currentQuestion];
    const isCorrect = question.options[index].isCorrect;

    setSelectedAnswer(index);

    if (isCorrect) {
      setFeedback({
        type: 'correct',
        message: question.correctFeedback,
      });

      // Show success message for 3 seconds, then transition
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        
        if (currentQuestion < questions.length - 1) {
          setDirection(1);
          setCurrentQuestion(currentQuestion + 1);
          setWrongAttempts(0);
        } else {
          // Last question - turn off alarm and complete
          setIsAlarmOn(false);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }, 3000);
    } else {
      setFeedback({
        type: 'incorrect',
        message: `نه ${firstName} جان بیا دوباره تلاش کنیم!`,
      });
      setWrongAttempts(prev => prev + 1);

      // Clear incorrect feedback after 2 seconds to allow retry
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback(null);
      }, 1000);
    }
  };

  const question = questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 px-4 py-12 pb-20 relative overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Audio Elements */}
      <audio ref={alarmAudioRef} src="/sounds/alarm.mp3" loop />
      <audio ref={fireAudioRef} src="/sounds/fire.mp3" loop />
      {/* Red warning bar */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: [0.8, 1, 0.8], y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 bg-red-600 py-3 px-4 text-center z-20"
          >
            <p className="text-white">۱۵ مرداد – آتش‌سوزی در اتاق سرور سازمان</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message Bar - Only for Incorrect */}
      <AnimatePresence>
        {feedback?.type === 'incorrect' && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-0 right-0 bg-red-500/90 backdrop-blur-sm py-3 px-4 text-center z-30 border-b-2 border-red-400"
          >
            <p className="text-white">{feedback.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Red alarm overlay - gets darker with wrong attempts */}
      <motion.div
        animate={{
          opacity: isAlarmOn ? (showIntro ? 0.15 : Math.min(0.15 + wrongAttempts * 0.05, 0.4)) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-red-600 pointer-events-none"
      />

      {/* Alarm lights */}
      <div className={`absolute left-0 right-0 flex justify-center gap-8 transition-all duration-1000 top-0`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: isAlarmOn ? 1 : 0.2,
              scale: isAlarmOn ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 bg-red-600 rounded-full shadow-lg shadow-red-500/50 blur-xl"
          />
        ))}
      </div>

      {/* Main Content - Responsive Layout */}
      <motion.div 
        layout
        className={`w-full max-w-7xl h-[80%] mx-auto mt-12 flex flex-col-reverse transition-all duration-1000 ${showIntro ? 'items-center justify-center' : 'lg:flex-row-reverse items-center justify-center lg:gap-12 mt-20'}`}
      >
        <motion.div
          layout
          initial={false}
          // animate={{
          //   scale: showIntro ? 1 : 0.9,
          // }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
          className="w-80 h-80 flex items-center justify-center overflow-hidden"
        >
          <Lottie 
            animationData={fireAnimationData} 
            loop={true} 
            className="w-full h-full" 
          />
        </motion.div>
        {/* Question Box - LEFT on desktop, BOTTOM on mobile */}
        <div className="relative z-10 w-full max-w-2xl " style={{minHeight:showIntro ? 0 : 540, alignContent:"center"}}>
          <AnimatePresence mode="wait">
            {showIntro ? (
                <motion.div 
                  className="text-center bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-lg p-6"
                >
                  <p className="text-red-400 mb-2">۱۵ مرداد</p>
                  <h2 className="text-white text-2xl font-bold">
                    آتش‌سوزی در اتاق سرور سازمان
                  </h2>
                </motion.div>
            ) : (
              <motion.div
                key={currentQuestion}
                initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  // Shake animation on wrong answer
                  rotate: selectedAnswer !== null && feedback?.type === 'incorrect' ? [0, -2, 2, -2, 2, 0] : 0,
                }}
                exit={{ x: direction > 0 ? -1000 : 1000, opacity: 0 }}
                transition={{ 
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  rotate: { duration: 0.5 }
                }}
                className="bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 lg:p-8 w-full border border-gray-700"
              >
                <div className="mb-6">
                  <span className="text-gray-400 text-sm">سوال {currentQuestion + 1} از {questions.length}</span>
                  <p className="text-white mt-2 leading-relaxed">
                    {question.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => feedback?.type !== 'correct' && handleAnswerSelect(index)}
                      disabled={feedback?.type === 'correct'}
                      whileHover={feedback?.type !== 'correct' ? { scale: 1.02 } : {}}
                      whileTap={feedback?.type !== 'correct' ? { scale: 0.98 } : {}}
                      className={`w-full p-4 rounded-lg text-right transition-all border-2 ${
                        selectedAnswer === index
                          ? feedback?.type === 'correct'
                            ? 'bg-green-600/20 border-green-500 text-green-300'
                            : 'bg-red-600/20 border-red-500 text-red-300'
                          : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:border-gray-500'
                      } ${feedback?.type === 'correct' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    >
                      <span className="inline-block w-6 ml-3 text-gray-400">{index + 1})</span>
                      {option.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress indicator */}
      {!showIntro && (
        <div className="mt-8 flex gap-2 justify-center relative z-10 ">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-2 rounded-full transition-all ${
                index < currentQuestion
                  ? 'bg-green-500'
                  : index === currentQuestion
                  ? 'bg-blue-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      )}

      {/* Feedback Popover with Blur Backdrop - ONLY FOR CORRECT */}
      <AnimatePresence>
        {feedback?.type === 'correct' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            {/* Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Popover Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3
              }}
              className="relative max-w-2xl w-full p-8 rounded-2xl border-2 bg-green-600/20 border-green-500 backdrop-blur-xl"
            >
              {/* Loading Animation for Correct Answer */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="text-4xl">✓</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center text-xl leading-relaxed text-green-200"
              >
                {feedback.message}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FireCrisis;