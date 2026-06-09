module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const { email, firstName, lastName, conference, source } = body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Brevo API key not configured" });
  }

  const LIST_IDS = {
    "mailing-list": 3,
    "betting-tips": 4,
  };

  const payload = {
    email,
    attributes: {
      FIRSTNAME: firstName || "",
      LASTNAME: lastName || "",
      CONFERENCE: conference || "",
    },
    listIds: source && LIST_IDS[source] ? [LIST_IDS[source]] : [],
    updateEnabled: true,
  };

  console.log("Sending to Brevo:", JSON.stringify(payload));

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("Brevo status:", response.status, "body:", responseText);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to subscribe", detail: responseText });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
