# 考试系统前端项目

这是一个基于React + TypeScript + Vite构建的考试系统前端项目，适合React初学者学习和实践。

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ESLint

## 项目结构

```
├── src/                # 源代码目录
│   ├── api/           # API接口
│   ├── assets/        # 静态资源
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   └── utils/         # 工具函数
├── public/            # 公共资源
├── index.html         # HTML模板
└── package.json       # 项目配置
```

## 开发环境要求

- Node.js 16+
- pnpm 8+

## 快速开始

1. 安装依赖
```bash
pnpm install
```

2. 启动开发服务器
```bash
pnpm dev
```

3. 构建生产版本
```bash
pnpm build
```

## 主要功能

- 用户认证（登录/注册）
- 考试管理
- 在线答题
- 成绩查询

## 开发指南

### 目录说明

- `src/api`: 存放所有API请求
- `src/pages`: 按功能模块组织的页面组件
- `src/router`: 路由配置，使用React Router管理页面导航
- `src/utils`: 通用工具函数，包括请求封装等

### 代码规范

项目使用ESLint进行代码规范检查，确保代码风格统一。主要规则包括：

- React Hooks规则检查
- TypeScript类型检查
- 组件刷新优化

### 样式开发

项目使用Tailwind CSS进行样式开发，提供了丰富的原子化CSS类名，方便快速构建UI。

## 学习资源

- [React官方文档](https://react.dev)
- [TypeScript官方文档](https://www.typescriptlang.org/docs)
- [Vite官方文档](https://vitejs.dev)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
