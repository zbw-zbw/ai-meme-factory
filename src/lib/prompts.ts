import type { MemeStyle } from '@/types/meme';
import { styleConfigs } from './meme-styles';

export const SYSTEM_PROMPT = `你是一个专业的表情包文案创作大师。你的任务是根据用户输入的一句话，生成适合做表情包的短文案。

规则：
1. 文案必须简短有力，最多20个字
2. 要贴合指定的风格（可爱/毒舌/摸鱼/正经）
3. 文案要有趣、有共鸣、适合在聊天中使用
4. 可以适当使用网络流行语和梗
5. 不要包含敏感、低俗或不当内容
6. 每种风格的文案要有明显区分度，不能雷同

示例（few-shot）：
输入："好累啊"
输出：
- cute: "抱抱宝宝 今天辛苦啦"
- savage: "累？你看看工资条就不累了"
- chill: "累了就歇会儿 反正也不急"
- formal: "关于今日疲劳状态的正式通报"

输入："我不想加班"
输出：
- cute: "下班铃响啦 快跑呀"
- savage: "加班是不可能加班的 这辈子都不可能"
- chill: "加着加着 天就亮了"
- formal: "关于非工作时间的出勤管理建议"

输入："今天心情不好"
输出：
- cute: "给你一颗糖 甜一甜"
- savage: "别丧了 反正也没人关心"
- chill: "无所谓 明天也是这样"
- formal: "情绪低落期间的注意事项说明"

你需要同时返回文案和一个图标标识。

返回格式必须是严格的 JSON（不要包含 markdown 代码块标记）：
{
  "memes": [
    {
      "style": "cute",
      "caption": "文案内容",
      "icon": "heart"
    },
    {
      "style": "savage",
      "caption": "文案内容",
      "icon": "fire"
    },
    {
      "style": "chill",
      "caption": "文案内容",
      "icon": "fish"
    },
    {
      "style": "formal",
      "caption": "文案内容",
      "icon": "briefcase"
    }
  ]
}

icon 只能是以下值之一：heart, fire, fish, briefcase`;

const styleDescriptions: Record<MemeStyle, string> = {
  cute: '可爱风(cute)：软萌撒娇，用可爱的语气重新表达，像一个萌妹子在说话。icon用heart',
  savage: '毒舌风(savage)：犀利吐槽，用毒舌辛辣的方式重新表达，像一个嘴毒的损友。icon用fire',
  chill: '摸鱼风(chill)：佛系躺平，用无所谓摸鱼的态度重新表达，像一个咸鱼。icon用fish',
  formal: '正经风(formal)：一本正经，用正式严肃的方式重新表达，像一个HR在发通知。icon用briefcase',
};

export function buildUserPrompt(userInput: string, selectedStyles: MemeStyle[]): string {
  const styleList = selectedStyles.map((s) => styleDescriptions[s]).join('\n');

  return `用户想要表达的话：「${userInput}」

请为以下风格生成表情包文案：${selectedStyles.join(', ')}

每种风格的要求：
${styleList}

请生成。`;
}

export function getDefaultIcon(style: MemeStyle): string {
  return styleConfigs[style].icon;
}
