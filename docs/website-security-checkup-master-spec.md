# 网站安全体检平台：产品与实施主规格

版本：1.1  
日期：2026-07-12  
目标执行者：GPT-5.6 low、GLM-5.2 或其他代码代理  
建议英文产品名：ShipAudit  
验证期建议副标题：Pre-launch HTTP security hygiene for web apps  
验证期产品地址：`security.laws3.net`；这是 Laws3 下的验证期子域名，不是独立品牌域名。第一笔真实付款后或广泛公开发布前（以先发生者为准）再决定并购买独立品牌域名
公开客户、安全与退款联系邮箱：`security@laws3.net`；`admin@laws3.net` 仅用于 Creem、Stripe、Cloudflare 和其他基础设施账号，不作为客户联系地址

v1.1 决策摘要：增加商业门禁、冻结验证期 SKU、明确报告类型与防伪边界、降低 CSP 权重、补充 DNS rebinding 测试、冻结 Chrome 扩展为非 MVP，并给出 2026-07-12 起四周的唯一执行顺序。

## 1. 执行原则

本文件是唯一需求基线。编码代理必须一次只执行一个阶段，完成测试和验收后才能进入下一阶段。

不得自行扩大扫描范围，不得增加端口扫描、漏洞利用、目录爆破、弱口令测试、SQL 注入测试、Nuclei 模板或其他主动攻击能力。

核心扫描、评分和修复建议必须由确定性代码产生。大模型只能对已经产生的 finding 做中文归纳，不得判断是否存在未检测到的漏洞，不得编造法规、漏洞或合规结论。

MVP 是“公开网站的被动配置体检”，不是渗透测试、漏洞扫描、等保测评或安全认证。

## 2. 产品决策

### 2.1 目标用户

首批用户按优先级排序：

1. 使用 Lovable、Bolt、Replit、Cursor、Windsurf 等快速上线应用的英文市场 indie developer。
2. 使用 Supabase、Firebase、Vercel、Netlify 或 Cloudflare 的小型 SaaS 团队。
3. 准备在 Show HN、Product Hunt、Reddit 或 X 发布产品，但没有专职安全人员的创始人。
4. 中国出海独立开发者和外贸 SaaS 团队，作为第二批用户。

### 2.2 核心价值主张

用户输入一个公开域名，在 10 秒左右得到：

- 0-100 分的可解释安全配置得分。
- 按“立即修复、近期改进、建议优化”分类的问题清单。
- 每个问题的证据、风险、修复方法和参考资料。
- 面向非安全人员的中文解释。
- 可分享、可打印的报告链接。

网站相对 Linux/Windows 本地安全工具的价值不在于扫描能力更强，而在于：

- 不安装、不配置，非安全开发者可以立即使用。
- 把多个检查结果统一成上线优先级，而不是输出大量原始告警。
- 针对 AI-built app、Supabase/Firebase 和常见托管平台提供具体解释。
- 提供可分享、带日期和范围的上线检查记录。
- 允许购买人工去误报、修复排序和专家复核。

熟悉 Nmap、Nuclei、ZAP、Burp Suite、testssl.sh 和 Linux 安全工具的专业人员不是核心付费用户。

验证期必须把“AI-built”作为目标用户限定，而不是声称产品已经具备 AI 专项扫描能力。在第 7.5 节规定的至少三项 AI-built 被动特色检查真实上线并出现在报告前，首页主标题和付费说明必须优先描述 HTTP security hygiene、公开配置检查与人工复核；可以在次级文案中说明服务面向 Lovable、Bolt、Replit、Cursor 等工具的使用者。

阶段 -1 不得暗示 ShipAudit 自有自动扫描器已经上线。人工复核可以使用公开工具、确定性清单和人工取证，但页面必须明确当前交付方式。

不得使用“检测网站是否安全”作为绝对承诺。推荐文案：

> 检查公开网站的 HTTPS、安全响应头、Cookie 和页面资源配置，帮助发现常见的外部配置风险。本结果不等同于漏洞扫描或合规认证。

### 2.3 商业假设

本产品不是以“在线扫描器比本地工具更强”为商业假设。需要验证的是：

> 没有安全经验的 AI 应用开发者，是否愿意为节省配置时间、减少误报、获得上线前优先级和可信人工复核付费。

收入优先级：

1. 人工专家复核和有限范围的产品化服务。
2. 已验证域名的自动 Launch Check。
3. 持续监控和变化提醒。
4. 免费扫描器本身不承担主要收入，只负责获客和建立信任。

纯自动扫描器很可能只能成为练手项目。只有当它能持续为人工复核、监控或代码审查带来订单时，才视为商业产品。

### 2.4 MVP 成功指标

以下指标分为硬门禁和诊断指标，不能再以“任意满足四项”替代商业验证。

硬门禁：

- **Gate A，允许进入阶段 1 safe-fetch：** 至少获得 1 笔已完成付款的 Founding Expert Review；或者获得 5 个高质量付费意向。高质量付费意向必须同时包含真实域名、预计上线时间、明确希望购买的交付物，以及至少一轮可回复的双向邮件沟通；等待列表注册、点赞和单向 mailto 不计入。
- **Gate B，允许进入阶段 2 完整规则引擎与评分：** 至少 1 笔 Founding Expert Review 已付款、完成书面交付并记录客户反馈。0 笔真实付款时不得实现完整规则引擎、评分落库、监控或徽章。
- **8 周商业成功条件：** 至少 2 笔已付款的专家复核订单。扫描量、邮箱量、等待列表和社交曝光不能替代该条件。若 8 周内未达成此目标，项目判定失败并强制下线清空。
- **监控与徽章开发门禁：** 至少 5 笔已付款的自动 Launch Check，或 50 个完成所有权验证且存在持续使用证据的域名；并且阶段 6 已完成复盘。在此之前只保留规格，不实施。

公开测试后的诊断指标：

- 500 次有效扫描。
- 100 个不同有效域名。
- 50 个邮箱或报告领取行为。
- 10 个完成所有权验证的域名。
- 5 个自动 Launch Check 订单。
- 2 个专家复核订单。
- 10 次有效报告分享；徽章在门禁前不计入指标。
- 至少 10 名用户完成反馈。

若前两周完成第 2.8 节的 20 次定向触达后仍未达到 Gate A，继续停留在阶段 -1，修改受众、报价或人工交付说明，不进入扫描开发。若 8 周内没有 2 笔专家复核付款，判定当前商业假设未验证；即使扫描量达标，也停止监控、徽章、扩展和更重基础设施的开发。

### 2.5 阶段门禁的工程许可范围

