
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
);

const Step2Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-lg text-center h-96">
      <LoadingSpinner />
      <h2 className="text-2xl font-bold text-sky-800 mt-8">あなたの未来の羅針盤を作成中...</h2>
      <p className="text-gray-600 mt-2">最適な備えを分析しています。少々お待ちください。</p>
    </div>
  );
};

export default Step2Loading;
