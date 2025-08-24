
import React, { useState } from 'react';
import type { DiagnosisResult, FormData } from '../types';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface Step3ResultProps {
  result: DiagnosisResult;
  formData: FormData;
  onRestart: () => void;
}

const ContactModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-sm w-full relative shadow-xl">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            <h3 className="text-2xl font-bold text-sky-700 mb-4">無料相談のご予約</h3>
            <p className="text-gray-600 mb-6">まずはお気軽にご連絡ください。あなたの想いをお聞かせいただけるのを楽しみにしております。</p>
            <div className="space-y-4">
                <p><strong>代表:</strong> 龍田　なるみ (Narumi Tatsuta)</p>
                <p><strong>電話:</strong> <a href="tel:090-7471-0763" className="text-sky-600 hover:underline">090-7471-0763</a></p>
                <p><strong>Email:</strong> <a href="mailto:tatsuta_n@tknot.co.jp" className="text-sky-600 hover:underline">tatsuta_n@tknot.co.jp</a></p>
            </div>
             <button onClick={onClose} className="mt-6 w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                閉じる
            </button>
        </div>
    </div>
);


const Step3Result: React.FC<Step3ResultProps> = ({ result, formData, onRestart }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const customerName = formData.nickname ? `${formData.nickname}様` : 'あなた';

    const handleSave = () => {
        window.print();
    };

    return (
    <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg print:shadow-none">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-sky-800">診断結果：{customerName}の未来の羅針盤</h2>
      </div>

      <div className="bg-sky-100 border-l-4 border-sky-500 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-sky-700 mb-2">最も大切にしたい備え</h3>
        <p className="text-2xl font-bold text-sky-900 mb-4">{result.priorityRisk}</p>
        <p className="text-gray-700 leading-relaxed">{result.personalizedReason}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-sky-700 mb-4">{customerName}へのお守り</h3>
        <div className="space-y-4">
          {result.suggestedCoverage.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg flex items-start space-x-4 shadow-sm">
                <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-800">{item.type}: <span className="text-sky-600">{item.amount}</span></p>
                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <h4 className="text-lg font-bold text-gray-800 mb-3">t-knotからのメッセージ</h4>
        <p className="text-gray-600 text-sm leading-6 max-w-2xl mx-auto">
          この診断は、あくまで一般的な目安です。あなたにとって本当に最適なプランは、あなたの価値観や想いを直接お伺いしながら、一緒に作り上げていくものだと信じています。<br/>
          私たちt-knotは、保険を売るプロではありません。あなたの人生に寄り添うパートナーです。給付の時には命がけでサポートすることをお約束します。<br/>
          どんな小さなことでも、お気軽にご相談ください。
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
        <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-500 text-white font-bold py-3 px-8 rounded-full hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          t-knot代表に無料で相談する
        </button>
        <button
            onClick={handleSave}
            className="bg-white border-2 border-sky-500 text-sky-500 font-bold py-3 px-8 rounded-full hover:bg-sky-50 focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all duration-300 transform hover:scale-105"
        >
          診断結果を保存する
        </button>
      </div>
       <div className="mt-6 text-center print:hidden">
        <button onClick={onRestart} className="text-sm text-gray-500 hover:text-sky-600 hover:underline">
          もう一度診断する
        </button>
      </div>
      {isModalOpen && <ContactModal onClose={() => setIsModalOpen(false)} />}
      <style>
        {`
          @media print {
            body { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
            .bg-sky-100 {
                background-color: #E0F2FE !important;
            }
             .border-sky-500 {
                border-color: #0EA5E9 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Step3Result;
