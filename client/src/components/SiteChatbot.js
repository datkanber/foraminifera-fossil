import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { answerQuestion } from "../utils/chatbotEngine";
import "../styles/components/chatbot.css";

const COPY = {
  tr: {
    launcher: "GeoKnow Asistan",
    title: "GeoKnow Araştırma Asistanı",
    subtitle: "Sitedeki veri seti, taksonlar ve rehberlerden yanıtlar",
    close: "Asistanı kapat",
    reset: "Sohbeti temizle",
    placeholder: "Bir takson, dönem veya sayfa sorun...",
    send: "Gönder",
    thinking: "Sitedeki kayıtlar taranıyor...",
    welcome:
      "Merhaba! Sitedeki foraminifer verileri, tanı kuralları, jeolojik katlar, 3D Laboratuvar, STONE etkinliği ve iletişim bilgileri hakkında soru sorabilirsiniz.",
    prompts: [
      "Tanı sistemi nasıl çalışır?",
      "Alveolina nerede yaşar?",
      "3D Lab'da neler var?",
      "İletişim bilgileri neler?",
    ],
  },
  en: {
    launcher: "GeoKnow Assistant",
    title: "GeoKnow Research Assistant",
    subtitle: "Answers grounded in site datasets, taxa & guides",
    close: "Close assistant",
    reset: "Clear chat",
    placeholder: "Ask about a taxon, stage, or feature...",
    send: "Send",
    thinking: "Searching site records...",
    welcome:
      "Hello! Ask me anything about GeoKnow's foraminiferal taxa, diagnosis rules, geological stages, 3D Lab, STONE event report, or contact details.",
    prompts: [
      "How does diagnosis work?",
      "Where does Alveolina live?",
      "What is in the 3D Lab?",
      "Contact details",
    ],
  },
};

function ChatIcon({ name }) {
  if (name === "chat") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L4 20.5l1.2-4.2A8.5 8.5 0 1 1 21 12Z" />
        <path d="M8.5 11.5h7M8.5 14.5h4.5" />
      </svg>
    );
  }
  if (name === "close") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }
  if (name === "reset") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4Z" />
    </svg>
  );
}

export default function SiteChatbot() {
  const { lang } = useLanguage();
  const text = COPY[lang];
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const msgCounter = useRef(0);

  // Focus input cleanly when opening drawer and scroll newest messages into view.
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, busy, isOpen]);

  async function submitQuery(question) {
    const clean = question.trim();
    if (!clean || busy) return;

    const userId = `u-${++msgCounter.current}`;
    setMessages((prev) => [...prev, { id: userId, role: "user", text: clean }]);
    setDraft("");
    setBusy(true);

    try {
      const reply = await answerQuestion(clean, lang);
      const botId = `b-${++msgCounter.current}`;
      if (reply) {
        setMessages((prev) => [...prev, { id: botId, role: "bot", ...reply }]);
      }
    } catch {
      const botId = `b-${++msgCounter.current}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botId,
          role: "bot",
          text:
            lang === "tr"
              ? "Bilgi dizini yüklenirken bir sorun oluştu. Lütfen tekrar deneyin."
              : "Something went wrong loading the site index. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }));
  }

  function handleReset() {
    setMessages([]);
    setDraft("");
    inputRef.current?.focus();
  }

  // Keep launcher compact in the interactive 3D Lab so corner controls stay clear.
  const isLabRoute = location.pathname.startsWith("/lab");

  return (
    <div
      className={`geoknow-chat${isLabRoute ? " is-compact-route" : ""}`}
      lang={lang}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.stopPropagation();
          handleClose();
        }
      }}
    >
      {isOpen && (
        <section
          className="geoknow-chat-panel"
          role="dialog"
          aria-label={text.title}
        >
          <header className="geoknow-chat-header">
            <div className="geoknow-chat-header-info">
              <h2>{text.title}</h2>
              <p>{text.subtitle}</p>
            </div>
            <div className="geoknow-chat-header-actions">
              {messages.length > 0 && (
                <button
                  type="button"
                  className="geoknow-chat-icon-btn"
                  onClick={handleReset}
                  title={text.reset}
                  aria-label={text.reset}
                >
                  <ChatIcon name="reset" />
                </button>
              )}
              <button
                type="button"
                className="geoknow-chat-icon-btn"
                onClick={handleClose}
                title={text.close}
                aria-label={text.close}
              >
                <ChatIcon name="close" />
              </button>
            </div>
          </header>

          <div className="geoknow-chat-messages" aria-live="polite">
            <div className="geoknow-chat-msg is-bot">
              <p>{text.welcome}</p>
              {messages.length === 0 && (
                <div className="geoknow-chat-prompts">
                  {text.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="geoknow-chat-prompt-btn"
                      onClick={() => submitQuery(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`geoknow-chat-msg is-${msg.role}`}>
                <p>{msg.text}</p>
                {Array.isArray(msg.bullets) && msg.bullets.length > 0 && (
                  <ul className="geoknow-chat-bullets">
                    {msg.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
                {Array.isArray(msg.links) && msg.links.length > 0 && (
                  <div className="geoknow-chat-links">
                    {msg.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="geoknow-chat-link-btn"
                        onClick={() => {
                          if (window.innerWidth <= 640) setIsOpen(false);
                        }}
                      >
                        <span>{link.label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="geoknow-chat-msg is-bot is-thinking">
                <p>{text.thinking}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="geoknow-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              submitQuery(draft);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="geoknow-chat-input"
              placeholder={text.placeholder}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={200}
              aria-label={text.placeholder}
            />
            <button
              type="submit"
              className="geoknow-chat-send"
              disabled={!draft.trim() || busy}
              aria-label={text.send}
              title={text.send}
            >
              <ChatIcon name="send" />
            </button>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        className={`geoknow-chat-launcher${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? text.close : text.launcher}
      >
        <ChatIcon name={isOpen ? "close" : "chat"} />
        <span className="geoknow-chat-launcher-label">{text.launcher}</span>
      </button>
    </div>
  );
}

