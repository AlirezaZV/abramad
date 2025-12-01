import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "./components/SplashScreen";
import { LandingPage } from "./components/LandingPage";
import { CrisisGame } from "./components/CrisisGame";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { AudioProvider } from "../contexts/AudioContext";
import type { UserData, UserFormPayload } from "../types/user";
import "./index.css";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const [stage, setStage] = useState<"landing" | "game">("landing");
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    date: "",
  });

  useEffect(() => {
    // Preload all Lottie files, images, and audio
    const loadResources = async () => {
      try {
        const lottieFiles = [
          "/lotties/data-fire.json", // LandingPage
          "/lotties/SceneA.json", // FireCrisis
          "/lotties/sceneB1.json", // ServerCrisis
          "/lotties/sceneB2.json", // ServerCrisis
          "/lotties/sceneC1.json", // CyberCrisis
          "/lotties/sceneC2.json", // CyberCrisis
        ];

        const images = [
          "/servers.jpg", // LandingPage & VictoryScreen background
        ];

        const audio = [
          "/sounds/fire.mp3", // FireCrisis audio
          "/music.mp3", // Background music
        ];

        // Load all Lottie JSON files
        const lottiePromises = lottieFiles.map((file) =>
          fetch(file)
            .then((res) => res.json())
            .catch((err) => console.error(`Failed to load ${file}:`, err))
        );

        // Preload images
        const imagePromises = images.map((src) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          }).catch((err) => console.error(`Failed to load ${src}:`, err))
        );

        // Preload audio
        const audioPromises = audio.map(
          (src) =>
            new Promise((resolve) => {
              const audio = new Audio();
              audio.oncanplaythrough = () => resolve(audio);
              audio.onerror = () => {
                console.error(`Failed to load ${src}`);
                resolve(null);
              };
              audio.src = src;
              audio.load();
            })
        );

        // Wait for all resources to load
        await Promise.all([
          ...lottiePromises,
          ...imagePromises,
          ...audioPromises,
        ]);

        console.log("All assets loaded successfully");
        setAssetsLoaded(true);
      } catch (error) {
        console.error("Error loading resources:", error);
        setAssetsLoaded(true); // Continue even if some assets fail
      }
    };

    loadResources();
  }, []);

  // Hide splash only when both animation completes AND assets are loaded
  useEffect(() => {
    if (splashComplete && assetsLoaded) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [splashComplete, assetsLoaded]);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  const handleFormSubmit = (data: UserFormPayload) => {
    setUserData({ ...data, date: new Date().toISOString() });
    setStage("game");
  };

  return (
    <AudioProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Background Music with floating mute/unmute button */}
        {!isLoading && <BackgroundMusic autoPlay={true} />}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <SplashScreen key="splash" onComplete={handleSplashComplete} />
          ) : (
            <>
              {stage === "landing" && (
                <LandingPage key="landing" onFormSubmit={handleFormSubmit} />
              )}
              {stage === "game" && (
                <CrisisGame
                  key="game"
                  firstName={userData.firstName}
                  lastName={userData.lastName}
                  userData={userData}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </AudioProvider>
  );
}
