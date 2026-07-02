import type { MemeStyle } from '@/types/meme';

interface MockResult {
  caption: string;
  emoji: string;
}

type MockRule = {
  keywords: string[];
  results: Record<MemeStyle, MockResult>;
};

const mockRules: MockRule[] = [
  {
    keywords: ['需求', '改'],
    results: {
      cute: { caption: '别改了好不好嘛~', emoji: '🥺' },
      savage: { caption: '改你🐴呢', emoji: '💀' },
      chill: { caption: '改不动了 先摸会儿', emoji: '🐟' },
      formal: { caption: '建议需求评审后再变更', emoji: '🤔' },
    },
  },
  {
    keywords: ['上班', '加班'],
    results: {
      cute: { caption: '好累好想休息呀~', emoji: '🥺' },
      savage: { caption: '资本家的阴谋', emoji: '💀' },
      chill: { caption: '摸到下班就是胜利', emoji: '🐟' },
      formal: { caption: '建议合理安排工作时间', emoji: '🤔' },
    },
  },
  {
    keywords: ['bug'],
    results: {
      cute: { caption: 'bug宝宝快走开~', emoji: '🥺' },
      savage: { caption: '这代码谁写的出来挨打', emoji: '💀' },
      chill: { caption: 'bug? 什么bug? 我不知道', emoji: '🐟' },
      formal: { caption: '已提交缺陷报告，待修复', emoji: '🤔' },
    },
  },
];

const defaultResults: Record<MemeStyle, MockResult> = {
  cute: { caption: '呜呜呜求求了嘛~', emoji: '🥺' },
  savage: { caption: '你认真的？', emoji: '💀' },
  chill: { caption: '无所谓 我先摸了', emoji: '🐟' },
  formal: { caption: '建议走正规流程', emoji: '🤔' },
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
