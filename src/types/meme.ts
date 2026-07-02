// 四种风格
export type MemeStyle = 'cute' | 'savage' | 'chill' | 'formal';

// 风格配置
export interface StyleConfig {
  id: MemeStyle;
  name: string;
  emoji: string;
  description: string;
  bgColor: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  fontWeight: number;
  fontSize: number;
}

// 生成的表情包
export interface MemeItem {
  id: string;
  style: MemeStyle;
  originalText: string;
  caption: string;
  emoji: string;
  dataUrl: string;
  createdAt: number;
}

// 生成请求
export interface GenerateRequest {
  text: string;
  styles: MemeStyle[];
}

// 生成状态
export type GenerateStatus = 'idle' | 'generating' | 'done' | 'error';
