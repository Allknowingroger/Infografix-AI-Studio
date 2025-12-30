
export enum InfographicType {
  STATISTICAL = 'statistical',
  PROCESS = 'process',
  COMPARISON = 'comparison',
  EDUCATIONAL = 'educational'
}

export interface StatItem {
  label: string;
  value: number;
  unit?: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface ComparisonSide {
  title: string;
  points: string[];
}

export interface InfoPoint {
  title: string;
  text: string;
  icon?: string;
}

export interface InfographicData {
  id: string;
  type: InfographicType;
  title: string;
  subtitle: string;
  summary: string;
  accentColor: string;
  // Dynamic fields based on type
  stats?: StatItem[];
  steps?: StepItem[];
  comparison?: {
    sideA: ComparisonSide;
    sideB: ComparisonSide;
  };
  points?: InfoPoint[];
}

export interface GenerationResponse {
  infographics: InfographicData[];
}
