// 실적 리포트: admin sales/members/applications fused with GA4 visits (data: live.business from the encrypted vault).
(()=>{
const css=`.biz-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.biz-kpi{border:1px solid var(--line);border-radius:12px;padding:16px;background:#fff}
.biz-kpi span{font-size:12px;color:var(--muted)}.biz-kpi b{display:block;font-size:24px;letter-spacing:-.6px;margin:8px 0 6px}.biz-kpi small{font-size:12px}
.biz-up{color:#28a27d}.biz-down{color:#d1574b}.biz-flat{color:var(--muted)}
.biz-flow{display:grid;grid-template-columns:1fr 1fr;gap:14px}.biz-flow h3,.biz-mix h3{font-size:13px;color:#526078;margin:0 0 10px}
.biz-step{display:flex;align-items:center;gap:10px;margin:8px 0;font-size:13px}.biz-step>span:first-child{width:92px;flex:none}.biz-track{flex:1;height:10px;border-radius:5px;background:#f0f2f7;overflow:hidden}.biz-track i{display:block;height:100%;border-radius:5px;background:#7181ed;min-width:3px}
.biz-step em{font-style:normal;color:var(--muted);font-size:11px;width:104px;flex:none;text-align:right;white-space:nowrap}.biz-step b{width:72px;flex:none;text-align:right}
.biz-mix{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.biz-mix>div{border:1px solid var(--line);border-radius:12px;padding:16px}
.biz-row{display:flex;justify-content:space-between;font-size:13px;margin:7px 0;gap:10px}.biz-row span{color:#526078}
.biz-year{margin-top:22px}.biz-year table td,.biz-year table th{text-align:right;white-space:nowrap}.biz-year table td:first-child,.biz-year table th:first-child{text-align:left}
.biz-bar{display:inline-block;height:8px;border-radius:4px;background:#b8c1f6;vertical-align:middle;margin-right:8px}.biz-total td{font-weight:700;background:#fafbfc}
.biz-callouts{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0}.biz-callouts div{background:#f6f7ff;border-radius:10px;padding:14px}.biz-callouts span{font-size:11px;color:var(--muted)}.biz-callouts b{display:block;font-size:17px;margin-top:6px}
.biz-scroll{overflow-x:auto}
@media(max-width:900px){.biz-kpis,.biz-callouts{grid-template-columns:repeat(2,1fr)}.biz-flow,.biz-mix{grid-template-columns:1fr}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>v==null?'—':Math.round(v).toLocaleString('ko-KR');
const won=v=>v==null?'—':n(v)+'원', man=v=>v==null?'—':(v>=1e8?(v/1e8).toFixed(2)+'억':Math.round(v/10000).toLocaleString('ko-KR')+'만')+' 원';
const pc=(a,b)=>!a?null:(b-a)/a*100, share=(a,b)=>b?Math.round(a/b*1000)/10:0;
const delta=(v,good=1)=>v==null?'<small class="biz-flat">비교 불가</small>':`<small class="${Math.abs(v)<.5?'biz-flat':(v*good>0?'biz-up':'biz-down')}">${v>0?'▲':v<0?'▼':''} ${Math.abs(v).toFixed(1)}% (전월 대비)</small>`;
const mname=m=>`${m.year}년 ${m.label}`+(m.partial?' (진행 중)':'');
function insights(c,p,b){let good=[],warn=[],ch=b.change;
 if(ch.sales>0)good.push(`${c.label} 매출은 ${man(c.sales)}으로 ${p.label}보다 ${ch.sales}% 늘었습니다.`);else warn.push(`${c.label} 매출은 ${man(c.sales)}으로 ${p.label}보다 ${Math.abs(ch.sales)}% 줄었습니다.`);
 if(ch.shipPayments>0)good.push(`배송대행 결제가 ${n(p.shipPayments)}건에서 ${n(c.shipPayments)}건으로 늘었습니다.`);else warn.push(`배송대행 결제가 ${n(p.shipPayments)}건에서 ${n(c.shipPayments)}건으로 줄었습니다.`);
 if(ch.visitors>0&&ch.newMembers<0)warn.push(`사이트 방문자는 ${ch.visitors}% 늘었는데 신규 회원은 ${Math.abs(ch.newMembers)}% 줄었습니다. 가입 화면이나 가입 안내를 확인해 보세요.`);
 else if(ch.newMembers>0)good.push(`신규 회원이 ${n(p.newMembers)}명에서 ${n(c.newMembers)}명으로 늘었습니다.`);
 let buyShare=share(c.buySales,c.sales);if(buyShare>=25)good.push(`구매대행이 매출의 ${buyShare}%를 차지합니다. 구매대행 금액에는 상품 값이 들어 있어 실제 수수료 이익은 더 작습니다.`);
 let cov=share(c.gaApplications,c.applications);warn.push(`GA4는 ${c.label} 배송대행 신청 ${n(c.applications)}건 중 ${n(c.gaApplications)}건(${cov}%)만 기록했습니다. 신청·결제는 관리자 숫자를 기준으로 보세요.`);
 let adm=share(c.adminViews,c.adminViews+c.customerViews);if(adm>=10)warn.push(`GA4 페이지 조회의 ${adm}%가 직원이 본 관리자 화면입니다. 고객 숫자를 보려면 관리자 화면을 GA4에서 빼야 합니다.`);
 return {good,warn}}
function section(tone,tag,title,body){return `<section class="easy-section ${tone}"><div class="easy-tag">${tag}</div><h2>${E(title)}</h2>${body}</section>`}
window.renderBusiness=function(b){if(!b||!b.months)return '<p>실적 데이터가 아직 없습니다.</p>';
 const ms=b.months,c=ms.find(m=>m.month===b.current),p=ms.find(m=>m.month===b.previous),ch=b.change;
 const kpis=[['매출',man(c.sales),ch.sales],['배송대행 결제',n(c.shipPayments)+'건',ch.shipPayments],['신규 회원',n(c.newMembers)+'명',ch.newMembers],['사이트 방문자',n(c.visitors)+'명',ch.visitors]]
  .map(([k,v,d])=>`<div class="biz-kpi"><span>${k}</span><b>${v}</b>${delta(d)}</div>`).join('');
 const people=[['사이트 방문자',c.visitors],['처음 온 사람',c.newVisitors],['신규 회원',c.newMembers]],work=[['배송대행 신청',c.applications],['배송대행 결제',c.shipPayments]];
 const bars=(rows,unit)=>{let mx=Math.max(...rows.map(r=>r[1]||0),1);return rows.map(([k,v],i)=>`<div class="biz-step"><span>${k}</span><span class="biz-track"><i style="width:${Math.max(1,(v||0)/mx*100)}%"></i></span><b>${n(v)}${unit}</b><em>${i?`앞 단계의 ${share(v,rows[i-1][1])}%`:''}</em></div>`).join('')};
 const ins=insights(c,p,b);
 const payTotal=c.payCountDeposit+c.payCountBank+c.payCountCard;
 const mix=`<div class="biz-mix"><div><h3>매출 구성</h3><div class="biz-row"><span>배송대행 청구액</span><b>${won(c.shipSales)}</b></div><div class="biz-row"><span>구매대행 청구액</span><b>${won(c.buySales)}</b></div><div class="biz-row"><span>배송대행 비중</span><b>${share(c.shipSales,c.sales)}%</b></div></div>
  <div><h3>배송대행 결제 방법</h3><div class="biz-row"><span>예치금으로만</span><b>${n(c.payCountDeposit)}건 (${share(c.payCountDeposit,payTotal)}%)</b></div><div class="biz-row"><span>계좌이체</span><b>${n(c.payCountBank)}건</b></div><div class="biz-row"><span>카드</span><b>${n(c.payCountCard)}건</b></div><div class="biz-row"><span>카드 수수료</span><b>${won(c.cardFee)}</b></div></div>
  <div><h3>효율</h3><div class="biz-row"><span>배송대행 1건 평균</span><b>${won(c.avgShip)}</b></div><div class="biz-row"><span>방문자 1명당 매출</span><b>${won(c.visitors?c.sales/c.visitors:null)}</b></div><div class="biz-row"><span>처음 온 사람 → 가입</span><b>${share(c.newMembers,c.newVisitors)}%</b></div><div class="biz-row"><span>예치금 충전</span><b>${man(c.topups)} · ${n(c.topupCount)}건</b></div></div></div>`;
 const ch2=Object.entries(c.channels||{}).sort((a,b)=>b[1]-a[1]),chTot=ch2.reduce((s,x)=>s+x[1],0);
 const chan=`<div class="biz-mix" style="grid-template-columns:1fr"><div><h3>어디서 왔나 (${c.label} 방문 ${n(chTot)}번)</h3>${ch2.map(([k,v])=>`<div class="biz-step"><span>${E(k)}</span><span class="biz-track"><i style="width:${Math.max(1,v/(ch2[0][1]||1)*100)}%"></i></span><b>${share(v,chTot)}%</b><em>${n(v)}번</em></div>`).join('')}</div></div>`;
 // 12-month summary card
 const mx=Math.max(...ms.map(m=>m.sales)),full=ms.filter(m=>!m.partial),avg=full.reduce((s,m)=>s+m.sales,0)/full.length;
 const rows=ms.map(m=>`<tr><td>${E(m.label)}${m.partial?' <small class="biz-flat">진행 중</small>':''}</td><td><span class="biz-bar" style="width:${Math.round(m.sales/mx*70)}px"></span>${man(m.sales)}</td><td>${n(m.shipPayments)}</td><td>${n(m.buyPayments)}</td><td>${n(m.newMembers)}</td><td>${n(m.visitors)}</td><td>${n(m.applications)}</td><td>${won(m.avgShip)}</td></tr>`).join('');
 const y=b.year,yr=`<section class="card biz-year"><div class="cardhead"><h2>지난 12개월 요약</h2><span class="small">${E(ms[0].year+'년 '+ms[0].label)} ~ ${E(mname(ms[ms.length-1]))}</span></div>
  <div class="biz-callouts"><div><span>12개월 매출</span><b>${man(y.sales)}</b></div><div><span>월평균 (완료된 달)</span><b>${man(avg)}</b></div><div><span>가장 많은 달</span><b>${E(ms.find(m=>m.month===b.best.month).label)} · ${man(b.best.sales)}</b></div><div><span>가장 적은 달</span><b>${E(ms.find(m=>m.month===b.worst.month).label)} · ${man(b.worst.sales)}</b></div></div>
  <div class="biz-scroll"><table><thead><tr><th>월</th><th>매출</th><th>배송대행 결제</th><th>구매대행 결제</th><th>신규 회원</th><th>방문자</th><th>배송대행 신청</th><th>배송 1건 평균</th></tr></thead><tbody>${rows}
  <tr class="biz-total"><td>합계</td><td>${man(y.sales)}</td><td>${n(y.shipPayments)}</td><td>${n(y.buyPayments)}</td><td>${n(y.newMembers)}</td><td>—</td><td>${n(y.applications)}</td><td>${won(y.shipPayments?y.shipSales/y.shipPayments:null)}</td></tr></tbody></table></div>
  <p class="note">방문자는 달마다 따로 센 숫자라 합계를 내지 않습니다. 배송대행 ${man(y.shipSales)} · 구매대행 ${man(y.buySales)} · 예치금 충전 ${man(y.topups)}(매출에 미포함).</p></section>`;
 return `<div class="easy-report-head"><div><div class="easy-tag">실적 리포트</div><h2>${E(mname(c))} 실적 · ${E(p.label)}과 비교</h2><p>관리자 페이지의 실제 결제·회원·신청 숫자와 GA4 방문 숫자를 합쳤습니다. ${E(b.throughDate)}까지 집계.</p></div></div>
 <div class="biz-kpis">${kpis}</div>
 ${section('summary','흐름',`${c.label} 방문에서 결제까지`,`<div class="biz-flow"><div><h3>사람</h3>${bars(people,'명')}</div><div><h3>일</h3>${bars(work,'건')}<div class="biz-step"><span>구매대행 결제</span><span class="biz-track"></span><b>${n(c.buyPayments)}건</b><em>별도 서비스</em></div></div></div>`)}
 ${section('info','돈',`${c.label} 매출 자세히`,mix+chan)}
 ${ins.good.length?section('good','좋아요','잘되고 있는 점','<ul>'+ins.good.map(t=>`<li>${E(t)}</li>`).join('')+'</ul>'):''}
 ${section('warn','확인','살펴볼 점','<ul>'+ins.warn.map(t=>`<li>${E(t)}</li>`).join('')+'</ul>')}
 ${yr}<p class="note">${b.notes.map(E).join('<br>')}</p>`};
})();
