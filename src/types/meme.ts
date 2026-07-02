// Four styles
export type MemeStyle = 'cute' | 'savage' | 'chill' | 'formal';

// Icon identifiers (mapped to SVG components in UI, SVG path data in Canvas)
export type IconName = 'heart' | 'fire' | 'fish' | 'briefcase';

// Style configuration
export interface StyleConfig {
  id: MemeStyle;
  name: string;
  icon: IconName;
  description: string;
  bgColor: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  fontWeight: number;
  fontSize: number;
}

// Generated meme
export interface MemeItem {
  id: string;
  style: MemeStyle;
  originalText: string;
  caption: string;
  icon: IconName;
  dataUrl: string;
  createdAt: number;
}

// Generate request
export interface GenerateRequest {
  text: string;
  styles: MemeStyle[];
}

// Generate status
export type GenerateStatus = 'idle' | 'generating' | 'done' | 'error';

// API response meme (from server)
export interface ApiMemeResult {
  style: MemeStyle;
  caption: string;
  icon: IconName;
}
