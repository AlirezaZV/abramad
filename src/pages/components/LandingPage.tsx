import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { UserForm } from "./UserForm";
import { Bold } from "lucide-react";

interface LandingPageProps {
  onFormSubmit: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) => void;
}

export function LandingPage({ onFormSubmit }: LandingPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [fireAnimationData, setFireAnimationData] = useState(null);

  useEffect(() => {
    fetch("/lotties/data-fire.json")
      .then((res) => res.json())
      .then((data) => setFireAnimationData(data))
      .catch((err) => console.error("Failed to load fire animation", err));
  }, []);

  const handleStartClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) => {
    onFormSubmit(data);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with server image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/servers.jpg")',
          backgroundColor: "#141e3090",
          backgroundBlendMode: "darken",
          opacity: 0.4,
        }}
      />

      {/* Fire light animation */}
      <motion.div
        animate={{
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed bottom-0 left-0 w-full h-full z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0) 90%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          transition={{ duration: 2 }}
          className="max-w-2xl w-full text-center space-y-8 flex-1 flex flex-col justify-center px-4"
          style={{ zIndex: 200,translateY: 60 }}
        >
          {/* Logo */}
          <motion.div
            className="flex justify-center"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Logo className="w-24 h-24" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white"
            style={{ fontSize: 30, fontWeight: "bold" }}
          >
            نجات شرکت در سه حرکت!
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-300 max-w-xl mx-auto leading-relaxed"
          >
            همیشه فکر می‌کنیم حادثه برای بقیه‌ست...
            <br /> ولی حقیقت تلخ اینه که ممکنه قربانی بعدی حوادث ما باشیم!
            <br /> پس بیا ببینم چقدر برای روزهای بحرانی آماده‌ای.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px #D62963",
                  "0 0 40px #EF6C29",
                  "0 0 60px #EF6C29",
                  "0 0 40px #EF6C29",
                  "0 0 20px #D62963",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block rounded-lg"
            >
              <Button
                onClick={handleStartClick}
                size="lg"
                className="cursor-pointer bg-gradient-to-r from-orange-600 to-red-600 hover:from-blue-600 hover:to-green-500 text-white px-16 py-8 text-xl shadow-lg hover:shadow-xl transition-all"
              >
                بزن بریم!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Fire Animation at Bottom */}
        <div className="relative w-full flex justify-center items-end mb-0 overflow-hidden" >
          <div className="flex w-full -mb-10">
            {fireAnimationData && (
              <>
                <Lottie
                  animationData={fireAnimationData}
                  loop={true}
                  className="w-100 lg:w-128 h-full flex-shrink-0"
                />
                 <Lottie
                  animationData={fireAnimationData}
                  loop={true}
                  className="w-100 lg:w-128 h-full flex-shrink-0"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form Popup */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleFormClose}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Form Container */}
            <motion.div
              className="relative z-10 w-full max-w-md"
            >
              <UserForm onSubmit={handleFormSubmit} onClose={handleFormClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LandingPage;
