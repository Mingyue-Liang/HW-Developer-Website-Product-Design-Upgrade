(() => {
  const officialUrl = 'https://developer.huawei.com/consumer/cn/doc/doccenter';
  const studioDownloadUrl = 'https://developer.huawei.com/consumer/cn/deveco-studio/resources/';
  const prompt = '请用 AEO 方式改写“构建第一个 HarmonyOS 应用（ArkTS）”';
  const summary = '使用 DevEco Studio 创建 Application → Empty Ability 工程，在 pages 中编写 Index.ets 与 Second.ets，并在 main_pages.json 注册第二页。通过 Router 的 pushUrl() 与 back() 完成跳转；预览验证后，配置调试签名并在真机运行。';
  const steps = [
    '创建 ArkTS 工程：选择 Application、Empty Ability，并完成工程同步。',
    '认识 Stage 模型目录：重点关注 entry/src/main/ets/pages 与 main_pages.json。',
    '编写 Index.ets：展示 Hello World，并让 Next 调用 pushUrl()。',
    '编写 Second.ets：注册 pages/Second，展示 Hi there，并让 Back 调用 back()。',
    '使用预览器验证两个页面之间的往返跳转。',
    '连接真机、生成调试签名，选择 entry 配置后运行应用。'
  ];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function matches(question) {
    const text = String(question || '').trim();
    if (/(?:AEO|答案引擎优化|问答式改写)/i.test(text) && /(?:ArkTS|第一个\s*HarmonyOS\s*应用|首个鸿蒙应用)/i.test(text)) return true;
    return /^(?:请|帮我|麻烦)?(?:用|做)?\s*(?:AEO|答案引擎优化)\s*(?:方式)?\s*(?:改写|重写|优化)(?:一下|这篇文章|教程|文档)?[。！!？?]?$/i.test(text);
  }
  function render(message) {
    const article = window.ArktsDocContent;
    const shareIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="3.5" r="2"/><circle cx="4" cy="19.5" r="2"/><circle cx="20" cy="19.5" r="2"/><path d="m11 5.3-6 12.3M13 5.3l6 12.3M6 19.5h12"/></svg>';
    const heartIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.7 5.2a5.1 5.1 0 0 0-7.2 0L12 6.7l-1.5-1.5a5.1 5.1 0 0 0-7.2 7.2L12 21l8.7-8.6a5.1 5.1 0 0 0 0-7.2Z"/></svg>';
    const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="5" width="13" height="16" rx="2"/><path d="M4 17V4a2 2 0 0 1 2-2h10"/></svg>';
    const caretIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg>';
    const meta = `<div class="aeo-page-meta"><span class="aeo-update-time">更新时间：2026-08-29 17:41</span><div class="aeo-page-tools"><span class="aeo-page-icon" aria-label="分享（展示）" title="分享">${shareIcon}</span><span class="aeo-page-icon" aria-label="收藏（展示）" title="收藏">${heartIcon}</span><div class="aeo-copy-wrap"><button type="button" class="aeo-copy-toggle" data-aeo-copy-menu aria-expanded="false"><span>${copyIcon}复制页面</span><span class="aeo-copy-caret">${caretIcon}</span></button><div class="aeo-copy-menu" hidden><div><b>复制页面</b><span>以 Markdown 格式添加到剪贴板</span></div><div><b>查看原文</b><span>以 Markdown 格式打开当前文档</span></div><div><b>复制 MCP 安装命令</b><span>复制命令并粘贴至 AI 对话框</span></div><div><b>查看 llms.txt</b><span>打开开发者文档的 llms.txt 页面</span></div></div></div></div></div>`;
    const studioButton = `<div class="aeo-studio-cta"><div><strong>想直接从示例工程开始？</strong><p>体验通过协议唤起 DevEco Studio、自动克隆并打开工程的流程。此原型为模拟演示。</p></div><button type="button" data-aeo-action="studio">在 DevEco Studio 中打开示例工程</button></div>`;
    const body = article.html.replace(/(<h2 id="arkts-step-1">[^<]*<\/h2>)/, `$1${studioButton}`);
    return `<div class="aeo-answer"><span class="aeo-label">AEO 改写 · 完整文章</span><h3>${escape(article.title)}</h3>${meta}<div class="arkts-article-body">${body}</div><div class="aeo-feedback"><strong>这篇文章有问题？</strong><p>可以通过工单反馈，或体验修改文档源文件并提交分支审核。</p><button type="button" data-aeo-action="feedback">反馈页面问题</button></div><small>文章内容来自用户提供的 Word 附件；未读取或修改官网实时页面。GitHub 与 DevEco Studio 自动打开流程均为本地模拟。</small></div>`;
  }
  async function copySummary() {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(summary); return true; }
    const field = document.createElement('textarea');
    field.value = summary;
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  }
  let feedbackTrigger = null;
  let review = null;
  const modalHost = document.createElement('div');
  modalHost.id = 'aeoFeedbackModalHost';
  function showModal(markup) {
    if (!modalHost.isConnected) document.body.appendChild(modalHost);
    modalHost.innerHTML = `<div class="aeo-modal-backdrop" data-aeo-overlay><div class="aeo-modal" role="dialog" aria-modal="true" aria-labelledby="aeoModalTitle"><button type="button" class="aeo-modal-close" data-aeo-close aria-label="关闭">×</button>${markup}</div></div>`;
    modalHost.querySelector('[data-aeo-close]')?.focus();
  }
  function closeModal() {
    modalHost.replaceChildren();
    feedbackTrigger?.focus();
    feedbackTrigger = null;
  }
  function showChoices() {
    showModal(`<small>文档反馈</small><h2 id="aeoModalTitle">反馈页面问题</h2><p>请选择反馈方式。GitHub 改稿与审核在此原型中为本地模拟，不会连接真实仓库。</p><div class="aeo-choice-grid"><button type="button" data-aeo-ticket><strong>工单反馈页面问题</strong><span>打开工单表单并预填文章标题。</span></button><button type="button" data-aeo-github><strong>修改文档源文件并提交审核（模拟）</strong><span>参考 Fern 的“Edit this page”，体验编辑、创建分支与等待审核。</span></button></div>`);
  }
  function showStudioChoice() {
    showModal(`<small>示例工程 · 交互模拟</small><h2 id="aeoModalTitle">在 DevEco Studio 中打开示例工程</h2><p>正式接入需要示例工程仓库地址与 DevEco Studio 已确认支持的唤起协议。当前原型不能检测本机安装状态，也不会真实唤起应用或克隆代码。</p><div class="aeo-modal-actions"><button type="button" data-aeo-studio-next>模拟已安装，继续打开</button><a href="${studioDownloadUrl}" target="_blank" rel="noopener noreferrer">未安装？下载 DevEco Studio ↗</a></div><p class="aeo-studio-note">安装完成后请回到此页，再点击“在 DevEco Studio 中打开示例工程”继续。</p>`);
  }
  function showStudioProgress() {
    showModal(`<small>示例工程 · 交互模拟</small><h2 id="aeoModalTitle">工程打开流程</h2><ol class="aeo-studio-steps"><li><b>1</b><span>模拟通过协议唤起 DevEco Studio</span><em>已完成</em></li><li><b>2</b><span>模拟自动克隆 ArkTS 双页面示例工程</span><em>已完成</em></li><li><b>3</b><span>模拟打开并同步工程</span><em>已完成</em></li></ol><p>这只是流程预览；没有实际唤起 IDE、克隆仓库或打开工程。你仍可按照文章第一步手动创建 Empty Ability 工程。</p><div class="aeo-modal-actions"><button type="button" data-aeo-close>返回教程</button><a href="${studioDownloadUrl}" target="_blank" rel="noopener noreferrer">查看官方下载页 ↗</a></div>`);
  }
  function showGithub() {
    showModal(`<small>EDIT THIS PAGE · 本地模拟</small><h2 id="aeoModalTitle">修改文档源文件</h2><p>当前没有这篇文章的真实 GitHub 仓库。下方是由附件生成的本地 Markdown 模拟源文件，修改不会传送到 GitHub。</p><div class="aeo-source-path">docs/getting-started/arkts-first-app.md <em>模拟路径</em></div><form id="aeoGithubForm"><label for="aeoSourceEditor">文档内容</label><textarea id="aeoSourceEditor" spellcheck="false"></textarea><label for="aeoChangeNote">修改说明</label><input id="aeoChangeNote" required maxlength="120" placeholder="例如：修正第二页路由说明"><div class="aeo-modal-actions"><button type="submit">创建分支并提交审核（模拟）</button><button type="button" data-aeo-choices>返回反馈方式</button></div></form>`);
    modalHost.querySelector('#aeoSourceEditor').value = window.ArktsDocContent.source;
  }
  function showReview() {
    showModal(`<small>GITHUB REVIEW · 本地模拟</small><h2 id="aeoModalTitle">${review.status === 'pending' ? '已提交，等待模拟审核' : '模拟审核已通过'}</h2><dl class="aeo-review"><div><dt>分支</dt><dd>${escape(review.branch)}</dd></div><div><dt>修改说明</dt><dd>${escape(review.note)}</dd></div><div><dt>审核状态</dt><dd>${review.status === 'pending' ? '等待审核' : '审核通过'}</dd></div></dl><p>此流程未创建真实分支或 Pull Request，也没有联系审核人。</p><div class="aeo-modal-actions">${review.status === 'pending' ? '<button type="button" data-aeo-review>查看模拟审核结果</button>' : ''}<button type="button" data-aeo-close>返回文章</button></div>`);
  }
  async function copyText(value) {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); return true; }
    const field = document.createElement('textarea');
    field.value = value;
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  }
  document.addEventListener('click', event => {
    const copyToggle = event.target.closest('.aeo-answer [data-aeo-copy-menu]');
    if (copyToggle) {
      const menu = copyToggle.parentElement.querySelector('.aeo-copy-menu');
      menu.hidden = !menu.hidden;
      copyToggle.setAttribute('aria-expanded', String(!menu.hidden));
      return;
    }
    const studio = event.target.closest('.aeo-answer [data-aeo-action="studio"]');
    if (studio) { feedbackTrigger = studio; showStudioChoice(); return; }
    const feedback = event.target.closest('.aeo-answer [data-aeo-action="feedback"]');
    if (feedback) { feedbackTrigger = feedback; showChoices(); return; }
    const codeButton = event.target.closest('.aeo-answer [data-arkts-copy]');
    if (codeButton) {
      const code = codeButton.closest('.arkts-code')?.querySelector('code')?.textContent;
      if (code) copyText(code).then(ok => { codeButton.textContent = ok ? '已复制' : '复制失败'; }).catch(() => { codeButton.textContent = '复制失败'; });
    }
  });
  modalHost.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (target?.hasAttribute('data-aeo-close') || event.target.hasAttribute('data-aeo-overlay')) { closeModal(); return; }
    if (target?.hasAttribute('data-aeo-choices')) { showChoices(); return; }
    if (target?.hasAttribute('data-aeo-studio-next')) { showStudioProgress(); return; }
    if (target?.hasAttribute('data-aeo-github')) { showGithub(); return; }
    if (target?.hasAttribute('data-aeo-review')) { review.status = 'approved'; showReview(); return; }
    if (target?.hasAttribute('data-aeo-ticket')) {
      closeModal();
      document.querySelector('[data-subnav-parent="help"][data-subnav-key="ticket"]')?.click();
      window.TicketWorkspace?.openNew();
      const title = document.querySelector('#twForm [name="title"]');
      const category = document.querySelector('#twForm [name="category"]');
      if (title) title.value = `文档页面问题：${window.ArktsDocContent.title}`;
      if (category) category.value = '其他技术问题';
    }
  });
  modalHost.addEventListener('submit', event => {
    if (event.target.id !== 'aeoGithubForm') return;
    event.preventDefault();
    const editor = modalHost.querySelector('#aeoSourceEditor');
    const note = modalHost.querySelector('#aeoChangeNote');
    if (editor.value === window.ArktsDocContent.source) { editor.setCustomValidity('请先修改页面内容'); editor.reportValidity(); editor.setCustomValidity(''); return; }
    if (!note.reportValidity()) return;
    review = {branch: 'docs/arkts-first-app-feedback-demo', note: note.value.trim(), status: 'pending'};
    showReview();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modalHost.hasChildNodes()) closeModal(); });
  window.HarmonyAeo = {officialUrl, prompt, summary, matches, render, copySummary};
})();
