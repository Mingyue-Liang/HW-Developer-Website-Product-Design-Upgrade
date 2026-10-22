(() => {
  'use strict';
  const seenKey = 'harmony-navigation-guide-v73-seen';
  const launcher = document.getElementById('navGuideLaunch');
  if (!launcher) return;
  const launcherHome = launcher.parentElement;
  const launcherNext = launcher.nextElementSibling;
  const compactScreen = window.matchMedia('(max-width:700px)');
  function placeLauncher() {
    if (compactScreen.matches) document.body.appendChild(launcher);
    else launcherHome.insertBefore(launcher, launcherNext);
  }
  placeLauncher();
  compactScreen.addEventListener('change', placeLauncher);
  const overlay = document.createElement('div');
  overlay.className = 'nav-guide-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `<section class="nav-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="navGuideTitle"><button type="button" class="nav-guide-close" data-nav-guide-close aria-label="关闭导航说明">×</button><small class="nav-guide-kicker">SITE MAP · 新版架构</small><h2 id="navGuideTitle">全局导航说明</h2><p class="nav-guide-intro">先说目标，再按资源、生态或支持继续探索；不同入口指向同一条开发旅程。</p><div class="nav-guide-flow">描述目标 <span>→</span> 生成任务工作台 <span>→</span> 打开对应资源 <span>→</span> 获取支持</div><div class="nav-guide-grid"><button type="button" class="nav-guide-card" data-nav-guide-go="home"><small>01 / 工作台</small><strong>从任务出发</strong><p>首页汇集常用任务与推荐内容；在首页输入开发目标，可生成对应的任务工作台。</p><em>返回工作台 →</em></button><button type="button" class="nav-guide-card" data-nav-guide-go="resources"><small>02 / 官方资源</small><strong>找产品、工具和文档</strong><p>包括产品与技术、开发工具、技术文档、规范与合规、解决方案及下载资源。</p><em>打开官方资源 →</em></button><button type="button" class="nav-guide-card" data-nav-guide-go="ecosystem"><small>03 / 开发者生态</small><strong>合作、资讯与成长</strong><p>查看生态合作、活动与资讯、开发者成长；从项目到学习机会继续向前。</p><em>打开开发者生态 →</em></button><button type="button" class="nav-guide-card" data-nav-guide-go="help"><small>04 / 帮助与支持</small><strong>从自助到人工</strong><p>先问 AI 助手或社区，再通过工单与人工支持处理复杂问题。</p><em>打开帮助与支持 →</em></button></div><div class="nav-guide-tips"><span>首页搜索：找明确的文档、工具或能力</span><span>✦ AI 助手：描述问题并获取建议</span></div><div class="nav-guide-footer"><p>这是当前 HTML 方案的导航说明，不替代官网实时内容。</p><button type="button" data-nav-guide-replay>重新查看操作引导</button></div></section>`;
  const coach = document.createElement('section');
  coach.className = 'nav-guide-coach';
  coach.hidden = true;
  coach.setAttribute('aria-label', '轻量操作引导');
  document.body.append(overlay, coach);
  const steps = [
    {title:'从工作台或左侧目录开始', body:'工作台按任务组织入口；左侧的官方资源、开发者生态、帮助与支持可展开查看二级页面。'},
    {title:'说出目标，或直接搜索', body:'在首页输入开发目标可生成任务工作台；已经知道名称时，使用首页搜索框更快。'},
    {title:'遇到问题，随时获得帮助', body:'顶部 AI 助手可继续提问；左侧“帮助与支持”还提供社区、工单与专项支持。'}
  ];
  let currentStep = 0;
  let returnFocus = null;
  function markSeen() { try { localStorage.setItem(seenKey, '1'); } catch {} }
  function renderCoach() {
    const step = steps[currentStep];
    coach.innerHTML = `<div class="nav-guide-coach-head"><small>快速认识新版导航</small><button type="button" data-nav-coach-skip aria-label="关闭操作引导">×</button></div><h2>${step.title}</h2><p>${step.body}</p><span class="nav-guide-coach-count">${currentStep + 1} / ${steps.length}</span><div class="nav-guide-coach-actions"><button type="button" data-nav-coach-map>查看导航说明</button><span class="nav-guide-coach-dots" aria-hidden="true">${steps.map((_, i) => `<i class="${i === currentStep ? 'active' : ''}"></i>`).join('')}</span><button type="button" data-nav-coach-next>${currentStep === steps.length - 1 ? '完成' : '下一步 →'}</button></div>`;
    coach.hidden = false;
  }
  function closeCoach() { coach.hidden = true; markSeen(); }
  function openGuide() {
    closeCoach();
    returnFocus = document.activeElement;
    overlay.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    overlay.querySelector('.nav-guide-close').focus();
  }
  function closeGuide() {
    overlay.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    (returnFocus?.isConnected ? returnFocus : launcher).focus();
  }
  function goTo(section) {
    closeGuide();
    if (section === 'home') {
      document.querySelector('.primary-side-nav [data-view="home"]')?.click();
      return;
    }
    const firstPage = {resources:'products', ecosystem:'cooperate', help:'ai'}[section];
    const parent = document.querySelector(`[data-sidebar-parent="${section}"]`);
    if (parent?.getAttribute('aria-expanded') !== 'true') parent?.click();
    document.querySelector(`[data-subnav-parent="${section}"][data-subnav-key="${firstPage}"]`)?.click();
  }
  launcher.addEventListener('click', openGuide);
  overlay.addEventListener('click', event => {
    if (event.target === overlay || event.target.closest('[data-nav-guide-close]')) { closeGuide(); return; }
    const route = event.target.closest('[data-nav-guide-go]');
    if (route) { goTo(route.dataset.navGuideGo); return; }
    if (event.target.closest('[data-nav-guide-replay]')) { closeGuide(); currentStep = 0; renderCoach(); }
  });
  coach.addEventListener('click', event => {
    if (event.target.closest('[data-nav-coach-skip]')) { closeCoach(); return; }
    if (event.target.closest('[data-nav-coach-map]')) { openGuide(); return; }
    if (event.target.closest('[data-nav-coach-next]')) {
      if (currentStep === steps.length - 1) closeCoach();
      else { currentStep += 1; renderCoach(); }
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !overlay.hidden) closeGuide(); });
  let seen = false;
  try { seen = localStorage.getItem(seenKey) === '1'; } catch {}
  if (!seen && (!location.hash || location.hash === '#home')) setTimeout(() => { if (overlay.hidden) renderCoach(); }, 550);
})();
