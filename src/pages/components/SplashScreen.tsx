import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
    >
      {/* Animated background glow */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with trim path animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="w-32 h-32"
            viewBox="0 0 306 306"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* First path - Blue */}
            <motion.path
              d="M113.713 211.273L211.263 113.722C232.813 92.1725 267.753 92.1725 289.303 113.722C310.853 135.272 310.853 170.213 289.303 191.763L191.753 289.312C170.203 310.862 135.263 310.862 113.713 289.312C92.1625 267.763 92.1625 232.823 113.713 211.273Z"
              fill="transparent"
              stroke="#264A9F"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.path
              d="M113.713 211.273L211.263 113.722C232.813 92.1725 267.753 92.1725 289.303 113.722C310.853 135.272 310.853 170.213 289.303 191.763L191.753 289.312C170.203 310.862 135.263 310.862 113.713 289.312C92.1625 267.763 92.1625 232.823 113.713 211.273Z"
              fill="#264A9F"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 1.4,
              }}
            />

            {/* Second path - Light Blue */}
            <motion.path
              d="M113.712 16.1625C102.932 26.9425 97.5525 41.0625 97.5525 55.1825V250.293C97.5525 264.413 102.942 278.533 113.712 289.312C135.262 310.862 170.203 310.862 191.753 289.312C202.533 278.533 207.912 264.413 207.912 250.293V55.1825C207.912 41.0625 202.523 26.9425 191.753 16.1625C170.203 -5.3875 135.262 -5.3875 113.712 16.1625Z"
              fill="transparent"
              stroke="#4272B8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.path
              d="M113.712 16.1625C102.932 26.9425 97.5525 41.0625 97.5525 55.1825V250.293C97.5525 264.413 102.942 278.533 113.712 289.312C135.262 310.862 170.203 310.862 191.753 289.312C202.533 278.533 207.912 264.413 207.912 250.293V55.1825C207.912 41.0625 202.523 26.9425 191.753 16.1625C170.203 -5.3875 135.262 -5.3875 113.712 16.1625Z"
              fill="#4272B8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 1.7,
              }}
            />

            {/* Third path - Green */}
            <motion.path
              d="M113.712 289.312L16.1625 191.763C-5.3875 170.213 -5.3875 135.272 16.1625 113.722C37.7125 92.1725 72.6525 92.1725 94.2025 113.722L191.753 211.273C213.303 232.823 213.303 267.763 191.753 289.312C170.203 310.862 135.262 310.862 113.712 289.312Z"
              fill="transparent"
              stroke="#54BA60"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                delay: 0.8,
              }}
            />
            <motion.path
              d="M113.712 289.312L16.1625 191.763C-5.3875 170.213 -5.3875 135.272 16.1625 113.722C37.7125 92.1725 72.6525 92.1725 94.2025 113.722L191.753 211.273C213.303 232.823 213.303 267.763 191.753 289.312C170.203 310.862 135.262 310.862 113.712 289.312Z"
              fill="#54BA60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 2,
              }}
              onAnimationComplete={onComplete}
            />
          </svg>
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <motion.h2
            className="text-white text-2xl mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            در حال بارگذاری...
          </motion.h2>

          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => {
          const randomX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
          const randomY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000);
          const randomY2 = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) - 100;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: randomX,
                y: randomY,
                opacity: 0,
              }}
              animate={{
                y: [randomY, randomY2],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
export default SplashScreen;
