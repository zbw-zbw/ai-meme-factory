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
  {
    keywords: ['下班', '回家', '走'],
    results: {
      cute: { caption: '好想回家呀', icon: 'fish' },
      savage: { caption: '活还没干完你走什么走', icon: 'fire' },
      chill: { caption: '到点了 先溜了', icon: 'fish' },
      formal: { caption: '今日工作已圆满完成', icon: 'briefcase' },
    },
  },
  {
    keywords: ['周末', '休息', '放假'],
    results: {
      cute: { caption: '周末好开心鸭', icon: 'heart' },
      savage: { caption: '放假也不让你消停', icon: 'fire' },
      chill: { caption: '终于可以躺平了', icon: 'fish' },
      formal: { caption: '祝您周末愉快', icon: 'heart' },
    },
  },
  {
    keywords: ['开会', '会议', '对齐'],
    results: {
      cute: { caption: '又开会呀呜呜', icon: 'heart' },
      savage: { caption: '这个会能发邮件吗', icon: 'fire' },
      chill: { caption: '开会摸鱼两不误', icon: 'fish' },
      formal: { caption: '会议已安排 请准时参加', icon: 'briefcase' },
    },
  },
  {
    keywords: ['工资', '钱', '穷'],
    results: {
      cute: { caption: '有钱啦有钱啦', icon: 'heart' },
      savage: { caption: '这点钱够干啥的', icon: 'fire' },
      chill: { caption: '发了再说吧', icon: 'fish' },
      formal: { caption: '薪资已发放 请查收', icon: 'briefcase' },
    },
  },
  {
    keywords: ['秃', '头秃', '头发'],
    results: {
      cute: { caption: '头发还在的 对吧', icon: 'heart' },
      savage: { caption: '头秃了代码也没改好', icon: 'fire' },
      chill: { caption: '秃了就戴帽子呗', icon: 'fish' },
      formal: { caption: '建议关注工作生活平衡', icon: 'briefcase' },
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
