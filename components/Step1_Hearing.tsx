
import React, { useState } from 'react';
import type { FormData } from '../types';
import { FUTURE_PLANS, WORRIES } from '../constants';
import { UserIcon } from './icons/UserIcon';
import { FamilyIcon } from './icons/FamilyIcon';
import { DreamIcon } from './icons/DreamIcon';
import { WorryIcon } from './icons/WorryIcon';

interface Step1HearingProps {
  onStartDiagnosis: (data: FormData) => void;
}

const Step1Hearing: React.FC<Step1HearingProps> = ({ onStartDiagnosis }) => {
  const [formData, setFormData] = useState<FormData>({
    nickname: '',
    age: '35',
    gender: '男性',
    occupation: '会社員',
    income: '500万円～700万円',
    savings: '300万円～500万円',
    spouse: true,
    childrenCount: '2',
    youngestChildAge: '5',
    futurePlans: [],
    worries: [],
  });

  const handleInputChange = <T,>(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: 'futurePlans' | 'worries', value: string) => {
    setFormData(prev => {
      const currentValues = prev[category];
      if (currentValues.includes(value)) {
        return { ...prev, [category]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentValues, value] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartDiagnosis(formData);
  };

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold text-sky-700">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const renderInput = (label: string, name: string, type: string = 'text', value: string, placeholder?: string) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
    </div>
  );
  
  const renderSelect = (label: string, name: string, value: string, options: string[]) => (
     <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const renderCheckboxGroup = (label: string, name: 'futurePlans' | 'worries', options: string[], checkedItems: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label} (複数選択可)</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-sky-100 hover:border-sky-300 transition-colors">
            <input
              type="checkbox"
              name={name}
              value={opt}
              checked={checkedItems.includes(opt)}
              onChange={() => handleCheckboxChange(name, opt)}
              className="h-5 w-5 rounded border-gray-300 text-sky-500 focus:ring-sky-400"
            />
            <span className="text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-sky-800">あなたの未来を一緒に考えさせてください</h2>
        <p className="text-gray-600 mt-2">いくつかの簡単な質問にお答えいただくだけで、あなただけの未来の羅針盤を作成します。</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {renderSection('あなたについて', <UserIcon className="h-8 w-8 text-sky-500 mr-3"/>, 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              {renderInput('ニックネーム (診断結果で使用します)', 'nickname', 'text', formData.nickname, '例：たろう')}
            </div>
            {renderInput('年齢', 'age', 'number', formData.age)}
            {renderSelect('性別', 'gender', formData.gender, ['男性', '女性', 'その他'])}
            {renderSelect('職業', 'occupation', formData.occupation, ['会社員', '公務員', '自営業', '経営者', '専業主婦(主夫)', 'パート・アルバイト', 'その他'])}
            {renderSelect('年収(おおよそ)', 'income', formData.income, ['～300万円', '300万円～500万円', '500万円～700万円', '700万円～1000万円', '1000万円以上'])}
            {renderSelect('貯蓄額', 'savings', formData.savings, ['～100万円', '100万円～300万円', '300万円～500万円', '500万円～1000万円', '1000万円以上'])}
          </div>
        )}

        {renderSection('あなたの大切な家族について', <FamilyIcon className="h-8 w-8 text-sky-500 mr-3"/>, 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">配偶者の有無</label>
                <div className="flex gap-4 mt-2">
                    <label className="flex items-center"><input type="radio" name="spouse" checked={formData.spouse} onChange={() => setFormData(p => ({...p, spouse: true}))} className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"/> <span className="ml-2">あり</span></label>
                    <label className="flex items-center"><input type="radio" name="spouse" checked={!formData.spouse} onChange={() => setFormData(p => ({...p, spouse: false}))} className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"/> <span className="ml-2">なし</span></label>
                </div>
            </div>
            {renderInput('お子様の人数', 'childrenCount', 'number', formData.childrenCount)}
            {formData.childrenCount !== '0' && renderInput('一番下のお子様の年齢', 'youngestChildAge', 'number', formData.youngestChildAge)}
          </div>
        )}

        {renderSection('あなたの将来の計画', <DreamIcon className="h-8 w-8 text-sky-500 mr-3"/>, 
          renderCheckboxGroup('夢や目標をお聞かせください', 'futurePlans', FUTURE_PLANS, formData.futurePlans)
        )}
        
        {renderSection('今、心の中で少し気に掛かっていること', <WorryIcon className="h-8 w-8 text-sky-500 mr-3"/>, 
          renderCheckboxGroup('不安を煽るつもりはありません。正直な気持ちをお聞かせください', 'worries', WORRIES, formData.worries)
        )}

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-sky-500 text-white font-bold py-3 px-12 rounded-full hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            診断を開始する
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1Hearing;