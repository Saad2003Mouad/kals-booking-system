/**
 * Boston Legend – Shared Widget Injector
 * Injects: Sign In button into the Webflow nav + AI Chat Concierge widget
 * Loaded by all static public HTML pages
 */
(function () {
  'use strict';

  const BOOKING_URL = '/booking';
  const LOGIN_URL   = '/login';
  const ADMIN_URL   = '/admin';
  const API_BASE    = ''; // same origin

  /* ─────────────────────────────────────────────
     1. INJECT SIGN IN BUTTON INTO WEBFLOW NAV
  ───────────────────────────────────────────── */
  function injectNavButtons() {
    const rightLinks = document.querySelector('.right-menu-links');
    if (!rightLinks || document.getElementById('bl-signin-btn')) return;

    // Hide any existing "Reserve Truck" or other duplicate buttons
    const existingButtons = rightLinks.querySelectorAll('a.button, a.reserve-btn, a[href*="booking"], a[href*="reserve"]');
    existingButtons.forEach(btn => btn.style.display = 'none');

    const signinBtn = document.createElement('a');
    signinBtn.id = 'bl-signin-btn';
    signinBtn.href = LOGIN_URL;
    signinBtn.textContent = 'Sign In or Sign Up';
    signinBtn.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'gap:6px',
      'padding:10px 24px',
      'border-radius:50px',
      'font-family:"Nunito",sans-serif',
      'font-weight:900',
      'font-size:14px',
      'color:#000223',
      'background:#FFA000',
      'text-decoration:none',
      'margin-right:10px',
      'transition:all .2s ease',
      'white-space:nowrap',
      'box-shadow: 0 4px 14px rgba(255,160,0,0.3)'
    ].join(';');

    signinBtn.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 6px 20px rgba(255,160,0,0.4)';
    });
    signinBtn.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 4px 14px rgba(255,160,0,0.3)';
    });

    // Insert as the primary CTA
    rightLinks.appendChild(signinBtn);
  }

  /* ─────────────────────────────────────────────
     2. AI CHAT WIDGET
  ───────────────────────────────────────────── */
  function buildChatWidget() {
    // Hide chat entirely from /admin and /login routes
    if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/login')) return;
    if (document.getElementById('bl-chat-root')) return;

    const NAVY  = '#000223';
    const GOLD  = '#FFA000';
    const PINK  = '#F391BD';

    /* ── Styles ── */
    const style = document.createElement('style');
    style.textContent = `
      #bl-chat-root * { box-sizing: border-box; font-family: 'Nunito', sans-serif; }
      .w-webflow-badge { display: none !important; opacity: 0 !important; visibility: hidden !important; }
      
      #bl-chat-bubble {
        position: fixed; bottom: 28px; right: 28px; z-index: 9999;
        width: 65px; height: 65px; border-radius: 50%;
        background: linear-gradient(135deg, ${GOLD}, #FFB300);
        border: 3px solid white; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 10px 30px rgba(255,160,0,.45);
        transition: transform .25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow .25s ease;
        animation: bl-pulse 2s infinite;
      }
      #bl-chat-bubble:hover {
        transform: scale(1.08) rotate(5deg);
        box-shadow: 0 14px 35px rgba(255,160,0,.55);
      }
      
      @keyframes bl-pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 160, 0, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(255, 160, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 160, 0, 0); }
      }

      #bl-chat-window {
        position: fixed; bottom: 105px; right: 28px; z-index: 9998;
        width: 400px; max-width: calc(100vw - 40px);
        height: 560px; max-height: calc(100vh - 140px);
        background: white; border-radius: 24px;
        box-shadow: 0 20px 50px rgba(0,2,35,.15);
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; pointer-events: none;
        transform: translateY(20px) scale(.95);
        transition: opacity .3s cubic-bezier(0.4, 0, 0.2, 1), transform .3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(0,2,35,0.08);
      }
      #bl-chat-window.open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }
      
      #bl-chat-header {
        background: linear-gradient(135deg, ${NAVY} 0%, #050b40 100%);
        padding: 18px 20px; display: flex; align-items: center; gap: 14px; flex-shrink: 0;
        border-bottom: 2px solid ${GOLD};
      }
      #bl-chat-avatar {
        width: 44px; height: 44px; border-radius: 50%;
        background: white;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      #bl-chat-avatar svg {
        width: 32px;
        height: 32px;
      }
      #bl-chat-header-info { flex: 1; }
      #bl-chat-header-name { color: white; font-weight: 800; font-size: 16px; line-height: 1.2; letter-spacing: 0.5px; }
      #bl-chat-header-status { color: ${GOLD}; font-size: 12px; font-weight: 700; margin-top: 3px; display: flex; align-items: center; gap: 5px; }
      #bl-chat-header-status::before { content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 8px #22C55E; }
      
      #bl-chat-close {
        background: rgba(255,255,255,.08); border: none; border-radius: 50%;
        width: 34px; height: 34px; cursor: pointer; color: white; font-size: 14px;
        display: flex; align-items: center; justify-content: center;
        transition: background .2s, transform .2s;
      }
      #bl-chat-close:hover { background: rgba(255,255,255,.18); transform: rotate(90deg); }
      
      #bl-chat-messages {
        flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px;
        scroll-behavior: smooth; background-color: #F9FAFB;
      }
      #bl-chat-messages::-webkit-scrollbar { width: 5px; }
      #bl-chat-messages::-webkit-scrollbar-thumb { background: rgba(0,2,35,.1); border-radius: 10px; }
      
      .bl-msg { display: flex; gap: 10px; align-items: flex-end; animation: bl-fade-in .3s ease forwards; }
      .bl-msg.user { flex-direction: row-reverse; }
      
      @keyframes bl-fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .bl-msg-avatar {
        width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
        background: white; border: 1px solid rgba(0,2,35,0.06);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }
      .bl-msg-avatar svg { width: 22px; height: 22px; }
      
      .bl-msg-bubble {
        max-width: 78%; padding: 12px 16px; border-radius: 20px;
        font-size: 14.5px; font-weight: 600; line-height: 1.5;
        box-shadow: 0 2px 8px rgba(0,2,35,.03);
      }
      .bl-msg.bot .bl-msg-bubble { 
        background: white; color: #1F2937; border-bottom-left-radius: 4px; 
        border: 1px solid rgba(0,2,35,0.04);
      }
      .bl-msg.user .bl-msg-bubble { 
        background: ${NAVY}; color: white; border-bottom-right-radius: 4px; 
      }
      
      .bl-msg-bubble strong { font-weight: 800; color: ${NAVY}; }
      .bl-msg.user .bl-msg-bubble strong { color: white; }
      .bl-msg-bubble a { color: ${GOLD}; font-weight: 800; text-decoration: underline; transition: color 0.2s; }
      .bl-msg-bubble a:hover { color: #E08B00; }
      
      #bl-chat-footer { padding: 16px; border-top: 1px solid #E5E7EB; flex-shrink: 0; background: white; }
      #bl-chat-form { display: flex; gap: 8px; align-items: center; }
      #bl-chat-input {
        flex: 1; border: 2px solid #E5E7EB; border-radius: 16px;
        padding: 12px 16px; font-size: 14px; font-weight: 600;
        outline: none; resize: none; height: 46px; font-family: inherit;
        transition: border-color .2s, box-shadow .2s;
        color: ${NAVY};
      }
      #bl-chat-input:focus { border-color: ${GOLD}; box-shadow: 0 0 0 3px rgba(255,160,0,0.15); }
      
      #bl-chat-send {
        width: 46px; height: 46px; border-radius: 14px; border: none; cursor: pointer;
        background: linear-gradient(135deg, ${GOLD}, #FFB300);
        color: ${NAVY}; font-size: 16px;
        display: flex; align-items: center; justify-content: center;
        transition: transform .15s, background .2s; flex-shrink: 0;
        box-shadow: 0 4px 10px rgba(255,160,0,0.25);
      }
      #bl-chat-send:hover { transform: scale(1.04); background: #FFA000; }
      
      .bl-typing { display: flex; align-items: center; gap: 5px; padding: 6px 0; }
      .bl-typing span { width: 8px; height: 8px; background: #CBD5E1; border-radius: 50%; animation: bl-bounce 1.2s infinite; }
      .bl-typing span:nth-child(2) { animation-delay: .2s; }
      .bl-typing span:nth-child(3) { animation-delay: .4s; }
      @keyframes bl-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
      
      .bl-suggest-wrap { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
      .bl-suggest-btn {
        background: #000223; color: ${GOLD}; border: 1.5px solid ${GOLD}; 
        border-radius: 20px; padding: 7px 14px; font-size: 12.5px; font-weight: 800;
        cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,2,35,0.08);
      }
      .bl-suggest-btn:hover { background: ${GOLD}; color: #000223; transform: translateY(-1.5px); box-shadow: 0 4px 8px rgba(255,160,0,0.3); }
      
      @media (max-width: 480px) {
        #bl-chat-window {
          bottom: 85px;
          right: 16px;
          width: calc(100vw - 32px);
          height: calc(100vh - 120px);
          max-height: 520px;
          border-radius: 20px;
          border: 1px solid rgba(0,2,35,0.08);
          box-shadow: 0 10px 30px rgba(0,2,35,0.15);
        }
        #bl-chat-bubble { bottom: 16px; right: 16px; width: 55px; height: 55px; }
      }
    `;
    document.head.appendChild(style);

    const iceCreamSVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C9.79 2 8 3.79 8 6V8H16V6C16 3.79 14.21 2 12 2Z" fill="${GOLD}"/>
      <path d="M6 8H18C19.1 8 20 8.9 20 10V11C20 14.31 16.31 17 12 17C7.69 17 4 14.31 4 11V10C4 8.9 4.9 8 6 8Z" fill="${PINK}"/>
      <path d="M12 16.5L8 22H16L12 16.5Z" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1"/>
    </svg>`;

    /* ── DOM ── */
    const root = document.createElement('div');
    root.id = 'bl-chat-root';
    root.innerHTML = `
      <button id="bl-chat-bubble" aria-label="Chat with Boston Legend AI Concierge">${iceCreamSVG}</button>
      <div id="bl-chat-window" role="dialog" aria-label="Boston Legend AI Concierge">
        <div id="bl-chat-header">
          <div id="bl-chat-avatar">${iceCreamSVG}</div>
          <div id="bl-chat-header-info">
            <div id="bl-chat-header-name">Boston Legend Concierge</div>
            <div id="bl-chat-header-status">Online — ask me anything!</div>
          </div>
          <button id="bl-chat-close" aria-label="Close chat">✕</button>
        </div>
        <div id="bl-chat-messages">
          <div class="bl-msg bot">
            <div class="bl-msg-avatar">${iceCreamSVG}</div>
            <div class="bl-msg-bubble">
              Hey there! 👋 I'm the Boston Legend AI Concierge.<br><br>
              Tell me about your event and guest count, and I'll recommend the perfect package!
              <div class="bl-suggest-wrap" id="bl-suggest-container">
                <button class="bl-suggest-btn">I need help booking</button>
                <button class="bl-suggest-btn">Where do you serve?</button>
                <button class="bl-suggest-btn">I need to talk to someone</button>
              </div>
            </div>
          </div>
        </div>
        <div id="bl-chat-footer">
          <form id="bl-chat-form">
            <input id="bl-chat-input" placeholder="Ask about packages, pricing, availability…" autocomplete="off" />
            <button type="submit" id="bl-chat-send" aria-label="Send">➤</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    /* ── Logic ── */
    const bubble   = document.getElementById('bl-chat-bubble');
    const win      = document.getElementById('bl-chat-window');
    const closeBtn = document.getElementById('bl-chat-close');
    const form     = document.getElementById('bl-chat-form');
    const input    = document.getElementById('bl-chat-input');
    const msgs     = document.getElementById('bl-chat-messages');
    let history    = [];
    let open       = false;

    function toggleChat() { open = !open; win.classList.toggle('open', open); if (open) input.focus(); }
    bubble.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function appendMsg(role, html) {
      const div = document.createElement('div');
      div.className = 'bl-msg ' + role;
      const isBot = role === 'bot';
      div.innerHTML = `${isBot ? `<div class="bl-msg-avatar">${iceCreamSVG}</div>` : ''}
        <div class="bl-msg-bubble">${html}</div>
        ${!isBot ? `<div class="bl-msg-avatar" style="background:${NAVY};color:${GOLD};font-weight:900;font-size:10px">YOU</div>` : ''}`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    function showTyping() {
      const d = document.createElement('div');
      d.className = 'bl-msg bot'; d.id = 'bl-typing';
      d.innerHTML = `<div class="bl-msg-avatar">${iceCreamSVG}</div><div class="bl-msg-bubble"><div class="bl-typing"><span></span><span></span><span></span></div></div>`;
      msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    }
    function removeTyping() { const t = document.getElementById('bl-typing'); if (t) t.remove(); }

    function md2html(text) {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br>');
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      sendMessage(text);
    });

    document.getElementById('bl-suggest-container')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('bl-suggest-btn')) {
        sendMessage(e.target.textContent);
        document.getElementById('bl-suggest-container').style.display = 'none';
      }
    });

    async function sendMessage(text) {
      input.value = '';
      appendMsg('user', text);
      history.push({ role: 'user', content: text });
      showTyping();

      try {
        const res = await fetch(API_BASE + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: history,
            currentPage: window.location.href // Send context for escalation
          }),
        });
        
        let data;
        try {
          data = await res.json();
        } catch (e) {
          throw new Error("Invalid response JSON");
        }

        removeTyping();

        if (!res.ok) {
          const errMsg = data?.final_response || data?.reply || "Sorry, I’m having trouble right now. Please try again or request a human.";
          appendMsg('bot', `<span style="color:#DC2626; font-weight:bold;">⚠️ Connection Issue</span><br>${md2html(errMsg)}`);
          return;
        }

        const reply = data.reply || data.final_response || 'For booking assistance, please visit our <a href="' + BOOKING_URL + '">Booking Page</a> or call <strong>617-999-3803</strong>.';
        appendMsg('bot', md2html(reply));
        history.push({ role: 'assistant', content: reply });
      } catch (err) {
        console.error("Chat widget error:", err);
        removeTyping();
        appendMsg('bot', '<span style="color:#DC2626; font-weight:bold;">⚠️ Network Error</span><br>Sorry, I\'m having trouble connecting to the concierge. Please call us at <strong>617-999-3803</strong> or <a href="' + BOOKING_URL + '">book online</a>.');
      }
    }
  }

  /* ─────────────────────────────────────────────
     3. INIT
  ───────────────────────────────────────────── */
  function init() {
    injectNavButtons();
    buildChatWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
