
import { GoogleGenAI, Type } from "@google/genai";

export type IntentCategory = 'INFO' | 'CAUTION' | 'TRUSTED' | 'POISON' | 'NEW' | 'SPOOF';

export interface ThreatAnalysisResponse {
  riskScore: number;
  threatCategory: string;
  intentState: IntentCategory; 
  similarityIndex: number;
  reasoning: string;
  advisory: string;
  isPoisoningAttempt: boolean;
  onChainAge: string;
  globalReputation: 'CLEAN' | 'FLAGGED' | 'UNKNOWN';
  mismatchDetails: {
    prefixMatch: boolean;
    suffixMatch: boolean;
    entropyCheck: string;
  };
  evidenceFlags: string[];
}

export interface InterceptionSynthesisResponse {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
  confidence: number;
  clusterMatch: string;
  threatLabel: string;
  telemetry: string[];
}

export interface CognitiveAutopsyResponse {
  autopsy: string;
  visualAnchor: string;
  deceptionRating: number;
  biologicalVulnerability: string;
}

export interface ReputationSynthesisResponse {
  reputationScore: number; // 0-100, where 100 is perfectly safe
  synthesis: string;
  sentinelSignals: {
    label: string;
    value: string;
    state: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  }[];
  verdict: string;
}

export const analyzeSecurityIntent = async (
  currentAddress: string, 
  historicalAddress: string,
  sourceContext: string = 'UNKNOWN'
): Promise<ThreatAnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `FAST_SECURITY_AUDIT:
      CONTEXT: "${sourceContext}"
      HIST: "${historicalAddress}"
      CURR: "${currentAddress}"`,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          threatCategory: { type: Type.STRING },
          intentState: { type: Type.STRING, enum: ['INFO', 'CAUTION', 'TRUSTED', 'POISON', 'NEW', 'SPOOF'] },
          similarityIndex: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          advisory: { type: Type.STRING },
          isPoisoningAttempt: { type: Type.BOOLEAN },
          onChainAge: { type: Type.STRING },
          globalReputation: { type: Type.STRING, enum: ['CLEAN', 'FLAGGED', 'UNKNOWN'] },
          mismatchDetails: {
            type: Type.OBJECT,
            properties: {
              prefixMatch: { type: Type.BOOLEAN },
              suffixMatch: { type: Type.BOOLEAN },
              entropyCheck: { type: Type.STRING }
            },
            required: ["prefixMatch", "suffixMatch", "entropyCheck"]
          },
          evidenceFlags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["riskScore", "threatCategory", "intentState", "similarityIndex", "reasoning", "advisory", "isPoisoningAttempt", "onChainAge", "globalReputation", "mismatchDetails", "evidenceFlags"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini Parse Error:", e);
    throw new Error("Failed to parse security analysis");
  }
};

export const analyzeAddressInterception = async (address: string): Promise<InterceptionSynthesisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `RETINAL_SHIELD_SCAN: "${address}". Determine if this is a known mimic or trusted protocol node.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING, enum: ['SAFE', 'SUSPICIOUS', 'MALICIOUS'] },
          confidence: { type: Type.NUMBER },
          clusterMatch: { type: Type.STRING },
          threatLabel: { type: Type.STRING },
          telemetry: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["verdict", "confidence", "clusterMatch", "threatLabel", "telemetry"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (e) {
    return {
      verdict: 'SUSPICIOUS',
      confidence: 50,
      clusterMatch: 'UNKNOWN',
      threatLabel: 'HEURISTIC_FAILURE',
      telemetry: ['SYNC_ERROR', 'FALLBACK_ACTIVE']
    };
  }
};

export const generateCognitiveAutopsy = async (
  realAddress: string,
  chosenAddress: string
): Promise<CognitiveAutopsyResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `AUTOPSY: REAL_ADDR: "${realAddress}" vs CHOSEN_POI: "${chosenAddress}". Explain biological bypass.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          autopsy: { type: Type.STRING },
          visualAnchor: { type: Type.STRING },
          deceptionRating: { type: Type.NUMBER },
          biologicalVulnerability: { type: Type.STRING }
        },
        required: ["autopsy", "visualAnchor", "deceptionRating", "biologicalVulnerability"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (e) {
    console.error("Autopsy Parse Error:", e);
    throw new Error("Failed to generate autopsy");
  }
};

export const synthesizeAddressReputation = async (address: string): Promise<ReputationSynthesisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `SYNTHESIS: ADDR: "${address}". Technical reputation synthesis.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reputationScore: { type: Type.NUMBER },
          synthesis: { type: Type.STRING },
          verdict: { type: Type.STRING },
          sentinelSignals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                state: { type: Type.STRING, enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] }
              },
              required: ["label", "value", "state"]
            }
          }
        },
        required: ["reputationScore", "synthesis", "verdict", "sentinelSignals"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (e) {
    console.error("Reputation Synthesis Error:", e);
    throw new Error("Failed to synthesize reputation");
  }
};
