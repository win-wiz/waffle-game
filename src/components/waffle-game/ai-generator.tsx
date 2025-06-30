import { useState } from 'react';
import {
  AI_WAFFLE_GENERATOR_PROMPT,
  ADVANCED_AI_WAFFLE_PROMPT,
  generateThemedWafflePrompt,
  validateAIGeneratedWords,
  parseAIWaffleResponse
} from '@/lib/ai-generator';

interface AIGeneratorProps {
  showAIPrompts: boolean;
  aiResponse: string;
  selectedTheme: string;
  onAiResponseChange: (response: string) => void;
  onSelectedThemeChange: (theme: string) => void;
  onValidateAIResponse: () => void;
}

export function AIGenerator({
  showAIPrompts,
  aiResponse,
  selectedTheme,
  onAiResponseChange,
  onSelectedThemeChange,
  onValidateAIResponse
}: AIGeneratorProps) {
  if (!showAIPrompts) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-50/90 to-indigo-50/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-300/60 shadow-xl mb-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-purple-400">
          <span className="text-2xl">🤖</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-indigo-700 bg-clip-text text-transparent mb-2">AI Waffle单词生成器</h3>
        <p className="text-purple-700/80">使用AI生成自定义主题的Waffle谜题</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* 提示词选择 */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-purple-900 mb-4">📋 选择提示词类型</h4>

          <div className="space-y-4">
            <button
              onClick={() => navigator.clipboard.writeText(AI_WAFFLE_GENERATOR_PROMPT)}
              className="w-full bg-white/90 backdrop-blur-sm text-purple-800 p-4 rounded-xl border border-purple-200/80 hover:bg-purple-100/90 transition-all duration-300 text-left shadow-sm"
            >
              <div className="font-semibold mb-1">📝 基础提示词</div>
              <div className="text-sm text-purple-600">适合初学者，生成标准的Waffle谜题</div>
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(ADVANCED_AI_WAFFLE_PROMPT)}
              className="w-full bg-white/90 backdrop-blur-sm text-purple-800 p-4 rounded-xl border border-purple-200/80 hover:bg-purple-100/90 transition-all duration-300 text-left shadow-sm"
            >
              <div className="font-semibold mb-1">⭐ 进阶提示词</div>
              <div className="text-sm text-purple-600">更详细的指令，生成高质量谜题</div>
            </button>

            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-purple-200/80 shadow-sm">
              <div className="font-semibold text-purple-900 mb-3">🎨 主题提示词</div>
              <select
                value={selectedTheme}
                onChange={(e) => onSelectedThemeChange(e.target.value)}
                className="w-full p-2 border border-purple-200 rounded-lg mb-3 bg-white shadow-sm"
              >
                <option value="random">随机主题</option>
                <option value="daily">日常生活</option>
                <option value="nature">自然世界</option>
                <option value="tech">科技现代</option>
                <option value="emotion">情感主题</option>
                <option value="action">动作主题</option>
              </select>
              <button
                onClick={() => navigator.clipboard.writeText(generateThemedWafflePrompt(selectedTheme))}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 border border-purple-400 text-white p-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
              >
                📋 复制主题提示词
              </button>
            </div>
          </div>
        </div>

        {/* AI响应验证 */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-purple-900 mb-4">🔍 AI响应验证</h4>

          <div className="space-y-4">
            <textarea
              value={aiResponse}
              onChange={(e) => onAiResponseChange(e.target.value)}
              placeholder="将AI生成的JSON响应粘贴到这里..."
              className="w-full h-48 p-4 border border-purple-200/80 rounded-xl bg-white/90 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
            <button
              onClick={onValidateAIResponse}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 border border-emerald-400 text-white p-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-md"
            >
              ✅ 验证并应用
            </button>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-200/80 shadow-sm">
        <h4 className="text-lg font-bold text-purple-900 mb-4">📖 使用说明</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <ol className="space-y-2 text-purple-800">
            <li className="flex items-start space-x-2">
              <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span>点击上方按钮复制提示词</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span>将提示词发送给AI（Claude、ChatGPT等）</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span>将AI返回的JSON响应粘贴到右侧文本框</span>
            </li>
          </ol>
          <ol className="space-y-2 text-purple-800" start={4}>
            <li className="flex items-start space-x-2">
              <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <span>点击"验证并应用"按钮</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <span>验证通过后，新谜题将自动加载</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
