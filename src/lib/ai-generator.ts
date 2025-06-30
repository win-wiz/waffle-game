import { ALL_WORDS } from '@/constants';

/**
 * AI单词生成器的提示词模板
 */
export const AI_WAFFLE_GENERATOR_PROMPT = `你是一个专业的Waffle单词游戏设计师。请生成6个符合以下严格规则的5字母英文单词：

游戏结构要求：
- 需要生成3个横向单词 + 3个纵向单词
- 布局为5×5网格，去掉四个角位置（共21个字母位置）
- 9个交叉点必须完全匹配

必须满足的约束：
1. 所有单词必须是常用的5字母英文单词
2. 9个交叉点字母必须完全匹配
3. 不使用专有名词、缩写或生僻词
4. 单词应该适合各年龄段玩家
5. 避免重复使用相同字母过多

输出格式要求：
请按以下JSON格式输出：
{
  "horizontal_words": ["WORD1", "WORD2", "WORD3"],
  "vertical_words": ["WORD4", "WORD5", "WORD6"],
  "validation": {
    "all_intersections_match": true,
    "all_words_valid": true,
    "difficulty_level": "medium"
  }
}

示例（参考格式）：
{
  "horizontal_words": ["SIREN", "RABBI", "WINCH"],
  "vertical_words": ["SCREW", "ROBIN", "NEIGH"],
  "validation": {
    "all_intersections_match": true,
    "all_words_valid": true, 
    "difficulty_level": "medium"
  }
}

验证检查要求：
1. 每个单词都是5个字母
2. 所有交叉点字母完全匹配
3. 所有单词都是常用英文词汇
4. 没有重复的单词
5. 整体难度适中

现在请生成一组新的6个单词：`;

/**
 * 验证AI生成的单词是否符合Waffle游戏规则
 */
