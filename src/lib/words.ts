import { ALL_WORDS } from '@/constants';
import { Word, Tile, Letter, Color } from '@/types';


// Trie节点定义
interface TrieNode {
  letter?: Letter;
  byNextLetter: Map<Letter, TrieNode>;
  words?: Set<string>;
}

// 全局Trie实例
let trie: TrieNode | null = null;

/**
 * 创建Trie节点
 */
function createTrieNode(): TrieNode {
  return {
    byNextLetter: new Map(),
    words: undefined
  };
}

/**
 * 向Trie中插入单词
 */
function insertWord(word: string): void {
  if (!trie) {
    trie = createTrieNode();
  }

  let currentNode = trie;

  for (const letter of word) {
    const letterKey = letter as Letter;

    if (!currentNode.byNextLetter.has(letterKey)) {
      currentNode.byNextLetter.set(letterKey, createTrieNode());
    }

    currentNode = currentNode.byNextLetter.get(letterKey)!;
  }

  // 在叶子节点存储单词
  if (!currentNode.words) {
    currentNode.words = new Set();
  }
  currentNode.words.add(word);
}

/**
 * 构建Trie（延迟初始化）
 */
function buildTrieIfEmpty(): void {
  if (trie) return;

  trie = createTrieNode();

  for (const word of ALL_WORDS) {
    insertWord(word);
  }
}

/**
 * 检查字母是否匹配约束
 */
function letterMatchesConstraint(
  letter: Letter,
  targetLetter: Letter,
  color: Color
): boolean {
  switch (color) {
  case Color.Green:
    return letter === targetLetter;
  case Color.Yellow:
    // 黄色表示字母在单词中但不在当前位置
    return letter !== targetLetter;
  case Color.Grey:
    // 灰色表示字母不在单词中
    return true; // 在这个阶段不能排除，需要在单词级别检查
  default:
    return false;
  }
}

/**
 * 检查单词是否包含黄色字母约束
 */
