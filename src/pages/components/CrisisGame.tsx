import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FireCrisis } from "./FireCrisis";
import { ServerCrisis } from "./ServerCrisis";
import { CyberCrisis } from "./CyberCrisis";
import { VictoryScreen } from "./VictoryScreen";
import { GameTimeline } from "./GameTimeline";
import type { UserData } from "../../types/user";

interface CrisisGameProps {
  firstName: string;
  lastName: string;
  userData?: UserData;
}

type CrisisStage =
  | "fire"
  | "transition1"
  | "server"
  | "transition2"
  | "cyber"
  | "victory";

export function CrisisGame({ firstName, lastName, userData }: CrisisGameProps) {
  const [stage, setStage] = useState<CrisisStage>("fire");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleFireComplete = () => {
    setStage("transition1");
  };

  const handleServerComplete = () => {
    setStage("transition2");
  };

  const handleCyberComplete = () => {
    setStage("victory");
  };

  const handleContinueToServer = () => {
    setStage("server");
    setCurrentQuestion(0);
  };

  const handleContinueToCyber = () => {
    setStage("cyber");
    setCurrentQuestion(0);
  };

  const handleQuestionChange = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  // Determine which crisis to show in timeline
  const getCurrentCrisis = (): "fire" | "server" | "cyber" | "victory" => {
    if (stage === "fire" || stage === "transition1") return "fire";
    if (stage === "server" || stage === "transition2") return "server";
    if (stage === "cyber") return "cyber";
    return "victory";
  };

  const showTimeline =
    stage !== "victory" && stage !== "transition1" && stage !== "transition2";

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {stage === "fire" && (
          <FireCrisis
            key="fire"
            onComplete={handleFireComplete}
            onQuestionChange={handleQuestionChange}
            firstName={firstName}
          />
        )}

        {stage === "transition1" && (
          <motion.div
            key="transition1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black flex flex-col items-center justify-center px-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white text-center max-w-2xl mb-8 leading-relaxed"
            >
              کارت خوب بود ولی این فقط آتش‌سوزی نیست که می‌تونه یه شرکت رو از پا
              دربیاره!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={handleContinueToServer}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              ادامه
            </motion.button>
          </motion.div>
        )}

        {stage === "server" && (
          <ServerCrisis
            key="server"
            onComplete={handleServerComplete}
            onQuestionChange={handleQuestionChange}
            firstName={firstName}
          />
        )}

        {stage === "transition2" && (
          <motion.div
            key="transition2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black flex flex-col items-center justify-center px-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white text-center max-w-2xl mb-8 leading-relaxed"
            >
              کارت خوب بود ولی هنوز باید یه شرکت دیگه رو هم از بحران نجات بدیم!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={handleContinueToCyber}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              ادامه
            </motion.button>
          </motion.div>
        )}

        {stage === "cyber" && (
          <CyberCrisis
            key="cyber"
            onComplete={handleCyberComplete}
            onQuestionChange={handleQuestionChange}
            firstName={firstName}
          />
        )}

        {stage === "victory" && (
          <VictoryScreen
            key="victory"
            firstName={firstName}
            lastName={lastName}
            userData={userData}
          />
        )}
      </AnimatePresence>

      {/* Timeline - show during crisis stages */}
      {showTimeline && (
        <GameTimeline
          currentCrisis={getCurrentCrisis()}
          currentQuestion={currentQuestion}
        />
      )}
    </div>
  );
}

export default CrisisGame;
