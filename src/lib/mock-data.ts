import type { MemeStyle, IconName } from '@/types/meme';

interface MockResult {
  caption: string;
  icon: IconName;
}

type MockRule = {
  keywords: string[];
  results: Record<MemeStyle, MockResult>;
};

const mockRules: MockRule[] = [
  {
    keywords: ['需求', '改'],
    results: {
      cute: { caption: '别改了好不好嘛~', icon: 'heart' },
      savage: { caption: '改你个大头鬼', icon: 'fire' },
      chill: { caption: '改不动了 先摸会儿', icon: 'fish' },
      formal: { caption: '建议需求评审后再变更', icon: 'briefcase' },
    },
  },
  {
    keywords: ['上班', '加班'],
    results: {
      cute: { caption: '好累好想休息呀~', icon: 'heart' },
      savage: { caption: '资本家的阴谋', icon: 'fire' },
      chill: { caption: '摸到下班就是胜利', icon: 'fish' },
      formal: { caption: '建议合理安排工作时间', icon: 'briefcase' },
    },
  },
  {
    keywords: ['bug'],
    results: {
      cute: { caption: 'bug宝宝快走开~', icon: 'heart' },
      savage: { caption: '这代码谁写的出来挨打', icon: 'fire' },
      chill: { caption: 'bug? 什么bug? 我不知道', icon: 'fish' },
      formal: { caption: '已提交缺陷报告，待修复', icon: 'briefcase' },
    },
  },
];

const defaultResults: Record<MemeStyle, MockResult> = {
  cute: { caption: '呜呜呜求求了嘛~', icon: 'heart' },
  savage: { caption: '你认真的？', icon: 'fire' },
  chill: { caption: '无所谓 我先摸了', icon: 'fish' },
  formal: { caption: '建议走正规流程', icon: 'briefcase' },
};

export function getMockCaption(text: string, style: MemeStyle): MockResult {
  for (const rule of mockRules) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.results[style];
    }
  }
  return defaultResults[style];
}

export function getMockData(text: string, styles: MemeStyle[]): Record<MemeStyle, MockResult> {
  const result = {} as Record<MemeStyle, MockResult>;
  for (const style of styles) {
    result[style] = getMockCaption(text, style);
  }
  return result;
}
