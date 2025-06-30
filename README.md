# Waffle Solver

一个基于 Next.js 15 开发的智能单词谜题游戏，采用现代化的 Web 技术栈，提供优雅的用户体验和强大的 AI 辅助功能。

## ✨ 核心特性

- 🎮 **完整的 Waffle 游戏体验** - 通过交换字母位置形成有效单词
- 🎨 **优雅的动画系统** - 流畅的弧线交换动画和视觉反馈
- 🤖 **AI 智能建议** - 基于算法的最优解决方案推荐
- 🏛️ **经典谜题集** - 5个主题化的精选谜题，避免重复
- 📱 **现代化 UI** - 基于 shadcn/ui 的美观界面设计
- 🔔 **智能通知系统** - 右上角多层级 Toast 通知

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:3001
```

## 📚 完整文档

本项目采用完整的文档化管理，所有详细文档都位于 [`docs/`](./docs/) 目录：

### 📖 主要文档
- **[文档导航](./docs/README.md)** - 完整的文档目录和快速导航
- **[项目设置指南](./docs/guides/setup.md)** - 详细的环境配置和安装说明
- **[开发指南](./docs/guides/development.md)** - 开发规范、工作流和最佳实践

### 🎯 功能文档
- **[Toast 通知系统](./docs/features/toast-system.md)** - 右上角通知系统的设计和实现
- **[经典谜题集](./docs/features/classic-puzzles.md)** - 主题化谜题的设计理念
- **[动画系统](./docs/features/animation-system.md)** - 弧线动画和视觉效果
- **[AI 集成功能](./docs/features/ai-integration.md)** - AI 生成器和智能建议

### 📈 迭代规划
- **[项目路线图](./docs/iterations/roadmap.md)** - 整体发展规划和版本计划
- **[经典谜题集迭代](./docs/iterations/classic-puzzles-roadmap.md)** - 内容扩展的详细规划

## 🛠️ 技术栈

- **Framework**: Next.js 15 + App Router
- **Language**: TypeScript  
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: CSS Animations + React Transitions
- **State Management**: React Hooks
- **Notifications**: sonner + next-themes

## 🎮 游戏规则

Waffle 是一个单词交换谜题游戏：

1. **目标**: 通过交换字母位置，形成 6 个有效英文单词（3 横 3 纵）
2. **操作**: 点击两个字母位置进行交换
3. **提示**: 
   - 🟢 绿色：字母在正确位置
   - 🟡 黄色：字母存在但位置错误  
   - ⚫ 灰色：字母不在该单词中
4. **限制**: 最多 15 步完成谜题

## 📊 项目状态

- ✅ **v1.2 已发布** - 经典谜题集功能完成
- 🚧 **v2.0 开发中** - 主题扩展和难度系统
- 📋 **v3.0 规划中** - 社交功能和个性化推荐

## 🤝 贡献指南

1. 查看 [开发指南](./docs/guides/development.md) 了解开发规范
2. 阅读 [项目路线图](./docs/iterations/roadmap.md) 了解发展方向
3. 参考 [功能文档](./docs/features/) 了解现有实现
4. 遵循代码规范和提交规范

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

**🔗 更多信息请查看 [完整文档](./docs/README.md)** 