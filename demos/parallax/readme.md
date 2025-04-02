# 纯前端实现图片伪3D视差效果 案例
## 项目介绍
这是一个基于 Web 技术实现的视差效果图像处理工具。该项目能够将普通 2D 图像转换为具有深度信息的视差效果图像，提供了沉浸式的视觉体验。
## 功能简介
1. 支持加载预设的图像及其深度图进行视差效果展示
2. 支持用户上传自定义图像，自动生成深度图并应用视差效果
## 模块介绍
1. 图片深度推理 (depthEstimator.js)
2. 视差效果渲染 (perspective.js)
```
parallax/
├── index.html          # 主 HTML 文件
├── package.json        # 项目依赖配置
├── vite.config.js      # Vite 构建配置
└── src/
    ├── app.js          # 应用主逻辑
    ├── perspective.js  # 视差效果渲染类
    ├── depthEstimator.js # 深度图生成算法
    └── style.css       # 样式文件
```