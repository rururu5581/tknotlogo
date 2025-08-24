
import React, { useState, useCallback } from 'react';
import Step1Hearing from './components/Step1_Hearing';
import Step2Loading from './components/Step2_Loading';
import Step3Result from './components/Step3_Result';
import type { FormData, DiagnosisResult } from './types';
import { getInsuranceDiagnosis } from './services/geminiService';
import logo from './assets/logo-t-knot.png';

type AppStep = 'hearing' | 'loading' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('hearing');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartDiagnosis = useCallback(async (data: FormData) => {
    setFormData(data);
    setStep('loading');
    setError(null);
    try {
      const diagnosisResult = await getInsuranceDiagnosis(data);
      setResult(diagnosisResult);
      setStep('result');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : '診断に失敗しました。時間をおいて再度お試しください。';
      setError(errorMessage);
      setStep('hearing'); // Go back to the form on error
    }
  }, []);

  const handleRestart = () => {
    setStep('hearing');
    setFormData(null);
    setResult(null);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'hearing':
        return <Step1Hearing onStartDiagnosis={handleStartDiagnosis} />;
      case 'loading':
        return <Step2Loading />;
      case 'result':
        return result && formData && <Step3Result result={result} formData={formData} onRestart={handleRestart} />;
      default:
        return <Step1Hearing onStartDiagnosis={handleStartDiagnosis} />;
    }
  };

  return (
    <div className="bg-[#0094FF66] min-h-screen text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <img 
          src={logo}
          alt="T.knot 株式会社 ロゴ" 
          className="h-24 w-auto mx-auto mb-4"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-700">未来の羅針盤</h1>
        <p className="text-gray-500 mt-1">あなたの人生に寄り添うパートナー</p>

        {error && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">エラー: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
      </header>
      <main className="w-full max-w-4xl">
        {renderStep()}
      </main>
      <footer className="w-full max-w-4xl text-center mt-12 text-gray-400 text-sm">
        <p>&copy; 2024 t-knot. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
