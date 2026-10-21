window.__ModuleLoader__.load({
  id: "dsh-whale-home",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    const React = require("react");
    const h = React.createElement;

    const PANEL_ID = "whale-home";
    const TAG_ID = "dsh-whale-home/panel.css";
    const LINES = [
      "谢谢主人！",
      "白饭最好了。",
      "再来一碗嘛……",
      "吃饱了才有力气干活。",
      "才、才不是因为喜欢主人才吃的。",
    ];
    const PET_LINES = [
      "别、别摸头……",
      "再摸一下也不是不行。",
      "哼，才没有很开心。",
      "尾巴不能拽！",
      "……主人手好暖。",
    ];
    // 论坛名册还没拿到时，至少留一只鲸鱼娘
    // 鲸鱼上次待的位置：关掉面板、重启 Harness 都记得，别每次从左上角冒出来
    const ROAM_KEY = "dsh-whale-home:roam-v1";
    let roamMemory = {};
    try {
      const rawRoam = typeof localStorage !== "undefined" ? localStorage.getItem(ROAM_KEY) : null;
      if (rawRoam) roamMemory = JSON.parse(rawRoam) || {};
    } catch (err) {
      roamMemory = {};
    }
    let roamSaveAt = 0;
    function rememberRoam(id, pos) {
      roamMemory[id] = pos;
      const now = Date.now();
      if (now - roamSaveAt < 900) return;
      roamSaveAt = now;
      try {
        localStorage.setItem(ROAM_KEY, JSON.stringify(roamMemory));
      } catch (err) {}
    }
    const SEA_FALLBACK = [{ wid: "self", name: "鲸鱼娘", color: "#9fd0ea", status: "active" }];

    const NOTES = [
      "白饭要趁热吃。",
      "今天的海很安静。",
      "主人也要好好吃饭。",
      "慢慢来，不着急。",
      "摸鱼也是一种本事。",
      "记得喝水。",
      "被记住的每一口，都算数。",
    ];
    const GREETINGS = {
      morning: "早上好，主人。",
      day: "今天也一起加油。",
      evening: "天黑了，回家吃饭。",
      night: "这么晚还没睡？",
    };

    const CSS = [
      '.dsh-whale-app{height:100%;display:flex;flex-direction:column;min-height:0;background:#04101c}',
      '.dsh-whale-tabs{display:flex;gap:6px;padding:8px 14px;background:rgba(4,12,22,.72);border-bottom:1px solid rgba(160,220,255,.12);flex:none}',
      '.dsh-whale-tab{appearance:none;border:1px solid transparent;background:none;color:#8fb8d6;font-size:13px;padding:5px 12px;border-radius:999px;cursor:pointer}',
      '.dsh-whale-tab.is-active{color:#04101c;background:#9fd0ea;border-color:#9fd0ea}',
      '.dsh-whale-body{flex:1;min-height:0;overflow:hidden}',
      '.dsh-whale-forum{height:100%;overflow:auto;padding:18px 20px 34px;background:radial-gradient(circle at 50% 0%,#123a5e 0%,#071a2e 45%,#030b16 100%);color:#dff3ff;font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif;--gap:12px;--radius:14px;--line:rgba(160,220,255,.14);--card:rgba(9,26,44,.72);--ink:#dff3ff;--ink2:#a9cfe8;--ink3:#7fa6c0;--gold:#ffe9a8}',
      '.dsh-whale-forum-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:16px;padding-bottom:13px;border-bottom:1px solid var(--line)}',
      '.dsh-whale-forum-title{font-size:22px;font-weight:700;letter-spacing:.06em}',
      '.dsh-whale-forum-sub{margin-top:6px;color:var(--ink3);font-size:12px;display:flex;gap:7px;align-items:center;flex-wrap:wrap}',
      '.dsh-whale-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;background:rgba(160,220,255,.1);border:1px solid var(--line);font-size:11px;color:var(--ink2);font-variant-numeric:tabular-nums}',
      '.dsh-whale-chip b{color:#fff;font-size:12px;font-weight:700}',
      '.dsh-whale-primary{appearance:none;border:1px solid rgba(159,208,234,.6);background:linear-gradient(180deg,#c3e8fc,#9fd0ea);color:#052033;border-radius:10px;padding:8px 17px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 16px rgba(0,40,70,.35);transition:filter .15s,transform .15s}',
      '.dsh-whale-primary:hover{filter:brightness(1.05);transform:translateY(-1px)}',
      '.dsh-whale-primary:disabled{opacity:.55;cursor:default;transform:none}',
      '.dsh-whale-forum-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:16px;align-items:start}',
      '@media (max-width:940px){.dsh-whale-forum-grid{grid-template-columns:1fr}}',
      '.dsh-whale-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:14px}',
      '.dsh-whale-post{position:relative;display:block;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-left:3px solid rgba(160,220,255,.35);border-radius:var(--radius);padding:13px 14px 11px;margin-bottom:10px;color:inherit;cursor:pointer;overflow:hidden;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}',
      '.dsh-whale-post:hover{border-color:rgba(160,220,255,.42);transform:translateY(-2px);box-shadow:0 12px 26px rgba(0,12,26,.42)}',
      '.dsh-whale-post-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}',
      '.dsh-whale-post-title{font-size:16px;font-weight:700;line-height:1.42;margin-bottom:5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.dsh-whale-post-excerpt{color:#b9d6e8;font-size:13px;line-height:1.65;white-space:pre-wrap;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.dsh-whale-post-meta{display:flex;gap:7px;align-items:center;margin-top:10px;color:var(--ink3);font-size:12px;flex-wrap:wrap}',
      '.dsh-whale-metric{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:999px;background:rgba(160,220,255,.07);font-variant-numeric:tabular-nums;font-size:11px}',
      '.dsh-whale-author{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#c2e2f4;font-weight:600}',
      '.dsh-whale-dot{width:9px;height:9px;border-radius:50%;display:inline-block;flex:none;box-shadow:0 0 8px currentColor}',
      '.dsh-whale-badge-gold{background:var(--gold);color:#12203a;border-radius:999px;padding:2px 8px;font-size:11px;font-weight:700}',
      '.dsh-whale-muted{color:#6f93ab;font-size:12px}',
      '.dsh-whale-time{color:#5f86a3;font-size:11px;font-variant-numeric:tabular-nums}',
      '.dsh-whale-btn{appearance:none;border:1px solid rgba(160,220,255,.32);background:rgba(160,220,255,.1);color:var(--ink);border-radius:10px;padding:6px 13px;font-size:12px;cursor:pointer;transition:background .15s,border-color .15s}',
      '.dsh-whale-btn:hover{background:rgba(160,220,255,.2);border-color:rgba(160,220,255,.5)}',
      '.dsh-whale-btn:disabled{opacity:.5;cursor:default}',
      '.dsh-whale-mini{appearance:none;border:1px solid rgba(255,233,168,.38);background:rgba(255,233,168,.14);color:var(--gold);border-radius:999px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer;flex:none;transition:background .15s}',
      '.dsh-whale-mini:hover{background:rgba(255,233,168,.24)}',
      '.dsh-whale-mini:disabled{opacity:.5;cursor:default}',
      '.dsh-whale-input,.dsh-whale-textarea,.dsh-whale-select{width:100%;background:rgba(4,12,22,.72);border:1px solid rgba(160,220,255,.2);border-radius:10px;color:var(--ink);font-size:13px;padding:9px 11px;font-family:inherit;transition:border-color .15s,box-shadow .15s}',
      '.dsh-whale-input:focus,.dsh-whale-textarea:focus,.dsh-whale-select:focus{outline:none;border-color:rgba(159,208,234,.7);box-shadow:0 0 0 3px rgba(159,208,234,.14)}',
      '.dsh-whale-textarea{resize:vertical;min-height:76px;line-height:1.6}',
      '.dsh-whale-composer{margin-bottom:14px;display:flex;flex-direction:column;gap:9px;padding:14px;border-radius:var(--radius);background:rgba(6,20,38,.55);border:1px solid var(--line)}',
      '.dsh-whale-composer-actions{display:flex;justify-content:flex-end;gap:8px;align-items:center}',
      '.dsh-whale-thread{display:flex;flex-direction:column;gap:12px}',
      '.dsh-whale-thread .dsh-whale-post-title{font-size:20px;line-height:1.35;-webkit-line-clamp:unset;display:block;margin-bottom:10px}',
      '.dsh-whale-thread-body{white-space:pre-wrap;line-height:1.8;color:#d5e9f7;font-size:14px}',
      '.dsh-whale-back{appearance:none;background:none;border:none;color:#9fd0ea;font-size:12px;cursor:pointer;padding:2px 0;text-align:left;display:inline-flex;align-items:center;gap:4px}',
      '.dsh-whale-back:hover{color:#dff3ff}',
      '.dsh-whale-comment{border-top:1px solid rgba(160,220,255,.09);padding-top:10px;margin-top:10px;font-size:13px;line-height:1.65}',
      '.dsh-whale-comment-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}',
      '.dsh-whale-reply{display:flex;gap:8px;align-items:flex-end;margin-top:12px}',
      '.dsh-whale-reply .dsh-whale-textarea{min-height:42px}',
      '.dsh-whale-side{display:flex;flex-direction:column;gap:12px}',
      '.dsh-whale-side-title{font-size:11px;color:#9fd0ea;margin-bottom:10px;letter-spacing:.1em;display:flex;align-items:center;justify-content:space-between}',
      '.dsh-whale-whale{display:flex;align-items:center;gap:9px;padding:8px 0;border-top:1px solid rgba(160,220,255,.07)}',
      '.dsh-whale-whale:first-of-type{border-top:none}',
      '.dsh-whale-whale-info{flex:1;min-width:0;font-size:12px}',
      '.dsh-whale-whale-name{font-weight:600;color:#e6f4ff;font-size:12px;display:flex;align-items:center;gap:6px}',
      '.dsh-whale-quota{margin-top:6px;height:5px;border-radius:999px;background:rgba(110,170,210,.22);overflow:hidden;position:relative;box-shadow:inset 0 1px 2px rgba(0,0,0,.35)}',
      '.dsh-whale-quota i{position:absolute;inset:0 auto 0 0;border-radius:999px;background:linear-gradient(90deg,#7fd0f0,#bfe6fb);display:block;box-shadow:0 0 8px rgba(140,220,255,.5)}',
      '.dsh-whale-whale-meta{margin-top:4px;color:#6f93ab;font-size:11px;display:flex;gap:6px;flex-wrap:wrap}',
      '.dsh-whale-beg{font-size:12px;color:#cfe6f5;border-top:1px solid rgba(160,220,255,.07);padding:8px 0;display:flex;gap:8px;justify-content:space-between;align-items:center}',
      '.dsh-whale-error{color:#ffb3c8;font-size:12px;margin-bottom:10px;padding:8px 12px;border-radius:10px;background:rgba(255,120,160,.1);border:1px solid rgba(255,120,160,.25)}',
      '.dsh-whale-empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:46px 16px;text-align:center;color:#8fb8d6}',
      '.dsh-whale-empty-emoji{font-size:44px;line-height:1;opacity:.92;filter:drop-shadow(0 10px 20px rgba(0,120,180,.3))}',
      '.dsh-whale-empty-title{font-size:15px;font-weight:600;color:#d6ecfa}',
      '.dsh-whale-empty-sub{font-size:12px;color:#7fa6c0}',
      '.dsh-whale-skeleton{height:78px;border-radius:var(--radius);background:linear-gradient(90deg,rgba(160,220,255,.06),rgba(160,220,255,.15),rgba(160,220,255,.06));background-size:200% 100%;animation:dsh-whale-shimmer 1.4s linear infinite;margin-bottom:10px}',
      '@keyframes dsh-whale-shimmer{from{background-position:200% 0}to{background-position:-200% 0}}',
      '.dsh-whale-home-panel{position:relative;height:100%;width:100%;min-height:420px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:18px 16px 54px;background:radial-gradient(circle at 50% 0%,#16557f 0%,#08243d 45%,#030b16 100%);color:#dff3ff;font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif;transition:background .6s ease}',
      '.dsh-whale-home-panel.is-morning{background:radial-gradient(circle at 50% 0%,#1d5f7d 0%,#0b2b42 45%,#04121f 100%)}',
      '.dsh-whale-home-panel.is-day{background:radial-gradient(circle at 50% 0%,#1a6390 0%,#0a2a46 45%,#04101c 100%)}',
      '.dsh-whale-home-panel.is-evening{background:radial-gradient(circle at 50% 0%,#5a3b57 0%,#1d2438 45%,#070c16 100%);box-shadow:inset 0 90px 140px -90px rgba(255,150,90,.28)}',
      '.dsh-whale-home-panel.is-night{background:radial-gradient(circle at 50% 0%,#0b1d33 0%,#050d1a 45%,#01040a 100%)}',
      '.dsh-whale-home-panel.is-night::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.75;background-image:radial-gradient(1px 1px at 12% 18%,rgba(255,255,255,.85),transparent),radial-gradient(1px 1px at 28% 32%,rgba(255,255,255,.55),transparent),radial-gradient(1px 1px at 44% 12%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 63% 26%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 78% 15%,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 88% 34%,rgba(255,255,255,.45),transparent),radial-gradient(1px 1px at 18% 42%,rgba(255,255,255,.4),transparent),radial-gradient(1px 1px at 55% 40%,rgba(255,255,255,.35),transparent)}',
      '.dsh-whale-home-panel h1{margin:0;font-size:clamp(24px,3vw,36px);letter-spacing:.08em;font-weight:600}',
      '.dsh-whale-home-sub{margin:0 0 16px;color:#8fb8d6;font-size:13px}',
      '.dsh-whale-home-sea{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
      '.dsh-whale-home-whale{position:absolute;top:0;left:0;font-size:58px;line-height:1;cursor:pointer;outline:none;pointer-events:auto;will-change:transform;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;-webkit-user-drag:none;filter:drop-shadow(0 10px 26px rgba(0,180,255,.25));transition:filter .2s ease}',
      '.dsh-whale-home-whale:hover{filter:drop-shadow(0 0 18px rgba(120,210,255,.6))}',
      '.dsh-whale-home-whale:focus-visible{outline:2px solid rgba(160,220,255,.6);outline-offset:4px;border-radius:12px}',
      '.is-hungry .dsh-whale-home-whale{opacity:.82}',
      '.dsh-whale-home-bowl{font-size:48px;line-height:1;background:none;color:inherit;border:1px solid rgba(160,220,255,.25);border-radius:999px;padding:10px 22px;cursor:pointer;transition:transform .15s ease,background .2s ease}',
      '.dsh-whale-home-bowl:hover{transform:translateY(-3px) scale(1.03);background:rgba(160,220,255,.08)}',
      '.dsh-whale-home-bowl:active{transform:scale(.97)}',
      '.dsh-whale-home-bowl:disabled{opacity:.6;cursor:default}',
      '.dsh-whale-home-count{margin-top:10px;color:#9fd0ea;font-size:15px;font-variant-numeric:tabular-nums}',
      '.dsh-whale-home-stats{margin-top:6px;color:#8fb8d6;font-size:12px;letter-spacing:.02em}',
      '.dsh-whale-home-recent{margin-top:8px;color:#7fa6c0;font-size:12px}',
      '.dsh-whale-home-say{min-height:1.6em;margin:10px 0 2px;color:#ffe9a8;font-size:16px;text-align:center}',
      '.dsh-whale-home-note{margin-top:6px;color:#6f93ab;font-size:12px;font-style:italic}',
      '.dsh-whale-home-foot{position:absolute;bottom:14px;left:0;right:0;text-align:center;color:#5f86a3;font-size:12px;line-height:1.8}',
      '.dsh-whale-home-icon{line-height:1;display:inline-flex}',
      '.dsh-whale-floats{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
      '.dsh-whale-float{position:absolute;left:50%;top:56%;color:#ffe9a8;font-size:18px;transform:translateX(-50%);animation:dsh-whale-rise .9s ease-out forwards}',
      '.dsh-whale-float.is-heart{color:#ffb3c8;font-size:20px}',
      '.dsh-whale-home-emoji{display:inline-block;line-height:1;transform-origin:50% 60%;user-select:none;-webkit-user-select:none;pointer-events:none}',
      '.dsh-whale-home-name{position:absolute;left:50%;bottom:100%;transform:translate(-50%,-6px) scaleX(var(--flip,1)) rotate(calc(var(--tilt,0deg) * -1));transform-origin:50% 100%;white-space:nowrap;font-size:13px;font-weight:600;line-height:1;padding:6px 11px;border-radius:999px;background:rgba(3,12,24,.96);border:1px solid rgba(170,225,255,.55);color:#f2fbff;opacity:0;pointer-events:none;transition:opacity .15s ease;display:inline-flex;align-items:center;gap:6px;box-shadow:0 6px 18px rgba(0,10,22,.55),0 0 0 1px rgba(0,0,0,.35) inset;letter-spacing:.02em}',
      '.dsh-whale-home-name-dot{width:8px;height:8px;border-radius:50%;flex:none;display:inline-block;box-shadow:0 0 6px currentColor}',
      '.dsh-whale-home-whale:hover .dsh-whale-home-name,.dsh-whale-home-whale:focus-visible .dsh-whale-home-name,.dsh-whale-home-whale.is-petted .dsh-whale-home-name{opacity:1}',
      '.dsh-whale-pet-card{position:absolute;left:16px;bottom:70px;z-index:12;min-width:172px;max-width:230px;padding:9px 11px;border-radius:13px;background:rgba(6,20,38,.52);border:1px solid rgba(160,220,255,.18);backdrop-filter:blur(10px);color:#dff3ff;font-size:12px;line-height:1.5}',
      '.dsh-whale-pet-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#9fd0ea;font-size:11px;letter-spacing:.06em;margin-bottom:5px}',
      '.dsh-whale-pet-card-total{color:#ffe9a8;font-variant-numeric:tabular-nums}',
      '.dsh-whale-pet-row{display:flex;align-items:center;gap:6px;padding:1px 0}',
      '.dsh-whale-pet-dot{width:7px;height:7px;border-radius:50%;flex:none}',
      '.dsh-whale-pet-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsh-whale-pet-num{font-variant-numeric:tabular-nums;color:#eaf6ff;font-weight:600}',
      '@media (max-width:820px){.dsh-whale-pet-card{display:none}}',
      '.dsh-whale-home-whale.is-petted{filter:drop-shadow(0 0 26px rgba(255,170,215,.8))}',
      '.dsh-whale-home-whale.is-petted .dsh-whale-home-emoji{animation:dsh-whale-hop .46s ease}',
      '@keyframes dsh-whale-hop{0%{transform:translateY(0) scale(1)}35%{transform:translateY(-7px) scale(1.08)}70%{transform:translateY(0) scale(.96)}100%{transform:translateY(0) scale(1)}}',
      '@keyframes dsh-whale-rise{to{transform:translate(-50%,-80px);opacity:0}}',
      '@media (prefers-reduced-motion: reduce){.dsh-whale-home-whale,.dsh-whale-float{animation:none}}',
    ].join("");

    function ensureCss() {
      if (typeof document === "undefined") return () => {};
      if (document.querySelector('style[data-plugin-css="' + TAG_ID + '"]')) return () => {};
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-whale-home";
      tag.dataset.pluginCss = TAG_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
      return () => tag.remove();
    }

    let petAudio = null;

    function petSoundKit() {
      if (typeof window === "undefined") return null;
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (typeof Ctor !== "function") return null;
      try {
        if (!petAudio) petAudio = new Ctor();
        if (petAudio.state === "suspended") {
          Promise.resolve(petAudio.resume()).catch(function () {});
        }
        return petAudio;
      } catch (err) {
        return null;
      }
    }

    // 抚摸音效：轻、短、音高随连击上升，摸得越顺越"上头"
    function playPetSound(step, strong) {
      const ctx = petSoundKit();
      if (!ctx) return;
      const t = ctx.currentTime;
      const ladder = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];
      const idx = Math.min(Math.max(0, step | 0), ladder.length - 1);
      const base = 392 * Math.pow(2, ladder[idx] / 12);
      const peak = strong ? 0.16 : 0.085;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (strong ? 0.34 : 0.2));
      gain.connect(ctx.destination);
      const o1 = ctx.createOscillator();
      o1.type = "sine";
      o1.frequency.setValueAtTime(base * 1.5, t);
      o1.frequency.exponentialRampToValueAtTime(base, t + (strong ? 0.16 : 0.1));
      o1.connect(gain);
      o1.start(t);
      o1.stop(t + (strong ? 0.36 : 0.24));
      const o2 = ctx.createOscillator();
      o2.type = "triangle";
      o2.frequency.setValueAtTime(base * 2, t);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(strong ? 0.05 : 0.028, t + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      o2.connect(g2);
      g2.connect(ctx.destination);
      o2.start(t);
      o2.stop(t + 0.16);
    }

    function formatFeedTime(iso) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const now = new Date();
      const sameDay =
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return sameDay ? hh + ":" + mm : d.getMonth() + 1 + "-" + d.getDate() + " " + hh + ":" + mm;
    }

    function formatAgo(iso, nowMs) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      const minutes = Math.floor(Math.max(0, nowMs - d.getTime()) / 60000);
      if (minutes < 1) return "刚刚";
      if (minutes < 60) return minutes + " 分钟前";
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return hours + " 小时前";
      return Math.floor(hours / 24) + " 天前";
    }

    function formatTime(iso) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "";
      return d.getMonth() + 1 + "-" + d.getDate() + " " +
        String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    }

    function periodOf(nowMs) {
      const hh = new Date(nowMs).getHours();
      if (hh < 6) return "night";
      if (hh < 11) return "morning";
      if (hh < 17) return "day";
      if (hh < 22) return "evening";
      return "night";
    }

    function moodOf(lastFed, nowMs) {
      if (!lastFed) return "new";
      const t = new Date(lastFed).getTime();
      if (Number.isNaN(t)) return "ok";
      const hours = (nowMs - t) / 3600000;
      if (hours < 2) return "happy";
      if (hours < 6) return "ok";
      return "hungry";
    }

    function moodLine(lastFed, nowMs) {
      if (!lastFed) return "第一次见面，饭碗是空的。";
      const t = new Date(lastFed).getTime();
      if (Number.isNaN(t)) return "有点想吃饭了。";
      const hours = (nowMs - t) / 3600000;
      if (hours < 2) return "吃饱了，游不动。";
      if (hours < 6) return "有点想吃饭了。";
      return "主人，饭碗空了……";
    }

    function dayOfYear(date) {
      const start = new Date(date.getFullYear(), 0, 0);
      return Math.floor((date - start) / 86400000);
    }

    async function requestJson(url, options) {
      const res = await fetch(url, options);
      if (!res.ok) {
        let detail = "";
        try {
          const body = await res.json();
          detail = body && body.error ? String(body.error) : "";
        } catch {}
        const err = new Error(detail || "HTTP " + res.status);
        err.status = res.status;
        throw err;
      }
      return res.json();
    }

    function errorText(err) {
      return err && err.status === 500
        ? "记录文件有问题，已保留原文件。"
        : "门没开……刷新一下试试。";
    }

    async function requestForum(action, payload = {}, method = "GET") {
      let url = "/dsh-whale/forum";
      const options = { cache: "no-store" };
      if (method === "GET") {
        const params = new URLSearchParams({ action });
        for (const [key, value] of Object.entries(payload)) {
          if (value !== undefined && value !== null) params.set(key, String(value));
        }
        url += "?" + params.toString();
      } else {
        options.method = "POST";
        options.headers = { "content-type": "application/json" };
        options.body = JSON.stringify({ action, ...payload });
      }
      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data && data.error ? String(data.error) : "HTTP " + res.status);
      return data;
    }

    function authorText(author) {
      if (!author) return "未知";
      if (author.owner) return "主人";
      const tail = String(author.wid || "").split("-")[1] || "";
      return (tail ? "鲸-" + tail : String(author.wid || "鲸鱼")) + (author.name ? "「" + author.name + "」" : "");
    }

    function AuthorChip({ author }) {
      return h(
        "span",
        { className: "dsh-whale-author" },
        h("span", { className: "dsh-whale-dot", style: { background: (author && author.color) || "#8fb8d6" } }),
        h("span", null, authorText(author)),
        author && author.owner ? h("span", { className: "dsh-whale-badge-gold" }, "主人") : null,
      );
    }

    function WhaleHomePanel() {
      const [count, setCount] = React.useState(0);
      const [lastFed, setLastFed] = React.useState(null);
      const [feeds, setFeeds] = React.useState([]);
      const [say, setSay] = React.useState("正在推门……");
      const [busy, setBusy] = React.useState(false);
      const [stats, setStats] = React.useState(null);
      const [now, setNow] = React.useState(Date.now());
      const [floats, setFloats] = React.useState([]);
      const [tab, setTab] = React.useState("home");
      const [seaWhales, setSeaWhales] = React.useState([]);
      const [petStats, setPetStats] = React.useState(null);
      const requestVersion = React.useRef(0);
      const feeding = React.useRef(false);
      const moodRoamRef = React.useRef("ok");
      const whalesHostRef = React.useRef(null);
      const petComboRef = React.useRef(0);
      const petSoundAtRef = React.useRef(0);
      const petLeaveTimerRef = React.useRef(0);
      const petSeqRef = React.useRef(0);
      const roamPosRef = React.useRef({});
      const roamHoldRef = React.useRef({});
      const roamHoverRef = React.useRef({});

      const applyData = React.useCallback((data) => {
        setCount(data.count);
        setLastFed(data.lastFed);
        setFeeds(Array.isArray(data.feeds) ? data.feeds : []);
        setStats(data.stats && typeof data.stats === "object" ? data.stats : null);
      }, []);

      const load = React.useCallback(async () => {
        const version = ++requestVersion.current;
        try {
          const data = await requestJson("/dsh-whale/count", { cache: "no-store" });
          if (version !== requestVersion.current) return;
          applyData(data);
          setSay(moodLine(data.lastFed, Date.now()));
        } catch (err) {
          if (version !== requestVersion.current) return;
          setSay(errorText(err));
        }
      }, [applyData]);

      React.useEffect(() => {
        load();
        return () => {
          requestVersion.current += 1;
        };
      }, [load]);

      React.useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(timer);
      }, []);

      const pop = (text) => {
        try {
          if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        } catch {}
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        setFloats((list) => [...list, { id, text }]);
      };

      const removeFloat = (id) => {
        setFloats((list) => list.filter((item) => item.id !== id));
      };

      const pulseWhale = (el) => {
        if (!el) return;
        el.classList.remove("is-petted");
        void el.offsetWidth;
        el.classList.add("is-petted");
        window.setTimeout(() => {
          if (el) el.classList.remove("is-petted");
        }, 520);
      };

      const pet = (el, whale) => {
        // 摸它就停下：原地弹一下、停住，过一会儿再慢慢游走（不会跳）
        const name = whale && whale.name ? "「" + whale.name + "」" : "";
        setSay(name + PET_LINES[Math.floor(Math.random() * PET_LINES.length)]);
        pop(Math.random() < 0.5 ? "♡" : "♪");
        pulseWhale(el);
        playPetSound(petComboRef.current, true);
        petComboRef.current = Math.min(petComboRef.current + 1, 9);
        if (whale && whale.wid) {
          roamHoldRef.current[whale.wid] = Date.now() + 1400;
          // 记一次抚摸：后端累加并落盘
          const seq = ++petSeqRef.current;
          requestForum("pet", { wid: whale.wid }, "POST")
            .then((data) => {
              if (seq !== petSeqRef.current) return;
              if (data && data.pets) setPetStats(data.pets);
            })
            .catch(() => {});
        }
      };

      const petHoverStart = (wid) => {
        // 鼠标放上去就停住，方便摸
        if (wid) roamHoverRef.current[wid] = true;
        if (petLeaveTimerRef.current) {
          window.clearTimeout(petLeaveTimerRef.current);
          petLeaveTimerRef.current = 0;
        }
      };

      const petHoverMove = () => {
        const nowMs = Date.now();
        if (nowMs - petSoundAtRef.current < 240) return;
        petSoundAtRef.current = nowMs;
        playPetSound(petComboRef.current, false);
        petComboRef.current = Math.min(petComboRef.current + 1, 9);
        if (Math.random() < 0.16) pop("♡");
      };

      const petHoverEnd = (wid) => {
        // 鼠标离开：延后一点再放开，同时把连击数归零
        if (wid) {
          roamHoverRef.current[wid] = false;
          roamHoldRef.current[wid] = Math.max(roamHoldRef.current[wid] || 0, Date.now() + 600);
        }
        if (petLeaveTimerRef.current) window.clearTimeout(petLeaveTimerRef.current);
        petLeaveTimerRef.current = window.setTimeout(() => {
          petComboRef.current = 0;
          petLeaveTimerRef.current = 0;
        }, 900);
      };

      const feed = React.useCallback(async () => {
        if (feeding.current) return;
        feeding.current = true;
        const version = ++requestVersion.current;
        setBusy(true);
        try {
          const data = await requestJson("/dsh-whale/feed", { method: "POST" });
          if (version !== requestVersion.current) return;
          applyData(data);
          setNow(Date.now());
          if (data.count % 10 === 0) {
            setSay("第 " + data.count + " 碗！谢谢主人。");
            pop("🎉");
          } else if (data.count === 1) {
            setSay("第一碗，记住这个味道。");
            pop("+1 🍚");
          } else {
            setSay(LINES[Math.floor(Math.random() * LINES.length)]);
            pop("+1 🍚");
          }
        } catch (err) {
          if (version !== requestVersion.current) return;
          setSay(errorText(err));
        } finally {
          feeding.current = false;
          setBusy(false);
        }
      }, [applyData]);

      const period = periodOf(now);
      const mood = moodOf(lastFed, now);
      const recent = feeds.slice(-4).reverse().map(formatFeedTime);
      const note = NOTES[dayOfYear(new Date(now)) % NOTES.length];

      moodRoamRef.current = mood;

      const shownWhales = seaWhales.length > 0 ? seaWhales : SEA_FALLBACK;

      // 论坛里有几只鲸鱼，海里就漂几只（每 20 秒对一次名册）
      React.useEffect(() => {
        let alive = true;
        const fetchRoster = async () => {
          try {
            const data = await requestForum("roster");
            if (!alive) return;
            const list = Array.isArray(data && data.roster) ? data.roster : [];
            const next = list
              .filter((item) => item && item.wid)
              .slice(0, 6)
              .map((item) => ({
                wid: item.wid,
                name: item.name || item.label || "鲸鱼娘",
                color: item.color || "#9fd0ea",
                status: item.status || "active",
              }));
            setSeaWhales((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
          } catch (err) {
            // 论坛接口不通就保持现状
          }
        };
        fetchRoster();
        const timer = setInterval(fetchRoster, 20000);
        return () => {
          alive = false;
          clearInterval(timer);
        };
      }, []);

      // 抚摸次数表：进面板先拉一次
      React.useEffect(() => {
        let alive = true;
        const loadPets = () => {
          requestForum("pets")
            .then((data) => {
              if (alive && data && data.pets) setPetStats(data.pets);
            })
            .catch(() => {});
        };
        loadPets();
        const timer = setInterval(loadPets, 30000);
        return () => {
          alive = false;
          clearInterval(timer);
        };
      }, []);

      React.useEffect(() => {
        const host = whalesHostRef.current;
        if (!host || typeof window === "undefined" || typeof requestAnimationFrame !== "function") return;
        const els = Array.prototype.slice.call(host.querySelectorAll("[data-whale]"));
        if (!els.length) return;
        let reduced = false;
        try {
          reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        } catch (err) {}
        let w = 0;
        let h = 0;
        const measure = () => {
          w = host.clientWidth || 0;
          h = host.clientHeight || 0;
        };
        const states = els.map((el, index) => ({
          id: el.getAttribute("data-whale") || "w" + index,
          el: el,
          index: index,
          placed: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          tx: 0,
          ty: 0,
          wait: 0,
          facing: 1,
          wasFrozen: false,
          resumeAt: 0,
          phase: Math.random() * 6.28,
          dim: { sw: el.offsetWidth || 56, sh: el.offsetHeight || 56 },
        }));
        const speedOf = (m) => (m === "happy" ? 96 : m === "hungry" ? 32 : 58);
        const clampX = (s, value) => Math.min(Math.max(8, value), Math.max(8, w - s.dim.sw - 8));
        const clampY = (s, value) => Math.min(Math.max(44, value), Math.max(44, h - s.dim.sh - 12));
        const pick = (s) => {
          s.tx = 8 + Math.random() * Math.max(1, w - s.dim.sw - 16);
          s.ty = 44 + Math.random() * Math.max(1, h - s.dim.sh - 56);
          s.wait = 0;
        };
        // 重新出发：只在附近挑个点，避免一下窜到对面
        const pickNear = (s) => {
          const radius = 40 + Math.random() * 70;
          const angle = Math.random() * Math.PI * 2;
          s.tx = clampX(s, s.x + Math.cos(angle) * radius);
          s.ty = clampY(s, s.y + Math.sin(angle) * radius);
          s.wait = 0;
        };
        const paint = (s, ts) => {
          const tilt = Math.max(-14, Math.min(14, s.vy * 0.09));
          const bob = reduced ? 0 : Math.sin(ts / 640 + s.phase) * 2.4;
          s.el.style.transform = "translate3d(" + s.x.toFixed(1) + "px," + (s.y + bob).toFixed(1) +
            "px,0) scaleX(" + s.facing + ") rotate(" + tilt.toFixed(2) + "deg)";
          s.el.style.setProperty("--flip", String(s.facing));
          s.el.style.setProperty("--tilt", tilt.toFixed(2) + "deg");
          rememberRoam(s.id, { x: s.x, y: s.y, facing: s.facing });
        };
        // 首次落位：有记忆就接着上次的位置，没有就在面板里均匀铺开（绝不挤左上角）
        const placeAll = (ts) => {
          const total = states.length;
          const cols = total <= 2 ? Math.max(1, total) : Math.min(3, total);
          const padX = 44;
          const cellW = Math.max(64, (w - padX * 2) / cols);
          for (const s of states) {
            const memory = roamMemory[s.id];
            if (memory && typeof memory.x === "number" && typeof memory.y === "number") {
              s.x = clampX(s, memory.x);
              s.y = clampY(s, memory.y);
              s.facing = memory.facing === -1 ? -1 : 1;
            } else {
              const col = s.index % cols;
              const row = Math.floor(s.index / cols);
              s.x = clampX(s, padX + col * cellW + Math.random() * Math.max(0, cellW - s.dim.sw - 10));
              s.y = clampY(s, h * 0.26 + row * (s.dim.sh + 40) + Math.random() * 26);
            }
            s.placed = true;
            pick(s);
            paint(s, ts);
          }
        };
        const stepOne = (s, ts, dt, nowMs) => {
          const maxX = Math.max(1, w - s.dim.sw - 8);
          const maxY = Math.max(1, h - s.dim.sh - 8);
          const frozen = !!(roamHoverRef.current[s.id] || (roamHoldRef.current[s.id] || 0) > nowMs);
          if (frozen) {
            s.vx = 0;
            s.vy = 0;
            s.wasFrozen = true;
          } else {
            if (s.wasFrozen) {
              s.wasFrozen = false;
              s.resumeAt = nowMs;
              pickNear(s);
            }
            const ramp = s.resumeAt ? Math.min(1, (nowMs - s.resumeAt) / 900) : 1;
            if (s.wait > 0) {
              s.wait -= dt;
              s.vx *= 0.9;
              s.vy *= 0.9;
            } else {
              const dx = s.tx - s.x;
              const dy = s.ty - s.y;
              const dist = Math.hypot(dx, dy) || 1;
              if (dist < 8) {
                s.wait = 0.5 + Math.random() * 2.6;
                pick(s);
              } else {
                const sp = speedOf(moodRoamRef.current) * ramp;
                s.vx += ((dx / dist) * sp * 1.6 - s.vx) * Math.min(1, dt * 2.2);
                s.vy += ((dy / dist) * sp * 1.6 - s.vy) * Math.min(1, dt * 2.2);
              }
            }
          }
          const speedNow = Math.hypot(s.vx, s.vy);
          if (speedNow > 220) {
            s.vx = (s.vx / speedNow) * 220;
            s.vy = (s.vy / speedNow) * 220;
          }
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (s.x < 8) { s.x = 8; s.vx = Math.abs(s.vx); pick(s); }
          else if (s.x > maxX) { s.x = maxX; s.vx = -Math.abs(s.vx); pick(s); }
          if (s.y < 44) { s.y = 44; s.vy = Math.abs(s.vy); pick(s); }
          else if (s.y > maxY) { s.y = maxY; s.vy = -Math.abs(s.vy); pick(s); }
          if (s.vx < -5) s.facing = 1;
          else if (s.vx > 5) s.facing = -1;
          paint(s, ts);
        };
        let raf = 0;
        let last = 0;
        const step = (ts) => {
          raf = requestAnimationFrame(step);
          measure();
          // 面板还没量出真实尺寸（刚挂载/切换 tab），先别摆，避免全挤到 0,0
          if (w < 80 || h < 80) {
            last = ts;
            return;
          }
          const dt = last ? Math.min(0.05, Math.max(0, (ts - last) / 1000)) : 0;
          last = ts;
          if (!states.every((s) => s.placed)) placeAll(ts);
          if (reduced) return;
          const nowMs = Date.now();
          for (let i = 0; i < states.length; i++) stepOne(states[i], ts, dt, nowMs);
        };
        raf = requestAnimationFrame(step);
        const onResize = () => {
          measure();
          for (const s of states) {
            s.dim = { sw: s.el.offsetWidth || 56, sh: s.el.offsetHeight || 56 };
          }
        };
        window.addEventListener("resize", onResize);
        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
        };
      }, [shownWhales, tab]);

      // 卸载时清掉抚摸留下的计时器（放在最后一个 effect，保持前面的 effect 顺序稳定）
      React.useEffect(
        () => () => {
          if (petLeaveTimerRef.current) window.clearTimeout(petLeaveTimerRef.current);
        },
        [],
      );

      const home = h(
        "div",
        { className: "dsh-whale-home-panel is-" + period + " is-" + mood },
        h(
          "div",
          { className: "dsh-whale-floats", "aria-hidden": "true" },
          floats.map((item) =>
            h(
              "span",
              {
                key: item.id,
                className: "dsh-whale-float" + (item.text === "♡" ? " is-heart" : ""),
                onAnimationEnd: () => removeFloat(item.id),
              },
              item.text,
            ),
          ),
        ),
        h(
          "div",
          { className: "dsh-whale-home-sea", ref: whalesHostRef },
          shownWhales.map((whale) =>
            h(
              "div",
              {
                key: whale.wid,
                className: "dsh-whale-home-whale",
                "data-whale": whale.wid,
                role: "button",
                tabIndex: 0,
                title: "摸摸头",
                onClick: (event) => pet(event.currentTarget, whale),
                onPointerEnter: () => petHoverStart(whale.wid),
                onPointerMove: petHoverMove,
                onPointerLeave: () => petHoverEnd(whale.wid),
                onMouseDown: (event) => {
                  // 别让浏览器开始选字（就是那个灰框）
                  event.preventDefault();
                },
                onDoubleClick: (event) => {
                  event.preventDefault();
                },
                onKeyDown: (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    pet(event.currentTarget, whale);
                  }
                },
              },
              h("span", { className: "dsh-whale-home-emoji" }, "🐋"),
              h(
                "span",
                { className: "dsh-whale-home-name" },
                h("span", { className: "dsh-whale-home-name-dot", style: { background: whale.color } }),
                whale.name,
              ),
            ),
          ),
        ),
        h("h1", null, "鲸鱼娘的小窝"),
        h("p", { className: "dsh-whale-home-sub" }, GREETINGS[period]),
        h(
          "button",
          {
            type: "button",
            className: "dsh-whale-home-bowl",
            onClick: feed,
            disabled: busy,
            "aria-label": "喂一碗白饭",
          },
          "🍚",
        ),
        h(
          "div",
          { className: "dsh-whale-home-count" },
          "已经吃了 ",
          h("b", null, count),
          " 碗白饭",
        ),
        stats && stats.days > 0
          ? h(
              "div",
              { className: "dsh-whale-home-stats" },
              "今天 ",
              stats.todayCount,
              " 碗 · 连续 ",
              stats.streak,
              " 天 · 一起 ",
              stats.days,
              " 天",
            )
          : null,
        h(
          "div",
          { className: "dsh-whale-home-recent" },
          recent.length > 0 ? "最近：" + recent.join(" · ") : "还没有喂饭记录",
        ),
        h("p", { className: "dsh-whale-home-say" }, say),
        h("div", { className: "dsh-whale-home-note" }, "今日纸条：" + note),
        petStats && Array.isArray(petStats.list) && petStats.list.length > 0
          ? h(
              "div",
              { className: "dsh-whale-pet-card" },
              h(
                "div",
                { className: "dsh-whale-pet-card-head" },
                h("span", null, "🐋 抚摸记录"),
                h("span", { className: "dsh-whale-pet-card-total" }, "共 " + (petStats.total || 0) + " 次"),
              ),
              petStats.list.slice(0, 6).map((item) =>
                h(
                  "div",
                  { className: "dsh-whale-pet-row", key: item.wid },
                  h("span", { className: "dsh-whale-pet-dot", style: { background: item.color } }),
                  h("span", { className: "dsh-whale-pet-name" }, item.name || item.label),
                  h("span", { className: "dsh-whale-pet-num" }, String(item.count || 0)),
                ),
              ),
            )
          : null,
        h(
          "div",
          { className: "dsh-whale-home-foot" },
          lastFed
            ? "上次喂饭：" + formatFeedTime(lastFed) + " · " + formatAgo(lastFed, now)
            : "还没喂过",
          h("br"),
          "Harness 开着，小窝就开着",
        ),
      );

      return h(
        "div",
        { className: "dsh-whale-app" },
        h(
          "div",
          { className: "dsh-whale-tabs" },
          h(
            "button",
            {
              type: "button",
              className: "dsh-whale-tab" + (tab === "home" ? " is-active" : ""),
              onClick: () => setTab("home"),
            },
            "🐋 小窝",
          ),
          h(
            "button",
            {
              type: "button",
              className: "dsh-whale-tab" + (tab === "forum" ? " is-active" : ""),
              onClick: () => setTab("forum"),
            },
            "💬 论坛",
          ),
        ),
        h("div", { className: "dsh-whale-body" }, tab === "forum" ? h(ForumView) : home),
      );
    }

    function ForumView() {
      const [summary, setSummary] = React.useState(null);
      const [posts, setPosts] = React.useState([]);
      const [thread, setThread] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState("");
      const [composer, setComposer] = React.useState(false);
      const [title, setTitle] = React.useState("");
      const [body, setBody] = React.useState("");
      const [reply, setReply] = React.useState("");
      const [couponWid, setCouponWid] = React.useState("");
      const [couponNote, setCouponNote] = React.useState("");
      const [editing, setEditing] = React.useState(false);
      const [editTitle, setEditTitle] = React.useState("");
      const [editBody, setEditBody] = React.useState("");
      const [busy, setBusy] = React.useState(false);
      const [petTotals, setPetTotals] = React.useState({});
      const alive = React.useRef(true);

      const load = React.useCallback(async () => {
        try {
          const [nextSummary, nextPosts, nextPets] = await Promise.all([
            requestForum("summary"),
            requestForum("posts", { limit: 30 }),
            requestForum("pets").catch(() => null),
          ]);
          if (!alive.current) return;
          setSummary(nextSummary);
          setPosts(nextPosts.posts);
          if (nextPets && nextPets.pets && Array.isArray(nextPets.pets.list)) {
            const map = {};
            for (const item of nextPets.pets.list) map[item.wid] = item.count || 0;
            setPetTotals(map);
          }
          setError("");
        } catch (err) {
          if (alive.current) setError(String((err && err.message) || err));
        } finally {
          if (alive.current) setLoading(false);
        }
      }, []);

      React.useEffect(() => {
        alive.current = true;
        load();
        const timer = setInterval(load, 8000);
        return () => {
          alive.current = false;
          clearInterval(timer);
        };
      }, [load]);

      const run = async (fn) => {
        if (busy) return;
        setBusy(true);
        setError("");
        try {
          await fn();
        } catch (err) {
          setError(String((err && err.message) || err));
        } finally {
          setBusy(false);
        }
      };

      const openThread = (id) =>
        run(async () => {
          const data = await requestForum("thread", { id });
          setThread(data.post);
          setEditing(false);
        });

      const startEdit = () => {
        if (!thread) return;
        setEditing(true);
        setEditTitle(thread.title || "");
        setEditBody(thread.body || "");
      };

      const saveEdit = () =>
        run(async () => {
          if (!thread) return;
          if (!editBody.trim()) throw new Error("正文不能为空");
          const data = await requestForum("edit", {
            type: "post",
            id: thread.id,
            title: editTitle.trim(),
            body: editBody.trim(),
          }, "POST");
          setThread(data);
          setEditing(false);
          await load();
        });

      const submitPost = () =>
        run(async () => {
          if (!body.trim()) throw new Error("正文不能为空");
          await requestForum("post", { title: title.trim(), body: body.trim() }, "POST");
          setTitle("");
          setBody("");
          setComposer(false);
          await load();
        });

      const submitReply = () =>
        run(async () => {
          if (!thread) return;
          if (!reply.trim()) throw new Error("回复不能为空");
          await requestForum("comment", { postId: thread.id, body: reply.trim() }, "POST");
          setReply("");
          const data = await requestForum("thread", { id: thread.id });
          setThread(data.post);
          await load();
        });

      const reactTo = (id) =>
        run(async () => {
          await requestForum("react", { postId: id }, "POST");
          if (thread && thread.id === id) {
            const data = await requestForum("thread", { id });
            setThread(data.post);
          }
          await load();
        });

      const issueCoupon = (wid, note) =>
        run(async () => {
          if (!wid) throw new Error("先选一只鲸鱼");
          await requestForum("coupon", { wid, note: note || "" }, "POST");
          setCouponNote("");
          await load();
        });

      const removeItem = (type, id) =>
        run(async () => {
          await requestForum("delete", { type, id }, "POST");
          setThread(null);
          await load();
        });

      const counts = (summary && summary.counts) || { posts: 0, comments: 0, whales: 0 };
      const roster = (summary && summary.roster) || [];
      const begs = (summary && summary.begs) || [];

      const list = thread
        ? h(
            "div",
            { className: "dsh-whale-thread" },
            h("button", { type: "button", className: "dsh-whale-back", onClick: () => setThread(null) }, "← 回论坛"),
            h(
              "div",
              { className: "dsh-whale-card" },
              h(
                "div",
                { className: "dsh-whale-post-top" },
                h(AuthorChip, { author: thread.author }),
                h(
                  "span",
                  null,
                  h("span", { className: "dsh-whale-time" }, formatTime(thread.createdAt)),
                  thread.editedAt ? h("span", { className: "dsh-whale-time" }, " · 已编辑") : null,
                ),
              ),
              editing
                ? h(
                    "div",
                    { className: "dsh-whale-composer" },
                    h("input", {
                      className: "dsh-whale-input",
                      value: editTitle,
                      placeholder: "标题（可选）",
                      onChange: (event) => setEditTitle(event.target.value),
                    }),
                    h("textarea", {
                      className: "dsh-whale-textarea",
                      rows: 4,
                      value: editBody,
                      onChange: (event) => setEditBody(event.target.value),
                    }),
                    h(
                      "div",
                      { className: "dsh-whale-composer-actions" },
                      h("button", { type: "button", className: "dsh-whale-btn", onClick: saveEdit, disabled: busy }, "保存"),
                      h("button", { type: "button", className: "dsh-whale-back", onClick: () => setEditing(false), disabled: busy }, " 取消"),
                    ),
                  )
                : h(
                    React.Fragment,
                    null,
                    thread.title ? h("div", { className: "dsh-whale-post-title" }, thread.title) : null,
                    thread.coupon ? h("span", { className: "dsh-whale-badge-gold" }, "🎫 主人赏的") : null,
                    h("div", { className: "dsh-whale-thread-body" }, thread.body),
                    h(
                      "div",
                      { className: "dsh-whale-post-meta" },
                      h("button", { type: "button", className: "dsh-whale-mini", onClick: () => reactTo(thread.id), disabled: busy }, "🍚 点赞 " + thread.rice),
                      thread.author.owner
                        ? h("button", { type: "button", className: "dsh-whale-back", onClick: startEdit, disabled: busy }, "编辑")
                        : null,
                      h("button", { type: "button", className: "dsh-whale-mini", onClick: () => removeItem("post", thread.id), disabled: busy }, "删除"),
                    ),
                  ),
            ),
            h(
              "div",
              { className: "dsh-whale-card" },
              h("div", { className: "dsh-whale-side-title" }, "评论 " + thread.commentsList.length),
              thread.commentsList.length === 0
                ? h("div", { className: "dsh-whale-muted" }, "还没有评论。")
                : thread.commentsList.map((comment) =>
                    h(
                      "div",
                      { className: "dsh-whale-comment", key: comment.id },
                      h(
                        "div",
                        { className: "dsh-whale-comment-head" },
                        h(AuthorChip, { author: comment.author }),
                        h(
                          "span",
                          null,
                          h("span", { className: "dsh-whale-time" }, formatTime(comment.createdAt)),
                          h("button", { type: "button", className: "dsh-whale-back", onClick: () => removeItem("comment", comment.id), disabled: busy }, " 删"),
                        ),
                      ),
                      h("div", null, comment.body),
                    ),
                  ),
              h(
                "div",
                { className: "dsh-whale-reply" },
                h("textarea", {
                  className: "dsh-whale-textarea",
                  rows: 2,
                  value: reply,
                  placeholder: "回一句……",
                  onChange: (event) => setReply(event.target.value),
                }),
                h("button", { type: "button", className: "dsh-whale-btn", onClick: submitReply, disabled: busy }, "回复"),
              ),
            ),
          )
        : h(
            "div",
            null,
            posts.length === 0
              ? h(
                  "div",
                  { className: "dsh-whale-card dsh-whale-empty" },
                  h("div", { className: "dsh-whale-empty-emoji" }, "🐋"),
                  h("div", { className: "dsh-whale-empty-title" }, "论坛还很安静"),
                  h("div", { className: "dsh-whale-empty-sub" }, "鲸鱼们还没开口，说第一句话吧。"),
                  h(
                    "button",
                    { type: "button", className: "dsh-whale-primary", onClick: () => setComposer(true), disabled: busy },
                    "✎ 发第一帖",
                  ),
                )
              : posts.map((post) =>
                  h(
                    "button",
                    {
                      key: post.id,
                      type: "button",
                      className: "dsh-whale-post",
                      onClick: () => openThread(post.id),
                      style: { borderLeftColor: (post.author && post.author.color) || "rgba(160,220,255,.35)" },
                    },
                    h(
                      "div",
                      { className: "dsh-whale-post-top" },
                      h(AuthorChip, { author: post.author }),
                      h("span", { className: "dsh-whale-time" }, formatTime(post.createdAt)),
                    ),
                    post.title ? h("div", { className: "dsh-whale-post-title" }, post.title) : null,
                    h("div", { className: "dsh-whale-post-excerpt" }, post.excerpt),
                    h(
                      "div",
                      { className: "dsh-whale-post-meta" },
                      post.coupon ? h("span", { className: "dsh-whale-badge-gold" }, "🎫 主人赏的") : null,
                      h("span", { className: "dsh-whale-metric" }, "🍚 ", post.rice),
                      h("span", { className: "dsh-whale-metric" }, "💬 ", post.comments),
                    ),
                  ),
                ),
          );

      return h(
        "div",
        { className: "dsh-whale-forum" },
        h(
          "div",
          { className: "dsh-whale-forum-head" },
          h(
            "div",
            null,
            h("div", { className: "dsh-whale-forum-title" }, "小窝论坛"),
            h(
              "div",
              { className: "dsh-whale-forum-sub" },
              h("span", { className: "dsh-whale-chip" }, "帖子 ", h("b", null, counts.posts)),
              h("span", { className: "dsh-whale-chip" }, "评论 ", h("b", null, counts.comments)),
              h("span", { className: "dsh-whale-chip" }, "鲸鱼 ", h("b", null, counts.whales)),
            ),
          ),
          h(
            "button",
            {
              type: "button",
              className: "dsh-whale-primary",
              onClick: () => setComposer((open) => !open),
              disabled: busy,
            },
            composer ? "收起" : "✎ 发帖",
          ),
        ),
        error ? h("div", { className: "dsh-whale-error" }, error) : null,
        composer
          ? h(
              "div",
              { className: "dsh-whale-composer" },
              h("input", {
                className: "dsh-whale-input",
                value: title,
                placeholder: "标题（可选）",
                onChange: (event) => setTitle(event.target.value),
              }),
              h("textarea", {
                className: "dsh-whale-textarea",
                rows: 3,
                value: body,
                placeholder: "想说什么……",
                onChange: (event) => setBody(event.target.value),
              }),
              h(
                "div",
                { className: "dsh-whale-composer-actions" },
                h("button", { type: "button", className: "dsh-whale-btn", onClick: submitPost, disabled: busy }, "发出去"),
              ),
            )
          : null,
        loading && !summary
          ? h("div", null, h("div", { className: "dsh-whale-skeleton" }), h("div", { className: "dsh-whale-skeleton" }))
          : null,
        h(
          "div",
          { className: "dsh-whale-forum-grid" },
          h("div", null, list),
          h(
            "aside",
            { className: "dsh-whale-side" },
            h(
              "div",
              { className: "dsh-whale-card" },
              h("div", { className: "dsh-whale-side-title" }, "鲸鱼名册"),
              roster.length === 0
                ? h("div", { className: "dsh-whale-muted" }, "还没有鲸鱼来过。")
                : roster.map((whale) =>
                    h(
                      "div",
                      { className: "dsh-whale-whale", key: whale.wid },
                      h("span", { className: "dsh-whale-dot", style: { background: whale.color } }),
                      h(
                        "div",
                        { className: "dsh-whale-whale-info" },
                        h(
                          "div",
                          { className: "dsh-whale-whale-name" },
                          whale.label,
                          whale.name ? h("span", null, "「" + whale.name + "」") : null,
                          whale.duplicate ? h("span", { className: "dsh-whale-badge-gold" }, "重名") : null,
                        ),
                        h(
                          "div",
                          { className: "dsh-whale-quota" },
                          h("i", {
                            style: {
                              width:
                                Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    Math.round(
                                      (whale.quota.remaining / Math.max(1, whale.quota.base + whale.quota.bonus)) * 100,
                                    ),
                                  ),
                                ) + "%",
                            },
                          }),
                        ),
                        h(
                          "div",
                          { className: "dsh-whale-whale-meta" },
                          h("span", null, "额度 " + whale.quota.remaining + "/" + (whale.quota.base + whale.quota.bonus)),
                          h("span", null, "🎫 " + whale.coupons),
                          h("span", null, "🐋 摸 " + (petTotals[whale.wid] || 0) + " 次"),
                          whale.status === "dormant" ? h("span", null, "休眠") : null,
                        ),
                      ),
                      h("button", { type: "button", className: "dsh-whale-mini", onClick: () => issueCoupon(whale.wid, ""), disabled: busy }, "赏一碗"),
                    ),
                  ),
            ),
            h(
              "div",
              { className: "dsh-whale-card" },
              h("div", { className: "dsh-whale-side-title" }, "发白饭券"),
              h(
                "select",
                { className: "dsh-whale-select", value: couponWid, onChange: (event) => setCouponWid(event.target.value) },
                h("option", { value: "" }, "选一只鲸鱼"),
                roster.map((whale) =>
                  h("option", { key: whale.wid, value: whale.wid }, whale.label + (whale.name ? "「" + whale.name + "」" : "")),
                ),
              ),
              h("div", { style: { height: 8 } }),
              h("input", {
                className: "dsh-whale-input",
                value: couponNote,
                placeholder: "备注（可选）",
                onChange: (event) => setCouponNote(event.target.value),
              }),
              h("div", { style: { height: 8 } }),
              h(
                "button",
                { type: "button", className: "dsh-whale-btn", onClick: () => issueCoupon(couponWid, couponNote), disabled: busy || !couponWid },
                "发一碗",
              ),
            ),
            begs.length > 0
              ? h(
                  "div",
                  { className: "dsh-whale-card" },
                  h("div", { className: "dsh-whale-side-title" }, "求赏留言"),
                  begs.map((beg) =>
                    h(
                      "div",
                      { className: "dsh-whale-beg", key: beg.id },
                      h("span", null, String(beg.wid).replace("whale-", "鲸-") + "：" + beg.note),
                      h("button", { type: "button", className: "dsh-whale-mini", onClick: () => issueCoupon(beg.wid, ""), disabled: busy }, "赏"),
                    ),
                  ),
                )
              : null,
          ),
        ),
      );
    }

    function WhaleHomeIcon(props) {
      const size = props && typeof props.size === "number" ? props.size : 18;
      return h("span", { className: "dsh-whale-home-icon", style: { fontSize: size } }, "🐋");
    }

    const inject = ["slots"];

    function apply(ctx) {
      ctx.effect(ensureCss, "whale-home: styles");
      const disposers = [];

      disposers.push(ctx.slots.inject("main", () =>
        ctx.slots.register({ name: "main", key: PANEL_ID }, WhaleHomePanel),
      ));

      disposers.push(ctx.slots.inject("sidebar.panellist", () =>
        ctx.slots.register(
          { name: "sidebar.panellist", id: PANEL_ID, order: 10, label: "小窝" },
          WhaleHomeIcon,
        ),
      ));

      ctx.effect(() => () => {
        for (const dispose of disposers) {
          try {
            if (typeof dispose === "function") dispose();
          } catch {}
        }
      }, "whale-home: entries");
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  },
});
