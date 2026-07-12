# ShipAudit 工作检查点

更新时间：2026-07-11（Asia/Singapore）

## 用户目标

在 `D:\Windsurf_Workspace\shipaudit` 从零构建 ShipAudit：面向 AI-built apps 的上线前安全检查与人工复核产品。

## 已完成

- 已将完整主规格复制到：
  - `docs/website-security-checkup-master-spec.md`
- 原文件与副本 SHA256 一致。
- 已将当前工作目录切换为：
  - `D:\Windsurf_Workspace\shipaudit`
- 已初始化独立 Git 仓库。
- 已建立 pnpm monorepo：
  - `apps/web`：Astro + React + Tailwind
  - `apps/worker`：Hono + Cloudflare Workers
  - `packages/contracts`：共享 TypeScript contracts
- 已完成阶段 -1 / 阶段 0 的首版：
  - 英文 ShipAudit 首页
  - `$99` founding review 预约表单（通过 mailto 工作，不保存数据）
  - 样例安全报告
  - 方法论与范围说明页
  - Worker `/api/health` 接口
  - 结构化 404 接口
  - Worker 单元测试
- 已显式允许 Astro/Cloudflare 必需的 `esbuild`、`sharp`、`workerd` 安装脚本。

## 已验证

- `pnpm typecheck`：通过，0 errors / 0 warnings / 0 hints。
- `pnpm test`：通过，Worker 2 tests passed。
- `pnpm build`：通过。
  - Astro 成功生成 3 个静态页面。
  - Worker dry-run bundle：64.19 KiB，gzip 15.58 KiB。
- 本地开发服务器曾成功运行于：
  - `http://127.0.0.1:4321/`
- 用户要求关机后，开发服务器已停止。

## 当前未完成

- 视觉截图检查尚未完成。
- 原因：`npx playwright` 可用，但 Playwright 1.61.1 对应浏览器二进制尚未安装。
- 未执行 `npx playwright install`，因为用户要求立即暂停并准备关机。
- 尚未执行真实扫描功能；这是有意遵守主规格的阶段顺序。
- 尚未部署 Cloudflare，也未配置正式域名、D1、Turnstile 或支付。

## 恢复后的下一步

1. 进入工作目录：

   ```powershell
   Set-Location -LiteralPath 'D:\Windsurf_Workspace\shipaudit'
   ```

2. 启动前端：

   ```powershell
   pnpm --filter @shipaudit/web dev --host 127.0.0.1 --port 4321
   ```

3. 安装 Playwright Chromium（需要网络）：

   ```powershell
   npx.cmd --yes playwright install chromium
   ```

4. 生成桌面和手机截图，检查：首页、样例报告、表单、移动端溢出。
5. 根据截图修复视觉问题，重新运行：

   ```powershell
   pnpm typecheck
   pnpm test
   pnpm build
   ```

6. 阶段 -1 页面确认后，再决定：
   - 先部署 Landing Page 验证付费需求；或
   - 进入主规格“阶段 1：输入和 SSRF 防护”。

## 重要约束

- 不要一次实施多个阶段。
- 阶段 1 必须先完成 SSRF/DNS/重定向安全测试，再进入扫描规则。
- 免费公共扫描不探测 `.env`、`.git/config`、API 权限或其他敏感路径。
- 核心评分必须为确定性代码，不能依赖 LLM。
- 当前 mailto 联系地址为 `hello@laws3.net`，恢复后应确认这是用户希望公开使用的邮箱。

