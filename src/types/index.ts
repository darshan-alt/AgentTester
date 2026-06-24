export type Provider = 'openai' | 'anthropic' | 'gemini';

export interface ApiKeys {
  openai: string;
  anthropic: string;
  gemini: string;
}

export interface Settings {
  provider: Provider;
  model: string;
  systemPrompt: string;
  apiKeys: ApiKeys;
}

export type LineStatus = 'correct' | 'incorrect' | 'violation';

export interface LineEvaluation {
  originalLine: string;
  status: LineStatus;
  explanation: string;
  isGuardrailViolation: boolean;
}

export interface EvaluationResponse {
  evaluations: LineEvaluation[];
  overallSummary: string;
  hasGuardrailViolations: boolean;
}
