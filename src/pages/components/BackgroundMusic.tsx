import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "../../contexts/AudioContext";

interface BackgroundMusicProps {
  autoPlay?: boolean;
}

export function BackgroundMusic({ autoPlay = true }: BackgroundMusicProps) {
  const { isMuted, toggleMute, playSound } = useAudio();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const attemptPlay = () => {
      if (autoPlay) {
        playSound("/music.mp3", { loop: true, volume: 0.5 });
        setHasStarted(true);
      }
    };

    // Try immediately
    attemptPlay();

    // Add listener for first interaction to ensure playback if autoplay was blocked
    const handleInteraction = () => {
      attemptPlay();
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [autoPlay, playSound]);

  const handleToggle = () => {
    if (!hasStarted) {
      // First click - start the music
      playSound("/music.mp3", { loop: true, volume: 0.5 });
      setHasStarted(true);
      if (isMuted) toggleMute();
    } else {
      toggleMute();
    }
  };

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="fixed z-[9999] w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-green-500 shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-300"
          style={{
            boxShadow: isMuted
              ? "0 4px 20px rgba(239, 68, 68, 0.4)"
              : "0 4px 20px rgba(59, 130, 246, 0.4)",
            zIndex: 9999,
            right: "10px",
            bottom: "10px",
            cursor: "pointer",
          }}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          <AnimatePresence mode="wait">
            {isMuted ? (
              <motion.div
                key="muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VolumeX className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="unmuted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Volume2 className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
export default BackgroundMusic;
