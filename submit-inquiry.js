
const AIRTABLE_API_URL = "https://api.airtable.com/v0";

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID || "appyfx9VGogMXGXNc";
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Inquiries";

  if (!token) {
    console.error("AIRTABLE_TOKEN is missing.");
    return jsonResponse(500, { error: "The contact form is not configured yet." });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid form submission." });
  }

  // Honeypot: silently accept likely bot submissions without creating a record.
  if (String(payload.website || "").trim()) {
    return jsonResponse(200, { ok: true });
  }

  const name = String(payload.name || "").trim().slice(0, 160);
  const email = String(payload.email || "").trim().slice(0, 254);
  const phone = String(payload.phone || "").trim().slice(0, 60);
  const companySize = String(payload.companySize || "").trim().slice(0, 80);
  const processToImprove = String(payload.processToImprove || "").trim().slice(0, 10000);

  if (!name || !email || !processToImprove) {
    return jsonResponse(400, {
      error: "Name, email, and the process you would like to improve are required."
    });
  }

  if (!isValidEmail(email)) {
    return jsonResponse(400, { error: "Please enter a valid email address." });
  }

  const fields = {
    "Name": name,
    "Email": email,
    "What process would you like to improve?": processToImprove
  };

  if (phone) fields["Phone"] = phone;
  if (companySize) fields["Company Size"] = companySize;

  const endpoint =
    `${AIRTABLE_API_URL}/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`;

  try {
    const airtableResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true
      })
    });

    const airtableResult = await airtableResponse.json().catch(() => ({}));

    if (!airtableResponse.ok) {
      console.error("Airtable error:", airtableResponse.status, airtableResult);
      return jsonResponse(502, {
        error: "We could not save your inquiry. Please try again."
      });
    }

    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error("Submission error:", error);
    return jsonResponse(500, {
      error: "We could not submit your inquiry. Please try again."
    });
  }
};
