export default async function handler(req, res) {
  try {
    // 🔥 FIX DI SINI
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { prompt } = body || {};

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Groq API error", detail: data });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      detail: error.message
    });
  }
}
