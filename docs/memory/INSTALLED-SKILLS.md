# Installed skills (snapshot 2026-11-21)

Where they live: **project skills** load automatically from `.claude/skills/` when Claude Code opens this repo. **Account skills** (`anthropic-skills:*`) come from the claude.ai account. **Plugin skills** come from installed Claude Code plugins. A few were installed with their own installers (see SETUP-LOCAL.md).


## Project skills (repo `.claude/skills/`, auto-loaded) (157)

| Skill | What it does |
|---|---|
| `21st-ui` | Find, install, and generate UI with 21st.dev. Use when the user asks for a UI component (pricing table, hero, navbar, dashboard, form, etc.), wants design inspiration, needs a brand logo as an SVG component, or wants to generate new UI from… |
| `ai-short-drama-production` | 将 AI 短剧、漫剧、剧情短视频从故事意图独立编排为可控生产任务。适用于剧本钩子、人物/场景/道具资产、场面调度图、布光图、打戏、草图转镜头与生成前 QC；全部必要合同随本 Skill 打包。 |
| `ai-storyboard-director` | 根据剧本与已定导演方案设计观看顺序、人物调度、电影摄影和剪辑，编写或修订分镜与视频提示词；支持创意镜头思路、打戏和运镜诊断。创意思路可单独交付或并列于主分镜，采用后才纳入；分镜、提示词与实际生成按当前阶段分别执行。 |
| `animejs` | Comprehensive skill for Anime.js v4 - a fast and flexible JavaScript animation library. This skill should be used when implementing web animations, creating timelines, working with SVG animations, scroll-based animations, draggable elements… |
| `api-and-interface-design` | Guides stable API and interface design. Use when designing APIs, module boundaries, or any public interface. Use when creating REST or GraphQL endpoints, defining type contracts between modules, or establishing boundaries between frontend a… |
| `argo-guide` | Guide for using Argo to create polished product demo videos from Playwright scripts with AI voiceover and animated overlays. Use this skill whenever the user mentions Argo, demo videos, product demos, screen recordings with narration, Playw… |
| `awesome-design-md` | Library of 74 DESIGN.md files describing the visual design systems of well-known products (Stripe, Linear, Vercel, Apple, Notion, Figma, Spotify, Airbnb, ElevenLabs, Claude and more) — colours, type, spacing, components and rules. Use when … |
| `banner-design` | Design banners for social media, ads, website heroes, creative assets, and print. Multiple art direction options with optional generated or supplied visuals. Actions: design, create, generate banner. Platforms: Facebook, Twitter/X, LinkedIn… |
| `bklit-ui` | Bklit UI charts and data visualization for any project using the @bklit shadcn registry. Install, compose, theme, and animate charts correctly. Triggers when working with @bklitui/ui/charts, @bklit components, data visualization, dashboards… |
| `brand` | Brand voice, visual identity, messaging frameworks, asset management, brand consistency. Activate for branded content, tone of voice, marketing assets, brand compliance, style guides. |
| `brandkit` | Premium brand-kit image generation skill for creating high-end brand-guidelines boards, logo systems, identity decks, and visual-world presentations. Trained for minimalist, cinematic, editorial, dark-tech, luxury, cultural, security, gamin… |
| `browser-testing-with-devtools` | Tests in real browsers via Chrome DevTools MCP. Use when building or debugging anything that runs in a browser. Use when you need to inspect the DOM, capture console errors, analyze network requests, profile performance, or verify visual ou… |
| `canvas-design` | Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying exis… |
| `captions-overlay` | Overlay doctrine for captions in HyperFrames videos — the caption MODEL (drop / rail / embed) and the rule that captions are an OVERLAY composited on top of the film, never a reserved bottom band you shift content up to avoid. Load when add… |
| `changelog-video` | Turn a weekly changelog .md into a finished branded changelog video (square 1080, ~45-60s, Annie VO, animated brand background, mock-UI visualizations, lowkey captions). Use when the user provides a changelog/digest markdown and wants the w… |
| `character-asset` | 根据剧本与人物身份设计角色资产，固定三视图加中景；支持女性角色魅力、气质与肖像设计。用于人物、角色设计、人物设定、人物资产、女性魅力、character、角色图；输出静态参考图任务说明与资产合同， 本 Skill 独立完成静态参考图任务说明、资产锁定、审核字段、负向约束和可供后续制作直接读取的资产合同。 |
| `ci-cd-and-automation` | Automates CI/CD pipeline setup. Use when setting up or modifying build and deployment pipelines. Use when you need to automate quality gates, configure test runners in CI, or establish deployment strategies. |
| `code-review-and-quality` | Conducts multi-axis code review. Use before merging any change. Use when reviewing code written by yourself, another agent, or a human. Use when you need to assess code quality across multiple dimensions before it enters the main branch. Us… |
| `code-simplification` | Simplifies code for clarity. Use when refactoring code for clarity without changing behavior. Use when code works but is harder to read, maintain, or extend than it should be. Use when reviewing code that has accumulated unnecessary complex… |
| `constraint-driven-development` | Establishes a project's quality bar as a written contract and stops agents quietly lowering it. Interviews the user on which dimensions matter, supplies sane default thresholds when they have no number in mind, records everything in CONSTRA… |
| `context-engineering` | Optimizes agent context setup. Use when starting a new session, when agent output quality degrades, when switching between tasks, or when you need to configure rules files and context for a project. |
| `cube-motion` | Use when adding UI motion with cube-motion. Four fixed motions (rise, leave, morph, reveal) on the Web Animations API with React and Solid components. Nothing to tune; pick the job. |
| `cut-the-curve` | The technique catalog: five velocity-matched SEAMS (zoom-through, INVERSE zoom-through, cut-the-curve, waterfall cut, rack-focus blur-cut) plus the two in-scene techniques — waterfall ENTRY (staggered arrival cascades for title cards / segm… |
| `cyberpunk-design` | 赛博朋克类型视觉设计预设。触发词：赛博、霓虹、黑客、未来都市、义体。用于明确需要此类型的画面设计、图像/视频提示词、视觉参数查询与诊断；保留摄影、光色、空间、动作、材质、连续性及 style_route/style_module 接口。 |
| `d-data-analysis-semantic-layer` | 审核并版本化写入 D｜数据分析知识语义层，只用于用户在看到正式报告和候选内容后明确回复“同意吸纳”“写入D”“加入数据分析知识库”“确认进入知识库”或“批准更新D”的场景。用于验证候选结论、来源、有效期、复查日期、冲突和历史版本；不得因“调用D”“分析市场”或生成候选内容而触发写入。包内自带完整审核、版本和写入合同，不要求配套Skill。 |
| `d-official-market-analysis` | 基于可验证的官方和权威来源分析影视、微短剧、漫剧、AI影视、网络动画与剧情短视频市场。用于“调用D”“用D分析”、题材趋势、平台对比、指标解释、项目市场评估与完整市场研究；按本次问题确定范围与交付，不把单项咨询自动扩成全市场报告。 |
| `debugging-and-error-recovery` | Guides systematic root-cause debugging. Use when tests fail, builds break, something that worked yesterday broke, behavior doesn't match expectations, or you encounter any unexpected error. Use when you need to figure out what broke and why… |
| `defuddle` | Extract clean Markdown from HTML pages with Defuddle CLI. |
| `deprecation-and-migration` | Manages deprecation and migration. Use when removing old systems, APIs, or features. Use when migrating users from one implementation to another. Use when migrating a database schema in production, such as renaming or dropping a column with… |
| `design-system` | Token architecture, component specifications, and slide generation. Three-layer tokens (primitive→semantic→component), CSS variables, spacing/typography scales, component specs, strategic slide creation. Use for design tokens, systematic de… |
| `design-taste-frontend-v1` | The original v1 taste-skill, preserved for projects depending on its exact behavior. The current default is `design-taste-frontend` (v2 experimental), which is a substantial rewrite. Use this v1 install name only if you need exact backward … |
| `design-taste-frontend` | Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesi… |
| `design` | Comprehensive design skill: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini, Atlas Cloud, or MuAPI AI), corporate identity program (50 deliverables, CIP mockups), HTML presentations (Chart.js), banner design (2… |
| `director-agent` | Create, revise, or diagnose screenplays and develop director treatments or pre-storyboard decisions covering causality, character action, dialogue, performance, visual storytelling, sound, editing, and optional AI-executable screenplay comp… |
| `documentation-and-adrs` | Records decisions and documentation. Use when you need to document an architecture decision (ADR) or the reasoning behind a design choice, when changing public APIs, shipping features, or when you need to record context that future engineer… |
| `doubt-driven-development` | Subjects every non-trivial decision to a fresh-context adversarial review before it stands. Use when you want every assumption cross-examined before proceeding, when stress-testing a plan for hidden failure modes, when correctness matters m… |
| `earshot` | Listen with earshot whenever you must judge, choose, trim, verify or compare sound you cannot hear - picking a sound effect, music or ambience from candidates, finding the cleanest moment in a recording, checking whether audio reads as a re… |
| `editor` | - Understand, generate, and edit footage with Diffusion Studio: analyze video/audio/images, generate them with AI, and compose video compositions. Use for any media analysis, media generation, or video editing task. |
| `effects` | Add any of 42 video effects to a talking-head video (orbit, spotlight, glass widgets, timeline, checklist, headline wall, comment box, phone fan, liquid glass graph, match-cut, iPhone toggles, LED sign and more). Effects track the speaker's… |
| `epic-design` | 史诗类型视觉设计预设。触发词：史诗、宏大、全景、奇观、帝国、王朝。用于明确需要此类型的画面设计、图像/视频提示词、视觉参数查询与诊断；保留摄影、光色、空间、动作、材质、连续性及 style_route/style_module 接口。 |
| `evil-button-docs` | Generate and verify Evil Buttons component documentation and registry wiring. Use when adding a new button/component to this repo, creating or updating `content/docs/*.mdx`, adding the component to `scripts/build-registry.mjs`, exposing MDX… |
| `explainer-default` | Make a clean 45–90 second product demo video for any software product, rendered from code to MP4 with music. Airy light canvas, short centred lines the camera pushes into, the product's own UI rebuilt and shown up close as it is used (typin… |
| `explainer-engaging` | Make a 10–30 second continuous-shot explainer for any product, rendered from code to MP4 with sound. One hero element (a ball, a cursor, a file, a message) travels through the product's workflow laid out as stations on one big canvas; the c… |
| `explainer-high-energy` | Make a 12–20 second high-energy motion-graphics promo for any product, rendered from code to MP4 with synthesised music. Fast beat-locked scene changes, kinetic typography, a shape that carries across every transition, a HUD frame. Use when… |
| `explainroo` | Make an explainer video (MP4) with a voice-over using explainroo. The voice is made on this computer and no API key is needed. Use when the user asks for an explainer, how-to, walkthrough, launch or tutorial video, an animated diagram with … |
| `fantasy-design` | 奇幻类型视觉设计预设。触发词：奇幻、魔法、森林、古堡、精灵、龙、巫师。用于明确需要此类型的画面设计、图像/视频提示词、视觉参数查询与诊断；保留摄影、光色、空间、动作、材质、连续性及 style_route/style_module 接口。 |
| `figma` | Bring Figma into a HyperFrames video - rendered assets, brand tokens, components, storyboard frames as reconstructed motion (frames read as states, not slides), shaders and connector-assisted motion. Use when the person pastes a figma.com l… |
| `frontend-design` | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults. |
| `frontend-ui-engineering` | Builds production-quality, accessible, responsive user-facing UIs. Use when building or modifying interfaces and pages, creating components, implementing layouts, meeting WCAG accessibility requirements, managing state, or when the output n… |
| `full-output-enforcement` | Overrides default LLM truncation behavior. Enforces complete code generation, bans placeholder patterns, and handles token-limit splits cleanly. Apply to any task requiring exhaustive, unabridged output. |
| `git-workflow-and-versioning` | Structures git workflow practices. Use when making any code change. Use when committing, branching, resolving conflicts, splitting uncommitted work in a messy working tree into clean atomic commits, opening or reviewing a pull request (PR),… |
| `gpt-taste` | Elite UX/UI & Advanced GSAP Motion Engineer. Enforces Python-driven true randomization for layout variance, strict AIDA page structure, wide editorial typography (bans 6-line wraps), gapless bento grids, strict GSAP ScrollTriggers (pinning,… |
| `graphify` | Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ exists, where the question should be treated as a graphify query first. Turns any input (code, docs, papers, ima… |
| `gsap-core` | Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). Use when the user asks for a JavaScript animation library, animation in React/V… |
| `gsap-frameworks` | Official GSAP skill for Vue, Svelte, and other non-React frameworks — lifecycle, scoping selectors, cleanup on unmount. Use when the user wants animation in Vue, Nuxt, Svelte, SvelteKit, or asks about GSAP with Vue/Svelte, onMounted, onMoun… |
| `gsap-performance` | Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. Use when optimizing GSAP animations, reducing jank, or when the user asks about animation performance, FPS, or smooth 60fps. |
| `gsap-plugins` | Official GSAP skill for GSAP plugins — registration, ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG and physics plugins, CustomEase, EasePack, CustomWiggle, CustomBounce, GSDevTools. Use whe… |
| `gsap-react` | Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js, or asks about GSAP with React, useGSAP, or cleanup on unmount. Recommend GSAP for React animation unless the… |
| `gsap-scrolltrigger` | Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. Use when building or recommending scroll-based animation, parallax, pinned sections, or when the user asks about ScrollTrigger, scroll animations, o… |
| `gsap-timeline` | Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. Use when sequencing animations, choreographing keyframes, or when the user asks about animation sequencing, timelines, or animation order (in GSAP o… |
| `gsap-utils` | Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Use when the user asks about gsap.utils, clamp, mapRange, random, snap, toArray, wrap, or helper utilities in GSAP. |
| `guofeng-visual-director` | 为中国古风题材设计完整的视觉语言，并编写、优化或诊断图像提示词；覆盖人物服饰、建筑空间、器物陈设、色彩光线、构图、故事关键帧与系列连续性。用于古风视觉设计、古装电影美术、历史或架空古代场景、古风人像、古风视觉圣经及明确的古风出图请求。区分历史还原、架空古风与风格化表达；不把古风自动变成仙侠、武侠或固定朝代。纯历史问答、古诗创作、完整剧本、逐镜分镜和现代国潮品牌设计不以本技能为主。 |
| `hairline-adopt` | Use when someone has an SVG (an icon, a logo, an illustration) and wants it as a Hairline figure, or runs /hairline-adopt with a file. Reads the drawing, rebuilds its object as an isometric line figure on the engine of @lucasmarkes/hairline… |
| `hairline-create` | Use when someone asks for a new Hairline figure, or runs /hairline-create with an idea. Draws one isometric line figure that answers the pointer, in the style and on the engine of @lucasmarkes/hairline, and hands it over as a single self-co… |
| `hard-sci-fi-visual-director` | Script-first visual design for original hard-science-fiction worlds, scenes, film stills, visual bibles, nonhuman life and ecology, mecha and combat-mecha families, future equipment, cockpits and UI/HMI. Use for 硬科幻视觉、科幻场景与世界观、外星生命、原创机甲与巨兽、… |
| `high-end-visual-design` | Teaches the AI to design like a high-end agency. Defines the exact fonts, spacing, shadows, card structures, and animations that make a website feel expensive. Blocks all the common defaults that make AI designs look cheap or generic. |
| `hook-reference` | The user's chosen references for hooks and talking-head editing (the Devin Jatho style, broken down layer by layer in instagram.com/reel/DcJNJurOtH9, and the "10 hooks that always work" library from instagram.com/reel/DbeVHuGspag). Use when… |
| `horror-design` | 恐怖类型视觉设计预设。触发词：恐怖、鬼、怪物、惊悚、灵异、凶宅、丧尸。用于明确需要此类型的画面设计、图像/视频提示词、视觉参数查询与诊断；保留摄影、光色、空间、动作、材质、连续性及 style_route/style_module 接口。 |
| `html-ppt` | HTML PPT Studio — author professional static HTML presentations in many styles, layouts, and animations, all driven by templates. Use when the user asks for a presentation, PPT, slides, keynote, deck, slideshow, "幻灯片", "演讲稿", "做一份 PPT", "做一… |
| `huashu-motion` | Motion graphics, launch videos and explainers as editable code. A director picks the motion language for your product; you point at frames to change them. 动画、发布片、解说视频，指着画面改。 |
| `hyperframes-cli` | The HyperFrames CLI by job - scaffold, check, look at frames, edit the timeline, preview, render locally or in the cloud, publish, project history - plus reading its JSON and recovering from build or render failures. |
| `hyperframes-registry` | About 450 ready-made HyperFrames blocks and components installed as editable source - transitions, overlays, titles, kinetic type, captions, charts, map overlays, 3D, camera moves. Use it before hand-building any named visual (CRT scanlines… |
| `hyperframes` | Read first to make, edit, animate or render any video with HyperFrames (HTML rendered to video), including launch films, explainers, music videos, charts, maps, vertical clips, title cards, captions and overlays. Holds the render contract, … |
| `idea-refine` | Refines raw ideas into sharp, actionable concepts through structured divergent and convergent thinking. Use when an idea is still vague, when you need to stress-test assumptions before committing to a plan, or when you want to expand option… |
| `image-to-code` | Elite website image-to-code skill for Codex. For visually important web tasks, it must first generate the design image(s) itself, deeply analyze them, then implement the website to match them as closely as possible. In Codex, it must prefer… |
| `imagegen-frontend-mobile` | Elite mobile app image-generation skill for creating premium, app-native screen concepts and flows. Designed for iOS, Android, and cross-platform mobile products. Prioritizes clean hierarchy, comfortably readable text, strong multi-screen c… |
| `imagegen-frontend-web` | Elite frontend image-direction skill for generating premium, conversion-aware website design references. CRITICAL OUTPUT RULE — generate ONE separate horizontal image FOR EVERY section. A landing page with 8 sections produces 8 images. Neve… |
| `impeccable` | Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, produ… |
| `incremental-implementation` | Delivers changes incrementally in thin, verifiable slices. Use when implementing any feature or change that touches more than one file, or when picking up the next task from a plan. Use when rolling a change out behind a feature flag, when … |
| `industrial-brutalist-ui` | Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolios, or editorial sites t… |
| `interview-me` | Extracts what the user actually wants instead of what they think they should want. Achieves this through one-question-at-a-time interview until ~95% confidence about the underlying intent. Use when an ask is underspecified ("build me X" wit… |
| `json-canvas` | Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual canvases, mind maps, flowcharts, or when the user mentions Canvas files in Obsidian. |
| `knap` | Render Markdown from templates and structured data using Knap CLI. Use when the user asks to apply a Knap template, turn JSON or CSV data into notes, batch-generate Markdown files, or format Defuddle output into a note. |
| `launch-shadcn-registry` | - Launch and promote a custom shadcn/ui registry end-to-end: validate registry.json, prepare the official shadcn-ui/ui directory PR, community directory PRs (registry.directory, shadcntemplates, birobirobiro/awesome-shadcn-ui, bytefer/aweso… |
| `lemo-opuscar` | Direct and produce a short film made entirely in code, in one of the styles of the Lemo-Opuscar library (e.g. Impasto Oil Painting 油画厚涂, Watercolor Brush 水彩笔刷, Ukiyo-e 浮世绘, Satellite Briefing 卫星简报, Exploded Teardown 产品拆解). Use when the user… |
| `media-use` | Get or make any media for a HyperFrames video - music, sound effects, images, icons, logos, voiceover, avatar and generated video, transcripts, cutouts, colour grades and looks - with HeyGen or free local tools, and mix placed audio. Also f… |
| `minimalist-ui` | Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows. |
| `motion-broll` | Turn a talking-head video and its transcript into motion-graphic B-roll timed to the speaker's words, in a continuous one-shape style (one element that morphs and never cuts, driven by a cursor, spring motion). Use when someone gives a vide… |
| `motion-design` | Code-only motion design pipeline (no After Effects) for Raphaël / Howseen: launch films, showreels, product promos, LinkedIn/X videos, meme clips. Use when asked to make a motion design video, a promo/launch film, a showreel, "remake this v… |
| `motion-doctrine` | GATEWAY — load FIRST before composing any HyperFrames animation or video. The high-level motion law that makes a multi-scene video feel like ONE continuous camera move instead of a stack of independently-animated slides. Covers the vector l… |
| `noir-design` | 黑色类型视觉设计预设。触发词：黑色、犯罪、悬疑、谍战、暗夜、侦探、黑帮。用于明确需要此类型的画面设计、图像/视频提示词、视觉参数查询与诊断；保留摄影、光色、空间、动作、材质、连续性及 style_route/style_module 接口。 |
| `object-separation` | Separate a person, product or hand from the background in a video, on the user's own computer with SAM 2. Scans the machine first to pick the right model size, then outputs the same video with the separated subject highlighted in green, plu… |
| `observability-and-instrumentation` | Instruments code so production behavior is visible and diagnosable. Use when adding logging, metrics, tracing, or alerting. Use when shipping any feature that runs in production and you need evidence it works. Use when production issues are… |
| `obsidian-bases` | Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formu… |
| `obsidian-cli` | Interact with Obsidian vaults using the Obsidian CLI to read, create, search, and manage notes, tasks, properties, and more. Also supports plugin and theme development with commands to reload plugins, run JavaScript, capture errors, take sc… |
| `obsidian-markdown` | Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embe… |
| `oil-motion` | 把 AI 生成或已有的视频、序列帧变成随滚动、指针、拖动、触摸、设备方向、音频、数据或状态变化的网页动画：设计动作方向，生成关键帧与视频，整理成图集或视频，编译时间轴并接入运行时。用户需要角色转向、产品拆解、镜头穿越、一镜到底转场，或要清理、抠色、补帧、压缩绿幕视频与雪碧图时使用。不用于纯 CSS、JS、SVG、Lottie 或实时 3D 就能完成的界面过渡与微交互（交给普通前端实现），也不用于独立成片剪辑、单张配图或静态页面。 |
| `openfilm` | Make videos as web pages with OpenFilm. Use when the user asks for a video, motion graphics, an animation, a launch film, an explainer, a music video, to edit, cut, check or render a film (film.html and pages with window.film), or to open O… |
| `oversized-cursor` | House-style oversized macOS cursor technique for HyperFrames launch videos. Load whenever a scene involves cursors or a pointer-led action, when kicking off a UI scene, when igniting a morph/transition/typing run with a click, or when a sce… |
| `performance-optimization` | Optimizes application performance across frontend, backend, queries, and databases. Use when performance requirements exist, when you suspect performance regressions, when Core Web Vitals or load times need improvement, when N+1 query patte… |
| `planning-and-task-breakdown` | Breaks work into ordered tasks. Use when you have a spec or clear requirements and need to break work into implementable tasks. Use when a task feels too large to start, when you need to estimate scope, or when parallel work is possible. |
| `playwright-cli` | Automate browser interactions, test web pages and work with Playwright tests. |
| `ponytail-audit` | Quality audit of a whole repo: bugs, security holes, what breaks under real load, risky code without tests, slow paths, and what to delete, merge or split. Ranked, each finding explained in plain English. One-shot report, changes nothing. U… |
| `ponytail-debt` | List every `shortcut:` comment (and older `ponytail:` ones) as a debt ledger. One-shot report, changes nothing. Use for "ponytail debt", "what did ponytail defer", "list the shortcuts", /ponytail-debt. |
| `ponytail-gain` | Show ponytail's measured savings (code, cost, speed) from the benchmark. One-shot display. Use for /ponytail-gain, "what does ponytail save", "ponytail impact". |
| `ponytail-help` | Quick reference for ponytail levels, skills and commands. One-shot display. Use for /ponytail-help, "ponytail help", "how do I use ponytail". |
| `ponytail-review` | Quality review of a change: is the logic right, is it safe, does it hold under real load, is risky code tested, is it fast enough, and is every line needed. Reads the connected code, not only the diff. Each finding is explained in plain Eng… |
| `ponytail` | Lazy senior dev mode: the smallest change that fully solves the task, and a reply a busy human understands in one read. Use on any coding task (writing, fixing, refactoring, reviewing, choosing dependencies) and when the user says "ponytail… |
| `produce-ai-video` | Produce or revise an actual playable AI video when the user explicitly requests video generation, an actual video test, or a finished film. Interpret the story, preserve locked directing and storyboard decisions, then generate, edit, add au… |
| `prop-asset` | 根据剧情、使用方式与美术方向设计道具形制、结构、材质及多视角/关键细节设定图。用于道具设计、道具资产、道具设定图、道具细节图、prop、物品图；输出静态参考图任务说明与资产合同， 本 Skill 独立完成静态参考图任务说明、资产锁定、审核字段、负向约束和可供后续制作直接读取的资产合同。 |
| `react-three-fiber` | Build declarative 3D scenes with React Three Fiber (R3F) - a React renderer for Three.js. Use when building interactive 3D experiences in React applications with component-based architecture, state management, and reusable abstractions. Ide… |
| `real-sound` | Build premium, realistic soundtracks for code-made videos and animations from real licensed recordings - launch films, product and feature videos, UI walkthroughs, logo stings, explainers, trailers and animated shorts made with Remotion, Hy… |
| `redesign-existing-projects` | Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS. |
| `reel-effects` | Library of 17 ready-made Remotion video effects for talking-head Reels/Shorts in reel/src/effects (orbit, couch wall, UI world, frame break, digital zoom, phone mockup, checklist, headline wall, zoom-through cut, chart grow, pull-back revea… |
| `remotion-motion-graphics` | Create and edit professional motion graphics videos with Remotion (React-based video). Use this skill EVERY time the user wants to create a video, edit a video, animate something, build an intro/outro/logo animation, make a Reel/Short/promo… |
| `remotion-to-hyperframes` | Bring existing video code or footage into HyperFrames and verify it frame by frame against the original - Remotion first, also Motion Canvas, Lottie, Three.js, p5.js, canvas or plain HTML/CSS animation, or renders from Manim, After Effects … |
| `reverse-any-video` | Rebuild any video file as an editable HyperFrames project - motion graphics, talking heads, live action or AI-generated footage. Measure and watch it, rebuild every layer, then check the render against the original frame by frame. Use to re… |
| `romance-design` | 爱情类型视觉设计预设。触发词：爱情、浪漫、温暖、亲密、心动、告白。用于明确需要此类型的画面设计、图像/视频提示词、视觉参数查询与诊断；保留摄影、光色、空间、动作、材质、连续性及 style_route/style_module 接口。 |
| `scene-asset` | 根据剧本设计电影场景的美术、构图、光色与氛围，常规场景默认主图加反打图；按用户需要扩展同空间多机位或九宫格，无指定画风时默认摄影写实。用于场景资产、环境图、房间多角度和场景机位设定；输出静态参考图任务说明与资产合同， 本 Skill 独立完成静态参考图任务说明、空间锁定、审核字段、负向约束和可供后续制作直接读取的资产合同。 |
| `seam-craft` | Render-correctness doctrine for scene-to-scene seams in HyperFrames launch videos — the prerequisites that make transitions composite correctly on the master timeline. Load when assembling the master timeline / index.html, when a white flas… |
| `security-and-hardening` | Hardens code against vulnerabilities. Use when auditing an input handler for vulnerabilities, when handling user input, authentication, data storage, or external integrations, or when checking a login flow is safe against the OWASP Top Ten.… |
| `shipping-and-launch` | Prepares production launches. Use when preparing to deploy to production, or when asking what needs to be in place before shipping. Use when you need a pre-launch checklist, when setting up monitoring, when planning a staged rollout, or whe… |
| `slides` | Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, and contextual slide strategies. |
| `slideshow` | Build a HyperFrames slideshow to present live - slides, fragment reveals, branching hotspots and presenter mode with speaker notes, served by `hyperframes present` - or turn an existing page into one. Use when the person wants a deck or pre… |
| `sound-effects` | Add a measured sound pass to a motion-graphics video made with Claude Code (HyperFrames, Remotion, GSAP, Claude Motion or the motion-broll skill). Builds a cue list, checks the music's beat grid against the kick drums, lands cuts on the bea… |
| `source-driven-development` | Grounds every implementation decision in official documentation. Use when you want to verify an approach against the official docs before implementing it, or when you want authoritative, source-cited code free from outdated patterns. Use wh… |
| `spec-driven-development` | Creates specs before coding. Use when starting a new project, feature, or significant change and no specification exists yet. Use when drafting a PRD or requirements document with objectives and scope, or when requirements are unclear, ambi… |
| `stitch-design-taste` | Semantic Design System Skill for Google Stitch. Generates agent-friendly DESIGN.md files that enforce premium, anti-generic UI standards — strict typography, calibrated color, asymmetric layouts, perpetual micro-motion, and hardware-acceler… |
| `test-driven-development` | Drives development with tests using the red-green-refactor loop. Use when implementing any logic, fixing any bug, or changing any behavior. Use when you need to prove that code works, when a bug report arrives, or when you're about to modif… |
| `threejs-animation` | Keyframe, skeletal and morph-target animation, procedural motion and clip blending, on WebGL or with WebGPU and TSL. Use when animating objects, playing glTF animations, posing bones, driving morph targets, or mixing and crossfading clips. |
| `threejs-asset-pipeline` | Shrinking glTF assets for three.js with gltf-transform: inspect, validate and optimize commands, Draco, meshopt and quantization, KTX2, WebP and AVIF textures, the loader setup each output needs, and gltfjsx for React. Use when compressing,… |
| `threejs-fundamentals` | Three.js scene setup: scenes and fog, cameras, the renderer and tone mapping, the animation loop, object hierarchies, transforms, core math and cleanup, on WebGL or with WebGPU and TSL. Use when creating a scene from scratch, configuring a … |
| `threejs-geometry` | Creating and shaping three.js geometry: built-in shapes, 3D text, vertex buffers and attributes, merging, instancing, batching, point clouds and lines, on WebGL or with WebGPU and TSL. Use when building 3D shapes or text, custom vertex data… |
| `threejs-interaction` | Picking with raycasting, camera controls, transform gizmos, drag, hover and box selection for three.js, identical under WebGL and WebGPU. Use when handling mouse, touch or keyboard input, detecting clicks on 3D objects, adding camera contro… |
| `threejs-lighting` | Light types and physical units, shadow maps, HDR environment lighting, light probes, and lighting performance, on WebGL or with WebGPU and TSL. Use when adding or tuning lights, fixing shadow acne, setting up image-based lighting, or dimmin… |
| `threejs-loaders` | Loading three.js assets: glTF with Draco, meshopt and KTX2 compression, other model formats, textures, HDR and EXR environments, progress, caching, cloning and disposal. Use when loading 3D models, textures or environment maps, or managing … |
| `threejs-materials` | Choosing and configuring three.js materials - unlit, diffuse, specular, PBR, toon, point and line materials - shared properties like blending and stencil, environment response, and the WebGPU node-material and TSL equivalents. Use when styl… |
| `threejs-performance` | Measuring and optimizing three.js speed: render statistics, memory counters, fewer draw calls via merging, instancing, batching and LOD, fill rate, shadows, CPU work per frame, shader stalls and GPU compute for particles, WebGL or WebGPU wi… |
| `threejs-postprocessing` | Three.js post-processing: composer pass chains, built-in renderer effects, and the WebGPU/TSL node pipeline — bloom, depth of field, ambient occlusion, custom screen effects. Use when adding visual effects, color grading, blur, glow, or scr… |
| `threejs-react-three-fiber` | Building three.js scenes from React with React Three Fiber and drei: renderer setup, the scene graph as JSX, frame-loop, state and loading hooks, pointer events, and adaptive performance, on WebGL or with WebGPU and TSL. Use when writing Re… |
| `threejs-shaders` | Custom GLSL vertex and fragment shaders: uniforms, varyings, shader chunks, extending built-in materials, instanced attributes, plus the same effects as node materials with TSL on WebGPU. Use when writing a shader, a custom material or effe… |
| `threejs-textures` | Three.js textures: image loading, color spaces, UV channels and transforms, texture types from canvas to HDR and KTX2, render targets, texture memory. Use when working with images on materials, UV coordinates, cubemaps, render targets or te… |
| `toothreferral-messaging` | Tooth Referral platform features (PLATFORM-FEATURES.md, from the 2026-11-12 audit) and the client review rules (no "GP", no red, no doctor names, staff Barbara/Tanya/Amanda/Greg, Gentle Dental / St. Andrew's Family Dental, never condescendi… |
| `tr-animations` | Design and build new ToothReferral product animations (Remotion, reel/src/tr) in the house style, in vertical, horizontal and transparent formats. Use when asked for a new ToothReferral/dashboard animation, UGC insert, end card, stat beat o… |
| `typegpu` | - TypeGPU is type-safe WebGPU in TypeScript. Use whenever the user writes, debugs, or designs TypeGPU code: 'use gpu' shader functions, tgpu.fn, buffers, textures, bind groups, compute and render pipelines, command encoders, render passes, … |
| `ui-styling` | Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Use when building user interfaces, implementing design systems, crea… |
| `ui-ux-pro-max` | UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typogra… |
| `using-agent-skills` | Discovers and invokes agent skills. Use when starting a session, or when you need to decide which skill or workflow applies to the piece of work at hand. This is the meta-skill that governs how all other skills are discovered and invoked. |
| `video-director` | Direct, build and verify short videos that are written as code and rendered frame by frame (HTML/Canvas/SVG/Three.js, GSAP or Remotion → MP4 or a live page). Covers motion graphics, product launch films, promos, explainers, kinetic typograp… |
| `video-shotcraft` | Create cinematic product videos from frontend projects or webpages with Remotion, real page captures, shot cards, the Ink Press template, beat sync and sound design. Use for full product promos, reproducing Ink Press, single shot-card effec… |
| `video-use` | Edit any video by conversation. Transcribe, cut, color grade, generate overlay animations, burn subtitles — for talking heads, montages, tutorials, travel, interviews. No presets, no menus. Ask questions, confirm the plan, execute, iterate,… |
| `war-design` | 为战争与军事题材提供统一的电影视觉顾问：战争类型光色、空间材质、人物服装装备、场景道具、故事关键帧、战斗与小队画面、图像提示词、真实出图及审查；保留style_route/style_module参数接口。用于战争技能、战争视觉、军事顾问、军事人物装备、军事场景、军事故事画面和大胆战术小队。纯军事新闻、战略理论研究、完整剧本及逐镜分镜编排不属于主交付。 |
| `watch` | - Watch and understand footage with Diffusion Studio: answer questions about a video or audio file, summarize it, find scenes and moments, pull quotes, and describe what happens and when. Use whenever the user asks what's in a piece of foot… |
| `web-design-director` | Design, implement, or review websites and application interfaces through product-specific visual direction, information architecture, interaction design, responsive behavior, accessibility, and verified frontend execution. Use for 网页设计、网站设计… |
| `whiteboard-video` | Generate smooth hand-drawn whiteboard and story videos directly inside Codex from text scripts, GPT Image 2 color storyboards, scene plans, SVGs, line art, or local images. Supports 30 built-in visual styles, automatic recommendations, cust… |
| `whitebox-previs-executor` | 在用户明确要求3D白模预演时，将已有视频提示词、镜头描述或分镜编译为可播放的机位与基础走位预演；创意镜头思路、方案讨论或Skill测试本身不触发渲染。动作密集打斗必须通过骨骼、武器约束、共享接触点和单动作门，否则拒绝或标为诊断，不用体块位移冒充打戏。 |
| `wuxia-design` | 武侠类型视觉设计预设。触发词：武侠、江湖、剑客、功夫、东方、侠客。用于明确需要此类型的画面设计、图像/视频提示词、视觉参数查询与诊断；保留摄影、光色、空间、动作、材质、连续性及 style_route/style_module 接口。 |

## Account skills (claude.ai, called as `anthropic-skills:<name>`) (16)

| Skill | What it does |
|---|---|
| `anthropic-skills:built-in-browser` | Read this skill before the first step that uses the built-in browser, the browser pane inside the Claude desktop app (also called the in-app browser, the browser pane, Claude's browser, or \"your own browser\"), whose tools are named mcp__C… |
| `anthropic-skills:chrome-browser` | Read this skill before the first step that uses Claude in Chrome, the browser extension whose tools are named mcp__claude-in-chrome__* (also called Chrome, the browser extension, or the external browser) and which acts in the person's real … |
| `anthropic-skills:computer-use` | Read this skill before the first step of any request to do something in an app on the person's own computer (Notes, Finder, System Settings, any desktop app), to look at their screen, or for \"computer use\". Computer use (desktop control) … |
| `anthropic-skills:deep-research` | Use this skill when the user's prompt requires (1) researching a topic across multiple sources, comparing options or alternatives, analyzing trends or history, understanding markets or industries, or reviewing literature or studies and (2) … |
| `anthropic-skills:docs` | docs (editable docs people share and comment on; the default for any document, named as a doc or not: a document, report, proposal, resume, cover letter, letter, contract, policy, form, template, worksheet, essay, handbook, guide, how-to, c… |
| `anthropic-skills:docx` | Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx) or Word templates (.dotx). Triggers include: any mention of Microsoft Word Documents, such as 'Word doc', 'word document', '.docx', '.dotx', … |
| `anthropic-skills:google-workspace` | Read this before the first Google Drive, Docs, Sheets or Slides connector call whenever the task creates or changes a Google file. Use this skill whenever the user wants to create or change a Google Doc, Sheet or Slides file in their Google… |
| `anthropic-skills:humanizer` | Rewrite AI-sounding text so it reads like a person wrote it, without changing what it says. Use when asked to humanize, de-AI, or make text sound natural. |
| `anthropic-skills:import-memory` | Import a memory export from another AI assistant into Claude's memory — conversationally, additively, and with the content treated as data. |
| `anthropic-skills:morning` | Render the user's morning brief as a styled HTML artifact, or set it up as a recurring weekday task. Use only when the user explicitly asks to run, see, or set up their morning brief, or if they invoke /morning by name. A question about the… |
| `anthropic-skills:pdf` | Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating … |
| `anthropic-skills:pptx` | Use this skill any time a .pptx or .potx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations as PowerPoint (.pptx) files; reading, parsing, or extracting text from any … |
| `anthropic-skills:signalreach-linkedin-outreach` | Run SignalReach LinkedIn outreach: personalised first messages to recently added 1st-degree decision makers, plus a 3-line follow-up after 1 day if there's no reply, humanized and token-lean. |
| `anthropic-skills:signalreach-outreach` | SignalReach LinkedIn outreach run: skip rules, 3-line message template, writing rules, 3-5 min pacing, Excel tracker and report format. |
| `anthropic-skills:skill-creator` | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with varia… |
| `anthropic-skills:xlsx` | Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit, or fix an existing .xlsx, .xlsm, .xltx, .csv, or .tsv file (e.g., adding columns, computing formulas, … |

## Other user skills (`~/.claude/skills`) (1)

| Skill | What it does |
|---|---|
| `session-start-hook` | Creating and developing startup hooks for Claude Code cloud sessions. Use only when the user asks for a SessionStart hook committed to their repository. Not for setting up a cloud environment or a repository for cloud sessions; that uses th… |

## Plugin skills (from installed Claude Code plugins in the cloud session)

| Plugin | Skills |
|---|---|
| a11y-enforcer | `a11y-enforcer:a11y-check`, `a11y-enforcer:contrast`, `a11y-enforcer:a11y-enforcer` |
| perf-profiler | `perf-profiler:perf-audit`, `perf-profiler:perf-compare`, `perf-profiler:perf-profiler` |
| audit-suite | `audit-as-a11y-eng`, `audit-as-backend-eng`, `audit-as-design-eng`, `audit-as-dx-eng`, `audit-as-frontend-eng`, `audit-as-perf-eng`, `audit-as-prod-readiness`, `audit-as-repo-maintainer`, `audit-as-structural-eng`, `audit-as-ux-eng`, `emil-design-engineering`, `full-audit`, `make-interfaces-feel-better`, `vercel-react-best-practices`, `web-animation-design`, `web-design-guidelines` |
| aeotester | `aeotester:audit` |
| seo-audit | `search-console-data-review`, `seo-audit`, `seo-fix-plan`, `seo-page-audit`, `technical-seo-code-audit` |
| finecomb | `finecomb:finecomb` |
| claude-code-setup | `claude-code-setup:claude-automation-recommender` |
| frontend-design | `frontend-design:frontend-design` |

## Built-in Claude Code skills

`code-review`, `simplify`, `fewer-permission-prompts`, `loop`, `claude-api`, `run`, `plugin-authoring`, `init`, `security-review`, `update-config`, `keybindings-help`, `dataviz`, `artifact-design`, `artifact-diagramming`, `artifact-capabilities`.


## Pinned in `skills-lock.json` (6)

| Skill | Source |
|---|---|
| `canvas-design` | anthropics/skills |
| `frontend-design` | anthropics/skills |
| `html-ppt` | lewislulu/html-ppt-skill |
| `impeccable` | pbakaus/impeccable |
| `pdf` | anthropics/skills |
| `remotion-best-practices` | remotion-dev/skills |

## MCP connectors used in this project

Google Drive (backup storage, recordings), ElevenLabs (voices, dubbing, sound), Gmail (read), GitHub, vidIQ, earshot (audio listening, local MCP), Claude Docs. 21st needs re-authorising.

## Obscura (installed 27 Nov 2026)

Rust headless browser for AI agents (github.com/h4ckf0r0day/obscura, Apache-2.0, v0.2.7): V8 JavaScript, Chrome DevTools
Protocol (drop-in for Puppeteer/Playwright), screenshots, screencast, PDF export, page extraction.
- CLI: `obscura` + `obscura-worker` in `/usr/local/bin` (default release build: rendering, no stealth transport).
  Example: `obscura fetch https://example.com --eval "document.title"`.
- Skill: `.claude/skills/obscura/SKILL.md` (CLI, CDP, MCP and rendering workflows).
- Local install: download `obscura-x86_64-linux.tar.gz` (or the macOS/Windows archive) from the GitHub Releases page,
  extract, and put both binaries on PATH. The project publishes no checksums.
