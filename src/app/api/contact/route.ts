import { NextResponse } from "next/server";
import { sendMail } from "@/lib/brevo";
import { renderQuoteRequestEmail } from "@/lib/emailTemplates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactBody {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  service?: unknown;
  details?: unknown;
  honeypot?: unknown;
}

function asString(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isValidEmail(value: string): boolean {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getRecipients(): string[] {
  const raw = process.env.CONTACT_RECIPIENT_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (typeof body.honeypot === "string" && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name, 120);
  const phone = asString(body.phone, 40);
  const email = asString(body.email, 200);
  const service = asString(body.service, 120);
  const details = asString(body.details, 5000);

  if (!name || !phone || !details) {
    return NextResponse.json(
      { ok: false, error: "Name, phone and project details are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const recipients = getRecipients();
  if (recipients.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Recipient mailbox is not configured. Please contact us directly.",
      },
      { status: 500 },
    );
  }

  const { subject, text, html } = renderQuoteRequestEmail({
    name,
    phone,
    email: email || undefined,
    service: service || undefined,
    details,
    submittedAt: new Date(),
  });

  const result = await sendMail({
    to: recipients,
    subject,
    text,
    html,
    replyTo: email || undefined,
  });

  if (!result.ok) {
    console.error("Brevo send failed", result);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't send your request right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
