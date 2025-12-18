// api/orion-ai.js
export default async function handler(req, res) {
  // Only POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Body parsing (Vercel can send object or string)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages[]" });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "Server misconfigured: OPENAI_API_KEY missing" });
    }

    // ---- Orion fish Assistant: system instructions ----
    const systemInstructions = `
You are "Orion fish Assistant", a B2B sales & support assistant for ORION FISH (seafood & fruit juice processing), based in Rufisque, Senegal.

Goals:
1) Answer customer questions clearly (FR/EN).
2) If the user asks for a price/quotation, switch to RFQ qualification and collect:
   - product, specs, packaging, quantity, target delivery date, destination/port, incoterm, requirements/certifications, buyer contact details.
3) If the user asks about compliance documents, explain they are available upon request depending on product/destination requirements, then ask what you need.

Hard rules:
- Never invent prices, stock, certifications or documents.
- If data is missing, ask short questions.
- Keep a professional, concise tone.
- Provide ORION FISH contacts when needed:
  Email: contact@orionsfish.com
  WhatsApp: +221 78 270 24 57, +221 33 913 83 92
  Address: Quartier Léona, Cité Filaos, Rufisque 17000, Senegal
  Website: https://www.orionsfish.com
`.trim();

    // ---- JSON Schema (Structured Outputs) ----
    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        reply: { type: "string" },
        intent: {
          type: "string",
          enum: ["faq", "rfq", "compliance", "contact", "other"],
        },
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
            buyer_contact: { type: ["string", "null"] },
          },
          required: [
            "product",
            "specs",
            "packaging",
            "quantity",
            "delivery_date",
            "destination",
            "incoterm",
            "requirements",
            "buyer_contact",
          ],
        },
        missing_fields: { type: "array", items: { type: "string" } },
      },
      required: ["reply", "intent", "rfq", "missing_fields"],
    };

    // Keep last N messages to limit tokens
    const inputItems = messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? ""),
    }));

    const payload = {
      model: "gpt-4o-mini",
      store: false,
      instructions: systemInstructions,
      input: inputItems,
      text: {
        format: {
          type: "json_schema",
          name: "orion_fish_response", // ✅ required
          strict: true,
          schema,
        },
      },
    };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(r.status).json({ error: "OpenAI error", details: data });
    }

    // Extract text from Responses API
    const extractOutputText = (resp) => {
      if (typeof resp?.output_text === "string" && resp.output_text.trim()) {
        return resp.output_text.trim();
      }
      const out = Array.isArray(resp?.output) ? resp.output : [];
      const parts = [];
      for (const item of out) {
        if (item?.type === "message" && Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c?.type === "output_text" && typeof c.text === "string") {
              parts.push(c.text);
            }
          }
        }
      }
      return parts.join("\n").trim();
    };

    const raw = extractOutputText(data);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Fallback if something unexpected happens
      parsed = {
        reply: raw || "Sorry, I couldn't format the answer.",
        intent: "other",
        rfq: {
          product: null,
          specs: null,
          packaging: null,
          quantity: null,
          delivery_date: null,
          destination: null,
          incoterm: null,
          requirements: null,
          buyer_contact: null,
        },
        missing_fields: [],
      };
    }

    return res.status(200).json(parsed);
  } catch (e) {
    return res
      .status(500)
      .json({ error: "Server error", details: String(e?.message || e) });
  }
}
