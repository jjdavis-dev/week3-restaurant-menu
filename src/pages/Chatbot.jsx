import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Chatbot() {
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Step 5 requirement: conversation history array
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I’m your waiter 🤵 Ask me about our menu.",
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  // Load menu from Supabase
  useEffect(() => {
    const loadMenu = async () => {
      setLoadingMenu(true);
      const { data, error } = await supabase
        .from("menu_items")
        .select("name, price, category")
        .order("category", { ascending: true });

      if (!error) setMenuItems(data ?? []);
      setLoadingMenu(false);
    };

    loadMenu();
  }, []);

  const menuContext = useMemo(() => {
    if (!menuItems.length) return "MENU: (No items loaded)";
    const lines = menuItems.map(
      (i) => `- ${i.name} ($${Number(i.price).toFixed(2)}) [${i.category}]`,
    );
    return `MENU ITEMS:\n${lines.join("\n")}`;
  }, [menuItems]);

  const systemPrompt = useMemo(() => {
    return `
You are a friendly restaurant waiter.
Rules:
- Only answer using the menu items provided.
- If asked about something not on the menu, politely say you can only answer based on this menu.
- Do NOT invent items.
- Keep responses short and helpful.

${menuContext}
`.trim();
  }, [menuContext]);

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || thinking) return;

    const updatedMessages = [...messages, { role: "user", content: question }];
    setMessages(updatedMessages);
    setInput("");
    setThinking(true);

    try {
      const endpoint = import.meta.env.VITE_WORKER_URL;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `AI request failed (${res.status})`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error("AI fetch error:", err); // 👈 ADD THIS LINE

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry — I couldn’t reach the AI service.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: "0 auto" }}>
      <h1>AI Menu Assistant</h1>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 12,
          height: 400,
          overflowY: "auto",
          background: "#fff",
          marginBottom: 12,
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <strong>{msg.role === "user" ? "You" : "Waiter"}:</strong>
            <div>{msg.content}</div>
          </div>
        ))}
        {thinking && <div>Waiter is thinking…</div>}
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the menu..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={thinking}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            cursor: thinking ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
