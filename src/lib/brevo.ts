/**
 * Minimal Brevo (formerly Sendinblue) transactional email client using
 * the HTTP API + global fetch.
 *
 * Why no SDK?
 *   - Works on Vercel / any Node 18+ runtime with zero extra deps.
 *   - Smaller bundle, simpler to audit.
 *
 * Required env vars (configure in Vercel project settings):
 *   - BREVO_API_KEY            From Brevo dashboard -> SMTP & API -> API Keys
 *   - BREVO_SENDER_EMAIL       A verified sender in Brevo -> Senders, Domains & Dedicated IPs
 *   - BREVO_SENDER_NAME        optional, defaults to "Designvate Website"
 *
 * Brevo free plan:
 *   - 300 emails/day
 *   - The sender email MUST be verified in your Brevo account
 *     (Brevo sends a confirmation email to the address you add).
 *   - Recipients do NOT need to be verified (unlike Mailgun's sandbox).
 */

export interface BrevoMessage {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface BrevoResult {
  ok: boolean;
  status: number;
  messageId?: string;
  error?: string;
}

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export async function sendMail(message: BrevoMessage): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    return {
      ok: false,
      status: 500,
      error:
        "Brevo is not configured. Set BREVO_API_KEY and BREVO_SENDER_EMAIL.",
    };
  }

  const senderName =
    process.env.BREVO_SENDER_NAME?.trim() || "Designvate Website";

  const recipients = (Array.isArray(message.to) ? message.to : [message.to])
    .map((email) => email.trim())
    .filter(Boolean)
    .map((email) => ({ email }));

  if (recipients.length === 0) {
    return { ok: false, status: 400, error: "No recipients provided." };
  }

  const payload: Record<string, unknown> = {
    sender: { email: senderEmail, name: senderName },
    to: recipients,
    subject: message.subject,
    textContent: message.text,
  };
  if (message.html) payload.htmlContent = message.html;
  if (message.replyTo) payload.replyTo = { email: message.replyTo };

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as {
      messageId?: string;
      message?: string;
      code?: string;
    };

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error:
          data.message ||
          data.code ||
          `Brevo request failed (${res.status})`,
      };
    }

    return { ok: true, status: res.status, messageId: data.messageId };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err instanceof Error ? err.message : "Unknown network error",
    };
  }
}
