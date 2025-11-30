import { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (soundPath: string, options?: { loop?: boolean; volume?: number }) => () => void;
  fadeVolume: (soundPath: string, targetVolume: number, duration: number) => void;
  globalVolume: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const [globalVolume] = useState(0.5);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Update all active audio elements
    audioRefs.current.forEach((audio) => {
      if (newMutedState) {
        audio.volume = 0;
        audio.pause();
      } else {
        audio.volume = globalVolume;
        if (audio.loop || audio.dataset.shouldPlay === 'true') {
          audio.play().catch(err => console.log('Play error:', err));
        }
      }
    });
  };

  const playSound = (soundPath: string, options?: { loop?: boolean; volume?: number }) => {
    const { loop = false, volume = globalVolume } = options || {};
    
    // Create or get existing audio element
    let audio = audioRefs.current.get(soundPath);
    if (!audio) {
      audio = new Audio(soundPath);
      audio.loop = loop;
      audioRefs.current.set(soundPath, audio);
    }
    
    // Set volume based on mute state
    audio.volume = isMuted ? 0 : volume;
    audio.dataset.shouldPlay = 'true';
    audio.dataset.baseVolume = volume.toString();
    
    // Play if not muted
    if (!isMuted) {
      audio.play().catch(err => console.log('Play error:', err));
    }
    
    // Return cleanup function
    return () => {
      audio!.pause();
      audio!.currentTime = 0;
      audio!.dataset.shouldPlay = 'false';
      if (!loop) {
        audioRefs.current.delete(soundPath);
      }
    };
  };

  const fadeVolume = (soundPath: string, targetVolume: number, duration: number) => {
    const audio = audioRefs.current.get(soundPath);
    if (!audio || isMuted) return;
    
    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const newVolume = startVolume + (volumeDiff * progress);
      audio.volume = Math.max(0, Math.min(1, newVolume));

      if (currentStep >= steps) {
        clearInterval(interval);
        audio.volume = targetVolume;
      }
    }, stepDuration);
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playSound, fadeVolume, globalVolume }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
