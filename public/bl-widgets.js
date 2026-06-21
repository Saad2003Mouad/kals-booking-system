/**
 * Boston Legend – Shared Widget Injector v8
 * Injects: Sign In button into the Webflow nav + AI Chat Concierge widget
 * Loaded by all static public HTML pages
 */
(function () {
  'use strict';

  var BOOKING_URL = '/packages';
  var LOGIN_URL   = '/login';
  var API_BASE    = '';

  /* ─────────────────────────────────────────────
     OCCASIONS LIST (used by mobile nav)
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

  /* ─────────────────────────────────────────────
     1. INJECT SIGN IN BUTTON INTO WEBFLOW NAV
  ───────────────────────────────────────────── */
  function injectNavButtons() {
    var rightLinks = document.querySelector('.right-menu-links');
    if (!rightLinks || document.getElementById('bl-signin-btn')) return;

    var existingSignIn = rightLinks.querySelector('a[href*="login"]') ||
      Array.from(rightLinks.querySelectorAll('a')).some(function(a) {
        return a.textContent.includes('Sign In') || a.textContent.includes('Sign Up');
      });

    if (existingSignIn) {
      var bookingLinks = rightLinks.querySelectorAll('a[href*="booking"], a[href*="reserve"]');
      bookingLinks.forEach(function(btn) { btn.remove(); });
      return;
    }

    var existingButtons = rightLinks.querySelectorAll('a.button, a.reserve-btn, a[href*="booking"], a[href*="reserve"]');
    existingButtons.forEach(function(btn) { btn.style.display = 'none'; });

    var signinBtn = document.createElement('a');
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

    rightLinks.appendChild(signinBtn);
  }

  /* ─────────────────────────────────────────────
     1.5 INJECT MANAGE BOOKING LINK
  ───────────────────────────────────────────── */
  function injectManageBookingLink() {
    var navMenu = document.querySelector('.nav-menu');
    if (!navMenu || document.getElementById('bl-manage-booking-link')) return;

    var existingManageBooking = Array.from(navMenu.querySelectorAll('a')).some(function(a) {
      return a.textContent.trim() === 'Manage Booking' || a.href.includes('manage-booking');
    });
    if (existingManageBooking) return;

    var manageBookingLink = document.createElement('a');
    manageBookingLink.id = 'bl-manage-booking-link';
    manageBookingLink.href = '/manage-booking';
    manageBookingLink.className = 'nav-link w-nav-link';
    manageBookingLink.textContent = 'Manage Booking';
    manageBookingLink.style.fontWeight = '900';

    var contactLink = Array.from(navMenu.querySelectorAll('a')).find(function(a) {
      return a.textContent.trim().toLowerCase() === 'contact' || a.href.includes('contact-us');
    });

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
    if (window.location.pathname.includes('/admin') || window.location.pathname.includes('/login')) return;
    if (document.getElementById('bl-chat-root')) return;

    console.log('[BostonLegend] Injecting chat widget...');

    var NAVY = '#000223';
    var GOLD = '#FFA000';
    var PINK = '#F391BD';

    var style = document.createElement('style');
    style.textContent = [
      '#bl-chat-root * { box-sizing: border-box; font-family: "Nunito", sans-serif; }',

      '#bl-chat-bubble {',
      '  position: fixed !important; bottom: 28px !important; right: 28px !important; z-index: 2147483647 !important;',
      '  width: 65px !important; height: 65px !important; border-radius: 50% !important;',
      '  background: linear-gradient(135deg, #FFA000, #FFB300) !important;',
      '  border: 3px solid white !important; cursor: pointer !important;',
      '  display: flex !important; align-items: center !important; justify-content: center !important;',
      '  box-shadow: 0 10px 30px rgba(255,160,0,.45) !important;',
      '  transition: transform .25s, box-shadow .25s !important;',
      '  animation: bl-pulse 2s infinite !important;',
      '}',
      '#bl-chat-bubble:hover { transform: scale(1.08) rotate(5deg); box-shadow: 0 14px 35px rgba(255,160,0,.55); }',

      '@keyframes bl-pulse {',
      '  0% { box-shadow: 0 0 0 0 rgba(255,160,0,0.7); }',
      '  70% { box-shadow: 0 0 0 12px rgba(255,160,0,0); }',
      '  100% { box-shadow: 0 0 0 0 rgba(255,160,0,0); }',
      '}',

      '#bl-chat-window {',
      '  position: fixed; bottom: 105px; right: 28px; z-index: 2147483646;',
      '  width: 400px; max-width: calc(100vw - 40px);',
      '  height: 560px; max-height: calc(100vh - 140px);',
      '  background: white; border-radius: 24px;',
      '  box-shadow: 0 20px 50px rgba(0,2,35,.15);',
      '  display: flex; flex-direction: column; overflow: hidden;',
      '  opacity: 0; pointer-events: none;',
      '  transform: translateY(20px) scale(.95);',
      '  transition: opacity .3s, transform .3s;',
      '  border: 1px solid rgba(0,2,35,0.08);',
      '}',
      '#bl-chat-window.open { opacity: 1 !important; pointer-events: all !important; transform: translateY(0) scale(1) !important; }',

      '#bl-chat-header { background: linear-gradient(135deg, #000223 0%, #050b40 100%); padding: 18px 20px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; border-bottom: 2px solid #FFA000; }',
      '#bl-chat-avatar { width: 44px; height: 44px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }',
      '#bl-chat-avatar svg { width: 32px; height: 32px; }',
      '#bl-chat-header-info { flex: 1; }',
      '#bl-chat-header-name { color: white; font-weight: 800; font-size: 16px; }',
      '#bl-chat-header-status { color: #FFA000; font-size: 12px; font-weight: 700; margin-top: 3px; display: flex; align-items: center; gap: 5px; }',
      '#bl-chat-header-status::before { content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 8px #22C55E; }',
      '#bl-chat-close { background: rgba(255,255,255,.08); border: none; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; color: white; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: background .2s; }',
      '#bl-chat-close:hover { background: rgba(255,255,255,.18); }',

      '#bl-chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth; background-color: #F9FAFB; }',
      '#bl-chat-messages::-webkit-scrollbar { width: 5px; }',
      '#bl-chat-messages::-webkit-scrollbar-thumb { background: rgba(0,2,35,.1); border-radius: 10px; }',

      '.bl-msg { display: flex; gap: 10px; align-items: flex-end; animation: bl-fade-in .3s ease forwards; }',
      '.bl-msg.user { flex-direction: row-reverse; }',
      '@keyframes bl-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }',

      '.bl-msg-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; background: white; border: 1px solid rgba(0,2,35,0.06); display: flex; align-items: center; justify-content: center; }',
      '.bl-msg-avatar svg { width: 22px; height: 22px; }',
      '.bl-msg-bubble { max-width: 78%; padding: 12px 16px; border-radius: 20px; font-size: 14.5px; font-weight: 600; line-height: 1.5; }',
      '.bl-msg.bot .bl-msg-bubble { background: white; color: #1F2937; border-bottom-left-radius: 4px; border: 1px solid rgba(0,2,35,0.04); }',
      '.bl-msg.user .bl-msg-bubble { background: #000223; color: white; border-bottom-right-radius: 4px; }',
      '.bl-msg-bubble strong { font-weight: 800; color: #000223; }',
      '.bl-msg.user .bl-msg-bubble strong { color: white; }',
      '.bl-msg-bubble a { color: #FFA000; font-weight: 800; text-decoration: underline; }',

      '#bl-chat-footer { padding: 16px; border-top: 1px solid #E5E7EB; flex-shrink: 0; background: white; }',
      '#bl-chat-form { display: flex; gap: 8px; align-items: center; }',
      '#bl-chat-input { flex: 1; border: 2px solid #E5E7EB; border-radius: 16px; padding: 12px 16px; font-size: 14px; font-weight: 600; outline: none; height: 46px; font-family: inherit; transition: border-color .2s; color: #000223; }',
      '#bl-chat-input:focus { border-color: #FFA000; box-shadow: 0 0 0 3px rgba(255,160,0,0.15); }',
      '#bl-chat-send { width: 46px; height: 46px; border-radius: 14px; border: none; cursor: pointer; background: linear-gradient(135deg, #FFA000, #FFB300); color: #000223; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }',

      '.bl-typing { display: flex; align-items: center; gap: 5px; padding: 6px 0; }',
      '.bl-typing span { width: 8px; height: 8px; background: #CBD5E1; border-radius: 50%; animation: bl-bounce 1.2s infinite; }',
      '.bl-typing span:nth-child(2) { animation-delay: .2s; }',
      '.bl-typing span:nth-child(3) { animation-delay: .4s; }',
      '@keyframes bl-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }',

      '.bl-suggest-wrap { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }',
      '.bl-suggest-btn { background: #000223; color: #FFA000; border: 1.5px solid #FFA000; border-radius: 20px; padding: 7px 14px; font-size: 12.5px; font-weight: 800; cursor: pointer; white-space: nowrap; }',
      '.bl-suggest-btn:hover { background: #FFA000; color: #000223; }',

      '@media (max-width: 480px) {',
      '  #bl-chat-window { bottom: 85px; right: 16px; width: calc(100vw - 32px); height: calc(100vh - 120px); }',
      '  #bl-chat-bubble { bottom: 16px !important; right: 16px !important; width: 55px !important; height: 55px !important; }',
      '}',
    ].join(' ');

    document.head.appendChild(style);

    var iceCreamSVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C9.79 2 8 3.79 8 6V8H16V6C16 3.79 14.21 2 12 2Z" fill="#FFA000"/><path d="M6 8H18C19.1 8 20 8.9 20 10V11C20 14.31 16.31 17 12 17C7.69 17 4 14.31 4 11V10C4 8.9 4.9 8 6 8Z" fill="#F391BD"/><path d="M12 16.5L8 22H16L12 16.5Z" fill="#D2B48C" stroke="#8B5A2B" stroke-width="1"/></svg>';

    var root = document.createElement('div');
    root.id = 'bl-chat-root';
    root.innerHTML =
      '<button id="bl-chat-bubble" aria-label="Chat with Boston Legend AI">' + iceCreamSVG + '</button>' +
      '<div id="bl-chat-window" role="dialog" aria-label="Boston Legend AI Concierge">' +
        '<div id="bl-chat-header">' +
          '<div id="bl-chat-avatar">' + iceCreamSVG + '</div>' +
          '<div id="bl-chat-header-info">' +
            '<div id="bl-chat-header-name">Boston Legend Concierge</div>' +
            '<div id="bl-chat-header-status">Online — ask me anything!</div>' +
          '</div>' +
          '<button id="bl-chat-close" aria-label="Close chat">\u2715</button>' +
        '</div>' +
        '<div id="bl-chat-messages">' +
          '<div class="bl-msg bot">' +
            '<div class="bl-msg-avatar">' + iceCreamSVG + '</div>' +
            '<div class="bl-msg-bubble">' +
              'Hey there! \uD83D\uDC4B I\'m the Boston Legend AI Concierge.<br><br>' +
              'Tell me about your event and guest count, and I\'ll recommend the perfect package!' +
              '<div class="bl-suggest-wrap" id="bl-suggest-container">' +
                '<button class="bl-suggest-btn">I need help booking</button>' +
                '<button class="bl-suggest-btn">Where do you serve?</button>' +
                '<button class="bl-suggest-btn">Talk to someone</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div id="bl-chat-footer">' +
          '<form id="bl-chat-form">' +
            '<input id="bl-chat-input" placeholder="Ask about packages, pricing, availability\u2026" autocomplete="off" />' +
            '<button type="submit" id="bl-chat-send" aria-label="Send">\u27A4</button>' +
          '</form>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);
    console.log('[BostonLegend] Chat widget injected. #bl-chat-root exists:', !!document.getElementById('bl-chat-root'));

    var bubble   = document.getElementById('bl-chat-bubble');
    var win      = document.getElementById('bl-chat-window');
    var closeBtn = document.getElementById('bl-chat-close');
    var form     = document.getElementById('bl-chat-form');
    var input    = document.getElementById('bl-chat-input');
    var msgs     = document.getElementById('bl-chat-messages');
    var history  = [];
    var isOpen   = false;

    function toggleChat() {
      isOpen = !isOpen;
      win.classList.toggle('open', isOpen);
      if (isOpen && input) input.focus();
    }

    bubble.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function appendMsg(role, html) {
      var div = document.createElement('div');
      div.className = 'bl-msg ' + role;
      var isBot = role === 'bot';
      div.innerHTML =
        (isBot ? '<div class="bl-msg-avatar">' + iceCreamSVG + '</div>' : '') +
        '<div class="bl-msg-bubble">' + html + '</div>' +
        (!isBot ? '<div class="bl-msg-avatar" style="background:#000223;color:#FFA000;font-weight:900;font-size:10px">YOU</div>' : '');
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    function showTyping() {
      var d = document.createElement('div');
      d.className = 'bl-msg bot';
      d.id = 'bl-typing';
      d.innerHTML = '<div class="bl-msg-avatar">' + iceCreamSVG + '</div><div class="bl-msg-bubble"><div class="bl-typing"><span></span><span></span><span></span></div></div>';
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function removeTyping() {
      var t = document.getElementById('bl-typing');
      if (t) t.remove();
    }

    function md2html(text) {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br>');
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      sendMessage(text);
    });

    var suggestContainer = document.getElementById('bl-suggest-container');
    if (suggestContainer) {
      suggestContainer.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('bl-suggest-btn')) {
          sendMessage(e.target.textContent);
          suggestContainer.style.display = 'none';
        }
      });
    }

    function sendMessage(text) {
      input.value = '';
      appendMsg('user', text);
      history.push({ role: 'user', content: text });
      showTyping();

      fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, currentPage: window.location.href }),
      })
      .then(function(res) {
        return res.json().then(function(data) {
          removeTyping();
          var reply = data.reply || data.final_response || 'For booking assistance, please visit our <a href="' + BOOKING_URL + '">Packages Page</a> or call <strong>617-999-3803</strong>.';
          appendMsg('bot', md2html(reply));
          history.push({ role: 'assistant', content: reply });
        });
      })
      .catch(function(err) {
        console.error('[BostonLegend] Chat error:', err);
        removeTyping();
        appendMsg('bot', '<span style="color:#DC2626;font-weight:bold;">\u26A0\uFE0F Network Error</span><br>Sorry, I\'m having trouble connecting. Please call us at <strong>617-999-3803</strong> or <a href="' + BOOKING_URL + '">book online</a>.');
      });
    }
  }

  /* ─────────────────────────────────────────────
     3. SWIPER INIT
  ───────────────────────────────────────────── */
  function initSwipers() {
    if (window.__blSwipersInited) return;

    function doInit() {
      if (typeof window.Swiper === 'undefined') return;
      window.__blSwipersInited = true;

      var brandEl = document.querySelector('.swiper-movies');
      if (brandEl && !brandEl.swiper) {
        new window.Swiper('.swiper-movies', {
          spaceBetween: 0, speed: 5000, slidesPerView: 2, loop: true, pagination: false,
          autoplay: { delay: 0, disableOnInteraction: false },
          freeMode: true, freeModeMomentum: false,
          breakpoints: { 766: { slidesPerView: 4 } },
        });
      }

      var reviewEl = document.querySelector('.swiper-review');
      if (reviewEl && !reviewEl.swiper) {
        new window.Swiper('.swiper-review', {
          slidesPerView: 1, loop: true,
          autoplay: { delay: 7000 },
        });
      }
    }

    if (typeof window.Swiper !== 'undefined') {
      doInit();
    } else {
      var checkSwiper = setInterval(function() {
        if (typeof window.Swiper !== 'undefined') {
          clearInterval(checkSwiper);
          doInit();
        }
      }, 200);
    }
  }

  /* ─────────────────────────────────────────────
     4. PREMIUM MOBILE NAV (Identical to SiteHeader.tsx)
  ───────────────────────────────────────────── */
  function injectMobileNavStyles() {
    if (document.getElementById('bl-mobile-nav-styles')) return;
    var style = document.createElement('style');
    style.id = 'bl-mobile-nav-styles';
    style.textContent = [
      /* Hide Webflow's native mobile nav components and the injected signin button */
      '@media (max-width: 991px) {',
      '  .nav-menu.w-nav-menu { display: none !important; }',
      '  .menu-button.w-nav-button { display: none !important; }',
      '  #bl-signin-btn { display: none !important; }',
      '}',
      
      /* ── Backdrop ── */
      '.bl-custom-backdrop {',
      '  position: fixed; inset: 0;',
      '  background: rgba(0,2,35,0.6);',
      '  backdrop-filter: blur(4px);',
      '  -webkit-backdrop-filter: blur(4px);',
      '  z-index: 9998;',
      '  opacity: 0; pointer-events: none;',
      '  transition: opacity 0.3s ease;',
      '}',
      '.bl-custom-backdrop.open {',
      '  opacity: 1; pointer-events: auto;',
      '}',

      /* ── Drawer ── */
      '.bl-custom-mobile-menu {',
      '  display: flex;',
      '  flex-direction: column;',
      '  position: fixed;',
      '  top: 0; right: 0; bottom: 0;',
      '  width: min(85vw, 310px);',
      '  background: #000223;',
      '  z-index: 10000;',
      '  overflow-y: auto;',
      '  padding: 72px 0 40px;',
      '  box-shadow: -8px 0 40px rgba(0,0,0,0.45);',
      '  transform: translateX(110%);',
      '  transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);',
      '}',
      '.bl-custom-mobile-menu.open {',
      '  transform: translateX(0);',
      '}',

      /* Nav links in drawer */
      '.bl-custom-mobile-menu a.nav-link,',
      '.bl-custom-mobile-menu .occasions-toggle {',
      '  color: #fff;',
      '  font-weight: 800;',
      '  font-size: 17px;',
      '  padding: 14px 24px;',
      '  border-bottom: 1px solid rgba(255,255,255,0.07);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  width: 100%;',
      '  box-sizing: border-box;',
      '  cursor: pointer;',
      '  text-decoration: none;',
      '  font-family: "Nunito", sans-serif;',
      '}',
      '.bl-custom-mobile-menu a.nav-link:hover,',
      '.bl-custom-mobile-menu .occasions-toggle:hover {',
      '  color: #FFA000;',
      '  background: rgba(255,160,0,0.07);',
      '}',

      /* Sign-in mobile link */
      '.bl-custom-signin {',
      '  display: block;',
      '  margin: 20px 16px 0;',
      '  padding: 13px 24px;',
      '  background: #FFA000;',
      '  color: #000223 !important;',
      '  font-weight: 900;',
      '  font-size: 15px;',
      '  border-radius: 50px;',
      '  text-align: center;',
      '  text-decoration: none;',
      '  box-shadow: 0 6px 18px rgba(255,160,0,0.35);',
      '  font-family: "Nunito", sans-serif;',
      '}',
      '.bl-custom-signin:hover {',
      '  background: #FFB300;',
      '}',

      /* Occasions accordion */
      '.bl-custom-arrow {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  width: 28px; height: 28px;',
      '  border-radius: 50%;',
      '  background: rgba(255,255,255,0.1);',
      '  transition: transform 0.28s ease, background 0.2s ease;',
      '  flex-shrink: 0;',
      '}',
      '.bl-custom-arrow.open {',
      '  transform: rotate(180deg);',
      '  background: rgba(255,160,0,0.2);',
      '}',

      '.bl-custom-panel {',
      '  overflow: hidden;',
      '  max-height: 0;',
      '  transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1);',
      '  background: rgba(255,255,255,0.04);',
      '}',
      '.bl-custom-panel.open {',
      '  max-height: 600px;',
      '}',
      '.bl-custom-panel a {',
      '  display: block;',
      '  color: rgba(255,255,255,0.82) !important;',
      '  font-size: 14.5px !important;',
      '  font-weight: 700 !important;',
      '  padding: 11px 24px 11px 36px !important;',
      '  border-bottom: 1px solid rgba(255,255,255,0.04) !important;',
      '  text-decoration: none;',
      '  transition: color 0.18s, background 0.18s;',
      '  font-family: "Nunito", sans-serif;',
      '}',
      '.bl-custom-panel a:hover {',
      '  color: #FFA000 !important;',
      '  background: rgba(255,160,0,0.07) !important;',
      '}',

      /* Custom Hamburger */
      '.bl-custom-hamburger {',
      '  display: flex;',
      '  flex-direction: column;',
      '  justify-content: center;',
      '  align-items: center;',
      '  gap: 6px;',
      '  width: 44px;',
      '  height: 44px;',
      '  background: transparent;',
      '  border: none;',
      '  cursor: pointer;',
      '  position: absolute;',
      '  top: 18px;',
      '  right: 18px;',
      '  z-index: 9999;',
      '  padding: 8px;',
      '}',
      '.bl-custom-hamburger span {',
      '  display: block;',
      '  width: 24px;',
      '  height: 2px;',
      '  background: #000223;',
      '  border-radius: 2px;',
      '  transition: 0.3s;',
      '}',

      '@media (min-width: 992px) {',
      '  .bl-custom-mobile-menu, .bl-custom-backdrop, .bl-custom-hamburger {',
      '    display: none !important;',
      '  }',
      '}'
    ].join(' ');
    document.head.appendChild(style);
  }

  function fixMobileNav() {
    if (document.getElementById('react-site-header')) return; // React handles it
    if (document.querySelector('.bl-custom-hamburger')) return; // Already injected

    // Only inject if there's a Webflow nav to replace
    var webflowNavbar = document.querySelector('.navbar.w-nav');
    if (!webflowNavbar) return;

    injectMobileNavStyles();

    // 1. Backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'bl-custom-backdrop';
    document.body.appendChild(backdrop);

    // 2. Hamburger Button
    var hamburger = document.createElement('button');
    hamburger.className = 'bl-custom-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    webflowNavbar.appendChild(hamburger);

    // 3. Drawer
    var drawer = document.createElement('nav');
    drawer.className = 'bl-custom-mobile-menu';

    // Close button
    var closeBtnEl = document.createElement('button');
    closeBtnEl.setAttribute('aria-label', 'Close menu');
    closeBtnEl.style.cssText = 'position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.12);border:none;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;font-size:18px;line-height:1;';
    closeBtnEl.innerHTML = '✕';
    drawer.appendChild(closeBtnEl);

    // Core Links
    var linksHTML = [
      '<a href="/" class="nav-link">Home</a>',
      '<a href="/about" class="nav-link">About</a>',
      '<a href="/menu" class="nav-link">Menu</a>',
      '<div>',
      '  <div class="occasions-toggle" role="button">',
      '    <div>Occasions</div>',
      '    <span class="bl-custom-arrow"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 5l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>',
      '  </div>',
      '  <div class="bl-custom-panel">'
    ];

    OCCASIONS_LIST.forEach(function(item) {
      linksHTML.push('<a href="' + item[0] + '">' + item[1] + '</a>');
    });

    linksHTML.push(
      '  </div>',
      '</div>',
      '<a href="/packages" class="nav-link">Packages</a>',
      '<a href="/manage-booking" class="nav-link">Manage Booking</a>',
      '<a href="/contact-us" class="nav-link">Contact</a>',
      '<a href="/login" class="bl-custom-signin">Sign In or Sign Up</a>'
    );

    drawer.innerHTML += linksHTML.join('');
    document.body.appendChild(drawer);

    // 4. Logic
    var isOpen = false;
    var occasionsToggle = drawer.querySelector('.occasions-toggle');
    var occasionsPanel = drawer.querySelector('.bl-custom-panel');
    var occasionsArrow = drawer.querySelector('.bl-custom-arrow');

    function toggleNav(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      isOpen = !isOpen;
      if (isOpen) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        // close occasions when closing nav
        if (occasionsPanel) {
            occasionsPanel.classList.remove('open');
            occasionsArrow.classList.remove('open');
        }
      }
    }

    function closeNav() {
      if (isOpen) toggleNav();
    }

    hamburger.addEventListener('click', toggleNav);
    closeBtnEl.addEventListener('click', closeNav);
    backdrop.addEventListener('click', closeNav);

    if (occasionsToggle) {
      occasionsToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var pOpen = occasionsPanel.classList.contains('open');
        occasionsPanel.classList.toggle('open', !pOpen);
        occasionsArrow.classList.toggle('open', !pOpen);
      });
    }

    var navLinks = drawer.querySelectorAll('a');
    navLinks.forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeNav();
        var href = a.getAttribute('href');
        if (href && href !== '#' && href !== '') {
          setTimeout(function() {
            window.location.assign(href);
          }, 50);
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     5. INIT — Maximum resilience
  ───────────────────────────────────────────── */
  function init() {
    console.log('[BostonLegend] init() called, readyState:', document.readyState);
    try { injectNavButtons(); } catch(e) { console.error('[BL] Nav buttons error:', e); }
    try { injectManageBookingLink(); } catch(e) { console.error('[BL] Manage booking error:', e); }
    try { buildChatWidget(); } catch(e) { console.error('[BL] Chat widget error:', e); }
    try { initSwipers(); } catch(e) { console.error('[BL] Swipers error:', e); }
    try { fixMobileNav(); } catch(e) { console.error('[BL] Mobile nav error:', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', function() {
    if (!document.getElementById('bl-chat-root')) {
      console.log('[BostonLegend] Retrying chat widget on load...');
      try { buildChatWidget(); } catch(e) { console.error('[BL] Chat widget error on load:', e); }
    }
    try { injectNavButtons(); } catch(e) {}
    try { injectManageBookingLink(); } catch(e) {}
  });

  var retryCount = 0;
  var retryInterval = setInterval(function() {
    retryCount++;
    if (!document.getElementById('bl-chat-root')) {
      console.log('[BostonLegend] Retry #' + retryCount + ' for chat widget...');
      try { buildChatWidget(); } catch(e) {}
    } else {
      clearInterval(retryInterval);
    }
    if (retryCount >= 10) clearInterval(retryInterval);
  }, 700);

  if (document.body) {
    new MutationObserver(function() {
      if (!document.getElementById('bl-chat-root')) {
        try { buildChatWidget(); } catch(e) {}
      }
    }).observe(document.body, { childList: true, subtree: false });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      new MutationObserver(function() {
        if (!document.getElementById('bl-chat-root')) {
          try { buildChatWidget(); } catch(e) {}
        }
      }).observe(document.body, { childList: true, subtree: false });
    });
  }

})();
