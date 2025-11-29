import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ideally accessed securely
const ai = new GoogleGenAI({ apiKey });

export const generateBriefingSuggestions = async (clientName: string, currentBriefing: string): Promise<string> => {
  if (!apiKey) return "Erro: API Key não configurada. Adicione process.env.API_KEY.";

  try {
    const prompt = `
      Você é um especialista em Marketing Digital sênior.
      Estou criando um briefing para o cliente: ${clientName}.
      O briefing atual é: "${currentBriefing}".
      
      Por favor, sugira 3 melhorias ou expansões estratégicas para este briefing, focando em resultados.
      Mantenha o tom profissional e direto. Use formatação Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar sugestões.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a IA. Verifique sua conexão e chave de API.";
  }
};