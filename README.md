# Python Comment Hover

通过 Pylance 的“跳转到定义”读取实际定义前的连续 `#` 注释，显示在引用的悬停提示中。支持类、方法、属性和函数局部变量；局部变量也支持赋值后紧跟三引号说明。

保存源代码后重新悬停即可更新，无需 JSON 配置。保留 Pylance 原有类型提示和文档。

## 安装

在 VS Code 执行 Extensions: Install from VSIX，选择随附 VSIX 文件。需要 Microsoft Pylance。

## 范围与限制

只读取定义前相同缩进的连续注释，不跨空行。当前支持简单赋值、self/cls 属性赋值和 def/class 定义。多行赋值、解构赋值、仅类型声明等复杂定义暂不提取。函数和类的原生 docstring 继续由 Pylance 显示。

根据实际定义区分同名成员；Pylance 无法解析对象类型、动态属性或多候选定义时也会有相应限制。多候选说明会一起显示并标注来源。注释按纯文本显示，不执行其中的链接或命令。

## 测试

运行 `node test.js`。打开 demo.py，分别悬停 first/second 内 count、user/order 的 save 和 name。

这是本地开发版本 0.1.0，未发布到 Marketplace。

## 开发与贡献

```sh
git clone https://github.com/mjxcn/python-comment-hover.git
cd python-comment-hover
npm test
npm run package
```

通过 VS Code 的 `Extensions: Install from VSIX` 安装打包产物。修改源码后重新打包、安装并重新加载窗口。欢迎提交 Issue 和 Pull Request。

`local-tools` 是当前本地扩展标识，并非已注册的 Marketplace 发布者；此项目尚未发布到扩展市场。

## 隐私

插件不发送网络请求、不执行 Python 源码、不收集遥测。它通过编辑器中的 Pylance 定义提供器解析符号，并在本地读取定义文件；文件不一定在当前工作区内。

## 验证情况

在 macOS VS Code + Pylance 中手工验证了不同函数中的同名局部变量、不同类中的同名方法和属性。自动测试覆盖注释提取，未替代完整的编辑器集成测试。

## 许可证

[MIT](LICENSE)
