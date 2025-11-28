import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CrisisGame } from './components/CrisisGame';
  
export default function App() {
  const [stage, setStage] = useState<'landing' | 'game'>('landing');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const handleFormSubmit = (data: { firstName: string; lastName: string; phone: string; email: string }) => {
    setUserData(data);
    setStage('game');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {stage === 'landing' && <LandingPage onFormSubmit={handleFormSubmit} />}
      {stage === 'game' && <CrisisGame firstName={userData.firstName} lastName={userData.lastName} />}
    </div>
  );
}
