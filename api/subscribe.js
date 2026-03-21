export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName, lastName, conference, source } = req.body;

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

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName || "",
          LASTNAME: lastName || "",
          CONFERENCE: conference || "",
        },
        listIds: source && LIST_IDS[source] ? [LIST_IDS[source]] : [],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Brevo error:", err);
      return res.status(500).json({ error: "Failed to subscribe" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