- Gate A 之前只允许：landing page、样例报告、方法论、范围与隐私页面、支付链接、成功页、订单人工记录、访谈和人工复核模板。
- 达到 Gate A 后只允许进入阶段 1：target normalizer、DNS/SSRF validator、manual redirect fetcher、body/header cap、timeout 与安全测试；不得提前加入评分、D1 报告存储、监控或徽章。
- 达到 Gate B 后才允许进入阶段 2：确定性规则引擎、finding schema 和评分。阶段 1 与阶段 2 仍必须分开验收。
- 产品负责人若书面豁免门禁，必须在仓库决策记录中写明证据、预算、允许范围和停止条件；编码代理不能自行豁免。

### 2.6 报告类型与可信边界

- `sample_report`：明确标注 Example data only，不表示真实目标已被检查。
- `public_baseline`：仅由 ShipAudit 服务端对公开目标执行被动检查后生成；不代表域名所有权已验证。
- `verified_launch_check`：完成域名所有权验证后，由服务端在授权范围内生成。
- `expert_review`：人工书面交付，引用服务端证据或阶段 -1 的公开工具证据，并列出人工判断、未知项和限制。
- `local_diagnostic`：只为未来可能的本地工具或浏览器扩展保留；不得使用 ShipAudit Verified 徽章，也不得冒充服务端报告。

任何可公开验证、带徽章或带 ShipAudit 签名的自动报告必须由服务端生成。报告必须显示报告类型、规范化目标、UTC 时间戳、规则版本、明确范围、未检查事项、过期时间和 ShipAudit 域名上的验证链接。公开 token 至少 128 bit 随机度，不得使用可枚举 ID。截图或本地导出本身不构成防伪证明。

服务端只保存生成 finding 所需的最小化、规范化证据；不得保存完整 HTML、Cookie 值或用户提交的凭据。徽章只能链接到仍有效的服务端报告。

### 2.7 Chrome Extension（Not in MVP）

1. 当前阶段禁止创建 Chrome 扩展目录、manifest、商店素材或扩展专用 license 流程。
2. 只有在阶段 6 完成后，且记录到至少 10 名相互独立的目标用户明确请求 localhost、preview 或登录后页面诊断，并提供具体使用场景，才允许重新立项评估。
3. 若未来实施，必须默认用户主动触发、最小权限、本地处理和显式上传；不得以 `<all_urls>` 作为未经论证的默认权限。
4. 扩展结果只能标记为 `local_diagnostic`；任何 `verified_launch_check`、徽章或专家签名仍需服务端独立取证。
5. 登录态内容、Cookie、页面正文和浏览历史不得自动上传；任何新增数据处理必须重新审查隐私政策和 Chrome Web Store 要求。

### 2.8 阶段 -1 唯一获客实验

阶段 -1 只执行英文定向 outreach，不并行执行 Show HN、Product Hunt、广泛 SEO 或付费广告实验。

- 对象：最近 30 天内准备上线或刚上线的 AI-built app 英文市场创始人。
- 数量：连续两周，每周 10 个一对一、人工筛选的目标，共 20 个。
- 报价：第 12.1 节定义的 `$99` Founding Expert Review。
- 每次触达记录：目标、来源、触达日期、回复、真实域名、上线时间、主要担忧、是否形成高质量意向、是否付款和拒绝原因。
- 可以免费指出一个公开配置问题作为示例，但不得恐吓、披露敏感细节或执行未授权的敏感路径和 API 检查。
- 唯一推荐获客渠道选定为冷邮件（Outreach），微信公众号等国内中文渠道不作为当前主漏斗。

## 3. 明确不做的功能

MVP 不实现：

- 任意端口扫描、服务识别或操作系统指纹。
- 漏洞利用、注入、目录枚举、爬虫式全站扫描。
- 登录后扫描、提交用户 Cookie 或 Authorization header。
- API 安全审计。真正的 API 审计需要 OpenAPI 定义、端点范围和明确授权。
- SSL Labs 级别的完整协议、证书链和密码套件测试。
- “等保 2.0 合规”“GDPR 合规”或任何认证结论。
- 自动修复用户网站。
- “无限扫描”套餐。
- 服务端生成复杂 PDF。MVP 使用打印友好 HTML，让浏览器另存为 PDF。

所有首页、定价页、样例报告和真实报告必须遵守以下诚实边界：

- 必现声明：`ShipAudit measures observable HTTP security hygiene within the stated scope. It is not a vulnerability scan, penetration test, compliance assessment, or security certification.`
- 分数旁必现副文案：`Configuration hygiene score — not proof that the application is secure.`
- 禁止结论文案：`Your app is safe`、`No vulnerabilities`、`Passed security`、`Certified Secure`、`Security Approved`、`Compliant`、`Passed Penetration Test`，以及中文同义表达。
- 可以描述某一具体检查为 `pass`，但不得把局部通过写成整个应用“安全通过”。
- 阶段 -1 页面必须区分样例数据、人工复核和尚未上线的自动能力；不得使用未来功能的完成时态误导购买者。

公开免费扫描与已验证扫描必须分层：

| 能力 | 公开免费扫描 | 验证域名所有权后 |
|---|---:|---:|
| HTTPS、Headers、Cookie | 是 | 是 |
| 首页内联脚本中的疑似敏感信息 | 是 | 是 |
| 首页引用的外部 JS 静态分析 | 否 | 是，限制数量和大小 |
| `/.env`、`/.git/config` 等敏感文件探测 | 否 | 可进入受控白名单 |
| 页面中已明确出现的 source map 线索（不下载 map） | 是 | 是 |
| 未引用 source map 枚举 | 否 | 可进入受控白名单 |
| API CORS 和认证配置检查 | 否 | 用户明确提供 API base URL 后执行 |
| Supabase/Firebase 数据权限测试 | 否 | 明确授权和范围后执行 |
| AI prompt injection/system prompt extraction | 否 | 仅人工复核且单独授权 |

## 4. GitHub 现有实现与复用策略

### 4.1 可以参考的项目