function wordContainsYellowLetters(word: string, tiles: Word<Tile>): boolean {
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile.color === Color.Yellow) {
      if (!word.includes(tile.letter)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * 检查单词是否不包含灰色字母
 */
function wordExcludesGreyLetters(word: string, tiles: Word<Tile>): boolean {
  const greyLetters = new Set<Letter>();

  for (const tile of tiles) {
    if (tile.color === Color.Grey) {
      greyLetters.add(tile.letter);
    }
  }

  for (const letter of word) {
    if (greyLetters.has(letter as Letter)) {
      return false;
    }
  }

  return true;
}

/**
 * 搜索符合约束的单词 - 优化版本
 */
export function searchWord(tiles: Word<Tile>): Set<string> {
  buildTrieIfEmpty();

  const results = new Set<string>();
  if (!trie) return results;

  // 使用DFS搜索Trie
  function dfs(node: TrieNode, depth: number, currentWord: string): void {
    // 如果到达单词末尾
    if (depth === 5) {
      if (node.words) {
        for (const word of node.words) {
          // 验证单词是否符合所有约束
          if (wordContainsYellowLetters(word, tiles) &&
              wordExcludesGreyLetters(word, tiles)) {
            results.add(word);
          }
        }
      }
      return;
    }

    const tile = tiles[depth];

    // 根据颜色约束选择下一个字母
    if (tile.color === Color.Green) {
      // 绿色：必须是指定字母
      if (node.byNextLetter.has(tile.letter)) {
        dfs(
          node.byNextLetter.get(tile.letter)!,
          depth + 1,
          currentWord + tile.letter
        );
      }
    } else {
      // 黄色或灰色：尝试所有可能的字母
      for (const [letter, nextNode] of node.byNextLetter) {
        if (letterMatchesConstraint(letter, tile.letter, tile.color)) {
          dfs(nextNode, depth + 1, currentWord + letter);
        }
      }
    }
  }

  dfs(trie, 0, '');
  return results;
}

/**
 * 获取所有可能的5字母单词（用于测试）
 */
export function getAllFiveLetterWords(): string[] {
  return ALL_WORDS.filter(word => word.length === 5);
}

/**
 * 检查单词是否在词库中
 */
export function isValidWord(word: string): boolean {
  return ALL_WORDS.includes(word.toUpperCase());
}

/**
 * 获取以特定字母开头的单词
 */
export function getWordsStartingWith(letter: Letter): string[] {
  return ALL_WORDS.filter(word => word.startsWith(letter));
}

/**
 * 获取包含特定字母的单词
 */
export function getWordsContaining(letter: Letter): string[] {
  return ALL_WORDS.filter(word => word.includes(letter));
}

/**
 * 重置Trie（用于测试或重新初始化）
 */
export function resetTrie(): void {
  trie = null;
}

// Waffle 谜题生成器
export interface WaffleSolution {
  words: {
    row1: string;  // 横向第1行
    row2: string;  // 横向第2行
    row3: string;  // 横向第3行
    col1: string;  // 纵向第1列
    col2: string;  // 纵向第2列
    col3: string;  // 纵向第3列
  };
  board: Letter[];  // 21个位置的字母数组
}

/**
 * 验证6个单词是否能形成有效的Waffle交叉网格
 * @param row1 横向第1行单词
 * @param row2 横向第2行单词
 * @param row3 横向第3行单词
 * @param col1 纵向第1列单词
 * @param col2 纵向第2列单词
 * @param col3 纵向第3列单词
 * @returns 是否有效
 */
export function isValidWaffleGrid(
  row1: string, row2: string, row3: string,
  col1: string, col2: string, col3: string
): boolean {
  // 检查所有单词都是5个字母
  if (![row1, row2, row3, col1, col2, col3].every(word => word.length === 5)) {
    return false;
  }

  // 检查所有单词都在词库中
  if (![row1, row2, row3, col1, col2, col3].every(word => isValidWord(word))) {
    return false;
  }

  // 检查9个交叉点约束
  const constraints = [
    [row1[0], col1[0]],  // 位置0: row1[0] = col1[0]
    [row1[2], col2[0]],  // 位置2: row1[2] = col2[0]
    [row1[4], col3[0]],  // 位置4: row1[4] = col3[0]
    [row2[0], col1[2]],  // 位置8: row2[0] = col1[2]
    [row2[2], col2[2]],  // 位置10: row2[2] = col2[2]
    [row2[4], col3[2]],  // 位置12: row2[4] = col3[2]
    [row3[0], col1[4]],  // 位置16: row3[0] = col1[4]
    [row3[2], col2[4]],  // 位置18: row3[2] = col2[4]
    [row3[4], col3[4]]   // 位置20: row3[4] = col3[4]
  ];

  return constraints.every(([a, b]) => a === b);
}

/**
 * 根据6个有效单词生成Waffle解决方案
 */
export function createWaffleSolution(
  row1: string, row2: string, row3: string,
  col1: string, col2: string, col3: string
): WaffleSolution | null {
  if (!isValidWaffleGrid(row1, row2, row3, col1, col2, col3)) {
    return null;
  }

  // 构建21个位置的字母数组
  const board: Letter[] = new Array(21);

  // 填入横向单词
  row1.split('').forEach((letter, i) => board[i] = letter as Letter);
  row2.split('').forEach((letter, i) => board[8 + i] = letter as Letter);
  row3.split('').forEach((letter, i) => board[16 + i] = letter as Letter);

  // 填入纵向单词的非交叉位置
  board[5] = col1[1] as Letter;   // 位置5: col1[1]
  board[13] = col1[3] as Letter;  // 位置13: col1[3]

  board[6] = col2[1] as Letter;   // 位置6: col2[1]
  board[14] = col2[3] as Letter;  // 位置14: col2[3]

  board[7] = col3[1] as Letter;   // 位置7: col3[1]
  board[15] = col3[3] as Letter;  // 位置15: col3[3]

  return {
    words: { row1, row2, row3, col1, col2, col3 },
    board
  };
}

/**
 * 更智能的Waffle生成器 - 逐步构建有效网格
 * @param maxAttempts 最大尝试次数
 * @returns 生成的Waffle解决方案
 */
export function generateSmartWaffle(maxAttempts: number = 1000): WaffleSolution | null {
  const fiveLetterWords = getAllFiveLetterWords();

  // 预构建索引以提高查找效率
  const wordsByFirstLetter = new Map<string, string[]>();
  const wordsByLetterAtPosition = new Map<string, string[]>();

  fiveLetterWords.forEach(word => {
    // 按首字母索引
    const firstLetter = word[0];
    if (!wordsByFirstLetter.has(firstLetter)) {
      wordsByFirstLetter.set(firstLetter, []);
    }
    wordsByFirstLetter.get(firstLetter)!.push(word);

    // 按位置字母索引
    for (let i = 0; i < 5; i++) {
      const key = `${i}-${word[i]}`;
      if (!wordsByLetterAtPosition.has(key)) {
        wordsByLetterAtPosition.set(key, []);
      }
      wordsByLetterAtPosition.get(key)!.push(word);
    }
  });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // 1. 随机选择第一个横向单词 - 选择常见的单词
      const row1 = fiveLetterWords[Math.floor(Math.random() * Math.min(fiveLetterWords.length, 500))];

      // 2. 基于row1的交叉点，寻找匹配的纵向单词
      const col1Candidates = wordsByFirstLetter.get(row1[0]) || [];
      const col2Candidates = wordsByFirstLetter.get(row1[2]) || [];
      const col3Candidates = wordsByFirstLetter.get(row1[4]) || [];

      if (col1Candidates.length === 0 || col2Candidates.length === 0 || col3Candidates.length === 0) {
        continue;
      }

      // 随机选择列单词
      const col1 = col1Candidates[Math.floor(Math.random() * col1Candidates.length)];
      const col2 = col2Candidates[Math.floor(Math.random() * col2Candidates.length)];
      const col3 = col3Candidates[Math.floor(Math.random() * col3Candidates.length)];

      // 3. 基于列单词的约束，寻找row2 - 使用索引快速查找
      const row2Key1 = `0-${col1[2]}`;
      const row2Key2 = `2-${col2[2]}`;
      const row2Key3 = `4-${col3[2]}`;

      const row2Set1 = new Set(wordsByLetterAtPosition.get(row2Key1) || []);
      const row2Set2 = new Set(wordsByLetterAtPosition.get(row2Key2) || []);
      const row2Set3 = new Set(wordsByLetterAtPosition.get(row2Key3) || []);

      const row2Candidates = [...row2Set1].filter(word =>
        row2Set2.has(word) && row2Set3.has(word)
      );

      if (row2Candidates.length === 0) continue;
      const row2 = row2Candidates[Math.floor(Math.random() * row2Candidates.length)];

      // 4. 基于列单词的约束，寻找row3
      const row3Key1 = `0-${col1[4]}`;
      const row3Key2 = `2-${col2[4]}`;
      const row3Key3 = `4-${col3[4]}`;

      const row3Set1 = new Set(wordsByLetterAtPosition.get(row3Key1) || []);
      const row3Set2 = new Set(wordsByLetterAtPosition.get(row3Key2) || []);
      const row3Set3 = new Set(wordsByLetterAtPosition.get(row3Key3) || []);

      const row3Candidates = [...row3Set1].filter(word =>
        row3Set2.has(word) && row3Set3.has(word)
      );

      if (row3Candidates.length === 0) continue;
      const row3 = row3Candidates[Math.floor(Math.random() * row3Candidates.length)];

      // 5. 验证并创建解决方案
      const solution = createWaffleSolution(row1, row2, row3, col1, col2, col3);
      if (solution) {
        console.log(`✅ 智能生成成功！尝试次数: ${attempt + 1}`);
        return solution;
      }
    } catch (error) {
      continue;
    }
  }

  console.log('⚠️ 智能生成失败，尝试随机生成...');
  return null;
}

