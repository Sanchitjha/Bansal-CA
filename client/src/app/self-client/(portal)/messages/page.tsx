"use client";

import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const { cases, messages, sendMessage } = useSelfClient();
  const [activeCaseId, setActiveCaseId] = useState(cases[0]?.id || "");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // One-time sync from the ?case= URL param (set when arriving from a case detail
    // page link) — not derivable from render since it should only apply once on load.
    const fromQuery = searchParams.get("case");
    if (fromQuery && cases.some((c) => c.id === fromQuery)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCaseId(fromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const threadMessages = messages.filter((m) => m.caseId === activeCaseId);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeCaseId) return;
    sendMessage(activeCaseId, draft);
    setDraft("");
  };

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Messages</h1>
          <p>Communicate with your assigned Core Team member for each case.</p>
        </div>
      </div>

      <div className="portal-messages-layout">
        <aside className="portal-messages-case-list">
          {cases.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`portal-messages-case-btn ${c.id === activeCaseId ? "active" : ""}`}
              onClick={() => setActiveCaseId(c.id)}
            >
              <span className="portal-messages-case-id">{c.id}</span>
              <span className="portal-messages-case-name">{c.serviceName}</span>
            </button>
          ))}
        </aside>

        <div className="portal-message-thread">
          {threadMessages.length === 0 ? (
            <p className="empty-state">No messages yet for this case. Say hello below.</p>
          ) : (
            <div className="message-thread">
              {threadMessages.map((m) => (
                <div key={m.id} className={`message-bubble ${m.sender === "client" ? "from-client" : "from-team"}`}>
                  <span className="message-sender">{m.senderName}</span>
                  <p className="message-text">{m.text}</p>
                  <span className="message-date">{new Date(m.date).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          <form className="portal-message-form" onSubmit={handleSend}>
            <input
              type="text"
              className="form-input"
              placeholder="Type a message..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