| 项目 | 状态与许可证 | 用途 | 决策 |
|---|---|---|---|
| `fedlinllc/security-headers-scanner` | MIT，Cloudflare Worker，约 19KB 单文件 | Worker 请求、响应头检查、基础评分 | 可参考或复用部分规则，但不可原样部署 |
| `mdn/mdn-http-observatory` | MPL-2.0，活跃维护 | Observatory v4 评分和公开 API | 优先参考测试定义与 API；避免直接复制大段代码 |
| `mozilla/http-observatory` | MPL-2.0，已归档 | 历史算法 | 只作历史参考，使用 MDN 新仓库 |
| `koenbuyens/securityheaders` | Apache-2.0 | CSP、CORS、响应头测试思路 | 参考测试场景，注意部分标准已过时 |
| `internetstandards/Internet.nl` | Apache-2.0，活跃 | DNSSEC、DMARC、SPF、HTTPS 等完整体系 | 架构过重；未来可调用 API 或借鉴说明文字 |
| `ssllabs/ssllabs-scan` | Apache-2.0 | SSL Labs API 客户端 | v2 可选外部依赖，不放进 MVP 核心路径 |
| `testssl/testssl.sh` | GPL-2.0 | 深度 TLS 扫描 | 未来独立扫描节点参考，不嵌入 Worker MVP |
| `projectdiscovery/httpx` / `nuclei` | MIT | 主动探测和漏洞扫描 | 不用于 MVP；需要授权证明、独立主机和滥用治理 |

### 4.2 为什么不直接 fork 现有 Worker

`fedlinllc/security-headers-scanner` 是最接近的实现，但当前版本存在商业上线风险：

- 接受任意 URL，而不是只接受规范化公开域名。
- 自动跟随重定向，未逐跳检查目标主机。
- 没有完整 SSRF 防护、Turnstile 和速率限制。
- 读取完整 HTML，未设置响应体上限。
- 返回原始响应头，可能暴露不必要信息。
- `Access-Control-Allow-Origin: *`，容易被第三方站点消耗额度。
- 没有测试、前端、D1、缓存、审计事件和隐私策略。
- Cookie 处理可能只分析合并后的单个 `set-cookie` 值。

推荐路线：创建自己的 TypeScript 项目，保留 MIT 项目 attribution，重新实现输入、安全边界、评分和 UI。若复制具体代码，必须在 `THIRD_PARTY_NOTICES.md` 中记录来源和许可证。

## 5. 技术架构

### 5.1 技术栈

- 语言：TypeScript，开启 `strict`。
- 前端：Astro 静态页面 + React islands + Tailwind CSS。
- API：Hono on Cloudflare Workers。
- 静态部署：Cloudflare Workers Static Assets 或 Pages。
- 数据库：Cloudflare D1。
- 缓存：Cloudflare KV；若初期不希望创建 KV，可先用 Cache API。
- 防机器人：Cloudflare Turnstile。
- 分析：Cloudflare Web Analytics + 自定义匿名 funnel events。
- 测试：Vitest + Miniflare/Workers test pool + Playwright。
- 部署：Wrangler，`dev`、`staging`、`production` 三套环境变量。
- 管理端：Cloudflare Access 保护的只读管理页面。

不要使用 Next.js；MVP 不需要其复杂度。不要引入重量级 UI 框架。图标使用 Lucide。

### 5.2 Cloudflare 平台约束

设计和测试必须以当前 Workers Free 限制为基线：每天 100,000 次请求、每次 HTTP 请求 10 ms CPU、50 个 subrequest、6 个同时等待建立的外连和 128 MB 内存。

等待 `fetch`、D1 或 KV 不计入 CPU 时间，但 HTML 解析、CSP 解析、IP 地址判断和 JSON 序列化会计入。实现必须避免通用 DOM、复杂正则回溯和大型依赖。若真实数据表明稳定超过免费 CPU 限制，优先升级约 5 美元/月的 Workers Paid，而不是削弱 SSRF 检查。

验证期 Cloudflare 基础设施硬预算上限为每月 `$10`，不含域名、支付通道费和人工成本。从 Free 升级 Paid 必须同时满足：已达到 Gate A；使用自有或明确授权目标完成可复现的性能记录；失败或延迟的主要原因确为 Free 层 CPU/subrequest 限制。升级决定和前后数据必须记录。预计超过 `$10/月` 时停止扩容并由产品负责人书面决定，不得通过移除 SSRF、响应上限、速率限制或日志脱敏来换取低成本。

阶段 1 必须先用最小 safe-fetch 原型测量 DNS、重定向、header 读取和 512 KiB 截断的 CPU 与墙钟时间。阶段 2 的 CSP、Cookie 和 HTML 规则必须分别记录基准；不得在零测量的情况下假定 Free 层可行。

Workers 的普通 `fetch` 不提供 SSL Labs 级别的完整证书链、协议和密码套件信息。MVP 只判断 HTTPS 是否能够由平台正常建立连接，不宣传“完成 TLS 深度审计”。

MDN Observatory 公共 API 可用于开发期对照评分，但有按 host 冷却和返回信息限制。产品核心扫描不得依赖其可用性，也不得把 MDN 的分数冒充为本产品独立检测结果。

Cloudflare 免费全球网络不等同于 Cloudflare 中国网络，不能承诺中国大陆所有运营商的固定延迟。首版面向中文用户，但按全球站点部署和测试。

### 5.3 推荐目录结构

```text
website-security-checkup/
  apps/
    web/
      src/pages/
      src/components/
      src/layouts/
      public/
    worker/
      src/index.ts
      src/routes/
      src/scanner/
      src/security/
      src/storage/
      src/ai/
      test/
  packages/
    contracts/
    rules/
    ui/
  migrations/
  e2e/
  docs/
  wrangler.jsonc
  THIRD_PARTY_NOTICES.md
  README.md
```

### 5.4 数据流

```text
用户输入域名
  -> Turnstile 验证
  -> 输入规范化
  -> DNS 和 SSRF 校验
  -> KV/Cache 查询
  -> 手动执行最多 5 次重定向
  -> 采集响应头和最多 512 KiB HTML
  -> 确定性规则分析
  -> 确定性评分
  -> D1 保存脱敏结果
  -> 返回报告 token
  -> 可选调用 GLM 生成管理层摘要
```

扫描过程不得保存页面完整 HTML，不得保存 DNS 原始报文，不得记录用户提交的 Turnstile token。

## 6. 网络与 SSRF 安全规范

这是项目最高优先级，必须先于扫描功能实现。

### 6.1 输入限制

MVP 输入框提示“请输入域名”，只接受：

- `example.com`
- `www.example.com`
- 用户粘贴 `https://example.com/path` 时，仅提取 hostname，并提示 MVP 只扫描首页。

拒绝：

- IP 地址，包括十进制、十六进制、IPv4-mapped IPv6 等变形。
- 用户名和密码形式的 URL。
- 自定义端口。
- `localhost`、`.local`、`.internal`、`.localhost`、`.test`、`.invalid`。
- 控制字符、超长 hostname、空 label、非法 IDN。
- 当前产品域名及其 Worker 域名，防止自调用循环。

