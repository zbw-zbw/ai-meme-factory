import type { MemeStyle, StyleConfig } from '@/types/meme';

export const ALL_STYLES: MemeStyle[] = ['cute', 'savage', 'chill', 'formal'];

export const styleConfigs: Record<MemeStyle, StyleConfig> = {
  cute: {
    id: 'cute',
    name: '可爱风',
    emoji: '🥺',
    description: '软萌撒娇，让人心都化了',
    bgColor: '#FFF1F2',
    bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    textColor: '#BE123C',
    accentColor: '#FB7185',
    fontWeight: 700,
    fontSize: 36,
  },
  savage: {
    id: 'savage',
    name: '毒舌风',
    emoji: '😑',
    description: '犀利吐槽，嘴巴够毒',
    bgColor: '#1E293B',
    bgGradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    textColor: '#FFFFFF',
    accentColor: '#F43F5E',
    fontWeight: 900,
    fontSize: 40,
  },
  chill: {
    id: 'chill',
    name: '摸鱼风',
    emoji: '🐟',
    description: '佛系躺平，摸鱼万岁',
    bgColor: '#ECFEFF',
    bgGradient: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)',
    textColor: '#0E7490',
    accentColor: '#06B6D4',
    fontWeight: 500,
    fontSize: 32,
  },
  formal: {
    id: 'formal',
    name: '正经风',
    emoji: '🤔',
    description: '一本正经，认真回复',
    bgColor: '#F8FAFC',
    bgGradient: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
    textColor: '#334155',
    accentColor: '#475569',
    fontWeight: 500,
    fontSize: 30,
  },
};

export function getStyleConfig(style: MemeStyle): StyleConfig {
  return styleConfigs[style];
}