export function validateAIGeneratedWords(
  horizontalWords: [string, string, string],
  verticalWords: [string, string, string]
): {
  isValid: boolean;
  errors: string[];
  intersections: { [key: string]: { h: string; v: string; match: boolean } };
} {
  const errors: string[] = [];
  const intersections: { [key: string]: { h: string; v: string; match: boolean } } = {};

  // 检查单词长度和有效性
  const allWords = [...horizontalWords, ...verticalWords];
  for (const word of allWords) {
    if (word.length !== 5) {
      errors.push(`单词 "${word}" 长度不是5个字母`);
    }
    if (!ALL_WORDS.includes(word.toUpperCase())) {
      errors.push(`单词 "${word}" 不在词库中`);
    }
  }

  // 检查交叉点匹配
  const intersectionMap = [
    { h: 0, hPos: 1, v: 0, vPos: 1, name: '交叉点1' }, // H1[1] = V1[1]
    { h: 0, hPos: 2, v: 1, vPos: 1, name: '交叉点2' }, // H1[2] = V2[1]
    { h: 0, hPos: 3, v: 2, vPos: 1, name: '交叉点3' }, // H1[3] = V3[1]
    { h: 1, hPos: 1, v: 0, vPos: 2, name: '交叉点4' }, // H2[1] = V1[2]
    { h: 1, hPos: 2, v: 1, vPos: 2, name: '交叉点5' }, // H2[2] = V2[2]
    { h: 1, hPos: 3, v: 2, vPos: 2, name: '交叉点6' }, // H2[3] = V3[2]
    { h: 2, hPos: 1, v: 0, vPos: 3, name: '交叉点7' }, // H3[1] = V1[3]
    { h: 2, hPos: 2, v: 1, vPos: 3, name: '交叉点8' }, // H3[2] = V2[3]
    { h: 2, hPos: 3, v: 2, vPos: 3, name: '交叉点9' } // H3[3] = V3[3]
  ];

  for (const intersection of intersectionMap) {
    const hChar = horizontalWords[intersection.h][intersection.hPos];
    const vChar = verticalWords[intersection.v][intersection.vPos];
    const match = hChar === vChar;

    intersections[intersection.name] = {
      h: hChar,
      v: vChar,
      match
    };

    if (!match) {
      errors.push(
        `${intersection.name}: 横向单词"${horizontalWords[intersection.h]}"位置${intersection.hPos}的字母"${hChar}" != 纵向单词"${verticalWords[intersection.v]}"位置${intersection.vPos}的字母"${vChar}"`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    intersections
  };
}

/**
 * 主题化AI单词生成器
 */
export function generateThemedWafflePrompt(theme: string): string {
  const themePrompts = {
    daily: '日常生活主题：家居、食物、工作、交通等常见词汇',
    nature: '自然主题：动物、植物、天气、地理等自然词汇',
    tech: '科技主题：电脑、网络、数字、现代科技词汇',
    emotion: '情感主题：感情、心理、人际关系等情感词汇',
    action: '动作主题：运动、活动、行为等动词词汇',
    random: '随机主题：混合各种类型的常用词汇'
  };

  const selectedTheme = themePrompts[theme as keyof typeof themePrompts] || themePrompts.random;

  return `${AI_WAFFLE_GENERATOR_PROMPT}

主题指导：
${selectedTheme}

请围绕这个主题生成6个相关的5字母英文单词，确保它们能完美组成一个Waffle谜题。`;
}

/**
 * AI提示词的进阶版本 - 包含更详细的约束和示例
 */
export const ADVANCED_AI_WAFFLE_PROMPT = `你是世界顶级的Waffle单词游戏设计师。请设计一个完美的Waffle谜题，包含6个巧妙匹配的5字母英文单词。

核心规则：
1. 生成3个横向单词 + 3个纵向单词
2. 这些单词将形成一个十字形网格，共有9个交叉点
3. 所有交叉点的字母必须完全匹配
4. 使用常见的、适合所有年龄的英文单词

设计原则：
- 优先选择日常生活中的高频词汇
- 避免专有名词、缩写、生僻词
- 考虑单词间的主题一致性（可选）
- 确保适中的游戏难度

质量标准：
✅ 所有单词都是标准5字母英文单词
✅ 9个交叉点字母完全匹配
✅ 单词在词典中常见且易于理解
✅ 整体组合自然流畅
✅ 适合不同水平的玩家

输出要求：
严格按照以下JSON格式输出，不要包含任何其他文字：

{
  "horizontal_words": ["横向单词1", "横向单词2", "横向单词3"],
  "vertical_words": ["纵向单词1", "纵向单词2", "纵向单词3"],
  "theme": "主题描述（可选）",
  "difficulty": "easy/medium/hard",
  "validation_passed": true
}

现在请开始设计一个高质量的Waffle单词谜题：`;

/**
 * 多样性AI生成器 - 生成不同风格的谜题
 */
export const generateVariedWafflePrompt = (style: 'easy' | 'medium' | 'hard' | 'themed') => {
  const stylePrompts = {
    easy: '请生成简单难度的谜题，使用最常见的日常英文单词，适合初学者',
    medium: '请生成中等难度的谜题，使用常见但稍有挑战性的英文单词',
    hard: '请生成困难难度的谜题，使用较少见但仍是标准的英文单词',
    themed: '请生成主题性谜题，6个单词围绕一个共同主题（如动物、食物、运动等）'
  };

  return `${ADVANCED_AI_WAFFLE_PROMPT}

特殊要求：
${stylePrompts[style]}

请生成符合要求的谜题：`;
};

/**
 * AI生成结果的类型定义
 */
export interface AIWaffleResult {
  horizontal_words: [string, string, string];
  vertical_words: [string, string, string];
  theme?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  validation_passed?: boolean;
}

/**
 * 解析AI生成的JSON响应
 */
export function parseAIWaffleResponse(response: string): AIWaffleResult | null {
  try {
    // 提取JSON部分
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('未找到有效的JSON响应');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]) as AIWaffleResult;

    // 基本验证
    if (!parsed.horizontal_words || !parsed.vertical_words ||
        parsed.horizontal_words.length !== 3 || parsed.vertical_words.length !== 3) {
      console.error('AI响应格式不正确');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('解析AI响应失败:', error);
    return null;
  }
}

/**
 * 快速验证提示词生成的可行性测试函数
 */
export function testAIPromptEffectiveness(): void {
  console.log('🤖 AI Waffle生成器测试');
  console.log('========================================');

  console.log('📋 基础提示词:');
  console.log(AI_WAFFLE_GENERATOR_PROMPT.substring(0, 200) + '...');

  console.log('\n🎨 主题化提示词示例 (自然主题):');
  console.log(generateThemedWafflePrompt('nature').substring(0, 200) + '...');

  console.log('\n⭐ 进阶提示词:');
  console.log(ADVANCED_AI_WAFFLE_PROMPT.substring(0, 200) + '...');

  console.log('\n🎯 使用说明:');
  console.log('1. 将任一提示词发送给AI（如Claude、GPT等）');
  console.log('2. AI将返回JSON格式的6个单词');
  console.log('3. 使用 validateAIGeneratedWords() 验证结果');
  console.log('4. 如果验证通过，即可用于Waffle游戏');

  // 测试验证函数
  console.log('\n🧪 验证函数测试:');
  const testResult = validateAIGeneratedWords(
    ['SIREN', 'RABBI', 'WINCH'],
    ['SCREW', 'ROBIN', 'NEIGH']
  );
  console.log('测试结果:', testResult.isValid ? '✅ 通过' : '❌ 失败');
  if (!testResult.isValid) {
    console.log('错误:', testResult.errors);
  }
}

/**
 * 创建一个演示用的AI交互界面（可选使用）
 */
export const createAIGeneratorDemo = () => {
  return {
    prompts: {
      basic: AI_WAFFLE_GENERATOR_PROMPT,
      advanced: ADVANCED_AI_WAFFLE_PROMPT,
      themed: (theme: string) => generateThemedWafflePrompt(theme),
      varied: (style: 'easy' | 'medium' | 'hard' | 'themed') => generateVariedWafflePrompt(style)
    },
    validate: validateAIGeneratedWords,
    parse: parseAIWaffleResponse,
    test: testAIPromptEffectiveness,

    // 使用示例
    example: {
      usage: '将prompts.basic复制给AI，获得JSON响应后用parse()和validate()处理',
      sample_input: 'AI返回的JSON字符串',
      sample_output: '经过验证的单词数组和错误信息'
    }
  };
};