只允许访问目标 hostname 的端口 80 和 443。

### 6.2 DNS 校验

每次网络请求前查询 A 和 AAAA 记录。所有返回地址必须是公开可路由地址。

拒绝以下范围及其 IPv6 对应范围：

- `0.0.0.0/8`
- `10.0.0.0/8`
- `100.64.0.0/10`
- `127.0.0.0/8`
- `169.254.0.0/16`
- `172.16.0.0/12`
- `192.0.0.0/24`
- `192.0.2.0/24`
- `192.168.0.0/16`
- `198.18.0.0/15`
- `198.51.100.0/24`
- `203.0.113.0/24`
- `224.0.0.0/4`
- `240.0.0.0/4`
- IPv6 loopback、link-local、unique-local、documentation、multicast 和 IPv4-mapped private address。

若域名同时解析到公开和私有地址，整个扫描失败，不选择其中一个继续。

DNS rebinding 必须作为阶段 1 的显式威胁处理：

- 解析并验证完整 CNAME、A 和 AAAA 结果；任一链路或答案出现私有、保留、文档、link-local 或 metadata 目标即失败。
- 每次实际 `fetch` 前立即重新解析和验证，不跨扫描复用 DNS 安全判定；重定向到新 hostname 时重新执行完整流程。
- 测试必须覆盖同一 hostname 第一次返回公网地址、第二次返回私网地址，以及公网/私网混合答案；全部必须 fail closed。
- Cloudflare Workers 若无法暴露实际连接 IP 或绑定已验证解析，阶段 1 必须记录平台残余风险、可用防护和实测结论。无法形成可接受的 fail-closed 方案时，不得开放任意公众目标扫描，也不得跳过 DNS 检查继续开发规则引擎。

### 6.3 重定向

`fetch` 必须使用 `redirect: "manual"`。最多允许 5 跳。

每一跳都必须：

1. 解析相对 Location。
2. 只允许 `http:` 或 `https:`。
3. 禁止 credentials 和自定义端口。
4. 对新 hostname 重新执行 DNS/SSRF 校验。
5. 记录跳转证据，但不向用户展示完整敏感 query。

### 6.4 请求限制

- 总扫描墙钟时间目标 10 秒，单请求使用 `AbortSignal.timeout`。
- HTML 只读取前 512 KiB，超出立即取消 stream。
- 扫描器最多处理 128 个响应 header、64 KiB 规范化 header 总量、单个 header 值 8 KiB 和 50 个 `Set-Cookie` 项；超出时停止解析并标记为 `unknown` 或明确的响应过大错误，不进入复杂规则。
- 只解析 `text/html` 或 XHTML；其他类型只分析响应头。
- 不发送 Cookie、Authorization、Referer 或用户自定义 header。
- 固定透明 User-Agent，包含产品主页 `https://security.laws3.net` 和联系邮箱 `security@laws3.net`。
- 每次扫描最多 8 个外部 subrequest。
- CORS 只允许自身正式域名和本地开发地址，禁止生产环境 `*`。

### 6.5 速率限制

建议初始限制：

- 匿名 IP：10 次/小时、30 次/天。
- 同一目标域名：1 次/5 分钟；命中时返回缓存报告。
- 同一浏览器会话：5 次/15 分钟。
- Turnstile 验证失败：直接拒绝，不执行 DNS 或 fetch。

不得把完整客户端 IP 存入 D1。需要持久化时使用每日轮换 secret 的 HMAC hash。

## 7. 扫描规则与评分

### 7.1 总体模型

总分 100，分为四类：

- HTTPS 与传输安全：35 分。
- 浏览器安全策略：40 分。
- Cookie 安全：15 分。
- 页面资源安全：10 分。

附加信息检查不计分：`security.txt`、CAA、DNSSEC、SPF、DMARC、Server banner。这样避免把邮件配置与网站主分数混在一起。

等级：

- A：90-100
- B：75-89
- C：60-74
- D：40-59
- F：0-39

严重度：`critical`、`high`、`medium`、`low`、`info`。

MVP 不引入 marketing/app 等站点 profile，也不让用户选择会改变分数的类型。所有目标使用同一套可解释基线，通过 `not_applicable`、`unknown` 和上下文说明减少误导。完成至少 20 份自有或授权报告并记录人工复核差异后，才允许基于数据重新评估权重或 profile；不得为提高展示分数临时调权。

### 7.2 核心规则表

| ID | 检查 | 分值 | 判断摘要 |
|---|---|---:|---|
| TLS-01 | HTTPS 可访问 | 15 | HTTPS 成功；证书失败或连接失败记 0 |
| TLS-02 | HTTP 跳转 HTTPS | 8 | HTTP 首页应通过 301/302/307/308 最终到 HTTPS |
| TLS-03 | HSTS | 12 | 存在且 max-age >= 15552000；includeSubDomains 和 preload 作为加分档 |
| HDR-01 | CSP | 14 | 存在有效策略；检查 default-src、object-src、base-uri、frame-ancestors、unsafe-eval、宽泛 wildcard；缺失不应被描述为等同于已存在可利用漏洞 |
| HDR-02 | 防 iframe 嵌入 | 7 | CSP frame-ancestors 优先；X-Frame-Options 为兼容信号 |
| HDR-03 | X-Content-Type-Options | 5 | 必须为 `nosniff` |
| HDR-04 | Referrer-Policy | 5 | 推荐 strict-origin-when-cross-origin、same-origin 或 no-referrer |
| HDR-05 | Permissions-Policy | 3 | 存在且无明显宽泛敏感能力授权 |
| HDR-06 | Cross-origin headers | 6 | COOP/CORP/COEP 按适用性提示；不要求所有站点全部启用 |
| CK-01 | Secure | 5 | HTTPS 下所有会话类 Cookie 应有 Secure |
| CK-02 | HttpOnly | 4 | 疑似会话 Cookie 应有 HttpOnly |
| CK-03 | SameSite | 4 | 必须显式；`None` 必须同时 Secure |
| CK-04 | Cookie 范围 | 2 | 检查过宽 Domain、Path 和推荐 `__Host-`/`__Secure-` 前缀 |
| CNT-01 | Mixed active content | 6 | HTML 中 script、iframe、form action 不应使用 HTTP |
| CNT-02 | 外部脚本 SRI | 2 | 仅作建议；动态第三方脚本不应被错误判定为高危 |
| CNT-03 | 不安全表单提交 | 2 | HTTPS 页面中的 form action 不得提交到 HTTP |

### 7.3 N/A 处理

没有 Set-Cookie 时，Cookie 类别标记为 `not_applicable`，不展示“全部 Cookie 安全”。总分计算时将其他三类按比例归一到 100。

