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
.biz-trend{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:18px 0}.biz-trend .card{padding:18px}.biz-trend h3{font-size:14px;margin:0 0 4px}.biz-legend{display:flex;gap:14px;font-size:11px;color:var(--muted);margin:6px 0 4px}.biz-legend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px;vertical-align:-1px}
.biz-trend svg text{font-size:10px;fill:#9ca5b5}.biz-trend svg .val{fill:#526078;font-size:9.5px}
@media(max-width:900px){.biz-kpis,.biz-callouts{grid-template-columns:repeat(2,minmax(0,1fr))}.biz-flow,.biz-mix,.biz-trend{grid-template-columns:1fr}}
@media(max-width:720px){.biz-step{gap:8px;font-size:12px}.biz-step>span:first-child{width:72px}.biz-step b{width:auto;white-space:nowrap}.biz-step em{display:none}.biz-kpi b{font-size:20px}.biz-mix>div,.biz-trend .card{padding:14px}}`;
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
// 12-month trends: stacked sales bars, and new members vs paying volume
const C={ship:'#5169ee',buy:'#b8c1f6',mem:'#28a27d',pay:'#5169ee'};
function trends(ms){const W=520,H=210,L=44,R=40,T=14,B=26,iw=W-L-R,ih=H-T-B,bw=iw/ms.length,x=i=>L+bw*i+bw/2;
 const axis=(mx,fmt)=>[0,.5,1].map(f=>`<line x1="${L}" x2="${W-R}" y1="${T+ih*(1-f)}" y2="${T+ih*(1-f)}" stroke="#eef0f4"/><text x="${L-6}" y="${T+ih*(1-f)+3}" text-anchor="end">${fmt(mx*f)}</text>`).join('')+ms.map((m,i)=>`<text x="${x(i)}" y="${H-8}" text-anchor="middle">${m.month.slice(2).replace('-','.')}</text>`).join('');
 const smx=Math.max(...ms.map(m=>m.sales),1),sy=v=>ih*v/smx,short=v=>v>=1e8?(v/1e8).toFixed(1)+'억':Math.round(v/1e4)+'만';
 const sales=ms.map((m,i)=>{let a=sy(m.shipSales),b2=sy(m.buySales),w=bw*.62,x0=x(i)-w/2,o=m.partial?' opacity=".45"':'';
  return `<g${o}><rect x="${x0}" y="${T+ih-a}" width="${w}" height="${a}" fill="${C.ship}" rx="2"><title>${E(mname(m))} 배송대행 ${won(m.shipSales)}</title></rect><rect x="${x0}" y="${T+ih-a-b2}" width="${w}" height="${b2}" fill="${C.buy}" rx="2"><title>${E(mname(m))} 구매대행 ${won(m.buySales)}</title></rect><text class="val" x="${x(i)}" y="${T+ih-a-b2-4}" text-anchor="middle">${short(m.sales)}</text></g>`}).join('');
 // payments on the left axis, new members on their own right axis (they are ~10x smaller)
 const pmx=Math.max(...ms.map(m=>m.shipPayments+m.buyPayments),1),nmx=Math.max(...ms.map(m=>m.newMembers),1);
 const line=(k,col,f,mx)=>{const y=v=>T+ih-ih*v/mx;return `<polyline fill="none" stroke="${col}" stroke-width="2.2" points="${ms.map((m,i)=>`${x(i)},${y(f(m))}`).join(' ')}"/>`+ms.map((m,i)=>`<circle cx="${x(i)}" cy="${y(f(m))}" r="3" fill="${col}"${m.partial?' opacity=".45"':''}><title>${E(mname(m))} ${k} ${n(f(m))}</title></circle>`).join('')};
 const right=[0,.5,1].map(f=>`<text x="${W-R+6}" y="${T+ih*(1-f)+3}" fill="${C.mem}" style="fill:${C.mem}">${n(nmx*f)}</text>`).join('');
 const people=line('결제 건수',C.pay,m=>m.shipPayments+m.buyPayments,pmx)+line('신규 회원',C.mem,m=>m.newMembers,nmx)+right;
 return `<div class="biz-trend"><div class="card"><h3>매출 추이</h3><div class="biz-legend"><span><i style="background:${C.ship}"></i>배송대행</span><span><i style="background:${C.buy}"></i>구매대행</span><span>흐린 막대: 진행 중인 달</span></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 12개월 매출">${axis(smx,v=>v?short(v):'0')}${sales}</svg></div>
  <div class="card"><h3>고객 추이</h3><div class="biz-legend"><span><i style="background:${C.pay}"></i>결제 건수(배송+구매대행, 왼쪽 축)</span><span><i style="background:${C.mem}"></i>신규 회원(오른쪽 축)</span></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 12개월 결제 건수와 신규 회원">${axis(pmx,v=>n(v))}${people}</svg></div></div>`}
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
 ${trends(ms)}
 ${section('summary','흐름',`${c.label} 방문에서 결제까지`,`<div class="biz-flow"><div><h3>사람</h3>${bars(people,'명')}</div><div><h3>일</h3>${bars(work,'건')}<div class="biz-step"><span>구매대행 결제</span><span class="biz-track"></span><b>${n(c.buyPayments)}건</b><em>별도 서비스</em></div></div></div>`)}
 ${section('info','돈',`${c.label} 매출 자세히`,mix+chan)}
 ${ins.good.length?section('good','좋아요','잘되고 있는 점','<ul>'+ins.good.map(t=>`<li>${E(t)}</li>`).join('')+'</ul>'):''}
 ${section('warn','확인','살펴볼 점','<ul>'+ins.warn.map(t=>`<li>${E(t)}</li>`).join('')+'</ul>')}
 ${yr}<p class="note">${b.notes.map(E).join('<br>')}</p>`};

// 월별 손익 정산: Marco's monthly profit sheets (data: live.settlement from the encrypted vault)
window.renderSettlement=function(st){if(!st||!st.months)return '<p>손익 정산 데이터가 아직 없습니다.</p>';
 const ms=st.months,full=ms.filter(m=>m.complete),lab=m=>Number(m.month.slice(5))+'월',T=st.totals,last=full[full.length-1],prev=full[full.length-2];
 const best=full.reduce((a,b)=>b.contribution>a.contribution?b:a,full[0]);
 const kpis=[['공헌이익 합계 ('+T.months+'개월)',man(T.contribution),''],['월평균 공헌이익',man(T.contribution/T.months),''],['가장 높은 달',lab(best)+' · '+man(best.contribution),''],[lab(last)+' 공헌이익',man(last.contribution),pc(prev.contribution,last.contribution)]]
  .map(([k,v,d])=>`<div class="biz-kpi"><span>${k}</span><b>${v}</b>${d===''?'':`<small class="${d>=0?'biz-up':'biz-down'}">${d>=0?'▲':'▼'} ${Math.abs(d).toFixed(1)}% (${lab(prev)} 대비)</small>`}</div>`).join('');
 // stacked bars: 팬스타 / 나르다 / 기타 수익, with fixed cost tick and contribution label
 const W=640,H=230,L=48,R=12,Tp=18,B=28,iw=W-L-R,ih=H-Tp-B,bw=iw/ms.length,x=i=>L+bw*i+bw/2,mx=Math.max(...full.map(m=>m.ship+m.otherTotal)),y=v=>ih*v/mx,short=v=>(v/1e4).toLocaleString('ko-KR',{maximumFractionDigits:0})+'만';
 const COL={pan:'#5169ee',nar:'#8f9cf3',oth:'#c7cdf8',fix:'#d1574b'};
 const bars=ms.map((m,i)=>{let w=bw*.56,x0=x(i)-w/2,base=Tp+ih;if(!m.complete)return `<rect x="${x0}" y="${Tp+ih*.55}" width="${w}" height="${ih*.45}" fill="none" stroke="#d5d9e3" stroke-dasharray="4 4" rx="3"/><text class="val" x="${x(i)}" y="${Tp+ih*.55-6}" text-anchor="middle">요약표 없음</text><text x="${x(i)}" y="${H-9}" text-anchor="middle">${lab(m)}</text>`;let parts=[[m.panstar,COL.pan,'팬스타'],[m.narda,COL.nar,'나르다'],[m.otherTotal,COL.oth,'기타 수익']];
  let g=parts.map(([v,c,k])=>{let h=y(v||0);base-=h;return `<rect x="${x0}" y="${base}" width="${w}" height="${h}" fill="${c}"><title>${E(lab(m))} ${E(k)} ${won(v)}</title></rect>`}).join('');
  let fy=Tp+ih-y(m.fixedTotal);g+=`<line x1="${x0-3}" x2="${x0+w+3}" y1="${fy}" y2="${fy}" stroke="${COL.fix}" stroke-width="2"><title>${E(lab(m))} 고정비 ${won(m.fixedTotal)}</title></line><text class="val" x="${x(i)}" y="${base-5}" text-anchor="middle">공헌 ${short(m.contribution)}</text>`;
  return g+`<text x="${x(i)}" y="${H-9}" text-anchor="middle">${lab(m)}</text>`}).join('');
 const axis=[0,.5,1].map(f=>`<line x1="${L}" x2="${W-R}" y1="${Tp+ih*(1-f)}" y2="${Tp+ih*(1-f)}" stroke="#eef0f4"/><text x="${L-6}" y="${Tp+ih*(1-f)+3}" text-anchor="end">${f?short(mx*f):'0'}</text>`).join('');
 const chart=`<div class="biz-trend" style="grid-template-columns:1fr"><div class="card"><h3>월별 수익 구성과 공헌이익</h3><div class="biz-legend"><span><i style="background:${COL.pan}"></i>팬스타 배송비 순수익</span><span><i style="background:${COL.nar}"></i>나르다 배송비 순수익</span><span><i style="background:${COL.oth}"></i>기타 수익</span><span><i style="background:${COL.fix};height:3px;vertical-align:3px"></i>고정비 선</span><span>막대 = 배송비 순수익 + 기타 수익 · 위 숫자 = 공헌이익(막대 − 고정비)</span></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="월별 손익">${axis}${bars}</svg></div></div>`;
 // full table
 const cell=(m,f)=>{let v=f(m);return `<td>${v==null||Number.isNaN(v)?'<span class="biz-flat">—</span>':won(v)}</td>`};
 const rows=[['팬스타 배송비 순수익',m=>m.complete?m.panstar:null],['나르다 배송비 순수익',m=>m.narda],['배송비 순수익 계',m=>m.complete?m.ship:null,1],['기타 수익',m=>m.complete?m.otherTotal:null],['고정비',m=>m.complete?-m.fixedTotal:null],['공헌이익',m=>m.complete?m.contribution:null,1],['세금 (20%)',m=>m.complete?m.tax:null],['분배 (80%, 3.3% 공제 후)',m=>m.complete?m.distributionNet:null],['분배 10%',m=>m.complete?m.share10:null],['분배 45% (각)',m=>m.complete?m.share45:null],
  ['팬스타 순이익 (마르코 기준)',m=>m.complete?null:m.panstarMarco],['구매대행 수수료',m=>m.complete?null:(m.buyFee||{}).krw],['배송비 외 재포장',m=>m.complete?null:(m.repack||{}).krw]];
 const table=`<section class="card biz-year"><div class="cardhead"><h2>월별 손익표</h2><span class="small">원 · 8·9월 손익표 없음</span></div><div class="biz-scroll"><table><thead><tr><th>항목</th>${ms.map(m=>`<th>${lab(m)}${m.complete?'':' <small class="biz-flat">일부</small>'}</th>`).join('')}<th>합계 (요약표 ${T.months}개월)</th></tr></thead><tbody>${rows.map(([k,f,strong])=>`<tr${strong?' class="biz-total"':''}><td>${E(k)}</td>${ms.map(m=>cell(m,f)).join('')}<td>${(()=>{let xs=full.map(f).filter(v=>v!=null);return xs.length?won(xs.reduce((a,b)=>a+b,0)):'<span class="biz-flat">—</span>'})()}</td></tr>`).join('')}</tbody></table></div></section>`;
 // breakdowns
 const list=(xs)=>xs.map(o=>`<div class="biz-row"><span>${E(o.name)}</span><b>${won(o.krw)}</b></div>`).join('');
 const brk=`<div class="biz-mix" style="margin-top:16px;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))">${full.map(m=>`<div><h3>${lab(m)} 기타 수익 · 고정비</h3>${list(m.other)}<div class="biz-row" style="border-top:1px solid var(--line);padding-top:6px"><span>기타 수익 계</span><b>${won(m.otherTotal)}</b></div><div style="height:8px"></div>${list(m.fixed)}<div class="biz-row" style="border-top:1px solid var(--line);padding-top:6px"><span>고정비 계</span><b>${won(m.fixedTotal)}</b></div>${m.notes.length?`<p class="note" style="margin-top:8px">${m.notes.map(E).join('<br>')}</p>`:''}</div>`).join('')}</div>`;
 // carriers
 const cm=ms.filter(m=>Object.keys(m.carrier||{}).length);
 const carr=`<div class="biz-mix" style="margin-top:16px;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))"><div><h3>나르다 · 건수와 건당 수익률</h3>${cm.filter(m=>m.carrier.nardaCount).map(m=>`<div class="biz-row"><span>${lab(m)}</span><b>${n(m.carrier.nardaCount)}건 · ${m.carrier.nardaMargin}%</b></div>`).join('')}<p class="note">3월(유가 상승 전) 37.35% → 5월 27.53%. 유가 상승 뒤 건당 수익률이 크게 떨어졌습니다.</p></div>
  <div><h3>팬스타 · 건수</h3>${cm.filter(m=>m.carrier.panstarCount).map(m=>`<div class="biz-row"><span>${lab(m)}</span><b>${n(m.carrier.panstarCount)}건 · ${man(m.panstar)}</b></div>`).join('')}<p class="note">4월은 건수가 22% 늘었지만 순수익은 7% 줄었습니다.</p></div>
  <div><h3>운임 (엔)</h3>${cm.filter(m=>m.carrier.panstarFreightJpy||m.carrier.nardaFreightJpy).map(m=>`<div class="biz-row"><span>${lab(m)}</span><b>${[m.carrier.panstarFreightJpy?'팬스타 ¥'+n(m.carrier.panstarFreightJpy):'',m.carrier.nardaFreightJpy?'나르다 ¥'+n(m.carrier.nardaFreightJpy):''].filter(Boolean).join(' · ')}</b></div>`).join('')}<p class="note">운임비 기준. 수수료를 더한 금액은 손익표 원본 참고.</p></div></div>`;
 const partialNotes=ms.filter(m=>!m.complete).map(m=>`${lab(m)}: ${m.notes.join(' ')}`);
 return `<div class="easy-report-head"><div><div class="easy-tag">월별 손익</div><h2>우마이직구 손익 정산 · 2026년</h2><p>${E(st.source)}. 공헌이익 = 배송비 순수익 + 기타 수익 − 고정비.</p></div></div>
 <div class="biz-kpis">${kpis}</div>${chart}${table}${section('info','구성','달마다 무엇이 들어왔고 나갔나',brk)}${section('summary','배송','배송사별 흐름',carr)}
 <p class="note">${partialNotes.map(E).join('<br>')}<br>8·9월 손익표는 아직 채널에 없습니다. 고객 이름은 넣지 않았습니다.</p>`};
})();
