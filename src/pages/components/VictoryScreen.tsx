import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import ReactConfetti from 'react-confetti';

interface VictoryScreenProps {
  firstName: string;
  lastName: string;
}

// Generate confetti pieces data once
const generateConfetti = () => {
  return Array.from({ length: 1000 }).map((_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 100,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5,
    color: ['#FFD700', '#C0C0C0', '#DAA520', '#FFFFFF'][Math.floor(Math.random() * 4)],
    velocityX: (Math.random() - 0.5) * 2,
    velocityY: Math.random() * 3 + 2,
    duration: Math.random() * 3 + 3,
  }));
};

export function VictoryScreen({ firstName, lastName }: VictoryScreenProps) {
  // const [confettiPieces] = useState(() => generateConfetti());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
    >
            {/* Background with server image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/servers.jpg")',
          backgroundBlendMode: "darken",
          opacity: 0.2,
        }}
      />
      {/* Custom Confetti */}
      {/* <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 99999 }}
      >
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: piece.x,
              y: piece.y,
              rotate: piece.rotation,
              scale: piece.scale,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 100,
              x: piece.x + piece.velocityX * 200,
              rotate: piece.rotation + 720,
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: piece.duration,
              ease: [0.3, 0.3, 0.4, 1],
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: piece.color,
            }}
          />
        ))}
      </div> */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999, // Higher than the modal
            pointerEvents: 'none', // Prevent interaction issues
          }}
        >
          <ReactConfetti
            gravity={0.3}
            width={window.innerWidth}
            height={window.innerHeight}
            initialVelocityX={2}
            initialVelocityY={5}
            numberOfPieces={1000}
            opacity={1}
            run
            wind={0}
            recycle={false}
            colors={['#54BA60', '#264A9F', '#4272B8', '#FFFFFF']}
          />
        </div>
      {/* Light burst animation */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-32 h-32 bg-white rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="text-center space-y-8 max-w-3xl relative z-10"
      >
        {/* Logo */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
          className="flex justify-center"
        >
          <Logo className="w-20 h-20" />
        </motion.div>

        {/* Trophy/Success Icon */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-8xl"
        >
          🏆
        </motion.div>

        {/* Congratulations text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <h1 className="text-white">
            تبریک!
          </h1>
          <p className="text-white text-2xl">
            {firstName} عزیز، تبریک می‌گیم، تو از هر سه بحران سربلند بیرون اومدی!
          </p>
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
        >
          <p className="text-white leading-relaxed">
            الان می‌دونی چطور می‌شه حتی وسط آتش‌سوزی، قطعی سرویس یا حمله سایبری، جریان کار یه سازمان رو زنده نگه داشت. این همون کاریه که سرویس <span className="text-green-400">بازیابی از بحران ابرآمد (ویژه راهکاران)</span> برای سازمان‌ها انجام می‌ده.
          </p>
        </motion.div>

        {/* Success badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex justify-center gap-6 flex-wrap"
        >
          {[
            { icon: '🔥', label: 'آتش‌سوزی' },
            { icon: '⚡', label: 'قطعی سرویس' },
            { icon: '🛡️', label: 'حمله سایبری' },
          ].map((badge, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 1.8 + index * 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4 text-center"
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-white text-sm">{badge.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Final message */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6"
        >
          <p className="text-white text-2xl">
            امیدوارم اسمتو بین برنده‌های قرعه‌کشی ۱۶ آذر ببینم! 🎁
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            شروع دوباره
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            بازگشت به وبسایت
          </button>
        </motion.div>

        {/* Decorative elements */}
        {/* <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="flex justify-center gap-4 text-4xl"
        >
          <span>⭐</span>
          <span>✨</span>
          <span>⭐</span>
        </motion.div> */}
      </motion.div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`ambient-${i}`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-2 h-2 bg-white rounded-full blur-sm"
          />
        ))}
      </div>
    </motion.div>
  );
}

export default VictoryScreen;