某项因为网络错误、content-type 或平台限制无法检查时，标记 `unknown`，不得按失败扣分。

### 7.4 附加检查

以下检查不进入主分数：

- `/.well-known/security.txt` 是否存在、是否符合基本格式。
- CAA DNS 记录。
- DNSSEC 是否可验证；若 Worker 内实现困难，MVP 可暂缓。
- 若存在 MX：SPF 与 DMARC；默认以折叠的 `info` 区域展示，不进入网站主分数。没有 MX 时不执行、不展示。DKIM 需要 selector，除非用户提供，否则不声称检测。
- `Server`、`X-Powered-By` 等技术暴露，仅作 low/info。
- HTTP 响应状态、重定向链长度、页面大小。

### 7.5 AI-built app 专项检查

以下检查作为 ShipAudit 差异化能力，初期不进入主分数，避免误报扭曲基础评级。

在首页把 “AI-built” 用作自动能力主叙事前，免费报告必须至少真实上线以下三类被动特色检查；它们只能使用本次扫描已经按上限取得的首页 HTML、内联脚本和响应 header，不得为满足营销要求增加目录枚举、敏感路径请求或未引用资源抓取：

1. 高置信度服务端 secret 模式检测与严格脱敏。
2. 明确出现的 source map 引用、localhost、开发或 staging endpoint、debug 标志；免费层只报告已观察到的引用，不枚举或下载未授权资源。
3. Supabase/Firebase 等 BaaS public identifier 与托管平台线索的正确分类，并提供对应官方修复或验证入口；公开标识本身只能是 `info` 或 `needs_verification`。

公开免费扫描可以检查首页 HTML 和内联脚本中的高置信度服务端 secret 格式，但不得显示完整 secret，只显示类型、所在上下文和首尾各 2-4 个脱敏字符。

域名验证后，可以下载首页明确引用的最多 3 个同源 JavaScript 文件，每个最多 128 KiB，检查：

- OpenAI、Anthropic、AWS 等通常不应出现在浏览器端的服务端凭据格式。
- Source map URL、调试开关、开发环境 API 地址和 localhost 地址。
- 无认证 AI endpoint、明显缺少客户端节流提示和可直接导致成本滥用的调用模式。
- Supabase/Firebase endpoint 和公开标识，为后续已授权权限测试提供线索。

以下值不能仅因出现在前端就判定为泄露：

- Stripe publishable key。
- Supabase anon key。
- Firebase client configuration。
- Google Maps browser key。
- 其他文档明确允许在客户端使用的 public identifier。

对于 public identifier，finding 状态只能是 `info` 或 `needs_verification`。只有在额外验证发现域名限制、RLS、数据库规则、Storage 或 API 授权配置不当时，才升级为风险 finding。

CORS 检查不能只根据主页的 `Access-Control-Allow-Origin: *` 判定漏洞。已验证扫描必须由用户提供 API base URL，并重点检查任意 Origin 反射、credentials 组合以及是否返回敏感数据。不得自动提交修改数据的请求。

AI prompt injection、system prompt extraction 和模型越权测试不自动执行，只能进入人工复核，并取得单独授权和调用成本确认。

### 7.6 finding 数据结构

```ts
type FindingStatus = "pass" | "fail" | "warning" | "info" | "needs_verification" | "unknown" | "not_applicable";
type Severity = "critical" | "high" | "medium" | "low" | "info";

interface Finding {
  id: string;
  category: "transport" | "headers" | "cookies" | "content" | "domain";
  titleZh: string;
  status: FindingStatus;
  severity: Severity;
  pointsEarned: number;
  pointsPossible: number;
  evidence: Array<{ label: string; value: string }>;
  summaryZh: string;
  riskZh: string;
  remediationZh: string[];
  references: Array<{ title: string; url: string }>;
  ruleVersion: string;
}
```

规则文字必须存放在版本化规则包中，不要散落在 UI 组件。

## 8. API 契约

### 8.1 创建扫描

`POST /api/v1/scans`

请求：

```json
{
  "target": "example.com",
  "locale": "zh-CN",
  "turnstileToken": "token"
}
```

成功返回：

```json
{
  "scanId": "uuid",
  "reportToken": "unguessable-token",
  "reportType": "public_baseline",
  "cached": false,
  "normalizedTarget": "example.com",
  "score": 82,
  "grade": "B",
  "summary": {
    "passed": 9,
    "warnings": 3,
    "failed": 2,
    "unknown": 1
  },
  "findings": []
}
```

错误码：

- `INVALID_TARGET`
- `TURNSTILE_FAILED`
- `RATE_LIMITED`
- `PRIVATE_OR_RESERVED_TARGET`
- `DNS_LOOKUP_FAILED`
- `REDIRECT_BLOCKED`
- `TARGET_TIMEOUT`
- `TARGET_UNREACHABLE`
- `UNSUPPORTED_CONTENT`
- `INTERNAL_ERROR`

错误响应不得包含 stack trace、内部 IP 或 Cloudflare secret。

### 8.2 报告

- `GET /api/v1/reports/:token`
- `DELETE /api/v1/reports/:token`
- `POST /api/v1/reports/:token/lead`
- `POST /api/v1/reports/:token/ai-summary`，v1.1 才实现

报告 token 至少 128 bit 随机度。不要使用自增 ID 作为公开标识。

## 9. D1 Schema

```sql
CREATE TABLE scans (
  id TEXT PRIMARY KEY,
  report_token_hash TEXT NOT NULL UNIQUE,
  report_type TEXT NOT NULL,
  target_host TEXT NOT NULL,
  target_host_hash TEXT NOT NULL,
  scope_json TEXT NOT NULL,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  algorithm_version TEXT NOT NULL,
  result_json TEXT NOT NULL,
  cached_from_id TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE INDEX idx_scans_target_created
  ON scans(target_host_hash, created_at);

CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  scan_id TEXT,
  email TEXT,
  wechat TEXT,
  purpose TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(scan_id) REFERENCES scans(id)
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  session_hash TEXT NOT NULL,
  event_name TEXT NOT NULL,
  scan_id TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE monitor_targets (
  id TEXT PRIMARY KEY,
  target_host TEXT NOT NULL,
  email TEXT NOT NULL,
  verified_at TEXT,
  frequency TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
```

匿名报告默认保留 90 天。用户主动删除后，D1 中只保留不可逆的聚合事件，不保留域名和 findings。

## 10. 页面与交互

### 10.1 页面清单

