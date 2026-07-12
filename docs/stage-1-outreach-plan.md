# ShipAudit 阶段 -1 唯一获客实验冷开发（Outreach）执行指南

根据 ShipAudit 主规格书设计，阶段 -1 的唯一目标是通过 **一对一定向冷触达（Cold Outreach）** 来验证市场对 `$99` 创始专家复核服务的真实付费需求。本指南规定了具体的客户筛选流程、冷触达话术模板以及数据追踪规范。

---

## 1. 目标客户画像与筛选标准

为确保高转化率与合规性，第一批 10 个目标客户必须满足以下所有标准：

1. **地理与语言定位**：仅针对**英文市场**（主要是欧美地区）的创始人。
2. **产品类型**：最近 30 天内准备上线或刚上线（Launch 阶段）的 **AI-built App** 或由独立开发者（Indie Hacker）构建的 Web 应用（如使用 Lovable, Bolt.new, Replit, Cursor 等工具快速生成的项目）。
3. **触达前安全检查（敲门砖）**：
   * **严禁行为**：不得进行任何未授权的主动漏洞利用、端口扫描、目录爆破、或者是登录后的敏感路径探测。
   * **允许行为**：仅观察公开的 HTTP 响应头、Cookie 属性、及静态 HTML/JS 中显式暴露的信息（如 Source Map 是否未关闭，是否缺失安全响应头如 HSTS, CSP, X-Frame-Options 等）。
   * **价值先导**：找到一个确定的、公开可见的安全配置小缺失，作为触达时的“免费安全预警提示”。

### 1.1 如何在社交媒体和社区高效搜寻目标
以下是推荐使用的具体搜索指令和平台：

* **Twitter/X 搜寻关键词**：
  * `"built with lovable" min_faves:1`
  * `"just launched my AI app" OR "launched my project"`
  * `"bolt.new project" OR "built with bolt.new"`
  * `"deployed to vercel" cursor app`
* **Product Hunt**：
  * 每日榜单（Launch Today）中，点进产品的 Landing Page，查看其技术栈和 HTTP 头。
* **Indie Hackers / Reddit (r/sideproject, r/saas)**：
  * 寻找发帖抱怨 "security worries"、"exposed env keys" 或者分享 "just shipped a new app" 的用户。

### 1.2 零干扰、零入侵排查命令（工具库）
在触达前，我们只需要使用基本的、合法的网络检测工具，**千万不要进行端口扫描**：

```bash
# 1. 检查安全头（Headers）与服务器信息
curl -I -sS https://target-app.com

# 2. 检查静态资源的 JS Source Map 是否暴露（在浏览器 DevTools Network 中查看，或用 curl 测试是否存在 .map 后缀）
curl -I -s -o /dev/null -w "%{http_code}" https://target-app.com/assets/index.js.map
# 若返回 200，说明 Source Map 暴露，任何人都能反编译其前端源码

# 3. 检查敏感的 Cookie 属性是否缺少 Secure 或 HttpOnly
curl -i -s https://target-app.com | grep -i "Set-Cookie"
```

---

## 2. 触达渠道选择

* **首选渠道**：冷邮件（Email Outreach，发信箱：`security@laws3.net`）
* **备选渠道**：Twitter/X 创始人私信（DM）、或 Indie Hackers/Product Hunt 社区私信。
* *注：微信公众号等中文国内渠道当前不在阶段 -1 的主获客漏斗中。*

---

## 3. 定向触达模板

### 3.1 电子邮件模板（Cold Email）

**发件人**：`Your Name <security@laws3.net>`
**主题**：Observable security configuration gap on [AppName] / Quick suggestion

```text
Hi [Founder Name],

Congrats on launching [AppName]! I came across your project and love what you've built.

While reviewing the public HTTP surface of your landing page, I noticed a minor security configuration gap that is often overlooked in early production builds:

Your site seems to be [exposing JS source maps / missing basic security headers such as Content-Security-Policy (CSP) or Strict-Transport-Security (HSTS)]. This makes the build more transparent than necessary. 

If you want, I can send over the exact configuration details to help you patch this up.

For context, I'm [Your Name], building ShipAudit. We help AI-assisted apps and indie projects ensure pre-launch HTTP security hygiene before scaling. Today, we are offering a hands-on "Founding Expert Review" for $99. It includes a comprehensive manual check on your session configs, SSRF risks, and authorization boundaries — with zero automated scanner noise.

Let me know if you want the details for the [source maps / headers] fix, or if you'd like us to run a full review of your setup.

Best regards,

[Your Name]
ShipAudit Founder
security@laws3.net | https://www.laws3.net
```

### 3.2 针对特定配置缺失的细化模板

