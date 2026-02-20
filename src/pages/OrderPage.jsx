import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OrderPage() {
  const [customerName, setCustomerName] = useState("");
  const [orderText, setOrderText] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!customerName.trim() || !orderText.trim()) {
      setStatus({ type: "error", message: "Please fill out both fields." });
      return;
    }

    setSaving(true);

    // ✅ If you renamed the DB column to order_text, keep this as-is.
    // ✅ If your DB column is still order_details, change order_text -> order_details below.
    const { error } = await supabase.from("orders").insert([
      {
        customer_name: customerName.trim(),
        order_text: orderText.trim(),
      },
    ]);

    if (error) {
      setStatus({ type: "error", message: error.message });
    } else {
      setStatus({ type: "success", message: "Order saved successfully!" });
      setCustomerName("");
      setOrderText("");
      // Optional alert if teacher expects it:
      // alert("Success! Your order has been saved.");
    }

    setSaving(false);
  };

  return (
    <div style={{ padding: 16, maxWidth: 700, margin: "0 auto" }}>
      <h1>Order Now</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Customer Name
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Johnny Davis"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          Order Text
          <textarea
            value={orderText}
            onChange={(e) => setOrderText(e.target.value)}
            placeholder="Example: 1x Pancakes, 1x Iced Tea (no ice)"
            rows={5}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Submit Order"}
        </button>

        {status.message && (
          <p
            style={{
              marginTop: 6,
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          >
            {status.type === "success" ? "✅ " : "❌ "}
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