- `/`：产品主页，首屏直接提供域名输入，不制作营销式大 Hero。
- `/report/[token]`：完整报告。
- `/checks`：检查项目录。
- `/checks/[id]`：每个检查项独立 SEO 页面。
- `/guides`：修复指南列表。
- `/guides/csp`、`/guides/hsts`、`/guides/cookies` 等。
- `/pricing`：免费、详细报告、监控和专家复核。
- `/methodology`：评分方法、版本和限制。
- `/responsible-use`：合法使用和禁止行为。
- `/privacy`、`/terms`、`/contact`。

### 10.2 首页流程

1. 输入域名。
2. 勾选“我确认只检查公开可访问配置，并同意合理使用条款”。
3. Turnstile。
4. 点击“开始体检”。
5. 固定高度进度区依次显示：验证域名、检查 HTTPS、分析响应头、检查页面资源、生成报告。
6. 扫描完成直接进入报告，不强制注册。

不要伪造实时进度百分比。每个状态必须对应实际阶段。

### 10.3 报告页面

报告首屏必须包含：

- 报告类型、规范化域名、UTC 扫描时间、规则版本和过期时间。
- 总分、等级和固定副文案 `Configuration hygiene score — not proof that the application is secure.`。
- 固定 Scope / Non-goals 模块，包含第 3 节规定的必现声明，并列出本次实际检查与未检查事项。
- 三个最高优先级行动。
- 四类分数。
- 通过、警告、失败、未知数量。

下面按优先级展示 finding。每项可展开查看证据、风险、修复步骤和参考资料。

提供：复制 ShipAudit 域名上的验证链接、打印/保存 PDF、重新扫描、领取详细建议。打印件和截图必须保留报告类型、时间、范围和验证链接；只有服务器上的有效记录构成可验证来源。

不使用恐吓文案，不用“你的网站已被黑”等无法证明的表达。

## 11. AI 摘要规范

AI 不是 MVP 上线阻塞项。先用模板产生准确中文建议，验证有用户后再接 GLM。

AI 输入只包含：

- 行业类型和技术栈的用户选择。
- 已脱敏 findings。
- 分数、等级和规则版本。

AI 不接收完整 HTML、原始 Cookie 值、用户 IP 或任意响应体。

输出 JSON Schema：

```json
{
  "executiveSummary": "string, 120-220 Chinese characters",
  "priorityActions": [
    {
      "findingIds": ["HDR-01"],
      "title": "string",
      "reason": "string",
      "steps": ["string"]
    }
  ],
  "limitations": ["string"]
}
```

Prompt 约束：

- 只能引用输入中的 finding ID。
- 不得新增漏洞、风险或法规要求。
- 不得改变严重度和分数。
- 不得声称网站安全、合规或遭到攻击。
- 信息不足时明确写“本次体检无法判断”。

AI 调用失败时必须回退到确定性模板，报告仍然可用。

模型输出必须经过运行时 JSON Schema 校验和 finding ID 白名单校验。`priorityActions[*].findingIds` 必须是输入 finding ID 的子集；标题、理由和步骤不得改变输入严重度、状态、分数或规则版本。任何未知 ID、结构错误、越权结论或验证失败都必须整段丢弃并回退到确定性模板，不能只删除违规字段后继续展示。模型输出永远不是 finding、分数或报告签名的事实源。

## 12. 商业化

### 12.1 首期价格验证

验证期只公开两个 SKU，统一使用美元；不得同时宣传人民币自动报告、低价监控或尚未交付的多层套餐。

- **Free Validation Assets：`$0`。** Landing page、方法论、明确标为 Example data only 的样例报告，以及自动公开扫描的等待列表。等待列表不是扫描服务，不承诺上线日期。
- **Founding Expert Review：前 10 笔已付款订单，每笔 `$99`。** 限 1 个公开可达应用和 1 个主域名；最多 90 分钟分析工时；使用公开工具、确定性清单和人工判断；在付款、目标授权和范围确认后的 3 个工作日内交付书面 reviewed report。

Verified Launch Check、Standard Expert Review、Code & Architecture Review 和 Monitoring 在验证期均标记为 deferred，不公开价格、不接受付款、不进入实现。只有达到相应商业门禁并另行更新本规格后，才能销售。

Founding Expert Review 的固定交付物：

1. 目标、时间、报告类型、检查范围和未检查事项。
2. 公开面证据与脱敏 finding 清单。
3. 按“上线前修复 / 近期改进 / 信息与待验证”排序的行动项。
4. 误报或不确定项说明，以及使用的规则或公开工具版本。
5. `Reviewed by John W. — 20+ years in IT, including 10+ years in cybersecurity`、交付日期和有效期；不得使用任何认证性表述。

交付边界：

- 只检查公开可达面，以及客户主动提供的只读截图、架构说明或配置片段。
- 不接收密码、Cookie、Authorization header、生产密钥或数据库凭据。
- 不修改客户代码，不执行漏洞利用、破坏性请求、端口扫描、目录爆破、登录态扫描或完整 API/代码审计。
- 客户要求增加范围时必须另行书面报价，不能挤入 90 分钟 founding 范围。

付款与退款：

- 阶段 -1 必须提供可实际完成付款的 Payment Link 或 Merchant of Record 链接，以及支付成功页和人工订单记录。mailto 只能用于售前沟通，不能作为付款或商业验证证据。
- 支付渠道验证顺序冻结为：先注册并审核 Creem，Stripe 作为第二渠道和回退方案。两者在完成真实 KYC、产品审核、测试付款、退款和结算验证前都不得写成“已支持”。支付与基础设施账号使用 `admin@laws3.net`；客户收据、售前、报告和退款联系显示 `security@laws3.net`。
- 工作开始前客户取消，或 ShipAudit 无法在约定范围内开始检查，原路全额退款。若因 ShipAudit 原因未在 3 个工作日内交付，客户可选择延期或全额退款；客户延迟提供授权或资料时 SLA 暂停。
- 报告交付后不承诺无条件退款；发现与约定范围不符或重大事实错误时，优先免费更正，无法更正时退款。

免费材料不能故意隐藏已经确认的关键风险。付费价值来自人工去误报、技术栈上下文、修复排序和书面责任边界，而不是把已确认风险锁在付费墙后。

### 12.2 深度扫描和监控前的所有权验证

一次性公开被动体检不要求所有权证明。任何敏感路径探测、API 检查、BaaS 权限测试和持续监控都必须验证域名控制权，任选：

- DNS TXT：`laws3-security-verification=<token>`。
- `/.well-known/laws3-security-verification.txt`。
- 指定域名邮箱验证，作为低保障备选。

### 12.3 徽章与报告签名

