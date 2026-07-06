import type { MemeStyle, StyleConfig } from '@/types/meme';

export const ALL_STYLES: MemeStyle[] = ['cute', 'savage', 'chill', 'formal'];

export const styleConfigs: Record<MemeStyle, StyleConfig> = {
  cute: {
    id: 'cute',
    name: '可爱风',
    icon: 'heart',
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
    icon: 'fire',
    description: '犀利吐槽，嘴巴够毒',
    bgColor: '#1C1917',
    bgGradient: 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
    textColor: '#FFFFFF',
    accentColor: '#F43F5E',
    fontWeight: 900,
    fontSize: 40,
  },
  chill: {
    id: 'chill',
    name: '摸鱼风',
    icon: 'fish',
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
    icon: 'briefcase',
    description: '一本正经，认真回复',
    bgColor: '#F5F5F4',
    bgGradient: 'linear-gradient(135deg, #F5F5F4 0%, #E7E5E4 100%)',
    textColor: '#44403C',
    accentColor: '#57534E',
    fontWeight: 500,
    fontSize: 30,
  },
};

export function getStyleConfig(style: MemeStyle): StyleConfig {
  return styleConfigs[style];
}
