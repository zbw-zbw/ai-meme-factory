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
      cute: { caption: '好想回家呀', icon: 'heart' },
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
      formal: { caption: '祝您周末愉快', icon: 'briefcase' },
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
  {
    keywords: ['饿'],
    results: {
      cute: { caption: '好饿好想吃肉肉', icon: 'heart' },
      savage: { caption: '饿到能吃下一头牛', icon: 'fire' },
      chill: { caption: '饿了就吃 管他呢', icon: 'fish' },
      formal: { caption: '关于用餐时间的紧急通知', icon: 'briefcase' },
    },
  },
  {
    keywords: ['困'],
    results: {
      cute: { caption: '困困 想睡觉觉了', icon: 'heart' },
      savage: { caption: '困死了我先睡了拜拜', icon: 'fire' },
      chill: { caption: '困了就趴会儿', icon: 'fish' },
      formal: { caption: '关于适时休息的管理建议', icon: 'briefcase' },
    },
  },
  {
    keywords: ['累'],
    results: {
      cute: { caption: '累了要抱抱嘛', icon: 'heart' },
      savage: { caption: '累到原地爆炸', icon: 'fire' },
      chill: { caption: '累了就躺平吧', icon: 'fish' },
      formal: { caption: '关于工作负荷的评估报告', icon: 'briefcase' },
    },
  },
  {
    keywords: ['无聊'],
    results: {
      cute: { caption: '好无聊陪人家玩嘛', icon: 'heart' },
      savage: { caption: '无聊到数头发', icon: 'fire' },
      chill: { caption: '无聊也是一种境界', icon: 'fish' },
      formal: { caption: '关于闲暇时间的利用建议', icon: 'briefcase' },
    },
  },
  {
    keywords: ['开心'],
    results: {
      cute: { caption: '开心到转圈圈啦', icon: 'heart' },
      savage: { caption: '笑什么笑 有什么好笑的', icon: 'fire' },
      chill: { caption: '开心就好 别想太多', icon: 'fish' },
      formal: { caption: '关于保持积极心态的倡议', icon: 'briefcase' },
    },
  },
  {
    keywords: ['减肥'],
    results: {
      cute: { caption: '不吃饱怎么减肥呀', icon: 'heart' },
      savage: { caption: '减肥从明天开始永远是明天', icon: 'fire' },
      chill: { caption: '吃完这顿再减', icon: 'fish' },
      formal: { caption: '关于健康管理计划的执行说明', icon: 'briefcase' },
    },
  },
  {
    keywords: ['考试'],
    results: {
      cute: { caption: '考试加油加油呀', icon: 'heart' },
      savage: { caption: '考试什么的毁灭吧', icon: 'fire' },
      chill: { caption: '考完就解放了再忍忍', icon: 'fish' },
      formal: { caption: '关于考试期间注意事项的通知', icon: 'briefcase' },
    },
  },
  {
    keywords: ['恋爱'],
    results: {
      cute: { caption: '想谈恋爱了好想有个人抱', icon: 'heart' },
      savage: { caption: '单身保平安懂不懂', icon: 'fire' },
      chill: { caption: '随缘吧不强求', icon: 'fish' },
      formal: { caption: '关于建立亲密关系的可行性分析', icon: 'briefcase' },
    },
  },
  {
    keywords: ['游戏'],
    results: {
      cute: { caption: '打游戏好开心呀', icon: 'heart' },
      savage: { caption: '游戏输了怪队友就完了', icon: 'fire' },
      chill: { caption: '再来一把最后一把', icon: 'fish' },
      formal: { caption: '关于娱乐时间分配的管理规定', icon: 'briefcase' },
    },
  },
  {
    keywords: ['天气'],
    results: {
      cute: { caption: '今天天气真好想出门', icon: 'heart' },
      savage: { caption: '天气再好也要上班认命吧', icon: 'fire' },
      chill: { caption: '适合发呆的一天', icon: 'fish' },
      formal: { caption: '关于天气状况的出行提醒', icon: 'briefcase' },
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
