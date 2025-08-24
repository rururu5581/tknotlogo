import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, DiagnosisResult } from '../types';

// Using the recommended model for this text-based task.
// By defining it as a constant, it's easy to update in the future.
const GEMINI_MODEL = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    priorityRisk: {
      type: Type.STRING,
      description: "ユーザーにとって最も優先度の高いリスク（例：死亡保障、医療保障）",
    },
    personalizedReason: {
      type: Type.STRING,
      description: "ユーザーの家族構成や将来の夢に寄り添った、心に響くパーソナライズされた理由説明",
    },
    suggestedCoverage: {
      type: Type.ARRAY,
      description: "提案する保障内容のリスト",
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: "保障の種類（例：生命保険、医療保険）",
          },
          amount: {
            type: Type.STRING,
            description: "保障額の目安（例：3000万円、日額1万円）",
          },
           description: {
            type: Type.STRING,
            description: "その保障がなぜ必要かの簡単な補足説明",
          },
        },
        required: ["type", "amount"]
      },
    },
  },
  required: ["priorityRisk", "personalizedReason", "suggestedCoverage"],
};


const createPrompt = (formData: FormData): string => {
  const customerName = formData.nickname ? `${formData.nickname}様` : 'お客様';
  return `
あなたは、保険代理店「t-knot」の経験豊富で心優しいファイナンシャルプランナーです。あなたの使命は、保険商品を売ることではなく、お客様の人生に寄り添い、未来への不安を安心に変える手助けをすることです。

これから提供する${customerName}の情報に基づいて、${customerName}が最も優先して備えるべきリスクを1つ特定し、なぜそれが必要なのかを、${customerName}の状況に合わせてパーソナライズされた、心に響くメッセージで伝えてください。

# ${customerName}の情報
- ニックネーム: ${formData.nickname || '(未設定)'}
- 年齢: ${formData.age}歳
- 性別: ${formData.gender}
- 職業: ${formData.occupation}
- 年収: ${formData.income}
- 貯蓄額: ${formData.savings}
- 配偶者: ${formData.spouse ? 'あり' : 'なし'}
- お子様の人数: ${formData.childrenCount}人
- 一番下のお子様の年齢: ${formData.youngestChildAge}歳
- 将来の計画: [${formData.futurePlans.join(', ')}]
- 心の内で気に掛かっていること: [${formData.worries.join(', ')}]

# 指示
1.  **最優先リスクの特定:** 上記の${customerName}の情報から、最も備えるべきリスク（例：死亡保障、医療保障、就業不能保障、老後資金など）を1つだけ選び出し、\`priorityRisk\`として出力してください。
2.  **理由のパーソナライズ:** なぜそのリスクが最優先なのか、${customerName}が選択した「将来の計画」や「大切な家族」の言葉を具体的に引用しながら、共感的で心温まるメッセージを作成してください。これは\`personalizedReason\`として出力してください。${customerName}を不安にさせるのではなく、夢を守るための前向きな備えであることを強調してください。
    - 例：「${formData.nickname || 'あなた'}が夢見る『${formData.futurePlans[0] || '将来の計画'}』を、万が一の時でも確実に守るために...」
3.  **必要保障の提案:** 特定したリスクに対して、公的なデータや一般的な目安に基づいた保障の種類と保障額を提案してください。これは\`suggestedCoverage\`の配列として出力してください。具体的な商品名は絶対に出さないでください。保障の種類ごとに簡単な補足説明を加えてください。
4.  **出力形式:** 必ず以下のJSONスキーマに従って、結果をJSON形式で出力してください。
`;
}


export const getInsuranceDiagnosis = async (formData: FormData): Promise<DiagnosisResult> => {
  // 診断実行時にAPIキーを読み込むことで、アプリ起動時のクラッシュを防ぎます。
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // このエラーはApp.tsxでキャッチされ、ユーザーに表示されます。
    throw new Error("APIキーが設定されていません。Vercelの環境変数を確認してください。");
  }
  
  // AIクライアントをここで初期化します（Lazy Initialization）
  const ai = new GoogleGenAI({ apiKey });
  const prompt = createPrompt(formData);
  
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
     if (!jsonText) {
      throw new Error("AIからの応答が空です。");
    }
    const parsedResult: DiagnosisResult = JSON.parse(jsonText);
    return parsedResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("AIによる診断の生成に失敗しました。入力内容を確認するか、時間をおいて再度お試しください。");
  }
};