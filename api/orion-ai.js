// api/orion-ai.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages[]" });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "Server misconfigured: OPENAI_API_KEY missing" });
    }

    const systemInstructions = `
You are "Orion fish Assistant", a B2B sales & support assistant for ORION FISH (seafood & fruit juice processing), based in Rufisque, Senegal.
Answer clearly (FR/EN). Never invent prices/stock/certifications.
If RFQ: ask for product, specs, packaging, quantity, delivery date, destination, incoterm, requirements, buyer contact.
Provide contacts if needed: contact@orionsfish.com, +221339138392, Rufisque 17000 Senegal, https://www.orionsfish.com
`.trim();

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        reply: { type: "string" },
        intent: { type: "string", enum: ["faq", "rfq", "compliance", "contact", "other"] },
        rfq: {
          type: "object",
          additionalProperties: false,
          properties: {
            product: { type: ["string", "null"] },
            specs: { type: ["string", "null"] },
            packaging: { type: ["string", "null"] },
            quantity: { type: ["string", "null"] },
            delivery_date: { type: ["string", "null"] },
            destination: { type: ["string", "null"] },
            incoterm: { type: ["string", "null"] },
            requirements: { type: ["string", "null"] },
            buyer_contact: { type: ["string", "null"] }
          },
          required: ["product","specs","packaging","quantity","delivery_date","destination","incoterm","requirements","buyer_contact"]
        },
        missing_fields: { type: "array", items: { type: "string" } }
      },
      required: ["reply","intent","rfq","missing_fields"]
    };

    const inputItems = messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "")
    }));

    const payload = {
      model: "gpt-4o-mini",
      store: false,
      instructions: systemInstructions,
      input: inputItems,
      text: {
        format: {
          type: "json_schema",
          name: "orion_fish_response",
          strict: true,
          schema
        }
      }
    };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(r.status).json({ error: "OpenAI error", details: data });
    }

    const extractOutputText = (resp) => {
      if (typeof resp?.output_text === "string" && resp.output_text.trim()) return resp.output_text.trim();
      const out = Array.isArray(resp?.output) ? resp.output : [];
      const parts = [];
      for (const item of out) {
        if (item?.type === "message" && Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c?.type === "output_text" && typeof c.text === "string") parts.push(c.text);
          }
        }
      }
      return parts.join("\n").trim();
    };

    const raw = extractOutputText(data);

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch {
      parsed = {
        reply: raw || "Sorry, I couldn't format the answer.",
        intent: "other",
        rfq: {
          product: null, specs: null, packaging: null, quantity: null,
          delivery_date: null, destination: null, incoterm: null,
          requirements: null, buyer_contact: null
        },
        missing_fields: []
      };
    }

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e?.message || e) });
  }
}