/**
 * 随机生成一个有效的Waffle谜题 - 优化版本
 * @param maxAttempts 最大尝试次数
 * @returns 生成的Waffle解决方案，如果失败返回null
 */
export function generateRandomWaffle(maxAttempts: number = 500): WaffleSolution | null {
  const fiveLetterWords = getAllFiveLetterWords();

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // 随机选择6个单词，但优先选择较短的单词（更可能匹配）
    const shuffled = [...fiveLetterWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(100, fiveLetterWords.length));

    for (let i = 0; i < shuffled.length - 5; i += 6) {
      const [row1, row2, row3, col1, col2, col3] = shuffled.slice(i, i + 6);

      const solution = createWaffleSolution(row1, row2, row3, col1, col2, col3);
      if (solution) {
        console.log(`✅ 随机生成成功！尝试次数: ${attempt + 1}`);
        return solution;
      }
    }
  }

  console.log('⚠️ 随机生成失败，使用经典谜题...');
  return null;
}

/**
 * 获取预定义的经典Waffle谜题
 */
export function getClassicWaffles(): WaffleSolution[] {
  const classics = [
    // 当前验证的组合 - 确保这个是100%正确的
    { row1: 'SIREN', row2: 'RABBI', row3: 'WINCH', col1: 'SCREW', col2: 'ROBIN', col3: 'NEIGH' }

    // 暂时只保留一个确实有效的组合，避免无效的谜题
    // TODO: 添加更多经过验证的组合
  ];

  return classics
    .map(({ row1, row2, row3, col1, col2, col3 }) => {
      const solution = createWaffleSolution(row1, row2, row3, col1, col2, col3);
      if (solution) {
        console.log(`✅ 经典谜题有效: ${row1}/${row2}/${row3} × ${col1}/${col2}/${col3}`);
      } else {
        console.log(`❌ 经典谜题无效: ${row1}/${row2}/${row3} × ${col1}/${col2}/${col3}`);
      }
      return solution;
    })
    .filter((solution): solution is WaffleSolution => solution !== null);
}

/**
 * 生成Waffle谜题的主函数 - 确保100%成功率
 * @returns 始终返回一个有效的WaffleSolution
 */
export function generateGuaranteedWaffle(): WaffleSolution {
  // 1. 首先尝试智能生成器（高效，成功率高）
  let solution = generateSmartWaffle(1000);
  if (solution) return solution;

  // 2. 如果失败，尝试随机生成器
  solution = generateRandomWaffle(500);
  if (solution) return solution;

  // 3. 如果还是失败，使用经典谜题（100%保证）
  const classics = getClassicWaffles();
  const randomClassic = classics[Math.floor(Math.random() * classics.length)];

  if (randomClassic) return randomClassic;

  // 4. 最后的兜底方案 - 硬编码的可靠组合
  return createWaffleSolution('SIREN', 'RABBI', 'WINCH', 'SCREW', 'ROBIN', 'NEIGH')!;
}
