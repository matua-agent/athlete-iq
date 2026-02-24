"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { STARTER_TOPICS } from "@/lib/knowledge-base";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isStreaming) return;

      const userMessage: Message = { role: "user", content: userText.trim() };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setShowTopics(false);
      setIsStreaming(true);

      // Add empty assistant message to stream into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulatedText += decoder.decode(value, { stream: true });
          const currentText = accumulatedText;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: currentText,
            };
            return updated;
          });
        }
      } catch (error) {
        console.error(error);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          };
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTopicClick = (prompt: string) => {
    sendMessage(prompt);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 sm:px-6 py-4 flex items-center gap-3 sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">
            AI
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">AthleteIQ</h1>
            <p className="text-xs text-zinc-500 hidden sm:block">
              Sports science AI · Backed by peer-reviewed research
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
            Live research
          </span>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                🔬
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2">
                Ask me anything about training
              </h2>
              <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
                Evidence-based answers on endurance physiology, strength, recovery, and performance —
                built on peer-reviewed research including published work from{" "}
                <a
                  href="https://dudleyrode.com"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Harrison Dudley-Rode
                </a>{" "}
                (EJAP, 2024/2025).
              </p>
            </div>

            {showTopics && (
              <div className="w-full max-w-2xl">
                <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider">
                  Quick topics
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STARTER_TOPICS.map((topic) => (
                    <button
                      key={topic.label}
                      onClick={() => handleTopicClick(topic.prompt)}
                      className="text-left p-3.5 rounded-xl border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                    >
                      <span className="text-lg mr-2">{topic.icon}</span>
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100">
                        {topic.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="text-sm prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 prose-headings:text-zinc-100 prose-strong:text-zinc-100 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:text-blue-300 prose-code:bg-zinc-800 prose-code:px-1 prose-code:rounded prose-li:my-0.5">
                      {msg.content ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <span className="text-zinc-500 animate-pulse">
                          Thinking...
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    You
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* Research citation bar */}
      {messages.length > 0 && (
        <div className="border-t border-zinc-800 px-4 py-2 bg-zinc-950">
          <div className="max-w-3xl mx-auto flex items-center gap-4 flex-wrap">
            <span className="text-xs text-zinc-600">Research basis:</span>
            <a
              href="https://doi.org/10.1007/s00421-024-05687-w"
              target="_blank"
              className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
            >
              Dudley-Rode et al. (2024) CHO/VT1 ↗
            </a>
            <a
              href="https://doi.org/10.1007/s00421-025-05815-0"
              target="_blank"
              className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
            >
              Dudley-Rode et al. (2025) Decoupling ↗
            </a>
            <span className="text-xs text-zinc-600">+ Banister (1975), Maunder (2021), Spragg (2022)</span>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-zinc-800 p-4 bg-zinc-950">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-3 items-end"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about training, physiology, recovery..."
              rows={1}
              className="w-full resize-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors pr-4 max-h-40"
              disabled={isStreaming}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-2"
          >
            {isStreaming ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-xs text-zinc-600 text-center mt-2 max-w-3xl mx-auto">
          AthleteIQ provides evidence-based information, not personalized medical advice. Consult a professional for health decisions.
        </p>
      </div>
    </div>
  );
}
