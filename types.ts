
export interface FormData {
  nickname: string;
  age: string;
  gender: string;
  occupation: string;
  income: string;
  savings: string;
  spouse: boolean;
  childrenCount: string;
  youngestChildAge: string;
  futurePlans: string[];
  worries: string[];
}

export interface SuggestedCoverage {
  type: string;
  amount: string;
  description?: string;
}

export interface DiagnosisResult {
  priorityRisk: string;
  personalizedReason: string;
  suggestedCoverage: SuggestedCoverage[];
}