徽章不属于当前 MVP，只有达到第 2.4 节的监控与徽章开发门禁并完成规格更新后才实施。未来徽章只能引用仍有效的服务端报告并表达检查事实：

- 推荐：`Baseline checked by ShipAudit`。
- 显示检查日期、算法版本和公开报告摘要链接。
- 30 或 90 天后过期，过期后显示 `Check expired`。
- 配置显著变化或用户删除报告时可以撤销。
- 不得使用 `Secure by ShipAudit` 或暗示安全认证。

## 13. SEO 与获客

阶段 -1 的唯一获客实验以第 2.8 节为准：英文市场一对一定向 outreach，连续两周共 20 个目标。此阶段不并行做 Show HN、Product Hunt、Reddit 广撒、中文渠道、批量 SEO 或付费广告，以便判断 `$99` 专家复核本身是否有需求。

达到 Gate A 后可以准备公开答疑和经授权的真实案例；完成阶段 5 后才评估 Show HN、r/SideProject、Indie Hackers、X 和 AI builder 社区发布。中文公众号、V2EX、掘金和出海社群属于单独渠道实验，不能与英文冷启动混为同一漏斗。提供开发者 API 或 GitHub Action 属于 v1.2，不是首发阻塞项。

验证期使用 `security.laws3.net`。它是验证期产品子域名，不视为独立品牌域名；不因中国大陆访问、备案或与其他内容品牌的潜在关联而立即购买新域名。独立域名本身也不能解决中国大陆网络可用性。出现第一笔真实付款，或准备面向 Show HN/Product Hunt 等进行广泛公开发布时，以先发生者为准重新决定独立品牌域名。验证期不得承诺中国大陆固定延迟、可用性或备案状态。

不得采用“未经同意扫描后，私信声称发现漏洞并要求付费”的恐吓式营销。可以检查公开基线，但联系作者时必须：

- 先说明检查范围和公开数据来源。
- 免费告知最重要的一项配置问题。
- 不在公开回复中披露敏感细节。
- 不声称目标已被入侵或存在未经确认的漏洞。

以下 SEO 内容只在 Gate A 后准备，并在阶段 5 完成后发布：

1. CSP 是什么以及常见错误。
2. HSTS max-age 应该设置多久。
3. Cookie 的 Secure、HttpOnly、SameSite 区别。
4. X-Frame-Options 与 CSP frame-ancestors。
5. 为什么不建议暴露 X-Powered-By。
6. security.txt 的标准写法。
7. WordPress 安全响应头配置。
8. Nginx 安全响应头模板。
9. Cloudflare 如何配置安全响应头。
10. Shopify/外贸站可以控制哪些安全头。

每篇内容引用官方资料并标注更新时间，不批量生成低质量 AI 文章。

## 14. 测试计划

阶段归属必须明确：DNS rebinding、IDN 请求目标、私网识别、逐跳重定向、慢源/大响应和自扫描绕过属于阶段 1；超大 header/Set-Cookie 的规则降级属于阶段 1 的读取上限与阶段 2 的解析测试；报告 token 枚举、速率限制、代理滥用和缓存投毒属于阶段 4。后续阶段的测试项可以先写规格，但不得因此提前实现对应功能。

### 14.1 单元测试

- hostname、IDN 和 URL 规范化。
- IDN 的 Unicode 展示值与实际请求用 ASCII hostname 必须可追溯，避免同形异义显示与请求目标不一致。
- IPv4/IPv6 私有、保留、文档和混淆格式识别。
- 逐跳重定向检查。
- DNS CNAME 链、混合公网/私网答案和 DNS rebinding 序列。
- header 总量、单值和 `Set-Cookie` 数量上限。
- CSP parser 和危险 directive。
- HSTS parser。
- 多个 Set-Cookie 独立分析。
- HTML 截断读取。
- 分数 N/A 归一化。
- finding 排序和等级边界。

### 14.2 SSRF 必测输入

```text
localhost
127.0.0.1
127.1
0x7f000001
2130706433
[::1]
[::ffff:127.0.0.1]
169.254.169.254
metadata.google.internal
user:pass@example.com
example.com:8080
https://public.example/redirect-to-private
https://public.example/redirect-loop
rebind.example  # 第一次解析为公网，fetch 前再次解析为私网
mixed.example   # 同时返回公网与私网地址
cname-to-private.example
```

所有测试使用 mocked fetch/DNS，不在自动测试中扫描真实第三方网站。

### 14.3 集成测试

建立本地 fixture server，覆盖：

- 完整安全头站点。
- 缺少 CSP/HSTS 的站点。
- report-only CSP。
- 多 Cookie 和不安全 Cookie。
- 混合内容和不安全 form action。
- 大于 512 KiB 的 HTML。
- 非 HTML 响应。
- 5 跳和 6 跳重定向。
- 5 跳内的慢源、大响应和跨主机开放重定向消耗。
- 超过 header 总量、单值和 `Set-Cookie` 数量上限的响应。
- timeout、DNS 失败、TLS 失败。

### 14.4 E2E

- 首页扫描成功。
- 非法目标不会发起扫描。
- Turnstile 失败。
- 缓存命中。
- 报告 token 猜测、短 token 和相邻 ID 不得读取其他报告。
- 规范化等价 hostname 使用同一安全缓存键；产品自身域名与 Worker 域名不能通过大小写、尾点或 IDN 变形绕过自扫描禁令。
- 报告展开、分享、打印和删除。
- 手机宽度 360px 无横向滚动和文字遮挡。

## 15. 可观测性与运维

记录但不包含敏感值的结构化事件：

- `scan_started`
- `scan_rejected`
- `scan_completed`
- `scan_failed`
- `cache_hit`
- `report_shared`
- `lead_submitted`
- `payment_intent`

错误日志只记录错误类别、阶段、耗时和匿名 request ID。不得记录完整 URL query、Cookie、HTML、Turnstile token 或 AI key。

设置预算保护：

- AI 每日最大调用次数和 token 上限。
- 同域名缓存。
- GLM key 只存在 Worker secret。
- 免费 Worker 接近额度时显示友好提示，不自动产生超预算服务。

## 16. 分阶段实施

### 阶段 -1：付费需求验证

在开发扫描器前完成并部署英文 landing page、样例报告、方法论、Scope / Non-goals、隐私与联系方式、可实际付款的 `$99` Founding Expert Review 链接、支付成功页、人工订单记录和书面交付模板。使用 MDN Observatory、现有开源工具、确定性清单和人工检查为首批用户交付，不自动探测未授权敏感路径，也不得宣称 ShipAudit 自有自动扫描已上线。

