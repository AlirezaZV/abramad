import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Button } from './ui/button';
import { AlertTriangle, WifiOff } from 'lucide-react';

interface ServerCrisisProps {
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
    question: 'این فروشگاه همین امروز یه پروموشن خیلی مهم رو اجرا کرده؛ ولی درست وسط اوج خریدها، سرور دچار نقص فنی شده و سایت به‌طور کامل از دسترس خارج شده. تیم فنی می‌گه مشکل سرور احتمالاً به این زودی‌ها حل نمی‌شه. فکر می‌کنی تو همچین شرایطی، چند درصد از مشتری‌ها خریدشون رو کلاً رها می‌کنن؟',
    options: [
      { text: '۶۶٪', isCorrect: false },
      { text: '۷۳٪', isCorrect: true },
      { text: '۲۵٪', isCorrect: false },
      { text: '۵۸٪', isCorrect: false },
    ],
    correctFeedback: 'درسته. فروش آنلاین شدیداً تحت تاثیر خدمات سریع و روان زیرساختیه.',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
  {
    id: 2,
    question: 'به‌نظرت داون‌تایم یک‌ساعته توی همچین پروموشنی، حدوداً چقدر برای این برند هزینه داره؟',
    options: [
      { text: '۳۰ میلیون تومان', isCorrect: true },
      { text: '۱۵ میلیون تومان', isCorrect: false },
      { text: '۳۵ میلیون تومان', isCorrect: false },
      { text: '۲۰ میلیون تومان', isCorrect: false },
    ],
    correctFeedback: 'درسته. اگه زیرساخت یاری‌ نکنه، پروموشن‌ها به جای سودرسانی تبدیل به ضرر خالص می‌شن.',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
  {
    id: 3,
    question: 'ولی خوشبختانه این برند از قبل به همچین روزی فکر کرده بود... به‌نظرت چقدر طول می‌کشه تا همه‌ اطلاعات این سرور اصلی با سرور پشتیبان سینک بشن؟',
    options: [
      { text: '۱ ساعت', isCorrect: false },
      { text: '۳۰ دقیقه', isCorrect: false },
      { text: '۵ ساعت', isCorrect: false },
      { text: 'بلادرنگ', isCorrect: true },
    ],
    correctFeedback: 'درسته. داده‌ها به‌‌طور لحظه‌ای و بی‌وقفه سینک می‌شن.',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
];

export function ServerCrisis({ onComplete, onQuestionChange, firstName }: ServerCrisisProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isErrorBlinking, setIsErrorBlinking] = useState(true);
  const [serverFixed, setServerFixed] = useState(false);
  const [direction, setDirection] = useState(0);
  const [sceneB1Data, setSceneB1Data] = useState(null);
  const [sceneB2Data, setSceneB2Data] = useState(null);
  const [isB1Complete, setIsB1Complete] = useState(false);
  const lottieRef = useRef<any>(null);

  // Load Lottie animations
  useEffect(() => {
    fetch('/lotties/sceneB1.json')
      .then(res => res.json())
      .then(data => setSceneB1Data(data))
      .catch(err => console.error('Failed to load sceneB1 animation', err));
    
    fetch('/lotties/sceneB2.json')
      .then(res => res.json())
      .then(data => setSceneB2Data(data))
      .catch(err => console.error('Failed to load sceneB2 animation', err));
  }, []);

  // Auto-transition intro after 3 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Blinking error effect
  useEffect(() => {
    if (!showIntro && currentQuestion < 3 && !serverFixed) {
      const interval = setInterval(() => {
        setIsErrorBlinking(prev => !prev);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [showIntro, currentQuestion, serverFixed]);

  // Notify parent about question change
  useEffect(() => {
    if (!showIntro && onQuestionChange && !serverFixed) {
      onQuestionChange(currentQuestion);
    }
  }, [currentQuestion, showIntro, onQuestionChange, serverFixed]);

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
          // Last question - complete
          setTimeout(() => {
            setServerFixed(true);
            setTimeout(() => {
              onComplete();
            }, 2000);
          }, 500);
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
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-12 pb-20 relative overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Orange warning bar */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: [0.8, 1, 0.8], y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 bg-orange-500 py-3 px-4 text-center z-20"
          >
            <p className="text-white">۷ آذر – ارور سرور در یکی از مهم‌ترین کمپین‌های سال</p>
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
            className="absolute top-0 left-0 right-0 bg-orange-500/90 backdrop-blur-sm py-3 px-4 text-center z-30 border-b-2 border-orange-400"
          >
            <p className="text-white">{feedback.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error overlay effect */}
      <motion.div
        animate={{
          opacity: isErrorBlinking ? (showIntro ? 0.1 : Math.min(0.1 + wrongAttempts * 0.05, 0.3)) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-orange-600 pointer-events-none"
      />

      {/* Error indicators */}
      <div className={`absolute left-0 right-0 flex justify-center gap-8 transition-all duration-1000 top-0`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: isErrorBlinking ? 1 : 0.2,
              scale: isErrorBlinking ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </motion.div>
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
          animate={{
            scale: showIntro ? 1 : 0.9,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
          className="w-80 h-80 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full flex items-center justify-center">
            {sceneB1Data && sceneB2Data && (
              <Lottie
                lottieRef={lottieRef}
                animationData={isB1Complete ? sceneB2Data : sceneB1Data}
                loop={isB1Complete}
                onComplete={() => {
                  if (!isB1Complete) {
                    setIsB1Complete(true);
                  }
                }}
                className="w-full h-full"
              />
            )}
          </div>
        </motion.div>
        {/* Question Box - LEFT on desktop, BOTTOM on mobile */}
        <div className="relative z-10 w-full max-w-2xl" style={{minHeight:showIntro ? 0 : 540, alignContent:"center"}}>
          <AnimatePresence mode="wait">
            {showIntro ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div 
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.5 }}
                  className="bg-orange-900/30 backdrop-blur-sm border border-orange-500/50 rounded-lg p-6"
                >
                  <p className="text-orange-400 mb-2">۷ آذر</p>
                  <h2 className="text-white text-2xl font-bold">
                    ارور سرور در یکی از مهم‌ترین کمپین‌های سال
                  </h2>
                </motion.div>
              </motion.div>
            ) : serverFixed ? (
              <motion.div
                key="fixed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex justify-center"
              >
                <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-green-500">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="text-8xl">✅</div>
                    </motion.div>
                    <p className="text-green-400 mt-2">سرور فعال شد!</p>
                    <div className="flex justify-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: [0.3, 1, 0.5, 1, 0.7] }}
                          transition={{
                            duration: 0.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 0.5
                          }}
                          className="w-2 h-8 bg-green-500 rounded"
                          style={{ originY: 1 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
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
                className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 w-full border border-gray-700"
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
      {!showIntro && !serverFixed && (
        <div className="mt-8 flex gap-2 justify-center relative z-10">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-2 rounded-full transition-all ${
                index < currentQuestion
                  ? 'bg-green-500'
                  : index === currentQuestion
                  ? 'bg-orange-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      )}

      {/* Feedback Popover - ONLY FOR CORRECT */}
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

export default ServerCrisis;