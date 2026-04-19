export interface QuoteRequestPayload {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  details: string;
  submittedAt: Date;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 14px;background:#f6f7f9;color:#5b6472;font-size:13px;font-weight:600;border-bottom:1px solid #ececec;width:170px;vertical-align:top;">${escapeHtml(
        label,
      )}</td>
      <td style="padding:10px 14px;color:#1f2937;font-size:14px;border-bottom:1px solid #ececec;white-space:pre-wrap;">${escapeHtml(
        value,
      )}</td>
    </tr>`;
}

export function renderQuoteRequestEmail(payload: QuoteRequestPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `New Quote Request — ${payload.name}${
    payload.service ? ` (${payload.service})` : ""
  }`;

  const text = [
    "New quote request received from designvate.com",
    "",
    `Name:    ${payload.name}`,
    `Phone:   ${payload.phone}`,
    `Email:   ${payload.email || "—"}`,
    `Service: ${payload.service || "—"}`,
    `When:    ${payload.submittedAt.toUTCString()}`,
    "",
    "Project Details:",
    payload.details,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f1f3f6;font-family:Inter,Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f6;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,0.06);">
            <tr>
              <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 28px 22px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">Designvate Ventures LLP</div>
                <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;">New Quote Request</h1>
                <p style="margin:6px 0 0;font-size:13px;color:#cbd5e1;">Submitted via the website contact form</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececec;border-radius:10px;overflow:hidden;">
                  ${row("Full Name", payload.name)}
                  ${row("Phone", payload.phone)}
                  ${row("Email", payload.email || "—")}
                  ${row("Service Interested In", payload.service || "—")}
                  ${row("Submitted", payload.submittedAt.toUTCString())}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px;">
                <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#5b6472;margin:18px 0 8px;">Project Details</h2>
                <div style="background:#f6f7f9;border:1px solid #ececec;border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.6;color:#1f2937;white-space:pre-wrap;">${escapeHtml(
                  payload.details,
                )}</div>
                ${
                  payload.email
                    ? `<p style="margin:18px 0 0;font-size:13px;color:#5b6472;">Reply directly to this email to respond to <a href="mailto:${escapeHtml(
                        payload.email,
                      )}" style="color:#0f172a;">${escapeHtml(payload.email)}</a>.</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#0f172a;color:#94a3b8;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} Designvate Ventures LLP. Sent automatically by the website.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
