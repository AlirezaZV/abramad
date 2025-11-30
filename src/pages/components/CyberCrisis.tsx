import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Button } from './ui/button';
import { AlertTriangle, Check, Shield, ShieldAlert } from 'lucide-react';
import { useAudio } from '../../contexts/AudioContext';

interface CyberCrisisProps {
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
    question: 'به‌نظرت توی همین یک سال گذشته، چند درصد از سازمان‌ها دست‌کم یک حملهٔ سایبری رو تجربه کردن؟',
    options: [
      { text: '۷۱٪', isCorrect: true },
      { text: '۵۰٪', isCorrect: false },
      { text: '۲۳٪', isCorrect: false },
      { text: '۸۶٪', isCorrect: false },
    ],
    correctFeedback: 'درسته. طبق گزارش BrightDefense، حدود ۷۱٪ از سازمان‌ها حداقل یک حمله سایبری رو تجربه کردن.',
    incorrectFeedback: 'نه، دوباره تلاش کن.',
  },
  {
    id: 2,
    question: 'به‌نظرت طبق گزارش‌ها، چند درصد از کسب‌وکارها گفتن که بخشی از عملیاتشون به‌خاطر حملهٔ سایبری مختل شده؟',
    options: [
      { text: '۲۲٪', isCorrect: false },
      { text: '۴۵٪', isCorrect: false },
      { text: '۶۸٪', isCorrect: true },
      { text: '۱۰٪', isCorrect: false },
    ],
    correctFeedback: 'درسته. حملات سایبری هرروز خطرناک‌تر می‌شن!',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
  {
    id: 3,
    question: 'اگه این سازمان برنامه‌ بازیابی از بحران داشت، سرویس‌هاش توی سایت دوم چه لایه‌های محافظتی‌ای داشتن؟',
    options: [
      { text: 'فایروال و سیستم‌های جلوگیری از نفوذ', isCorrect: false },
      { text: 'رمزنگاری داده‌ها روی سرورها', isCorrect: false },
      { text: 'مانیتورینگ هوشمند و هشداردهی', isCorrect: false },
      { text: 'همهٔ موارد', isCorrect: true },
    ],
    correctFeedback: 'درسته. یه سرویس بازیابی از بحران خوب فکر تمام این لایه‌ها رو می‌کنه!',
    incorrectFeedback: 'نه، بیا دوباره تلاش کنیم.',
  },
];

export function CyberCrisis({ onComplete, onQuestionChange, firstName }: CyberCrisisProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
  const [isAlarmOn, setIsAlarmOn] = useState(true);
  const [direction, setDirection] = useState(0);
  const [sceneC1Data, setSceneC1Data] = useState(null);
  const [sceneC2Data, setSceneC2Data] = useState(null);
  const [isC1Complete, setIsC1Complete] = useState(false);
  const lottieRef = useRef<any>(null);
  const { playSound, fadeVolume } = useAudio();
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);
  
  const [targetLottieY, setTargetLottieY] = useState(-200);
  const [targetQuestionY, setTargetQuestionY] = useState(-389);


