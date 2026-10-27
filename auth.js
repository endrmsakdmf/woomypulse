// Login gate: dashboard data ships only as data/vault.json (AES-256-CBC + HMAC, key from PBKDF2 of the password).
// Requests for data/*.json are answered from the decrypted vault, so app.js and website.js stay unchanged.
(()=>{
const enc=new TextEncoder(),dec=new TextDecoder(),b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const KEY='woomypulse-keys';let keys=null,unlocked,waiters=[];
const ready=new Promise(r=>unlocked=r);
const realFetch=window.fetch.bind(window);
async function loadVault(){let r=await realFetch('data/vault.json',{cache:'no-store'});if(!r.ok)throw Error('vault');return r.json()}
async function derive(pw,v){let base=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
 let bits=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:b64(v.salt),iterations:v.iter},base,512));
 return {aes:bits.slice(0,32),mac:bits.slice(32)}}
async function open(v,k){let iv=b64(v.iv),ct=b64(v.ct),msg=new Uint8Array(iv.length+ct.length);msg.set(iv);msg.set(ct,iv.length);
 let mk=await crypto.subtle.importKey('raw',k.mac,{name:'HMAC',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('HMAC',mk,b64(v.mac),msg))throw Error('wrong password');
 let ak=await crypto.subtle.importKey('raw',k.aes,'AES-CBC',false,['decrypt']);
 return JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-CBC',iv},ak,ct)))}
const hex=a=>Array.from(a,b=>b.toString(16).padStart(2,'0')).join(''),unhex=s=>Uint8Array.from(s.match(/../g),h=>parseInt(h,16));
function remember(k,v){try{sessionStorage.setItem(KEY,JSON.stringify({salt:v.salt,aes:hex(k.aes),mac:hex(k.mac)}))}catch{}}
function recall(v){try{let s=JSON.parse(sessionStorage.getItem(KEY)||'null');return s&&s.salt===v.salt?{aes:unhex(s.aes),mac:unhex(s.mac)}:null}catch{return null}}
// Each data request re-reads the vault so the 1-minute refresh in app.js still picks up new data.
async function bundle(){await ready;let v=await loadVault(),k=recall(v)||keys;
 try{return await open(v,k)}catch{ /* re-encrypted with a new salt: same password, new keys */
  if(window.__pw){keys=await derive(window.__pw,v);remember(keys,v);return open(v,keys)}throw Error('locked')}}
window.fetch=async(input,init)=>{let url=typeof input==='string'?input:input.url,m=url.match(/(?:^|\/)data\/([\w-]+\.json)(?:\?|$)/);
 if(!m||m[1]==='vault.json')return realFetch(input,init);
 try{let b=await bundle();if(!(m[1] in b))return new Response('{}',{status:404});
  return new Response(JSON.stringify(b[m[1]]),{status:200,headers:{'Content-Type':'application/json'}})}
 catch{return new Response('{}',{status:401})}};
function gate(){let d=document.createElement('div');d.id='loginGate';d.innerHTML=`<style>
#loginGate{position:fixed;inset:0;z-index:1000;background:var(--bg,#f5f6f8);display:grid;place-items:center;padding:16px}
#loginGate form{background:white;border:1px solid var(--line,#e9edf2);border-radius:16px;padding:32px;width:min(380px,100%);box-shadow:0 20px 60px #19243a14}
#loginGate h1{font-size:22px;margin:14px 0 6px}#loginGate p{font-size:13px}#loginGate input{width:100%;padding:12px;border:1px solid #dfe3eb;border-radius:9px;margin:18px 0 10px;font:inherit}
#loginGate button{width:100%;background:var(--blue,#5169ee);color:white;border:0;border-radius:9px;padding:12px;font:inherit;font-weight:650;cursor:pointer}
#loginGate button:disabled{opacity:.6}#loginErr{color:#d14b4b;font-size:12px;min-height:18px;margin-top:10px}</style>
<form autocomplete="on"><span class="mark">w</span><b style="font-size:20px">woomy pulse.</b><h1>로그인</h1><p>우마이직구 대시보드는 비밀번호가 있어야 볼 수 있습니다.</p>
<input type="password" id="loginPw" placeholder="비밀번호" autocomplete="current-password" required autofocus><button id="loginBtn">들어가기</button><div id="loginErr"></div></form>`;
 document.body.appendChild(d);
 d.querySelector('form').onsubmit=async e=>{e.preventDefault();let pw=d.querySelector('#loginPw').value,btn=d.querySelector('#loginBtn'),err=d.querySelector('#loginErr');
  btn.disabled=true;btn.textContent='확인 중…';err.textContent='';
  try{let v=await loadVault(),k=await derive(pw,v);await open(v,k);keys=k;window.__pw=pw;remember(k,v);d.remove();unlocked()}
  catch(x){err.textContent=x.message==='wrong password'?'비밀번호가 맞지 않습니다.':'데이터를 불러오지 못했습니다. 잠시 후 다시 시도하세요.'}
  finally{btn.disabled=false;btn.textContent='들어가기'}}}
function logoutButton(){let nav=document.querySelector('.aside-bottom');if(!nav)return;let b=document.createElement('button');
 b.textContent='로그아웃';b.style.cssText='margin-top:14px;width:100%';b.onclick=()=>{try{sessionStorage.removeItem(KEY)}catch{};location.reload()};nav.appendChild(b)}
document.addEventListener('DOMContentLoaded',async()=>{logoutButton();
 try{let v=await loadVault(),k=recall(v);if(k){await open(v,k);keys=k;unlocked();return}}catch{}
 gate()});
})();
