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
    // Hide chat entirely from /admin routes
    if (window.location.pathname.startsWith('/admin')) return;
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
        width: 60px; height: 60px; border-radius: 50%;
        background: linear-gradient(135deg, ${GOLD}, #FFB300);
        border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 32px rgba(255,160,0,.5);
        transition: transform .2s ease, box-shadow .2s ease;
        font-size: 26px;
      }
      #bl-chat-bubble:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(255,160,0,.6); }
      #bl-chat-window {
        position: fixed; bottom: 100px; right: 28px; z-index: 9998;
        width: 380px; max-width: calc(100vw - 40px);
        height: 540px; max-height: calc(100vh - 130px);
        background: white; border-radius: 24px;
        box-shadow: 0 24px 80px rgba(0,0,0,.18);
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; pointer-events: none;
        transform: translateY(20px) scale(.96);
        transition: opacity .25s ease, transform .25s ease;
      }
      #bl-chat-window.open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }
      #bl-chat-header {
        background: linear-gradient(135deg, ${NAVY} 0%, #001a4c 100%);
        padding: 20px; display: flex; align-items: center; gap: 14px; flex-shrink: 0;
      }
      #bl-chat-avatar {
        width: 44px; height: 44px; border-radius: 50%;
        background: linear-gradient(135deg, ${GOLD}, ${PINK});
        display: flex; align-items: center; justify-content: center;
        font-size: 22px; flex-shrink: 0;
      }
      #bl-chat-header-info { flex: 1; }
      #bl-chat-header-name { color: white; font-weight: 900; font-size: 16px; line-height: 1; }
      #bl-chat-header-status { color: rgba(255,255,255,.55); font-size: 12px; font-weight: 700; margin-top: 3px; }
      #bl-chat-header-status::before { content: "●"; color: #4ADE80; margin-right: 4px; font-size: 8px; }
      #bl-chat-close {
        background: rgba(255,255,255,.1); border: none; border-radius: 50%;
        width: 32px; height: 32px; cursor: pointer; color: white; font-size: 16px;
        display: flex; align-items: center; justify-content: center;
        transition: background .2s;
      }
      #bl-chat-close:hover { background: rgba(255,255,255,.2); }
      #bl-chat-messages {
        flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px;
        scroll-behavior: smooth;
      }
      #bl-chat-messages::-webkit-scrollbar { width: 4px; }
      #bl-chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,.1); border-radius: 4px; }
      .bl-msg { display: flex; gap: 10px; align-items: flex-end; }
      .bl-msg.user { flex-direction: row-reverse; }
      .bl-msg-avatar {
        width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
        background: linear-gradient(135deg,${GOLD},${PINK});
        display: flex; align-items: center; justify-content: center; font-size: 14px;
      }
      .bl-msg-bubble {
        max-width: 75%; padding: 12px 16px; border-radius: 18px;
        font-size: 14px; font-weight: 600; line-height: 1.5;
      }
      .bl-msg.bot .bl-msg-bubble { background: #F8F9FA; color: #1F2937; border-bottom-left-radius: 4px; }
      .bl-msg.user .bl-msg-bubble { background: ${NAVY}; color: white; border-bottom-right-radius: 4px; }
      .bl-msg-bubble strong { font-weight: 800; }
      .bl-msg-bubble a { color: ${GOLD}; font-weight: 800; text-decoration: underline; }
      #bl-chat-footer { padding: 16px; border-top: 1px solid #F3F4F6; flex-shrink: 0; }
      #bl-chat-form { display: flex; gap: 10px; align-items: center; }
      #bl-chat-input {
        flex: 1; border: 2px solid #E5E7EB; border-radius: 14px;
        padding: 10px 14px; font-size: 14px; font-weight: 600;
        outline: none; resize: none; height: 44px; font-family: inherit;
        transition: border-color .2s;
      }
      #bl-chat-input:focus { border-color: ${GOLD}; }
      #bl-chat-send {
        width: 44px; height: 44px; border-radius: 12px; border: none; cursor: pointer;
        background: linear-gradient(135deg, ${GOLD}, #FFB300);
        color: ${NAVY}; font-size: 18px;
        display: flex; align-items: center; justify-content: center;
        transition: transform .15s; flex-shrink: 0;
      }
      #bl-chat-send:hover { transform: scale(1.05); }
      .bl-typing { display: flex; align-items: center; gap: 5px; padding: 6px 0; }
      .bl-typing span { width: 7px; height: 7px; background: #CBD5E1; border-radius: 50%; animation: bl-bounce 1.2s infinite; }
      .bl-typing span:nth-child(2) { animation-delay: .2s; }
      .bl-typing span:nth-child(3) { animation-delay: .4s; }
      @keyframes bl-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      .bl-suggest-wrap { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
      .bl-suggest-btn {
        background: #FFFBEB; color: ${GOLD}; border: 1px solid #FDE68A; 
        border-radius: 20px; padding: 6px 12px; font-size: 12px; font-weight: 800;
        cursor: pointer; transition: all 0.2s; white-space: nowrap;
      }
      .bl-suggest-btn:hover { background: #FEF3C7; transform: translateY(-1px); }
      @media (max-width: 480px) {
        #bl-chat-window { bottom: 0; right: 0; width: 100vw; height: 100vh; max-height: 100vh; border-radius: 0; }
      }
    `;
    document.head.appendChild(style);

    /* ── DOM ── */
    const root = document.createElement('div');
    root.id = 'bl-chat-root';
    root.innerHTML = `
      <button id="bl-chat-bubble" aria-label="Chat with Boston Legend AI Concierge">🍦</button>
      <div id="bl-chat-window" role="dialog" aria-label="Boston Legend AI Concierge">
        <div id="bl-chat-header">
          <div id="bl-chat-avatar">🍦</div>
          <div id="bl-chat-header-info">
            <div id="bl-chat-header-name">Boston Legend Concierge</div>
            <div id="bl-chat-header-status">Online — ask me anything!</div>
          </div>
          <button id="bl-chat-close" aria-label="Close chat">✕</button>
        </div>
        <div id="bl-chat-messages">
          <div class="bl-msg bot">
            <div class="bl-msg-avatar">🍦</div>
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
      div.innerHTML = `${isBot ? '<div class="bl-msg-avatar">🍦</div>' : ''}
        <div class="bl-msg-bubble">${html}</div>
        ${!isBot ? '<div class="bl-msg-avatar" style="background:linear-gradient(135deg,#000223,#001a4c);color:#FFA000;font-weight:900;font-size:11px">YOU</div>' : ''}`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    function showTyping() {
      const d = document.createElement('div');
      d.className = 'bl-msg bot'; d.id = 'bl-typing';
      d.innerHTML = '<div class="bl-msg-avatar">🍦</div><div class="bl-msg-bubble"><div class="bl-typing"><span></span><span></span><span></span></div></div>';
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
        const data = await res.json();
        removeTyping();
        const reply = data.reply || 'For booking assistance, please visit our <a href="' + BOOKING_URL + '">Booking Page</a> or call <strong>617-999-3803</strong>.';
        appendMsg('bot', md2html(reply));
        history.push({ role: 'assistant', content: data.reply || reply });
      } catch {
        removeTyping();
        appendMsg('bot', '<span style="color:red">⚠️ Network Error</span><br>Sorry, I\'m having trouble connecting. Please call us at <strong>617-999-3803</strong> or <a href="' + BOOKING_URL + '">book online</a>.');
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
