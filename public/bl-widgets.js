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

    // Guard: if a Sign In / login link already exists in the header, do nothing
    const existingSignIn = rightLinks.querySelector('a[href*="login"]') || 
                           Array.from(rightLinks.querySelectorAll('a')).some(a => a.textContent.includes('Sign In') || a.textContent.includes('Sign Up'));
    if (existingSignIn) {
      // Clean up any remaining Reserve Truck buttons if they exist
      const bookingLinks = rightLinks.querySelectorAll('a[href*="booking"], a[href*="reserve"]');
      bookingLinks.forEach(btn => btn.remove());
      return;
    }

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
     1.5 INJECT MANAGE BOOKING LINK
  ───────────────────────────────────────────── */
  function injectManageBookingLink() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu || document.getElementById('bl-manage-booking-link')) return;

    // Guard: if Manage Booking already exists in the nav, do nothing
    const existingManageBooking = Array.from(navMenu.querySelectorAll('a')).some(a => 
      a.textContent.trim() === 'Manage Booking' || a.href.includes('manage-booking')
    );
    if (existingManageBooking) return;

    const manageBookingLink = document.createElement('a');
    manageBookingLink.id = 'bl-manage-booking-link';
    manageBookingLink.href = '/manage-booking';
    manageBookingLink.className = 'nav-link w-nav-link';
    manageBookingLink.textContent = 'Manage Booking';
    
    // Add some inline style just in case it needs to look like the others but match our styling
    manageBookingLink.style.fontWeight = '900';

    // Find the Contact link so we can insert Manage Booking right before it
    const contactLink = Array.from(navMenu.querySelectorAll('a')).find(a => 
      a.textContent.trim().toLowerCase() === 'contact' || a.href.includes('contact-us')
    );
    
    if (contactLink) {
      navMenu.insertBefore(manageBookingLink, contactLink);
    } else {
      navMenu.appendChild(manageBookingLink);
    }
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
     3. SWIPER MARQUEE INIT
     Initializes brand marquee + review sliders on
     all pages (static HTML + React-rendered pages).
     Safe to call multiple times - guards against double-init.
  ───────────────────────────────────────────── */
  function initSwipers() {
    if (window.__blSwipersInited) return;

    function doInit() {
      if (typeof window.Swiper === 'undefined') return;
      window.__blSwipersInited = true;

      // Brand marquee: .swiper-movies
      var brandEl = document.querySelector('.swiper-movies');
      if (brandEl && !brandEl.swiper) {
        new window.Swiper('.swiper-movies', {
          spaceBetween: 0,
          speed: 5000,
          slidesPerView: 2,
          loop: true,
          pagination: false,
          autoplay: {
            delay: 0,
            disableOnInteraction: false,
          },
          freeMode: true,
          freeModeMomentum: false,
          cssMode: false,
          breakpoints: {
            766: {
              slidesPerView: 4,
            },
          },
        });
      }

      // Review slider: .swiper-review
      var reviewEl = document.querySelector('.swiper-review');
      if (reviewEl && !reviewEl.swiper) {
        new window.Swiper('.swiper-review', {
          slidesPerView: 1,
          loop: true,
        /* ─────────────────────────────────────────────
     4. PREMIUM MOBILE NAV — FULL DRAWER + OCCASIONS ACCORDION
     Replaces Webflow's basic mobile toggle with a premium
     slide-in drawer identical to the React SiteHeader.
     Works on ALL static HTML pages consistently.
  ───────────────────────────────────────────── */
  var OCCASIONS_LIST = [
    ['/occasions/birthday-parties', 'Birthday Parties'],
    ['/occasions/block-parties', 'Block Parties'],
    ['/occasions/corporate-parties', 'Corporate Parties'],
    ['/occasions/fundraisers', 'Fundraisers'],
    ['/occasions/launch-parties', 'Launch Parties'],
    ['/occasions/marketing-events', 'Marketing Events'],
    ['/occasions/movie-rental', 'Movie Rental'],
    ['/occasions/photo-sessions', 'Photo Sessions'],
    ['/occasions/reunions', 'Reunions'],
    ['/occasions/school-occasions', 'School Occasions'],
    ['/occasions/sports-occasions', 'Sports Occasions'],
    ['/occasions/wedding-receptions', 'Wedding Receptions'],
  ];

  function injectMobileNavStyles() {
    if (document.getElementById('bl-mobile-nav-styles')) return;
    var style = document.createElement('style');
    style.id = 'bl-mobile-nav-styles';
    style.textContent = [
      /* Backdrop */
      '.bl-mob-backdrop{position:fixed;inset:0;background:rgba(0,2,35,0.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:9000;opacity:0;pointer-events:none;transition:opacity .3s ease;}',
      '.bl-mob-backdrop.open{opacity:1;pointer-events:auto;}',
      /* Drawer */
      '@media(max-width:991px){',
        '.nav-menu.w-nav-menu{display:flex!important;flex-direction:column!important;position:fixed!important;top:0!important;right:0!important;bottom:0!important;width:min(85vw,310px)!important;background:#000223!important;z-index:9200!important;overflow-y:auto!important;padding:72px 0 40px!important;box-shadow:-8px 0 40px rgba(0,0,0,.45)!important;transform:translateX(110%)!important;transition:transform .38s cubic-bezier(.4,0,.2,1)!important;}',
        '.nav-menu.w-nav-menu.w--open{transform:translateX(0)!important;}',
        /* Nav links */
        '.nav-menu.w-nav-menu .nav-link.w-nav-link,.nav-menu.w-nav-menu .nav-link.dropdown.w-dropdown-toggle{color:#fff!important;font-weight:800!important;font-size:17px!important;padding:14px 24px!important;border-bottom:1px solid rgba(255,255,255,.07)!important;display:flex!important;align-items:center!important;justify-content:space-between!important;width:100%!important;box-sizing:border-box!important;cursor:pointer!important;text-decoration:none!important;}',
        '.nav-menu.w-nav-menu .nav-link.w-nav-link:hover,.nav-menu.w-nav-menu .nav-link.dropdown.w-dropdown-toggle:hover{color:#FFA000!important;background:rgba(255,160,0,.07)!important;}',
        /* Hide Webflow dropdown list and old arrow on mobile */
        '.nav-menu.w-nav-menu .dropdown-list.w-dropdown-list{display:none!important;}',
        '.nav-menu.w-nav-menu .w-icon-dropdown-toggle{display:none!important;}',
        '.nav-menu.w-nav-menu .w-dropdown{position:static!important;}',
        /* Mobile Sign-In */
        '.bl-mob-signin{display:block;margin:20px 16px 0;padding:13px 24px;background:#FFA000;color:#000223!important;font-weight:900;font-size:15px;border-radius:50px;text-align:center;text-decoration:none;box-shadow:0 6px 18px rgba(255,160,0,.35);}',
        '.bl-mob-signin:hover{background:#FFB300;}',
        /* Close button */
        '.bl-mob-close-btn{position:absolute;top:16px;right:16px;background:rgba(255,255,255,.12);border:none;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;font-size:18px;line-height:1;z-index:10;}',
        /* Occasions arrow */
        '.bl-occasions-arrow{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.1);transition:transform .28s ease,background .2s ease;flex-shrink:0;}',
        '.bl-occasions-arrow.open{transform:rotate(180deg);background:rgba(255,160,0,.2);}',
        /* Occasions panel */
        '.bl-occasions-panel{overflow:hidden;max-height:0;transition:max-height .38s cubic-bezier(.4,0,.2,1);background:rgba(255,255,255,.04);}',
        '.bl-occasions-panel.open{max-height:700px;}',
        '.bl-occasions-panel a{display:block;color:rgba(255,255,255,.82)!important;font-size:14.5px!important;font-weight:700!important;padding:11px 24px 11px 36px!important;border-bottom:1px solid rgba(255,255,255,.04)!important;text-decoration:none!important;transition:color .18s,background .18s;}',
        '.bl-occasions-panel a:hover{color:#FFA000!important;background:rgba(255,160,0,.07)!important;}',
        /* hide right-menu-links on mobile */
        '.right-menu-links{display:none!important;}',
        '.menu-button.w-nav-button{display:flex!important;}',
      '}',
      /* Desktop: hide mobile elements */
      '@media(min-width:992px){',
        '.bl-mob-close-btn,.bl-mob-signin,.bl-occasions-panel,.bl-occasions-arrow{display:none!important;}',
        '.right-menu-links{display:flex!important;}',
        '.menu-button.w-nav-button{display:none!important;}',
      '}',
    ].join('');
    document.head.appendChild(style);
  }

  function fixMobileNav() {
    var btn = document.querySelector('.menu-button.w-nav-button');
    var menu = document.querySelector('.nav-menu.w-nav-menu');
    if (!btn || !menu) return;
    if (btn.dataset.blNavFixed) return;
    btn.dataset.blNavFixed = '1';

    /* ── Inject shared CSS ── */
    injectMobileNavStyles();

    /* ── Backdrop ── */
    var backdrop = document.createElement('div');
    backdrop.className = 'bl-mob-backdrop';
    document.body.insertBefore(backdrop, document.body.firstChild);

    /* ── Close button ── */
    var closeBtn = document.createElement('button');
    closeBtn.className = 'bl-mob-close-btn';
    closeBtn.setAttribute('aria-label', 'Close navigation menu');
    closeBtn.textContent = '✕';
    menu.insertBefore(closeBtn, menu.firstChild);

    /* ── Mobile Sign-In link ── */
    if (!menu.querySelector('.bl-mob-signin')) {
      var signinMob = document.createElement('a');
      signinMob.href = '/login';
      signinMob.className = 'bl-mob-signin';
      signinMob.textContent = 'Sign In or Sign Up';
      menu.appendChild(signinMob);
    }

    /* ── Occasions accordion ── */
    var occasionsToggle = menu.querySelector('.nav-link.dropdown.w-dropdown-toggle');
    var occasionsWrapper = menu.querySelector('.w-dropdown');

    if (occasionsToggle && occasionsWrapper) {
      // Inject arrow SVG into toggle
      var arrow = document.createElement('span');
      arrow.className = 'bl-occasions-arrow';
      arrow.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 5l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      occasionsToggle.appendChild(arrow);

      // Build accordion panel
      var panel = document.createElement('div');
      panel.className = 'bl-occasions-panel';
      OCCASIONS_LIST.forEach(function(item) {
        var a = document.createElement('a');
        a.href = item[0];
        a.textContent = item[1];
        a.addEventListener('click', closeNav);
        panel.appendChild(a);
      });
      occasionsWrapper.appendChild(panel);

      // Toggle on click
      occasionsToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = panel.classList.contains('open');
        panel.classList.toggle('open', !isOpen);
        arrow.classList.toggle('open', !isOpen);
        occasionsToggle.setAttribute('aria-expanded', (!isOpen).toString());
      });
    }

    /* ── Open / close helpers ── */
    function openNav() {
      btn.classList.add('w--open');
      menu.classList.add('w--open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      btn.classList.remove('w--open');
      menu.classList.remove('w--open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      // Also collapse occasions
      if (occasionsWrapper) {
        var panel = occasionsWrapper.querySelector('.bl-occasions-panel');
        var arrow = occasionsWrapper.querySelector('.bl-occasions-arrow');
        if (panel) panel.classList.remove('open');
        if (arrow) arrow.classList.remove('open');
      }
    }

    /* ── Hamburger toggle (capture phase, before Webflow) ── */
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (btn.classList.contains('w--open')) { closeNav(); } else { openNav(); }
    }, true);

    /* ── Close button ── */
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeNav();
    });

    /* ── Backdrop click ── */
    backdrop.addEventListener('click', closeNav);

    /* ── Close nav links ── */
    menu.querySelectorAll('.nav-link.w-nav-link, .bl-mob-signin').forEach(function(link) {
      link.addEventListener('click', closeNav);
    });


    /* ── Webflow anti-interference: MutationObserver ── */
    var wfObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.attributeName === 'class' && !btn.classList.contains('w--open') && menu.classList.contains('w--open')) {
          menu.classList.remove('w--open');
          backdrop.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
    wfObserver.observe(btn, { attributes: true, attributeFilter: ['class'] });
  }

  /* ─────────────────────────────────────────────
     5. INIT
  ───────────────────────────────────────────── */
  function init() {
    injectNavButtons();
    injectManageBookingLink();
    buildChatWidget();
    initSwipers();
    fixMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
