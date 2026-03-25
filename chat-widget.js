/**
 * ZOKFORCE Chat Widget
 * Embeddable AI chatbot powered by DeepSeek via Cloudflare Worker
 */
(function () {
  "use strict";

  const CONFIG = {
    apiUrl: "/api/chat",
    openingMessage:
      "👋 Hi! Welcome to ZOKFORCE. I'm your AI assistant. Ask me anything about our AI services, company capabilities, or how AI can transform your business!",
    suggestedQuestions: [
      "What AI services does ZOKFORCE offer?",
      "How can AI transform my business?",
      "I'd like to speak with a representative.",
    ],
    maxHistory: 20,
    storageKey: "zok_chat_history",
  };

  // ─── State ────────────────────────────────────────────────────────────────

  let isOpen = false;
  let isLoading = false;
  let conversationHistory = [];
  let suggestionsShown = true;

  // Restore history from sessionStorage
  try {
    const saved = sessionStorage.getItem(CONFIG.storageKey);
    if (saved) {
      conversationHistory = JSON.parse(saved);
      suggestionsShown = false;
    }
  } catch (e) {
    // Ignore storage errors
  }

  // ─── DOM Creation ─────────────────────────────────────────────────────────

  function init() {
    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/chat-widget.css";
    document.head.appendChild(link);

    // Create bubble
    const bubble = document.createElement("button");
    bubble.id = "zok-chat-bubble";
    bubble.setAttribute("aria-label", "Open chat");
    bubble.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
    document.body.appendChild(bubble);

    // Create panel
    const panel = document.createElement("div");
    panel.id = "zok-chat-panel";
    panel.innerHTML = `
      <div class="zok-chat-header">
        <div class="zok-chat-avatar">🤖</div>
        <div class="zok-chat-header-info">
          <h3>ZOKFORCE AI Assistant</h3>
          <p><span class="zok-status-dot"></span>Online</p>
        </div>
      </div>
      <div class="zok-chat-messages" id="zok-messages"></div>
      <div class="zok-suggestions" id="zok-suggestions"></div>
      <div class="zok-chat-input-area">
        <textarea id="zok-chat-input" placeholder="Type your message..." rows="1"></textarea>
        <button id="zok-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
      <div class="zok-powered">Powered by <a href="https://www.zokforce.com" target="_blank">ZOKFORCE AI</a></div>
    `;
    document.body.appendChild(panel);

    // Bind events
    bubble.addEventListener("click", toggleChat);

    const input = document.getElementById("zok-chat-input");
    const sendBtn = document.getElementById("zok-chat-send");

    sendBtn.addEventListener("click", () => sendMessage());
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 100) + "px";
    });

    // Render existing history or opening message
    if (conversationHistory.length > 0) {
      renderHistory();
    } else {
      addBotMessage(CONFIG.openingMessage);
    }

    if (suggestionsShown) {
      renderSuggestions();
    }
  }

  // ─── Toggle ───────────────────────────────────────────────────────────────

  function toggleChat() {
    isOpen = !isOpen;
    const panel = document.getElementById("zok-chat-panel");
    const bubble = document.getElementById("zok-chat-bubble");

    panel.classList.toggle("open", isOpen);
    bubble.classList.toggle("open", isOpen);

    if (isOpen) {
      bubble.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
      scrollToBottom();
      setTimeout(() => {
        document.getElementById("zok-chat-input")?.focus();
      }, 300);
    } else {
      bubble.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
    }
  }

  // ─── Messages ─────────────────────────────────────────────────────────────

  function addBotMessage(text) {
    const container = document.getElementById("zok-messages");
    const msgEl = document.createElement("div");
    msgEl.className = "zok-msg bot";
    msgEl.innerHTML = formatMarkdown(text);
    container.appendChild(msgEl);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const container = document.getElementById("zok-messages");
    const msgEl = document.createElement("div");
    msgEl.className = "zok-msg user";
    msgEl.textContent = text;
    container.appendChild(msgEl);
    scrollToBottom();
  }

  function showTyping() {
    const container = document.getElementById("zok-messages");
    const typing = document.createElement("div");
    typing.className = "zok-typing";
    typing.id = "zok-typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    container.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("zok-typing-indicator");
    if (el) el.remove();
  }

  function renderHistory() {
    const container = document.getElementById("zok-messages");
    // Always show opening message first
    const openingEl = document.createElement("div");
    openingEl.className = "zok-msg bot";
    openingEl.innerHTML = formatMarkdown(CONFIG.openingMessage);
    container.appendChild(openingEl);

    conversationHistory.forEach((msg) => {
      if (msg.role === "user") {
        addUserMessage(msg.content);
      } else if (msg.role === "assistant") {
        addBotMessage(msg.content);
      }
    });
  }

  function renderSuggestions() {
    const container = document.getElementById("zok-suggestions");
    container.innerHTML = "";
    CONFIG.suggestedQuestions.forEach((q) => {
      const btn = document.createElement("button");
      btn.className = "zok-suggestion-btn";
      btn.textContent = q;
      btn.addEventListener("click", () => {
        hideSuggestions();
        document.getElementById("zok-chat-input").value = q;
        sendMessage();
      });
      container.appendChild(btn);
    });
  }

  function hideSuggestions() {
    suggestionsShown = false;
    const container = document.getElementById("zok-suggestions");
    if (container) container.innerHTML = "";
  }

  function scrollToBottom() {
    const container = document.getElementById("zok-messages");
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }

  // ─── Send Message ─────────────────────────────────────────────────────────

  async function sendMessage() {
    if (isLoading) return;

    const input = document.getElementById("zok-chat-input");
    const text = input.value.trim();
    if (!text) return;

    // Hide suggestions on first message
    if (suggestionsShown) hideSuggestions();

    // Show user message
    input.value = "";
    input.style.height = "auto";
    addUserMessage(text);

    // Update state
    isLoading = true;
    document.getElementById("zok-chat-send").disabled = true;
    showTyping();

    try {
      const response = await fetch(CONFIG.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: conversationHistory.slice(-CONFIG.maxHistory),
        }),
      });

      const data = await response.json();
      hideTyping();

      if (data.success && data.answer) {
        addBotMessage(data.answer);
        // Save to history
        conversationHistory.push({ role: "user", content: text });
        conversationHistory.push({ role: "assistant", content: data.answer });
        saveHistory();
      } else {
        addBotMessage(
          data.error || "Sorry, I'm having trouble right now. Please try again or visit [www.zokforce.com](https://www.zokforce.com)."
        );
      }
    } catch (error) {
      hideTyping();
      console.error("Chat error:", error);
      addBotMessage("Sorry, I couldn't connect. Please check your connection and try again.");
    } finally {
      isLoading = false;
      document.getElementById("zok-chat-send").disabled = false;
      document.getElementById("zok-chat-input")?.focus();
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function saveHistory() {
    try {
      const trimmed = conversationHistory.slice(-CONFIG.maxHistory);
      sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(trimmed));
    } catch (e) {
      // Ignore storage errors
    }
  }

  function formatMarkdown(text) {
    // Simple markdown-to-HTML conversion for chat messages
    let html = escapeHtml(text);

    // Bold: **text**
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic: *text*
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");

    // Inline code: `text`
    html = html.replace(/`(.+?)`/g, "<code>$1</code>");

    // Links: [text](url)
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" style="color:var(--zok-primary-light)">$1</a>'
    );

    // Unordered list items: • or - at start of line
    html = html.replace(/^[•\-]\s+(.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

    // Numbered list items
    html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

    // Paragraphs (double newline)
    html = html.replace(/\n\n/g, "</p><p>");

    // Single newlines to <br>
    html = html.replace(/\n/g, "<br>");

    return "<p>" + html + "</p>";
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ─── Initialize ───────────────────────────────────────────────────────────

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