#### 模板 A：JS Source Map 泄露（最常见的 AI 代码生成弊端）
**主题**：Security alert: Exposed frontend source code on [AppName]

```text
Hi [Founder Name],

Congrats on shipping [AppName]! 

While browsing your site, I noticed that the production Javascript build has Source Maps enabled and publicly accessible (e.g., [Exact JS file URL].map). 

This means anyone can easily reverse-engineer your client-side source code, see your folder structure, and inspect your API calling logic in plain English. 

I’ve compiled a quick step-by-step guide on how to turn this off in your bundler (Vite/Webpack/Next.js). Let me know if you'd like me to send it over.

For context, I run ShipAudit (https://www.laws3.net) where we review pre-launch HTTP hygiene for indie and AI-assisted apps. We're currently doing $99 Founding Expert Reviews (limited to 10 slots) to manually check endpoints, public cookies, and Supabase RLS policies before launch.

Let me know if you want the source maps fix info!

Best,
[Your Name]
```

#### 模板 B：缺失关键安全响应头 (HSTS / CSP / X-Frame-Options)
**主题**：Observable security headers missing on [AppName]

```text
Hi [Founder Name],

I was checking out [AppName] after seeing your launch. It looks really clean!

I did a quick, passive check on your HTTP response headers and noticed that basic Clickjacking and Protocol security headers are missing:
- No Strict-Transport-Security (HSTS)
- No Content-Security-Policy (CSP)
- No X-Frame-Options (making the app iframeable elsewhere)

It takes less than 10 minutes to configure these on Vercel/Netlify/Cloudflare. I can write down the exact lines you need to add to your config files if you'd like.

I'm building ShipAudit (https://www.laws3.net) to help indie founders audit their public surface security configs for a flat $99 (no subscription, just a manual checklist review by a human). 

Let me know if you want the config snippets for the security headers!

Best,
[Your Name]
```

#### 模板 C：Cookie 缺少 Secure 或 HttpOnly 保护
**主题**：Quick heads-up regarding session cookies on [AppName]

```text
Hi [Founder Name],

Congrats on launching [AppName]!

While testing your public page response, I noticed your session/authentication cookies seem to be missing the [HttpOnly / Secure / SameSite] flag. Without these, the session identifiers are accessible to client-side scripts, increasing XSS risks.

I can share the code snippet to enforce secure cookie configuration for your tech stack. Just let me know.

I'm the founder of ShipAudit (https://www.laws3.net) where we provide pre-launch security reviews for $99. Let me know if you want the secure cookie fix or want us to do a wider review!

Best,
[Your Name]
```

### 3.3 Twitter/X 创始人私信模板（Short DM）

```text
Hi [Founder Name], love what you've built with [AppName]!

Quick heads-up: I noticed your production build is [exposing JS source maps / missing CSP security headers]. It's a very common early-stage setup issue.

If you'd like, I can drop the exact details on how to fix it here.

For context, we are running ShipAudit (www.laws3.net) helping early-stage apps audit pre-launch security configurations. We also do a $99 hands-on expert review covering SSRF risks and endpoint auth.

Let me know if you want the fix info!
```

---

## 4. 触达数据追踪看板 (Outreach Tracker)

每次触达都必须详细记录，以便在第 4 周进行门禁（Gate A）评估。请使用以下表格进行记录：

| 编号 | 创始人姓名 | 触达渠道/来源 | 触达日期 | 真实域名/项目名 | 上线时间 | 发现的公开配置问题 | 回复状态 | 是否形成高质量意向 | 是否付款 | 拒绝原因/担忧 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 01 | | | | | | | | | | |
| 02 | | | | | | | | | | |
| 03 | | | | | | | | | | |
| 04 | | | | | | | | | | |
| 05 | | | | | | | | | | |
| 06 | | | | | | | | | | |
| 07 | | | | | | | | | | |
| 08 | | | | | | | | | | |
| 09 | | | | | | | | | | |
| 10 | | | | | | | | | | |

---

## 5. 阶段 -1 门禁要求 (Gate A & B Check)

根据主规格书，项目推进需严格对照门禁：

1. **Gate A（阶段 -1 验证成功门禁）**：两周内完成 20 次定向触达（第一周 10 次，第二周 10 次）。
   * **通过标准**：8 周内产生 **2 笔** 专家复核付款（每笔 `$99`）。
   * **未通过处理**：继续停留在阶段 -1，修改受众、文案或报价，**绝不提前编写后续的自动扫描器或主平台代码**。
2. **交付说明透明度**：此阶段无自动扫描。向客户交付时，必须使用公开工具、确定性清单和人工审计，并在交付报告中显式注明：`This is a manual expert review report.`
