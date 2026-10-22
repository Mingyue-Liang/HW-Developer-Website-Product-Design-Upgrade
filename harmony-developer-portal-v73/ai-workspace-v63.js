(() => {
  const batches=[
    [
      ['应用开发','⌘',['如何用 ArkTS 和 ArkUI 创建第一个鸿蒙应用？','折叠屏与手机共用一套界面时，如何适配布局？','如何为应用添加元服务入口？']],
      ['调试诊断','◇',['DevEco Studio 构建失败，应该先检查什么？','应用启动后闪退，怎样定位原因？','页面滑动卡顿，如何排查性能问题？']],
      ['上架审核','✓',['应用审核未通过，我该检查什么？','发布新版本前需要完成哪些测试？','申请敏感权限时需要注意哪些说明？']],
      ['开放能力','✧',['Push Kit 的推送消息收不到，如何排查？','如何在应用中接入华为账号登录？','Payment Kit 接入前需要准备什么？']]
    ],
    [
      ['应用开发','⌘',['如何用 DevEco Studio 创建 HarmonyOS 工程？','ArkUI 页面之间如何传递参数？','如何让应用适配平板和电脑？']],
      ['调试诊断','◇',['真机调试无法连接设备时如何排查？','应用包安装失败，应该查看哪些日志？','如何分析页面内存占用异常？']],
      ['上架审核','✓',['鸿蒙应用上架需要准备哪些资料？','隐私政策和权限说明如何核对？','审核反馈中的兼容性问题如何复现？']],
      ['开放能力','✧',['如何选择适合应用的地图能力？','如何配置应用内支付测试环境？','如何为应用接入消息推送？']]
    ]
  ];
  const state={batch:0};
  const assistant=()=>window.HarmonyStandaloneAI;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const root=()=>document.getElementById('aiWorkspace');
  function renderRecommendations(){
    const grid=document.getElementById('aiwRecommendGrid');
    if(!grid)return;
    grid.innerHTML=batches[state.batch].map(([title,icon,questions])=>`<article class="aiw-category"><div class="aiw-category-head"><span class="aiw-category-icon" aria-hidden="true">${icon}</span><h3>${title}</h3></div>${questions.map(question=>`<button type="button" data-fullai-question="${esc(question)}">${esc(question)}</button>`).join('')}</article>`).join('');
  }
  function renderHistory(snapshot){
    const area=document.getElementById('aiwHistory');
    if(!area)return;
    area.innerHTML=snapshot.history.length?snapshot.history.map(chat=>`<button type="button" data-fullai-chat="${esc(chat.id)}" aria-current="${chat.id===snapshot.id}">${esc(chat.title)}</button>`).join(''):'<span class="aiw-empty">还没有本地会话</span>';
  }
  function renderConversation(snapshot){
    const area=document.getElementById('aiwConversation'),welcome=document.getElementById('aiwWelcome');
    if(!area||!welcome)return;
    welcome.hidden=!!snapshot.messages.length;
    area.hidden=!snapshot.messages.length;
    if(!snapshot.messages.length){area.replaceChildren();return}
    area.innerHTML=snapshot.messages.map(message=>message.role==='user'?`<div class="aiw-message user"><div>${esc(message.text)}</div></div>`:`<div class="aiw-message assistant"><span class="aiw-avatar" aria-hidden="true">✦</span><div><strong>AI 助手 · 页面参考答复</strong>${message.kind==='aeo'?window.HarmonyAeo.render(message):`<p>${esc(message.text)}</p>${message.link?`<a href="${esc(message.link)}" target="_blank" rel="noopener noreferrer">查看相关官方资料 ↗</a>`:''}`}</div></div>`).join('');
    const stage=document.getElementById('aiwStage');
    stage.scrollTop=snapshot.messages.at(-1)?.kind==='aeo'?0:stage.scrollHeight;
  }
  function refresh(){
    if(!root()||!assistant())return;
    const snapshot=assistant().getSnapshot();
    renderRecommendations();renderHistory(snapshot);renderConversation(snapshot);
  }
  function send(question){
    const value=String(question||'').trim();
    if(!value||!assistant())return;
    assistant().sendInPage(value);
    refresh();
    const input=document.querySelector('#aiwComposer textarea');
    if(input){input.value='';input.focus()}
  }
  function newChat(){assistant()?.newInPage();refresh();document.querySelector('#aiwComposer textarea')?.focus()}
  function mount(){
    if(!root()||!assistant())return;
    if(document.body.classList.contains('ais-open'))assistant().close();
    refresh();
  }
  document.addEventListener('click',event=>{
    if(!root())return;
    const button=event.target.closest('button');
    if(!button||!root().contains(button))return;
    if(button.hasAttribute('data-aeo-action')){const action=button.dataset.aeoAction;if(action==='copy'){window.HarmonyAeo.copySummary().then(ok=>{button.textContent=ok?'已复制':'复制失败'}).catch(()=>{button.textContent='复制失败'});return}if(action==='steps'){assistant()?.toggleAeoSteps();refresh();return}}
    if(button.hasAttribute('data-fullai-new'))newChat();
    else if(button.hasAttribute('data-fullai-shuffle')){state.batch=(state.batch+1)%batches.length;renderRecommendations()}
    else if(button.hasAttribute('data-fullai-question'))send(button.dataset.fullaiQuestion);
    else if(button.hasAttribute('data-fullai-chat')){assistant()?.restoreInPage(button.dataset.fullaiChat);refresh()}
  });
  document.addEventListener('submit',event=>{if(event.target.id!=='aiwComposer')return;event.preventDefault();send(event.target.elements.question.value)});
  document.addEventListener('keydown',event=>{if(event.target.matches('#aiwComposer textarea')&&event.key==='Enter'&&!event.shiftKey){event.preventDefault();send(event.target.value)}});
  window.AIWorkspace={mount,getRecommendations(){return batches[0]}};
  mount();
})();
