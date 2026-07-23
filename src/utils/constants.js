export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.h-root{
  min-height:100vh;
  background:#09090E;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  overflow-x:hidden;
}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes pulse{0%,100%{opacity:.025;}50%{opacity:.06;}}

.a1{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) .0s both;}
.a2{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) .1s both;}
.a3{animation:fadeUp .55s cubic-bezier(.22,.68,0,1.2) .18s both;}
.a4{animation:fadeIn .65s ease .28s both;}

@media(prefers-reduced-motion:reduce){
  .a1,.a2,.a3,.a4{animation:none;opacity:1;}
  .film-bg{display:none;}
  .m-card,.g-btn{transition:none!important;}
}

.film-bg{
  position:absolute;inset:0;
  display:grid;
  grid-template-columns:repeat(24,1fr);
  grid-template-rows:repeat(10,1fr);
  gap:2px;padding:2px;
  pointer-events:none;
  animation:pulse 5s ease-in-out infinite;
  z-index:0;
}
.f-cell{border-radius:1px;background:#F5A623;opacity:0;}
.f-cell.on{opacity:1;}

.nav{
  position:sticky;top:0;z-index:100;
  background:rgba(9,9,14,.85);
  backdrop-filter:blur(14px);
  border-bottom:1px solid #16161e;
  padding:0 16px;
  height:60px;
  display:flex;
  align-items:center;
  gap:12px;
}
@media(min-width:769px){.nav{padding:0 clamp(16px,4vw,40px);gap:24px;}}

.nav-logo{
  font-family:'Syne',sans-serif;
  font-size:18px;font-weight:800;
  color:#F5A623;letter-spacing:-.02em;
  white-space:nowrap;flex-shrink:0;
}
@media(min-width:769px){.nav-logo{font-size:20px;}}
.nav-logo span{color:#F0EDE8;}

.nav-search{
  flex:1;
  display:flex;align-items:center;
  background:#141418;
  border:1px solid #1e1e28;
  border-radius:10px;
  padding:0 14px;
  height:38px;
  transition:border-color .2s;
  min-width:0;
}
.nav-search:focus-within{border-color:rgba(245,166,35,.5);}
.nav-search input{
  flex:1;min-width:0;
  background:transparent;border:none;outline:none;
  color:#F0EDE8;font-family:'Inter',sans-serif;
  font-size:14px;padding:0 10px;
}
.nav-search input::placeholder{color:#3a3a48;}

.nav-right{
  display:none;
  align-items:center;gap:10px;margin-left:auto;flex-shrink:0;
}
@media(min-width:769px){.nav-right{display:flex;}}

.city-pill{
  display:flex;align-items:center;gap:5px;
  font-size:13px;color:#aaa;
  background:transparent;border:none;cursor:pointer;
  font-family:'Inter',sans-serif;padding:0;
}
.city-pill select{
  background:transparent;border:none;outline:none;
  color:#F0EDE8;font-size:13px;font-weight:600;
  font-family:'Inter',sans-serif;cursor:pointer;
}
.city-pill select option{background:#141418;}

.nav-btn{
  background:transparent;
  border:1px solid #252530;
  border-radius:8px;
  color:#F0EDE8;
  font-family:'Inter',sans-serif;
  font-size:13px;font-weight:600;
  padding:7px 16px;cursor:pointer;
  transition:border-color .15s;white-space:nowrap;
}
.nav-btn:hover{border-color:rgba(245,166,35,.5);}
.nav-btn.primary{background:#F5A623;color:#09090E;border-color:#F5A623;}
.nav-btn.primary:hover{background:#E09920;border-color:#E09920;}

.hamburger{
  display:flex;
  background:transparent;border:none;
  color:#F0EDE8;cursor:pointer;
  padding:4px;border-radius:6px;
  transition:background .15s;
  flex-shrink:0;
}
@media(min-width:769px){.hamburger{display:none;}}
.hamburger:hover{background:rgba(255,255,255,.05);}

.mobile-menu{
  display:none;
  position:fixed;top:60px;left:0;right:0;
  background:rgba(9,9,14,.98);
  backdrop-filter:blur(14px);
  border-bottom:1px solid #16161e;
  padding:16px 20px 24px;
  z-index:99;
  flex-direction:column;
  gap:12px;
  animation:fadeIn .25s ease;
}
.mobile-menu.open{display:flex;}
.mobile-menu .city-pill{
  display:flex;align-items:center;gap:8px;
  padding:10px 14px;
  background:#141418;
  border-radius:8px;
  border:1px solid #1e1e28;
}
.mobile-menu .city-pill select{
  flex:1;
  background:transparent;border:none;outline:none;
  color:#F0EDE8;font-size:14px;font-weight:600;
  font-family:'Inter',sans-serif;cursor:pointer;
}
.mobile-menu .city-pill select option{background:#141418;}
.mobile-menu .nav-btn{
  width:100%;
  text-align:center;
  padding:12px;
  font-size:15px;
}

.featured{
  position:relative;
  width:100%;
  height:clamp(300px,50vw,560px);
  overflow:hidden;
}
.featured-img{
  width:100%;height:100%;object-fit:cover;
  display:block;
}
.featured-overlay{
  position:absolute;inset:0;
  background:linear-gradient(
    90deg,
    rgba(9,9,14,.92) 0%,
    rgba(9,9,14,.7) 45%,
    rgba(9,9,14,.15) 75%,
    transparent 100%
  );
}
@media(max-width:480px){
  .featured-overlay{
    background:linear-gradient(
      0deg,
      rgba(9,9,14,.95) 0%,
      rgba(9,9,14,.6) 50%,
      transparent 100%
    );
  }
}
.featured-overlay-bottom{
  position:absolute;bottom:0;left:0;right:0;height:160px;
  background:linear-gradient(to top,#09090E,transparent);
}
.featured-content{
  position:absolute;inset:0;
  display:flex;flex-direction:column;
  justify-content:flex-end;
  padding:clamp(16px,4vw,56px) clamp(16px,4vw,56px);
  max-width:640px;
}
@media(max-width:480px){.featured-content{padding:20px;}}
.featured-tag{
  display:inline-flex;align-items:center;gap:6px;
  background:rgba(245,166,35,.15);
  border:1px solid rgba(245,166,35,.3);
  border-radius:100px;
  padding:4px 12px;
  font-size:9px;font-weight:700;
  letter-spacing:.12em;color:#F5A623;
  text-transform:uppercase;margin-bottom:12px;
  width:fit-content;
}
.featured-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(24px,5vw,52px);
  font-weight:800;line-height:1.05;
  letter-spacing:-.025em;color:#F0EDE8;
  margin-bottom:10px;
}
.featured-meta{
  display:flex;flex-wrap:wrap;align-items:center;
  gap:10px;font-size:12px;color:#aaa;
  margin-bottom:18px;
}
@media(max-width:480px){.featured-meta{font-size:11px;gap:8px;}}
.featured-meta .rating{
  display:flex;align-items:center;gap:4px;
  color:#F5A623;font-weight:600;
}
.featured-btns{display:flex;gap:10px;flex-wrap:wrap;}
.btn-watch{
  display:flex;align-items:center;gap:7px;
  background:#F5A623;border:none;border-radius:10px;
  color:#09090E;font-family:'Inter',sans-serif;
  font-weight:700;font-size:13px;
  padding:10px 20px;cursor:pointer;
  transition:background .15s,transform .1s;
}
@media(max-width:480px){.btn-watch{font-size:12px;padding:8px 16px;}}
.btn-watch:hover{background:#E09920;}
.btn-watch:active{transform:scale(.97);}
.btn-outline{
  display:flex;align-items:center;gap:7px;
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.15);
  border-radius:10px;
  color:#F0EDE8;font-family:'Inter',sans-serif;
  font-weight:600;font-size:13px;
  padding:10px 20px;cursor:pointer;
  transition:border-color .15s,transform .1s;
}
@media(max-width:480px){.btn-outline{font-size:12px;padding:8px 16px;}}
.btn-outline:hover{border-color:rgba(245,166,35,.4);}
.btn-outline:active{transform:scale(.97);}

.wrap{
  max-width:1240px;margin:0 auto;
  padding:0 16px;
}
@media(min-width:769px){.wrap{padding:0 clamp(16px,4vw,40px);}}

.sh{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
@media(min-width:769px){.sh{gap:14px;margin-bottom:20px;}}
.sh-label{
  display:flex;align-items:center;gap:6px;
  font-family:'Syne',sans-serif;
  font-size:11px;font-weight:700;
  letter-spacing:.1em;color:#F5A623;
  text-transform:uppercase;white-space:nowrap;
}
@media(min-width:769px){.sh-label{font-size:13px;gap:7px;}}
.sh-line{flex:1;height:1px;background:#18181f;}
.sh-link{
  display:flex;align-items:center;gap:4px;
  background:transparent;border:none;
  color:#666;font-family:'Inter',sans-serif;
  font-size:12px;font-weight:500;
  cursor:pointer;padding:0;white-space:nowrap;
  transition:color .15s;
}
@media(min-width:769px){.sh-link{font-size:13px;gap:5px;}}
.sh-link:hover{color:#F5A623;}

.lang-tabs{
  display:flex;gap:6px;
  margin-bottom:16px;
  flex-wrap:wrap;
}
@media(min-width:769px){.lang-tabs{gap:8px;margin-bottom:20px;}}
.lang-tab{
  background:#141418;
  border:1px solid #1e1e28;
  border-radius:100px;
  color:#888;
  font-family:'Inter',sans-serif;
  font-size:11px;font-weight:600;
  padding:5px 12px;cursor:pointer;
  transition:background .15s,border-color .15s,color .15s;
}
@media(min-width:769px){.lang-tab{font-size:12px;padding:6px 16px;}}
.lang-tab.active,.lang-tab:hover{
  background:rgba(245,166,35,.1);
  border-color:rgba(245,166,35,.4);
  color:#F5A623;
}

.movie-row{
  display:flex;gap:12px;
  overflow-x:auto;
  padding-bottom:12px;
  scroll-snap-type:x mandatory;
  -webkit-overflow-scrolling:touch;
}
@media(min-width:769px){.movie-row{gap:14px;}}
.movie-row::-webkit-scrollbar{height:3px;}
.movie-row::-webkit-scrollbar-track{background:#141418;border-radius:2px;}
.movie-row::-webkit-scrollbar-thumb{background:#2a2a38;border-radius:2px;}
.movie-row::-webkit-scrollbar-thumb:hover{background:#F5A623;}

.m-card{
  flex-shrink:0;
  width:clamp(140px,22vw,210px);
  background:#141418;
  border:1px solid #1a1a24;
  border-radius:12px;
  overflow:hidden;cursor:pointer;
  scroll-snap-align:start;
  transition:transform .22s cubic-bezier(.22,.68,0,1.2),border-color .2s,box-shadow .2s;
}
@media(max-width:480px){.m-card{width:clamp(120px,40vw,160px);}}
@media(min-width:769px){.m-card{width:clamp(160px,22vw,210px);}}
.m-card:hover{
  transform:translateY(-6px);
  border-color:rgba(245,166,35,.45);
  box-shadow:0 18px 40px rgba(0,0,0,.55);
}
.m-card:focus-visible{outline:2px solid #F5A623;outline-offset:2px;}
.m-img{position:relative;aspect-ratio:2/3;overflow:hidden;}
.m-img img{
  width:100%;height:100%;
  object-fit:cover;display:block;
  transition:transform .4s ease;
}
.m-card:hover .m-img img{transform:scale(1.05);}
.m-fade{
  position:absolute;bottom:0;left:0;right:0;height:70px;
  background:linear-gradient(to top,#141418,transparent);
  pointer-events:none;
}
@media(min-width:769px){.m-fade{height:90px;}}
.m-tag{
  position:absolute;top:8px;left:8px;
  font-size:8px;font-weight:700;
  letter-spacing:.07em;
  padding:2px 6px;border-radius:4px;
}
@media(min-width:769px){.m-tag{font-size:9px;padding:3px 8px;}}
.m-body{padding:8px 10px 12px;}
@media(min-width:769px){.m-body{padding:11px 13px 14px;}}
.m-title{
  font-family:'Syne',sans-serif;
  font-size:12px;font-weight:700;
  color:#F0EDE8;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  margin-bottom:6px;
}
@media(min-width:769px){.m-title{font-size:13px;margin-bottom:7px;}}
.m-meta{
  display:flex;flex-wrap:wrap;
  gap:5px;font-size:10px;color:#666;
}
@media(min-width:769px){.m-meta{gap:7px;font-size:11px;}}
.m-meta-i{display:flex;align-items:center;gap:2px;}
.m-meta-i.rt{color:#F5A623;}

.g-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
}
@media(min-width:480px){.g-grid{gap:10px;}}
@media(min-width:540px){.g-grid{grid-template-columns:repeat(6,1fr);gap:12px;}}

.g-btn{
  background:#141418;
  border:1px solid #1a1a24;
  border-radius:10px;
  padding:clamp(12px,3vw,20px) 6px;
  cursor:pointer;
  display:flex;flex-direction:column;
  align-items:center;gap:6px;
  font-family:'Inter',sans-serif;
  font-size:10px;font-weight:500;
  color:#666;
  transition:border-color .2s,background .2s,color .2s,transform .22s cubic-bezier(.22,.68,0,1.2);
}
@media(min-width:480px){.g-btn{gap:9px;font-size:12px;}}
@media(min-width:769px){.g-btn{padding:clamp(14px,3vw,20px) 8px;gap:9px;font-size:12px;border-radius:12px;}}
.g-btn:hover{background:#171720;transform:translateY(-4px);}
.g-emoji{font-size:18px;line-height:1;}
@media(min-width:480px){.g-emoji{font-size:22px;}}

.steps{
  display:grid;
  grid-template-columns:1fr;
  gap:2px;border-radius:14px;overflow:hidden;
}
@media(min-width:640px){.steps{grid-template-columns:repeat(3,1fr);}}

.step{
  background:#141418;
  padding:clamp(18px,3vw,36px) clamp(14px,3vw,30px);
  position:relative;overflow:hidden;
}
@media(min-width:769px){.step{padding:clamp(22px,4vw,36px) clamp(18px,3vw,30px);}}
@media(min-width:640px){
  .step:not(:last-child)::after{
    content:'';position:absolute;
    right:0;top:20%;bottom:20%;
    width:1px;background:#1c1c26;
  }
}
.step-n{
  font-family:'Syne',sans-serif;
  font-size:48px;font-weight:800;
  color:#1a1a24;line-height:1;
  position:absolute;top:10px;right:14px;
  user-select:none;pointer-events:none;
  letter-spacing:-3px;
}
@media(min-width:769px){.step-n{font-size:68px;right:16px;}}
.step-ico{
  width:40px;height:40px;
  background:rgba(245,166,35,.08);
  border:1px solid rgba(245,166,35,.16);
  border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  color:#F5A623;margin-bottom:14px;
}
@media(min-width:769px){.step-ico{width:46px;height:46px;border-radius:11px;margin-bottom:18px;}}
.step-title{
  font-family:'Syne',sans-serif;
  font-size:14px;font-weight:700;
  color:#F0EDE8;margin-bottom:6px;
}
@media(min-width:769px){.step-title{font-size:15px;margin-bottom:8px;}}
.step-desc{font-size:12px;color:#666;line-height:1.6;}
@media(min-width:769px){.step-desc{font-size:13px;line-height:1.65;}}

.cta{
  background:#141418;
  border:1px solid #1a1a24;
  border-radius:16px;
  padding:clamp(32px,6vw,80px) clamp(16px,5vw,72px);
  text-align:center;position:relative;overflow:hidden;
}
@media(min-width:769px){.cta{border-radius:20px;padding:clamp(44px,7vw,80px) clamp(24px,6vw,72px);}}
.cta-glow{
  position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% -10%,rgba(245,166,35,.09) 0%,transparent 60%);
  pointer-events:none;
}
.cta-eye{
  font-size:10px;font-weight:600;
  letter-spacing:.18em;color:#F5A623;
  text-transform:uppercase;margin-bottom:10px;
  position:relative;z-index:1;
}
@media(min-width:769px){.cta-eye{font-size:11px;margin-bottom:14px;}}
.cta-h{
  font-family:'Syne',sans-serif;
  font-size:clamp(22px,5vw,44px);
  font-weight:800;color:#F0EDE8;
  letter-spacing:-.022em;line-height:1.08;
  margin-bottom:10px;position:relative;z-index:1;
}
@media(min-width:769px){.cta-h{margin-bottom:14px;}}
.cta-sub{
  font-size:13px;color:#666;
  max-width:400px;margin:0 auto 24px;
  line-height:1.6;position:relative;z-index:1;
}
@media(min-width:769px){.cta-sub{font-size:15px;margin:0 auto 34px;line-height:1.65;}}
.cta-btns{
  display:flex;gap:10px;
  justify-content:center;flex-wrap:wrap;
  position:relative;z-index:1;
}
@media(min-width:769px){.cta-btns{gap:12px;}}
.btn-p{
  background:#F5A623;border:none;border-radius:10px;
  color:#09090E;font-family:'Inter',sans-serif;
  font-weight:700;font-size:13px;
  padding:11px 24px;cursor:pointer;
  transition:background .15s,transform .1s;
}
@media(min-width:769px){.btn-p{font-size:14px;padding:13px 32px;border-radius:11px;}}
.btn-p:hover{background:#E09920;}
.btn-p:active{transform:scale(.97);}
.btn-g{
  background:transparent;
  border:1px solid #252530;border-radius:10px;
  color:#F0EDE8;font-family:'Inter',sans-serif;
  font-weight:600;font-size:13px;
  padding:11px 24px;cursor:pointer;
  transition:border-color .15s,transform .1s;
}
@media(min-width:769px){.btn-g{font-size:14px;padding:13px 32px;border-radius:11px;}}
.btn-g:hover{border-color:rgba(245,166,35,.45);}
.btn-g:active{transform:scale(.97);}

.gap{height:clamp(40px,6vw,88px);}
.gap-sm{height:clamp(24px,3vw,48px);}
`;