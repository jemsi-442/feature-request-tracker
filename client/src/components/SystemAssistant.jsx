import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiMessageSquare, FiRefreshCw, FiSend, FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { getAssistantQuickActions, getAssistantReply, getAssistantSuggestions } from "../utils/systemAssistant";
import { useAuth } from "../hooks/useAuth";

const STORAGE_KEY = "feature-request-tracker-system-assistant";

function createAssistantMessage(language, greeting) {
  return {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    text: greeting,
    language,
    intent: "greeting",
  };
}

export default function SystemAssistant() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed?.messages) && parsed.messages.length
        ? parsed.messages
        : [createAssistantMessage(language, t("assistant.greeting"))];
    } catch {
      return [createAssistantMessage(language, t("assistant.greeting"))];
    }
  });

  const suggestions = useMemo(() => getAssistantSuggestions(language), [language]);
  const quickActions = useMemo(
    () => getAssistantQuickActions(language, location.pathname, user?.role || "user"),
    [language, location.pathname, user?.role]
  );
  const lastIntent = [...messages].reverse().find((message) => message.role === "assistant" && message.intent)?.intent;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (typeof parsed?.open === "boolean") {
        setOpen(parsed.open);
      }
    } catch {
      // ignore invalid local state
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        open,
        messages: messages.slice(-18),
      })
    );
  }, [open, messages]);

  const handleToggle = () => {
    setOpen((current) => !current);
  };

  const handleClear = () => {
    const initial = createAssistantMessage(language, t("assistant.greeting"));
    setMessages([initial]);
    setDraft("");
  };

  const handleAsk = (text) => {
    const question = text.trim();
    if (!question) return;

    const answer = getAssistantReply(question, language, {
      pathname: location.pathname,
      lastIntent,
      role: user?.role || "user",
    });

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "user",
        text: question,
        language,
      },
      {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "assistant",
        text: answer.text,
        language,
        intent: answer.intent,
      },
    ]);
    setDraft("");
    setOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAsk(draft);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-[min(92vw,22rem)] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
          <div className="bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_58%,#f59e0b_100%)] p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-black sm:text-lg">{t("assistant.title")}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                  aria-label={t("assistant.clear")}
                >
                  <FiRefreshCw />
                </button>
                <button
                  onClick={handleToggle}
                  className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                  aria-label={t("assistant.close")}
                >
                  <FiX />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-3 sm:p-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleAsk(suggestion)}
                    className="rounded-full bg-slate-900 px-3 py-2 text-left text-xs font-semibold text-white transition hover:bg-teal-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleAsk(suggestion)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:text-teal-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "assistant"
                      ? "border border-slate-200 bg-white text-slate-700"
                      : "ml-8 bg-slate-900 text-white"
                  }`}
                >
                  {message.text}
                </article>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <label className="flex-1">
                <span className="sr-only">{t("assistant.title")}</span>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={t("assistant.placeholder")}
                  className="input min-h-[4.5rem] resize-none"
                />
              </label>
              <button type="submit" className="btn-primary inline-flex items-center gap-2 px-4">
                <FiSend />
                <span className="hidden sm:inline">{t("assistant.send")}</span>
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        onClick={handleToggle}
        className="ml-auto mt-3 inline-flex items-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-teal-700"
        aria-label={t("assistant.open")}
      >
        <FiMessageSquare />
        <span>{t("assistant.title")}</span>
        <FiArrowUpRight className="text-amber-300" />
      </button>
    </div>
  );
}
