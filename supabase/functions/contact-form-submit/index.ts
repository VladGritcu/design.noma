import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

async function sendEmailViaGmail(
  formData: ContactFormData,
  attachmentCount: number
): Promise<void> {
  const gmailApiKey = Deno.env.get("GMAIL_API_KEY");
  const senderEmail = Deno.env.get("SENDER_EMAIL") || "hello@noma.studio";
  const recipientEmail = Deno.env.get("RECIPIENT_EMAIL") || "hello@noma.studio";

  if (!gmailApiKey) {
    throw new Error("Gmail API key not configured");
  }

  const emailBody = `
Mesaj nou de la NOMA Contact Form

Nume: ${formData.name}
Email: ${formData.email}
Telefon: ${formData.phone}

Mesaj:
${formData.message}

Fișiere atașate: ${attachmentCount} imagine(i)

---
Acest email a fost trimis de la formularului de contact de pe nomastudio.ro
`;

  const mailPayload = {
    to: recipientEmail,
    subject: `Nou Contact Form Submission - ${formData.name}`,
    text: emailBody,
    from: senderEmail,
  };

  const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${gmailApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      raw: Buffer.from(JSON.stringify(mailPayload)).toString("base64"),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gmail API error: ${error}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const formData = await req.formData();

    const name = formData.get("given-name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const inspirationPhotos = formData.getAll("inspiration_photos");
    const attachmentCount = inspirationPhotos.length;

    const contactData: ContactFormData = {
      name,
      email,
      phone,
      message,
    };

    try {
      await sendEmailViaGmail(contactData, attachmentCount);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Mesajul a fost trimis cu succes",
        data: {
          name,
          email,
          attachments: attachmentCount,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Form submission error:", error);

    return new Response(
      JSON.stringify({
        error: "A apărut o eroare la procesarea formularului",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