严格执行第 2.8 节的唯一获客实验：连续两周定向触达 20 名 AI-built app 英文市场开发者，并尝试销售前 10 个 `$99` founding review 名额。

验收：达到 Gate A 才允许进入阶段 1；达到 Gate B 才允许进入阶段 2。8 周内必须获得至少 2 笔真实付款才能判定商业验证成功。若未达到门禁，继续人工销售验证或更换定位，不以扫描量替代付款。

### 阶段 0：工程骨架

交付：monorepo、Astro 静态站、Hono Worker、共享 contracts、Wrangler 环境、Vitest/Playwright、CI。

验收：本地一条命令启动；`/api/health` 返回版本；测试和 build 通过。

### 阶段 1：输入和 SSRF 防护

前置条件：达到 Gate A。未达到时禁止开始。

交付：target normalizer、IP range library、DNS/CNAME validator、DNS rebinding fail-closed 处理、manual redirect fetcher、body/header cap、timeout、性能测量和单元测试。不得包含评分、D1 报告、监控、徽章或扩展。

验收：第 14.2 节全部通过；尚未实现评分也可以。

### 阶段 2：扫描和规则引擎

前置条件：达到 Gate B，且阶段 1 独立验收完成。

交付：响应头、Cookie、HTML 资源检查；finding schema；规则版本；确定性评分。

验收：fixture 集成测试通过；同一输入结果稳定；未知状态不误扣分。

### 阶段 3：前端报告

交付：首页、真实阶段进度、报告、检查项详情、方法论、隐私和合理使用页面。

验收：桌面和手机无溢出；打印样式完整；所有 finding 有证据和修复说明。

### 阶段 4：D1、缓存和防滥用

交付：migration、报告 token、90 天保留、删除、Turnstile、速率限制、缓存。

验收：重复扫描命中缓存；公开 ID 不可枚举；删除后无法恢复报告。

### 阶段 5：部署和封闭测试

交付：staging、production、域名、Web Analytics、错误监控、20 个自有或授权域名测试。

验收：无高严重度安全缺陷；P95 扫描时间小于 12 秒；错误率低于 5%。

### 阶段 6：获客和付费验证

交付：10 篇高质量英文内容、Show HN/Reddit/X 发布材料、反馈表单，以及经新规格批准后的 Verified Launch Check。专家复核流程已在阶段 -1 建立，此阶段根据真实交付数据决定是否继续、提价或停止。

验收：达到第 2.4 节指标后才能继续。

### 阶段 7：AI 摘要

交付：AIProvider、GLM adapter、JSON schema 校验、引用 finding ID、缓存、预算和 fallback。

验收：模型无法改变分数或新增 finding；断开 AI 后核心报告正常。

### 阶段 8：持续监控

交付：域名所有权验证、Cron、差异报告、邮件提醒和取消订阅。

验收：只扫描已验证域名；不重复告警；用户可立即停止监控和删除数据。

### 当前四周唯一推荐顺序（2026-07-12 起）

这四周不并行开发扫描器与销售漏斗，也不开始阶段 2、D1 报告、监控、徽章、AI 摘要或 Chrome 扩展。

1. **第 1 周：只完成阶段 -1 生产化。** 注册并提交 Creem 审核，同时准备 Stripe 回退；完成视觉 QA；修正首页和样例报告的 Scope / Non-goals 与当前人工交付措辞；补齐隐私、联系方式、交付边界、Payment Link、支付成功页和人工订单记录；验证 `security@laws3.net` 收发信；部署到 `security.laws3.net`。
2. **第 2 周：只做第一批 10 个英文定向 outreach。** 不开始 safe-fetch；记录完整漏斗、异议和定价反馈，推动真实付款或高质量双向意向。
3. **第 3 周：完成第二批 10 个 outreach，并优先交付首笔人工复核。** 若收到订单，按 90 分钟与 3 个工作日边界交付并记录客户反馈；仍不开始阶段 2。
4. **第 4 周：门禁复盘。** 达到 Gate A 时只启动阶段 1 safe-fetch 和 SSRF 测试；未达到 Gate A 时继续停留在阶段 -1，修改报价、受众或交付说明，不写扫描代码。即使提前达到 Gate B，阶段 2 也排在本四周之后，以保证阶段 1 独立验收。

## 17. 给编码代理的执行提示词

每次新会话使用以下模板，只替换阶段编号：

```text
你是一名资深 Cloudflare/TypeScript 工程师。请完整阅读
plans/website-security-checkup-master-spec.md。

本次只执行“阶段 X”，不要提前实现后续阶段，不要增加规格之外的扫描能力。

执行要求：
1. 先检查现有文件和未提交修改，保留用户已有工作。
2. 列出阶段 X 的实现清单和受影响文件。
3. 使用 TypeScript strict，优先小型纯函数和显式 schema。
4. 网络输入默认不可信，SSRF 防护不得临时跳过。
5. 为每个行为添加单元测试；网络测试使用 mock/fixture，不扫描真实第三方。
6. 运行格式化、类型检查、单元测试、构建；涉及 UI 时运行 Playwright 并检查手机截图。
7. 如果发现规格矛盾，停止扩展并记录问题，不自行扩大权限或扫描范围。
8. 最终报告完成内容、测试结果、剩余风险和下一阶段入口。

阶段 X 的完成标准完全以主规格对应章节为准。
```

对低推理档模型，不要一次要求实施两个阶段。阶段 1 和阶段 2 尤其必须分开。

## 18. Definition of Done

MVP 可公开上线必须同时满足：

- SSRF 测试矩阵全部通过。
- 不存在主动攻击或端口扫描能力。
- 核心报告不依赖大模型。
- 评分算法有版本号、单元测试和公开方法论。
- 扫描不保存 HTML、Cookie 值或用户 IP。
- Turnstile、缓存和速率限制生效。
- 手机和桌面核心流程通过 Playwright。
- 隐私、条款、合理使用、联系方式页面可访问。
- 至少 20 个自有或明确授权域名完成测试。
- 项目列出所有第三方代码和许可证。

## 19. 最终建议

第一版不要宣称“AI 安全扫描器”，也不要把 AI 当作卖点。用户真正购买的是可信、清晰、可执行的安全判断。

你的 20 年网络安全和存储经验应体现在规则解释、优先级、企业案例和专家复核中，而不是“专利级算法”这类无法验证的宣传语。

最短可行路线是：借鉴 `fedlinllc/security-headers-scanner` 的 Worker 形态，参考 MDN Observatory 的测试方法，自己实现安全输入边界、中文规则、报告、测试和商业闭环。
