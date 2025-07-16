export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbz1-7Rox-lLLlBm5pDrpgZ_agiQz41Ot_fta3zCdl8ptq0juLEzaDQ-6VH59SnulXxC/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    res.status(200).send(`✅ Logged to Google Sheets: ${text}`);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    res.status(500).send("Logging failed.");
  }
}