useEffect(() => {
  const updateY = () => {
    if (window.innerWidth < 640) {
      // Mobile
      setTargetLottieY(-50);
      setTargetQuestionY(-150);
    } else {
      // Desktop
      setTargetLottieY(-200);
      setTargetQuestionY(-389);
    }
  };

  updateY(); // run once
  window.addEventListener("resize", updateY);

  return () => window.removeEventListener("resize", updateY);
}, [window.innerWidth]);

  // Play alarm sound
  useEffect(() => {
    const alarmCleanup = playSound('/sounds/alarm.mp3', { loop: true, volume: 0.6 });
    cleanupFunctionsRef.current = [alarmCleanup];

    return () => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
    };
  }, [playSound]);

  // Load Lottie animations
  useEffect(() => {
    fetch('/lotties/sceneC1.json')
      .then(res => res.json())
      .then(data => setSceneC1Data(data))
      .catch(err => console.error('Failed to load sceneC1 animation', err));
    
    fetch('/lotties/sceneC2.json')
      .then(res => res.json())
      .then(data => setSceneC2Data(data))
      .catch(err => console.error('Failed to load sceneC2 animation', err));
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

  // Blinking red alarm effect
  useEffect(() => {
    if (!showIntro && currentQuestion < 3) {
      const interval = setInterval(() => {
        setIsAlarmOn(prev => !prev);
      }, 700);
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
      // Fade out alarm sound
      fadeVolume('/sounds/alarm.mp3', 0, 500);

      setFeedback({
        type: 'correct',
        message: question.correctFeedback,
      });

      // Show success message for 3 seconds, then transition
      setTimeout(() => {
        // Fade back in alarm sound
        fadeVolume('/sounds/alarm.mp3', 0.6, 500);
        setFeedback(null);
        setSelectedAnswer(null);
        
        if (currentQuestion < questions.length - 1) {
          setDirection(1);
          setCurrentQuestion(currentQuestion + 1);
        } else {
          // All questions completed
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
            <p className="text-white">۲۲ دی – حمله سایبری به سیستم مرکزی سازمان</p>
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

      {/* Red alarm overlay */}
      <motion.div
        animate={{
          opacity: isAlarmOn ? (showIntro ? 0.12 : 0.12) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-red-600 pointer-events-none"
      />

      {/* Alarm lights */}
      <div className={`absolute flex-col flex left-0 right-0 flex justify-center gap-8 transition-all duration-1000 top-0`}>
       <div className='flex-row flex ' style={{alignSelf:"center"}}>
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
  {/* --- INTRO TEXT --- */}
  <AnimatePresence>
    {showIntro && (
      <motion.div
        key="introText"
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -200 }}
        transition={{ duration: 0.5 }}
        className="mt-10 text-center bg-red-900/30 backdrop-blur-sm border border-red-500/50  p-6"
      >
        <p className="text-red-400 mb-2">۲۲ دی</p>
        <h2 className="text-white text-2xl font-bold">
         حمله سایبری به سیستم مرکزی سازمان
        </h2>
      </motion.div>
    )}
  </AnimatePresence>
      </div>

{/* MAIN CONTENT AREA */}
<motion.div
  layout
  className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center mt-10 relative"
  transition={{ layout: { duration: 1, ease: "easeInOut" } }}
>



   {/* --- LOTTIE SHARED ELEMENT --- */}
  <motion.div
    layoutId="lottie"
    className="flex items-center justify-center"
    initial={false}
    animate={
      showIntro
        ? { scale: 1.3, y: 0 }
        : { scale: 0.85, y: targetLottieY }
    }
    transition={{ duration: 1, ease: "easeInOut" }}
  >
    <div className="w-72 h-72 md:w-80 md:h-80">
              {sceneC1Data && sceneC2Data && (
                <Lottie
                  lottieRef={lottieRef}
                  animationData={isC1Complete ? sceneC2Data : sceneC1Data}
                  loop={isC1Complete}
                  onComplete={() => {
                    if (!isC1Complete) {
                      setIsC1Complete(true);
                    }
                  }}
                  className="w-full h-full"
                />
              )}    </div>
  </motion.div>


  {/* RIGHT/BELOW CONTENT (TITLE -> QUESTION BOX) */}
  <motion.div
    layout
    layoutId="content-box"
    className={`w-full max-w-2xl flex flex-col items-center`}
    transition={{
      layout: { duration: 0.9, ease: "easeInOut" }
    }}
  >

  {/* --- QUIZ CONTENT --- */}
  <AnimatePresence mode="wait">
    {!showIntro && (
      <motion.div
        key={currentQuestion}
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          layout: { duration: 1, ease: "easeInOut" },
          opacity: { duration: 0.4 }
        }}
        style={{
    borderTopColor:" #d62963",
    marginTop:targetQuestionY,
    borderTopWidth: "10px"}}
        className="mt-10 w-full max-w-2xl bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
      >
        <span className="text-gray-400 text-sm">
          سوال {currentQuestion + 1} از {questions.length}
        </span>

        <p className="text-white mt-3 leading-relaxed">
          {question.question}
        </p>

        <div className="mt-6 space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => feedback?.type !== 'correct' && handleAnswerSelect(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full p-4 rounded-lg text-right border-2 transition-all
                ${
                  selectedAnswer === index
                    ? feedback?.type === 'correct'
                      ? "bg-green-600/20 border-green-500 text-green-300"
                      : "bg-red-600/20 border-red-500 text-red-300"
                    : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                }
              `}
            >
              <span className="inline-block w-6 ml-3 text-gray-400">
                {index + 1}
              </span>
              {option.text}
            </motion.button>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>

      </motion.div>

      {/* Progress indicator */}
      {/* {!showIntro && (
        <div className="mt-8 flex gap-2 justify-center relative z-10">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-12 h-2 rounded-full transition-all ${
              index < currentQuestion
                ? 'bg-green-500'
                : index === currentQuestion
                ? 'bg-red-500'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      )} */}

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
                    <Check width={50} height={50} color='green'/>
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
    </motion.div>
  );
}

export default CyberCrisis;