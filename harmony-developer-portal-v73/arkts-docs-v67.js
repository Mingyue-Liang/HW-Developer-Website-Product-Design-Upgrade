(function(){
  'use strict';
  const content=window.ArktsDocContent;
  const studioDownload='https://developer.huawei.com/consumer/cn/deveco-studio/resources/';
  let activeTrigger=null;
  let simulatedReview=null;

  function landing(footer){
    return `<div class="arkts-docs" id="arktsDocs"><nav class="arkts-crumb" aria-label="当前位置"><button type="button" data-view="resources">官方资源</button><span>／</span><strong>技术文档</strong></nav><section class="arkts-docs-hero"><small>HARMONYOS DOCUMENTATION</small><h1>技术文档</h1><p>从入门教程开始，继续查阅开发指南、API 参考与示例代码。</p></section><div class="arkts-docs-grid"><button type="button" class="arkts-feature" data-arkts-article><span class="arkts-feature-index">入门教程 · ArkTS</span><h2>${content.title}</h2><p>从 Empty Ability 工程出发，完成两个 ArkTS 页面、路由跳转、调试签名和真机运行。</p><span class="arkts-feature-action">阅读升级版教程 →</span></button><div class="arkts-docs-links"><a href="https://developer.huawei.com/consumer/cn/doc/doccenter" target="_blank" rel="noopener noreferrer"><strong>官方文档中心</strong><span>浏览完整技术文档 ↗</span></a><a href="https://developer.huawei.com/consumer/cn/doc/doccenter-references/api/development-intro-api" target="_blank" rel="noopener noreferrer"><strong>API 参考</strong><span>查阅接口与参数说明 ↗</span></a><a href="https://developer.huawei.com/consumer/cn/samples/" target="_blank" rel="noopener noreferrer"><strong>示例代码</strong><span>查找更多可运行示例 ↗</span></a></div></div>${footer}</div>`;
  }

  function article(footer){
    const openButton=`<div class="arkts-studio-cta"><div><strong>想在 DevEco Studio 中跟着操作？</strong><p>体验从本页打开示例工程的流程。当前为交互模拟，不会唤起本机应用或克隆仓库。</p></div><button type="button" data-arkts-open>在 DevEco Studio 中打开示例工程</button></div>`;
    const body=content.html.replace(/(<h2 id="arkts-step-1">[^<]*<\/h2>)/,`$1${openButton}`);
    const toc=content.toc.map(item=>`<a href="#arkts-${item.id}" data-arkts-toc>${item.title}</a>`).join('');
    return `<div class="arkts-docs arkts-article-page" id="arktsDocs"><nav class="arkts-crumb" aria-label="当前位置"><button type="button" data-view="resources">官方资源</button><span>／</span><button type="button" data-arkts-back>技术文档</button><span>／</span><strong>ArkTS 入门</strong></nav><div class="arkts-article-layout"><article class="arkts-article"><div class="arkts-article-head"><small>入门教程 · ArkTS · Stage 模型</small><h1>${content.title}</h1><p>本文以 DevEco Studio 26.0.0 Release 为例，按六个步骤完成首个应用。</p></div><div class="arkts-article-body">${body}</div><section class="arkts-feedback"><div><h2>这篇文章有问题？</h2><p>可选择工单反馈，或体验 GitHub 文档改稿与分支审核流程。</p></div><button type="button" data-arkts-feedback>反馈页面问题</button></section></article><aside class="arkts-toc" aria-label="本文目录"><strong>本文目录</strong>${toc}</aside></div><div class="arkts-modal-host" id="arktsModalHost"></div>${footer}</div>`;
  }

  function modal(root,markup){
    const host=root.querySelector('#arktsModalHost');
    if(!host)return;
    host.innerHTML=`<div class="arkts-modal-backdrop" data-arkts-overlay><div class="arkts-modal" role="dialog" aria-modal="true" aria-labelledby="arktsModalTitle"><button class="arkts-modal-close" type="button" data-arkts-close aria-label="关闭">×</button>${markup}</div></div>`;
    host.querySelector('.arkts-modal-close').focus();
  }
  function closeModal(root){const host=root.querySelector('#arktsModalHost');if(host)host.innerHTML='';activeTrigger?.focus();activeTrigger=null}
  function openStudio(root){
    modal(root,`<small class="arkts-modal-kicker">示例工程 · 交互模拟</small><h2 id="arktsModalTitle">在 DevEco Studio 中打开示例工程</h2><p>正式接入需要示例工程仓库及经确认的 DevEco Studio 唤起协议。当前页面不会检测安装状态、调用本机应用或下载代码。</p><div class="arkts-modal-actions"><button type="button" class="arkts-modal-primary" data-arkts-studio-next>模拟已安装并继续</button><a href="${studioDownload}" target="_blank" rel="noopener noreferrer">尚未安装？下载 DevEco Studio ↗</a></div><p class="arkts-modal-note">安装完成后返回此页，重新点击“在 DevEco Studio 中打开示例工程”继续。</p>`);
  }
  function studioNext(root){
    modal(root,`<small class="arkts-modal-kicker">示例工程 · 交互模拟</small><h2 id="arktsModalTitle">打开工程流程</h2><ol class="arkts-sim-steps"><li><b>1</b><span>模拟发送 DevEco Studio 协议唤起请求</span><em>已完成</em></li><li><b>2</b><span>模拟克隆 ArkTS 双页面示例工程</span><em>已完成</em></li><li><b>3</b><span>模拟在 IDE 中打开并同步工程</span><em>已完成</em></li></ol><p class="arkts-modal-note">这只是流程预览；没有真实工程被克隆或打开。你仍可按本文步骤在 DevEco Studio 中手动创建 Empty Ability 工程。</p><div class="arkts-modal-actions"><button type="button" class="arkts-modal-primary" data-arkts-close>返回教程</button><a href="${studioDownload}" target="_blank" rel="noopener noreferrer">查看官方下载页 ↗</a></div>`);
  }
  function openFeedback(root){
    modal(root,`<small class="arkts-modal-kicker">页面反馈</small><h2 id="arktsModalTitle">反馈页面问题</h2><p>选择适合你的反馈方式。所有模拟操作都会清晰标注，不会向远程服务提交内容。</p><div class="arkts-feedback-choices"><button type="button" data-arkts-ticket><strong>工单反馈页面问题</strong><span>进入工单与人工支持，描述文档中的问题。</span><em>前往工单 →</em></button><button type="button" data-arkts-github><strong>在 GitHub 修改页面（模拟）</strong><span>编辑本文源内容，体验创建分支、提交审核和查看结果。</span><em>开始模拟改稿 →</em></button></div>`);
  }
  function openGithub(root){
    modal(root,`<small class="arkts-modal-kicker">GITHUB EDIT THIS PAGE · 模拟</small><h2 id="arktsModalTitle">编辑本文源文件</h2><p>下面展示的是由附件生成的本地模拟源文件，并非 GitHub 仓库中的真实文件。修改后可以体验分支审核流程。</p><div class="arkts-source-path">docs/getting-started/arkts-first-app.md <span>模拟源文件</span></div><form id="arktsGithubForm"><label for="arktsSourceEditor">页面内容</label><textarea id="arktsSourceEditor" spellcheck="false"></textarea><label for="arktsChangeNote">修改说明</label><input id="arktsChangeNote" required maxlength="120" placeholder="例如：补充页面注册的注意事项"><div class="arkts-modal-actions"><button class="arkts-modal-primary" type="submit">创建分支并提交审核（模拟）</button><button type="button" data-arkts-feedback>返回选择方式</button></div></form><p class="arkts-modal-note">不创建真实 GitHub 分支或 Pull Request，也不会修改当前文章。</p>`);
    root.querySelector('#arktsSourceEditor').value=content.source;
  }
  function submitGithub(root){
    const editor=root.querySelector('#arktsSourceEditor');
    const note=root.querySelector('#arktsChangeNote');
    if(!editor||!note)return;
    if(editor.value===content.source){editor.setCustomValidity('请先修改页面内容');editor.reportValidity();editor.setCustomValidity('');return}
    if(!note.reportValidity())return;
    simulatedReview={branch:'docs/arkts-first-app-feedback-demo',note:note.value.trim(),status:'pending'};
    showReview(root);
  }
  function showReview(root){
    if(!simulatedReview)return;
    modal(root,`<small class="arkts-modal-kicker">GITHUB REVIEW · 模拟</small><h2 id="arktsModalTitle">文档修改已进入模拟审核</h2><div class="arkts-review-status"><div><span>分支</span><strong>${simulatedReview.branch}</strong></div><div><span>修改说明</span><strong id="arktsReviewNote"></strong></div><div><span>状态</span><strong id="arktsReviewStatus">${simulatedReview.status==='pending'?'等待模拟审核':'模拟审核已通过'}</strong></div></div><p class="arkts-modal-note">本地流程预览：没有创建远程分支、提交 Pull Request 或联系真实审核人。</p><div class="arkts-modal-actions">${simulatedReview.status==='pending'?'<button type="button" class="arkts-modal-primary" data-arkts-review>查看模拟审核结果</button>':''}<button type="button" data-arkts-close>返回教程</button></div>`);
    root.querySelector('#arktsReviewNote').textContent=simulatedReview.note;
  }
  function mount(options){
    const root=document.getElementById('arktsDocs');if(!root)return;
    root.addEventListener('click',async event=>{
      const target=event.target.closest('button,a');if(!target)return;
      if(target.hasAttribute('data-arkts-toc')){event.preventDefault();document.getElementById(target.getAttribute('href').slice(1))?.scrollIntoView({behavior:'smooth',block:'start'});return}
      if(target.hasAttribute('data-arkts-article')){options.openArticle();return}
      if(target.hasAttribute('data-arkts-back')){options.back();return}
      if(target.hasAttribute('data-arkts-open')){activeTrigger=target;openStudio(root);return}
      if(target.hasAttribute('data-arkts-studio-next')){studioNext(root);return}
      if(target.hasAttribute('data-arkts-feedback')){activeTrigger=activeTrigger||target;openFeedback(root);return}
      if(target.hasAttribute('data-arkts-ticket')){closeModal(root);options.openTicket();return}
      if(target.hasAttribute('data-arkts-github')){openGithub(root);return}
      if(target.hasAttribute('data-arkts-review')){simulatedReview.status='approved';showReview(root);return}
      if(target.hasAttribute('data-arkts-copy')){const code=target.closest('.arkts-code')?.querySelector('code')?.textContent;if(!code)return;try{await navigator.clipboard.writeText(code);target.textContent='已复制'}catch{target.textContent='复制失败，请手动选择代码'}return}
      if(target.hasAttribute('data-arkts-close')){closeModal(root);return}
    });
    root.addEventListener('submit',event=>{if(event.target.id==='arktsGithubForm'){event.preventDefault();submitGithub(root)}});
    root.addEventListener('click',event=>{if(event.target.hasAttribute('data-arkts-overlay'))closeModal(root)});
    root.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.querySelector('.arkts-modal'))closeModal(root)});
  }
  window.ArktsDocs={landing,article,mount};
})();
