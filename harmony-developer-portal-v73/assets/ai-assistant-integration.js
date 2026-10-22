(() => {
  const main = document.getElementById('main');
  const base = 'https://developer.huawei.com/consumer/cn/';
  const configSource = 'https://developer.huawei.com/consumer/cn/doc/doccenter-getting-started/module-configuration-file#abilities%E6%A0%87%E7%AD%BE';
  const docs = [
    {id:'ability',kind:'API 参考',title:'UIAbilityContext / terminateSelf',description:'销毁当前 UIAbility，并理解 removeMissionAfterTerminate 对最近任务的影响。',keywords:'UIAbilityContext terminateSelf removeMissionAfterTerminate 销毁 任务 最近任务 API',source:configSource},
    {id:'ime',kind:'开发指南',title:'IME Kit 简介',description:'认识输入法服务、输入法框架及相关 API 的适用场景。',keywords:'IME Kit 输入法 键盘 inputMethodEngine inputMethod ExtensionAbility',source:base},
    {id:'cert',kind:'开发者成长',title:'开发者能力认证',description:'了解 HarmonyOS 课程与认证方向，规划开发者学习路径。',keywords:'开发者能力认证 鸿蒙 课程 学堂 认证 职业',source:base},
    {id:'prepare',kind:'开发指南',title:'应用开发准备',description:'从开发者注册、身份验证到开发环境准备，梳理开始应用开发前的事项。',keywords:'应用 开发 准备 注册 实名认证',source:base},
    {id:'biometric',kind:'开放能力',title:'开通生物特征认证能力',description:'从设备支持情况、接口版本和权限约束入手查阅认证能力。',keywords:'生物特征 认证 指纹 人脸 安全',source:base},
    {id:'video',kind:'视频学习',title:'多端协同 · 手表协同',description:'体验围绕课程片段提问、按回答中的时间点定位的学习流程。',keywords:'手表协同 多端协同 视频 课程 时间点',source:base}
  ];
  const imeSearchResults = [
    {title:'IME Kit简介',type:'docs',description:'IME Kit提供输入法框架和输入法开发服务相关能力，帮助编辑框所在应用与输入法应用完成交互。',path:'文档  >  指南与 API 参考  >  指南  >  应用框架  >  IME Kit（输入法开发服务）',url:'https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/ime-kit'},
    {title:'输入法开发服务术语  #IME Kit',type:'docs',description:'了解输入法开发服务中的常用概念，再根据输入法应用或自绘编辑框的场景选择对应接口。',path:'文档  >  指南与 API 参考  >  指南  >  应用框架  >  IME Kit',url:'https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V13/ime-api-V13'},
    {title:'新增和增强特性  #IME Kit',type:'docs',description:'查看 IME Kit 在系统版本中的接口变化和新增能力，核对适用设备与 API 版本。',path:'文档  >  版本说明  >  HarmonyOS 版本  >  API 变更清单',url:'https://developer.huawei.com/consumer/cn/doc/doccenter-release-notes/js-apidiff-imekit-6011'},
    {title:'针对 API 12 应用的变更  #IME Kit',type:'docs',description:'了解输入法及相关系统能力的行为变更，适配目标 API 版本时请以版本说明为准。',path:'文档  >  版本说明  >  HarmonyOS NEXT  >  接口行为变更',url:'https://developer.huawei.com/consumer/cn/doc/doccenter-release-notes/changelogs-from-next-db2'},
    {title:'IME Kit（输入法开发服务）',type:'docs',description:'浏览输入法开发服务的 ArkTS API、C API 与错误码目录。',path:'文档  >  指南与 API 参考  >  API 参考  >  应用框架',url:'https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V13/ime-api-V13'},
    {title:'在自绘编辑框中使用输入法  #IME Kit',type:'code',description:'通过 inputMethod 获取控制器，绑定输入法并监听插入、删除、选择和光标移动等操作。',path:'文档  >  指南与 API 参考  >  指南  >  输入法框架',url:'https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V13/use-inputmethod-in-custom-edit-box-V13'},
    {title:'输入法框架常见问题',type:'community',description:'查看输入法开发相关问题，以及悬浮键盘位置和尺寸等场景的说明。',path:'文档  >  开发 FAQ  >  输入法框架',url:'https://developer.huawei.com/consumer/cn/doc/doccenter-dev-faq/faqs-input-method-framework'}
  ];
  const chapters=[{at:0,label:'课程导入'},{at:192,label:'场景说明（示意）'},{at:438,label:'开发流程（示意）'},{at:706,label:'调试与验证（示意）'}];
  const state={query:'',doc:null,filter:'all',messages:[],seconds:0,playing:false,timer:null,recognition:null,voice:false,sessionId:Date.now().toString(36),sessionTime:Date.now(),historyOpen:false,immersive:false,assistantClosed:false,voiceOpen:false,voicePaused:false,voiceShared:true,voiceAnswer:null};
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const time=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
  const current=()=>docs.find(item=>item.id===state.doc);
  const historyKey='harmony-ai-search-history';
  const conversationKey='harmony-ai-conversation-history';
  const configCode=['{','  "name": "EntryAbility",','  "removeMissionAfterTerminate": true','}'].join(String.fromCharCode(10));
  function readHistory(){try{return JSON.parse(localStorage.getItem(historyKey)||'[]').filter(x=>typeof x==='string').slice(0,6)}catch{return []}}
  function remember(q){if(!q)return;try{localStorage.setItem(historyKey,JSON.stringify([q,...readHistory().filter(x=>x!==q)].slice(0,6)))}catch{}}
  function readConversations(){try{return JSON.parse(localStorage.getItem(conversationKey)||'[]').filter(x=>x&&Array.isArray(x.messages)).slice(0,12)}catch{return []}}
  function saveConversation(){if(!state.messages.length)return;const first=state.messages.find(x=>x.role==='user');const entry={id:state.sessionId,time:state.sessionTime,title:first?.text.slice(0,34)||'新对话',query:state.query,doc:state.doc,messages:state.messages};try{localStorage.setItem(conversationKey,JSON.stringify([entry,...readConversations().filter(x=>x.id!==entry.id)].slice(0,12)))}catch{}}
  function freshSession(){state.sessionId=Date.now().toString(36)+Math.random().toString(36).slice(2,6);state.sessionTime=Date.now();state.messages=[];state.historyOpen=false}
  function route(){return '#ai-search?query='+encodeURIComponent(state.query)+(state.doc?'&doc='+encodeURIComponent(state.doc):'')}
  function toast(message){document.querySelector('.aiw-status')?.remove();const node=document.createElement('div');node.className='aiw-status';node.setAttribute('role','status');node.textContent=message;document.body.appendChild(node);setTimeout(()=>node.remove(),2400)}
  function stopPlayback(){state.playing=false;if(state.timer){clearInterval(state.timer);state.timer=null}}
  function stopVoice(){if(state.recognition){try{state.recognition.abort()}catch{}state.recognition=null}state.voice=false;state.voiceOpen=false;state.voiceAnswer=null;document.querySelector('.aiw-voice-backdrop')?.remove();if(globalThis.speechSynthesis)globalThis.speechSynthesis.cancel()}
  function matches(query){const q=query.trim().toLowerCase();if(!q)return docs;const direct=docs.filter(item=>(item.title+' '+item.keywords+' '+item.description).toLowerCase().includes(q));if(direct.length)return direct;if(/输入法|键盘|ime/i.test(q))return docs.filter(x=>x.id==='ime');if(/销毁|任务|ability|terminate/i.test(q))return docs.filter(x=>x.id==='ability');if(/认证|学堂|课程/i.test(q))return docs.filter(x=>x.id==='cert'||x.id==='video');if(/手表|协同|视频/i.test(q))return docs.filter(x=>x.id==='video');return []}
  function imeResults(){
    const filters=[['all','全部'],['docs','文档'],['community','社区问答'],['code','示例代码'],['video','视频课程']];
    const visible=state.filter==='all'?imeSearchResults:imeSearchResults.filter(item=>item.type===state.filter);
    return `<div class="aiw-filter-row" aria-label="搜索结果分类">${filters.map(([key,label])=>`<button type="button" data-aiw-filter="${key}" class="${state.filter===key?'active':''}" aria-pressed="${state.filter===key}">${label}</button>`).join('')}<span>更多⌄</span></div><p class="aiw-result-count">找到${state.filter==='all'?'全部':''}相关内容：<b>${state.filter==='all'?'86':visible.length}</b><span>原型展示 ${visible.length} 条</span></p>${state.filter==='all'||state.filter==='docs'?`<div class="aiw-featured-result"><h2>IME Kit（输入法开发服务）</h2><p>输入法开发服务，负责建立编辑框所在应用与输入法应用之间的通信通道</p><button type="button" data-aiw-doc="ime">查看文档</button></div>`:''}<div class="aiw-search-list">${visible.length?visible.map(item=>`<a class="aiw-search-hit" href="${item.url}" target="_blank" rel="noopener noreferrer"><strong>${esc(item.title)}</strong><p>${esc(item.description)}</p><small>来自：${esc(item.path)}</small></a>`).join(''):'<div class="aiw-empty">当前示例中没有这个分类的 IME Kit 内容。可以切回“全部”查看其他结果。</div>'}</div>`
  }
  function results(){if(/^ime\s*kit$/i.test(state.query.trim()))return imeResults();const hits=matches(state.query);return `<div class="aiw-main-header"><div><h2>搜索结果</h2><p>选择内容后，右侧助手会关联当前文章或课程。</p></div><span>${hits.length?`找到 ${hits.length} 条相关内容`:'暂无精确匹配'}</span></div>${hits.length?hits.map(item=>`<button class="aiw-result" type="button" data-aiw-doc="${item.id}"><span class="aiw-result-kind">${item.kind}</span><strong>${item.title}</strong><p>${item.description}</p><small>华为开发者内容 · </small><em>打开并辅助阅读 →</em></button>`).join(''):`<div class="aiw-empty">当前本地示例库没有“${esc(state.query)}”的对应内容。可试试“UIAbilityContext”“IME Kit”“开发者能力认证”或“手表协同”；其他资源仍可使用页面原有搜索入口查找。</div>`}`}
  function abilityArticle(){return `<article class="aiw-article"><span class="aiw-result-kind">API 参考</span><h2>UIAbilityContext / terminateSelf</h2><p class="aiw-lead">销毁 UIAbility 自身，通过 callback 接收异步结果。此接口需在主线程调用。</p><h3 id="aiw-overview">调用方式</h3><pre>terminateSelf(callback: AsyncCallback&lt;void&gt;): void</pre><p>调用接口结束当前 UIAbility，并在回调中处理执行结果。</p><pre>this.context.terminateSelf((err) =&gt; {&#10;  if (err.code) {&#10;    console.error(err.message);&#10;    return;&#10;  }&#10;  console.info('UIAbility 已销毁');&#10;});</pre><h3 id="aiw-config">最近任务配置</h3><div class="aiw-field-note" id="aiw-field-note"><p>调用该接口后，任务中心默认仍保留该任务。如需同时清理任务，可在模块配置中将 <button class="aiw-field" type="button" data-aiw-field>removeMissionAfterTerminate ✧</button> 配置为 <code>true</code>。</p></div><p><code>false</code> 为默认值，销毁后保留最近任务；<code>true</code> 表示销毁后移除。2in1 设备和平板设备的自由多窗模式下，该配置不生效，默认移除任务。</p><h3 id="aiw-example">module.json5 示例</h3><pre>${esc(configCode)}</pre><button class="aiw-primary" type="button" data-aiw-copy>复制配置片段</button><div class="aiw-source">据附件中的交互示例整理；设备与版本限制请核对 <a href="${configSource}" target="_blank" rel="noopener noreferrer">官方 module.json5 配置说明 ↗</a>。</div></article>`}
  function imeArticle(){return `<article class="aiw-article"><span class="aiw-result-kind">开发指南</span><h2>IME Kit 简介</h2><p class="aiw-lead">IME Kit 建立应用编辑框与输入法应用之间的通信通道，帮助开发者构建输入法和自绘编辑框等能力。</p><h3 id="aiw-overview">适用场景</h3><ul><li>开发输入法本身：先看输入法服务与 <code>InputMethodExtensionAbility</code>。</li><li>在自绘编辑框中接入输入法：先看输入法框架与编辑框交互。</li><li>普通应用控制软键盘：核对 <code>inputMethod</code> 相关接口。</li></ul><h3 id="aiw-api">能力与 API</h3><p><code>inputMethodEngine</code> 面向输入法服务侧；<code>inputMethod</code> 面向使用或控制输入法的应用侧。具体方法、权限和版本需以对应 API 页面为准。</p><h3 id="aiw-check">开发前核对</h3><p>确认目标设备、系统与 API 版本，并逐项查看所选接口的起始版本、权限及调用约束。</p><div class="aiw-source">此处是附件中的阅读摘要，不替代完整文档。<a href="${base}" target="_blank" rel="noopener noreferrer">前往华为开发者官网检索 IME Kit ↗</a></div></article>`}
  function simpleArticle(item){const detail={cert:['华为开发者联盟学堂涵盖 HarmonyOS 课程与不同业务场景的认证考试。','先确定目标方向，再查阅课程、考试条件和认证说明。'],prepare:['应用开发前，先完成开发者注册及必要的身份验证。','随后准备开发环境，查看对应设备与应用形态的开发指南。'],biometric:['使用生物特征认证能力前，先确认设备支持情况、接口版本及权限约束。','打开完整文档后，再核对能力开通步骤与调用示例。']}[item.id];return `<article class="aiw-article"><span class="aiw-result-kind">${item.kind}</span><h2>${item.title}</h2><p class="aiw-lead">${detail[0]}</p><h3 id="aiw-overview">内容摘要</h3><p>${item.description}</p><h3 id="aiw-check">下一步</h3><p>${detail[1]}</p><div class="aiw-source">此处为附件中的阅读示例与摘要，具体条件以官网为准。<a href="${item.source}" target="_blank" rel="noopener noreferrer">前往华为开发者官网查找完整资料 ↗</a></div></article>`}
  function videoArticle(){const chapter=chapters.filter(x=>x.at<=state.seconds).at(-1)||chapters[0];return `<article class="aiw-article"><span class="aiw-result-kind">视频学习</span><h2>多端协同 · 手表协同</h2><p class="aiw-lead">选择片段或询问助手，体验“回答—时间点—回看片段”的学习流程。</p><div class="aiw-video-screen"><div><strong>多端协同 · 手表协同</strong><span id="aiw-video-caption">片段示意：${chapter.label}</span></div></div><div class="aiw-video-controls"><button type="button" data-aiw-play>${state.playing?'暂停':'播放示意'}</button><input id="aiw-video-range" type="range" min="0" max="1000" value="${state.seconds}" aria-label="示意课程时间点"><time id="aiw-video-time">${time(state.seconds)} / 16:40</time></div><p>此处没有接入官网视频或字幕；时间点及回答仅用于交互体验，不能视为原课程内容。</p><h3 id="aiw-chapters">片段索引</h3><div class="aiw-chapters">${chapters.map(x=>`<button type="button" class="${chapter.at===x.at?'active':''}" data-aiw-seek="${x.at}"><b>${time(x.at)}</b>${x.label}</button>`).join('')}</div><div class="aiw-source"><a href="${base}" target="_blank" rel="noopener noreferrer">前往华为开发者官网查找完整课程 ↗</a></div></article>`}
  function article(){const item=current();return `<div class="aiw-article-nav"><button type="button" data-aiw-results>← 返回搜索结果</button><a href="${item.source}" target="_blank" rel="noopener noreferrer">${item.id==='ability'?'查看官方配置说明':'前往官网查找完整资料'} ↗</a></div>${item.id==='ability'?abilityArticle():item.id==='ime'?imeArticle():item.id==='video'?videoArticle():simpleArticle(item)}`}
  function prompts(){switch(state.doc){case 'ability':return ['removeMissionAfterTerminate 是什么？','配置写在哪里？','不配置会怎样？'];case 'ime':return ['我的需求适合用 IME Kit 吗？','我该选哪个 API？','使用前要确认什么？'];case 'video':return ['概括当前片段','开发流程在哪里讲？','调试和验证在哪里讲？'];case 'cert':return ['这篇文章讲什么？','如何开始认证？'];default:return state.doc?['汇总文章','定位相关段落','下一步看什么？']:['UIAbilityContext 怎么配置？','IME Kit 适合什么场景？','手表协同课程在哪里？']}}
  function messageHTML(message){if(message.role==='user')return `<div class="aiw-message user">${esc(message.text)}</div>`;const a=message.answer;return `<div class="aiw-message"><strong>✦ ${esc(a.title)}</strong><p>${esc(a.body)}</p>${a.code?`<pre>${esc(a.code)}</pre><button type="button" data-aiw-copy>复制配置片段</button>`:''}${a.anchor?`<button type="button" data-aiw-locate="${a.anchor}">定位相关段落 →</button>`:''}${Number.isInteger(a.seek)?`<button type="button" data-aiw-seek="${a.seek}">▶ 跳到 ${time(a.seek)}（示意）</button>`:''}${a.source?`<a href="${a.source}" target="_blank" rel="noopener noreferrer">查看参考来源 ↗</a>`:''}</div>`}
  function historyPanel(){const entries=readConversations();return `<div class="aiw-history-panel" id="aiw-history-panel"><div class="aiw-history-heading"><strong>历史对话</strong><span>仅保存在当前浏览器</span></div>${entries.length?entries.map(entry=>`<button type="button" data-aiw-conversation="${esc(entry.id)}"><strong>${esc(entry.title)}</strong><small>${new Date(entry.time).toLocaleString('zh-CN')} · ${esc(docs.find(x=>x.id===entry.doc)?.title||'搜索结果')}</small></button>`).join(''):'<p>还没有历史对话。发送问题后会自动保存在这里。</p>'}</div>`}
  function assistant(){
    const item=current(),context=item?`${item.kind}：${item.title}`:state.query?`搜索：${state.query}`:'搜索与辅助阅读';
    const intro=item?`已关联当前${item.kind}。可概括、定位、追问，并查看参考来源。`:'输入主题或打开结果，助手会随阅读内容更新上下文。';
    return `<aside class="aiw-assistant" id="aiw-assistant" aria-label="上下文 AI 助手"><div class="aiw-assistant-head"><span class="aiw-brand-icon" aria-hidden="true"></span><strong>AI 助手</strong><div class="aiw-head-actions"><button type="button" data-aiw-new aria-label="打开新对话" title="新对话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-5 8l4 2v-5"/><circle cx="18" cy="17" r="4"/><path d="M18 15v4m-2-2h4"/></svg></button><button type="button" data-aiw-history-toggle aria-label="查看历史对话" aria-expanded="${state.historyOpen}" title="历史对话"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3M4 5l-2 2"/></svg></button><button type="button" data-aiw-immersive aria-label="${state.immersive?'退出沉浸模式':'沉浸模式浏览'}" aria-pressed="${state.immersive}" title="${state.immersive?'退出沉浸模式':'沉浸模式'}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><rect x="6" y="7" width="12" height="10" rx="1" fill="currentColor" stroke="none"/></svg></button><button type="button" data-aiw-close aria-label="关闭 AI 助手" title="关闭 AI 助手"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div></div>${state.historyOpen?historyPanel():''}<div class="aiw-context">当前上下文：<b>${esc(context)}</b><br>${intro}</div><div class="aiw-conversation" id="aiw-conversation" aria-live="polite">${state.messages.length?state.messages.map(messageHTML).join(''):`<div class="aiw-message"><strong>可以帮你做什么？</strong><p>${intro}</p></div>`}</div><div class="aiw-assistant-foot"><div class="aiw-prompts">${prompts().map(text=>`<button type="button" data-aiw-question="${esc(text)}">${esc(text)}</button>`).join('')}</div><form class="aiw-compose" id="aiw-compose"><input name="question" aria-label="继续向 AI 助手提问" maxlength="240" placeholder="继续提问当前内容…"><button type="submit">发送</button><button type="button" data-aiw-voice aria-label="打开语音对话" title="语音对话">🎙</button></form><p>预设交互示例；未接入实时 AI、账号数据或真实课程字幕。</p></div></aside>`
  }
  function render(){
    const item=current(),hist=readHistory(),searchMode=Boolean(state.query&&!item),imeMode=searchMode&&/^ime\s*kit$/i.test(state.query.trim());
    document.getElementById('searchModal')?.classList.remove('open');
    document.getElementById('aiPanel')?.classList.remove('open');
    main.innerHTML=`<div class="aiw-page${searchMode?' search-results-mode':''}${imeMode?' ime-results-mode':''}"><div class="aiw-topline"><button class="aiw-back" type="button" data-aiw-home>← 返回首页</button><small>资源搜索与 AI 助手</small></div><section class="aiw-hero"><small>HARMONYOS DEVELOPER · RESOURCE SEARCH</small><h1>${item?'边阅读，边理解':'搜索官方内容，再进一步提问'}</h1><p>${item?'助手会关联当前内容，并给出可核对的段落、配置或示意时间点。':'输入关键词，打开文章或课程，再围绕当前内容追问。'}</p><form class="aiw-searchbar" id="aiw-search-form"><input name="query" value="${esc(state.query)}" aria-label="搜索资源关键词" placeholder="试试 UIAbilityContext、IME Kit 或手表协同"><button type="submit">搜索资源</button></form><div class="aiw-search-meta"><span>搜索历史</span>${hist.map(text=>`<button type="button" data-aiw-history="${esc(text)}">${esc(text)}</button>`).join('')}${hist.length?'<button type="button" data-aiw-clear-history>清除历史</button>':''}</div></section><div class="aiw-layout"><div class="aiw-main">${item?article():results()}</div></div></div>`;
    document.title=(item?item.title+' · ':'资源搜索 · ')+'HarmonyOS Developer';
    main.focus({preventScroll:true});
  }
  function open(query='',doc=null,push=true){saveConversation();stopPlayback();stopVoice();state.query=query.trim().slice(0,120);state.doc=docs.some(item=>item.id===doc)?doc:null;state.filter='all';freshSession();state.seconds=0;state.assistantClosed=false;state.immersive=false;if(state.query)remember(state.query);render();if(push)history.pushState(null,'',route());if(state.query)globalThis.HarmonyStandaloneAI?.openWithQuery(state.query);window.scrollTo({top:0,behavior:'smooth'})}
  function answer(question){const q=question.trim(),item=current();if(!item){if(/输入法|ime/i.test(q))return {title:'IME Kit 相关内容',body:'可打开 IME Kit 简介，助手会切换到输入法开发上下文。',source:base};if(/手表|协同|课程/i.test(q))return {title:'课程片段学习',body:'可打开“多端协同 · 手表协同”，按示意时间点查看片段并继续追问。',source:base};if(/ability|terminate|任务|配置/i.test(q))return {title:'UIAbilityContext 相关内容',body:'可打开 UIAbilityContext / terminateSelf，点击文中的 removeMissionAfterTerminate 字段查看配置解读。',source:configSource};return {title:'继续探索',body:'本地示例库包含 UIAbilityContext、IME Kit、开发者能力认证和多端协同课程。若需要其他主题，请使用页面原有的官方资源搜索。'}}
    if(item.id==='ability'){
      if(/默认|不配置|false/i.test(q))return {title:'默认保留最近任务',body:'该字段可省略，默认值为 false，UIAbility 销毁后任务仍保留在最近任务列表。2in1 和平板自由多窗模式属于例外，应核对官方说明。',anchor:'aiw-config',source:configSource};
      if(/配置|哪里|文件|怎么写|remove/i.test(q))return {title:'控制销毁后是否移除最近任务',body:'terminateSelf() 销毁当前 UIAbility；removeMissionAfterTerminate 是 module.json5 中对应 UIAbility 的配置项，不是 terminateSelf() 的调用参数。设为 true 可在销毁后移除任务。',code:configCode,anchor:'aiw-config',source:configSource};
      if(/设备|平板|多窗/i.test(q))return {title:'设备差异',body:'附件中的字段说明指出：2in1 设备与平板设备的自由多窗模式下，该配置不生效，默认移除任务。具体版本条件请以官方文档为准。',anchor:'aiw-config',source:configSource};
      return {title:'terminateSelf 概要',body:'此接口用于销毁当前 UIAbility，通过 callback 接收异步结果；是否从最近任务移除由模块配置项控制。',anchor:'aiw-overview',source:configSource};
    }
    if(item.id==='ime'){
      if(/适合|场景|区别/i.test(q))return {title:'按开发场景选择能力',body:'开发输入法本身先看输入法服务；自绘编辑框接入输入法先看输入法框架；普通应用控制软键盘则核对 inputMethod。',anchor:'aiw-overview',source:base};
      if(/api|接口|哪个/i.test(q))return {title:'API 入口',body:'inputMethodEngine 面向输入法服务侧，inputMethod 面向使用或控制输入法的应用侧，InputMethodExtensionAbility 是输入法应用的扩展能力入口。',anchor:'aiw-api',source:base};
      return {title:'开发前核对',body:'先确认设备、系统与 API 版本，再核对接口权限及调用约束。当前文章是概览，不足以判断具体设备上某一接口是否可用。',anchor:'aiw-check',source:base};
    }
    if(item.id==='video'){
      const part=/场景|协同/.test(q)?chapters[1]:/流程|步骤|开发/.test(q)?chapters[2]:/调试|验证|排查/.test(q)?chapters[3]:chapters.filter(x=>x.at<=state.seconds).at(-1)||chapters[0];
      return {title:part.label,body:'可跳到该示意时间点体验从答案回看课程。此页面未接入真实视频和字幕，不能据此推断原课程内容。',seek:part.at,source:base};
    }
    return {title:/定位/.test(q)?'相关段落':'文章摘要',body:`${item.description} ${item.id==='cert'?'可先确定目标认证方向，再核对课程与考试要求。':item.id==='prepare'?'开发前应核对账号与环境准备事项。':'开通前需确认设备支持、接口版本及权限约束。'}`,anchor:/定位/.test(q)?'aiw-check':'aiw-overview',source:item.source};
  }
  function ask(question){const q=question.trim();if(!q)return;const response=answer(q);state.messages.push({role:'user',text:q},{role:'assistant',answer:response});saveConversation();const box=main.querySelector('#aiw-conversation');if(box){box.innerHTML=state.messages.map(messageHTML).join('');box.scrollTop=box.scrollHeight}const input=main.querySelector('#aiw-compose input');if(input)input.value='';return response}
  function seek(seconds){state.seconds=Math.max(0,Math.min(1000,Math.floor(seconds)));const chapter=chapters.filter(item=>item.at<=state.seconds).at(-1)||chapters[0],range=main.querySelector('#aiw-video-range'),clock=main.querySelector('#aiw-video-time'),caption=main.querySelector('#aiw-video-caption');if(range)range.value=state.seconds;if(clock)clock.textContent=time(state.seconds)+' / 16:40';if(caption)caption.textContent='片段示意：'+chapter.label;main.querySelectorAll('.aiw-chapters button').forEach(button=>button.classList.toggle('active',Number(button.dataset.aiwSeek)===chapter.at))}
  function togglePlay(){if(state.playing){stopPlayback();main.querySelector('[data-aiw-play]').textContent='播放示意';return}state.playing=true;main.querySelector('[data-aiw-play]').textContent='暂停';state.timer=setInterval(()=>{if(state.seconds>=1000){stopPlayback();main.querySelector('[data-aiw-play]').textContent='播放示意';return}seek(state.seconds+1)},1000)}
  function renderVoice(){
    document.querySelector('.aiw-voice-backdrop')?.remove();
    const context=current()?.title||'搜索结果';
    const layer=document.createElement('div');layer.className='aiw-voice-backdrop';layer.id='aiw-voice-backdrop';
    layer.innerHTML=`<section class="aiw-voice-dialog" role="dialog" aria-modal="true" aria-labelledby="aiw-voice-title"><header><h2 id="aiw-voice-title">✦ AI助手 · 语音对话</h2><button type="button" data-aiw-voice-close aria-label="关闭语音对话">×</button></header><div class="aiw-voice-status"><i class="${state.voicePaused?'paused':''}" aria-hidden="true"></i><span>${state.voicePaused?'已暂停聆听':state.voiceAnswer?'已整理回答':'正在聆听…'}</span></div>${state.voiceShared?`<div class="aiw-voice-context">当前页面：${esc(context)}<button type="button" data-aiw-voice-unshare aria-label="取消共享当前页面">×</button></div>`:'<div class="aiw-voice-context unshared">当前页面未共享</div>'}<p class="aiw-voice-note">${state.voiceShared?'当前使用模拟语音流程，不会调用麦克风；点击“模拟语音提问”体验。':'未共享页面，示例回答不会使用当前文章内容。'}</p>${state.voiceAnswer?`<div class="aiw-voice-answer"><small>你问：${esc(state.voiceAnswer.question)}</small><strong>✦ AI 助手</strong><p>${esc(state.voiceAnswer.body)}</p></div>`:''}<footer><button type="button" class="aiw-voice-demo" data-aiw-voice-demo ${state.voicePaused?'disabled':''}>模拟语音提问</button><div><button type="button" data-aiw-voice-pause>${state.voicePaused?'继续聆听':'暂停聆听'}</button><button type="button" data-aiw-voice-text>切回文字</button></div></footer></section>`;
    document.body.appendChild(layer);layer.querySelector('[data-aiw-voice-close]').focus();
  }
  function voice(){state.voiceOpen=true;state.voicePaused=false;state.voiceShared=true;state.voiceAnswer=null;renderVoice()}
  function demoVoice(){
    if(state.voicePaused)return;
    const question=state.voiceShared?(state.doc==='ability'?'removeMissionAfterTerminate 怎么配置？':state.doc==='ime'?'我该选哪个 API？':state.doc==='video'?'开发流程在哪里讲？':state.doc==='cert'?'这篇文章讲什么？':'请结合当前页面给我一个摘要'):'不共享页面时可以怎样提问？';
    let response;
    if(state.voiceShared)response=ask(question);
    else{response={title:'通用提问提示',body:'当前页面未共享。可以用文字描述你的问题；本地示例不会读取文章内容。'};state.messages.push({role:'user',text:question},{role:'assistant',answer:response});saveConversation();const box=main.querySelector('#aiw-conversation');if(box){box.innerHTML=state.messages.map(messageHTML).join('');box.scrollTop=box.scrollHeight}}
    state.voiceAnswer={question,body:response.body};renderVoice();
  }
  document.addEventListener('click',event=>{
    const voiceAction=event.target.closest('[data-aiw-voice-close],[data-aiw-voice-demo],[data-aiw-voice-pause],[data-aiw-voice-text],[data-aiw-voice-unshare]');
    if(voiceAction||event.target.id==='aiw-voice-backdrop'){
      event.preventDefault();event.stopImmediatePropagation();
      if(voiceAction?.hasAttribute('data-aiw-voice-demo'))demoVoice();
      else if(voiceAction?.hasAttribute('data-aiw-voice-pause')){state.voicePaused=!state.voicePaused;renderVoice()}
      else if(voiceAction?.hasAttribute('data-aiw-voice-unshare')){state.voiceShared=false;renderVoice()}
      else{const toText=voiceAction?.hasAttribute('data-aiw-voice-text');stopVoice();main.querySelector(toText?'#aiw-compose input':'[data-aiw-voice]')?.focus()}
      return;
    }
    const homeAsk=event.target.closest('[data-home-ask-ai]'),topAi=event.target.closest('#topAi'),modalAsk=event.target.closest('#launchAiSearchFromModal');
    if(homeAsk||topAi||modalAsk){event.preventDefault();event.stopImmediatePropagation();if(homeAsk||topAi){globalThis.HarmonyStandaloneAI?.open();return}open(document.getElementById('modalInput')?.value||'');return}
    const action=event.target.closest('[data-aiw-doc],[data-aiw-filter],[data-aiw-results],[data-aiw-home],[data-aiw-history],[data-aiw-clear-history],[data-aiw-question],[data-aiw-field],[data-aiw-copy],[data-aiw-locate],[data-aiw-seek],[data-aiw-play],[data-aiw-voice],[data-aiw-new],[data-aiw-history-toggle],[data-aiw-immersive],[data-aiw-close],[data-aiw-reopen],[data-aiw-conversation]');if(!action)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(action.hasAttribute('data-aiw-filter')){state.filter=action.dataset.aiwFilter;render();return}
    if(action.hasAttribute('data-aiw-new')){saveConversation();freshSession();render();main.querySelector('#aiw-compose input')?.focus();return}
    if(action.hasAttribute('data-aiw-history-toggle')){state.historyOpen=!state.historyOpen;render();main.querySelector('[data-aiw-history-toggle]')?.focus();return}
    if(action.hasAttribute('data-aiw-conversation')){const entry=readConversations().find(x=>x.id===action.dataset.aiwConversation);if(entry){saveConversation();state.query=entry.query||'';state.doc=docs.some(x=>x.id===entry.doc)?entry.doc:null;state.messages=entry.messages;state.sessionId=entry.id;state.sessionTime=entry.time;state.historyOpen=false;state.assistantClosed=false;render();history.pushState(null,'',route())}return}
    if(action.hasAttribute('data-aiw-immersive')){state.immersive=!state.immersive;render();main.querySelector('[data-aiw-immersive]')?.focus();return}
    if(action.hasAttribute('data-aiw-close')){state.assistantClosed=true;state.immersive=false;state.historyOpen=false;stopVoice();render();main.querySelector('[data-aiw-reopen]')?.focus();return}
    if(action.hasAttribute('data-aiw-reopen')){state.assistantClosed=false;render();main.querySelector('#aiw-compose input')?.focus();return}
    if(action.hasAttribute('data-aiw-doc')){open(state.query,action.dataset.aiwDoc);return}
    if(action.hasAttribute('data-aiw-results')){open(state.query);return}
    if(action.hasAttribute('data-aiw-home')){stopPlayback();stopVoice();document.title='HarmonyOS Developer — 鸿蒙开发者门户';document.querySelector('[data-view="home"]').click();return}
    if(action.hasAttribute('data-aiw-history')){open(action.dataset.aiwHistory);return}
    if(action.hasAttribute('data-aiw-clear-history')){try{localStorage.removeItem(historyKey)}catch{}render();return}
    if(action.hasAttribute('data-aiw-question')){globalThis.HarmonyStandaloneAI?.ask(action.dataset.aiwQuestion);return}
    if(action.hasAttribute('data-aiw-field')){main.querySelector('#aiw-field-note')?.classList.add('active');globalThis.HarmonyStandaloneAI?.ask('removeMissionAfterTerminate 是什么？配置写在哪里？');return}
    if(action.hasAttribute('data-aiw-copy')){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(configCode).then(()=>toast('配置片段已复制')).catch(()=>toast('当前环境无法复制，请手动选择代码'));else toast('当前环境无法复制，请手动选择代码');return}
    if(action.hasAttribute('data-aiw-locate')){main.querySelector('#'+action.dataset.aiwLocate)?.scrollIntoView({behavior:'smooth',block:'center'});return}
    if(action.hasAttribute('data-aiw-seek')){seek(Number(action.dataset.aiwSeek));main.querySelector('.aiw-video-screen')?.scrollIntoView({behavior:'smooth',block:'nearest'});return}
    if(action.hasAttribute('data-aiw-play')){togglePlay();return}
    if(action.hasAttribute('data-aiw-voice'))voice();
  },true);
  document.addEventListener('submit',event=>{if(event.target.id==='homeSearch'){const query=event.target.querySelector('#homeQuery')?.value.trim();if(!query)return;event.preventDefault();event.stopImmediatePropagation();globalThis.HarmonyStandaloneAI?.close();open(query);return}if(event.target.id==='aiw-search-form'){event.preventDefault();event.stopImmediatePropagation();open(event.target.elements.query.value);return}if(event.target.id==='aiw-compose'){event.preventDefault();event.stopImmediatePropagation();ask(event.target.elements.question.value)}},true);
  document.addEventListener('input',event=>{if(event.target.id==='aiw-video-range')seek(Number(event.target.value))});
  document.addEventListener('keydown',event=>{
    if(state.voiceOpen&&event.key==='Tab'){
      const buttons=[...document.querySelectorAll('.aiw-voice-dialog button:not([disabled])')];
      if(!buttons.length)return;
      if(event.shiftKey&&document.activeElement===buttons[0]){event.preventDefault();buttons.at(-1).focus()}
      else if(!event.shiftKey&&document.activeElement===buttons.at(-1)){event.preventDefault();buttons[0].focus()}
      return;
    }
    if(event.key!=='Escape')return;
    if(state.voiceOpen){event.preventDefault();stopVoice();main.querySelector('[data-aiw-voice]')?.focus()}
    else if(state.immersive){event.preventDefault();state.immersive=false;render()}
    else if(state.historyOpen){event.preventDefault();state.historyOpen=false;render()}
  },true);
  function restore(){if(!location.hash.startsWith('#ai-search')){stopPlayback();stopVoice();document.title='HarmonyOS Developer — 鸿蒙开发者门户';return}const params=new URLSearchParams(location.hash.split('?')[1]||'');open(params.get('query')||'',params.get('doc')||null,false)}
  window.addEventListener('popstate',restore);
  if(location.hash.startsWith('#ai-search'))restore();
})();
