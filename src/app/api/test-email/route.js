// /app/api/test-email/route.js
import nodemailer from "nodemailer";

export async function GET(req) {
  try {
    console.log("🧪 Test Email API Called");

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    console.log("📧 EMAIL_USER:", emailUser);
    console.log("🔑 EMAIL_PASSWORD exists:", !!emailPassword);

    if (!emailUser || !emailPassword) {
      return new Response(
        JSON.stringify({
          error: "Missing EMAIL_USER or EMAIL_PASSWORD",
          emailUser: emailUser ? "✅ Set" : "❌ Missing",
          emailPassword: emailPassword ? "✅ Set" : "❌ Missing",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Verify connection
    console.log("🔍 Verifying email connection...");
    await transporter.verify();
    console.log("✅ Email connection verified!");

    // Send test email
    const testEmail = "snowfie.official@gmail.com";
    console.log("📬 Sending test email to:", testEmail);

    const info = await transporter.sendMail({
      from: emailUser,
      to: testEmail,
      subject: "🧪 Test Email - Ecomus",
      html: `
        <h2>Test Email Success! ✅</h2>
        <p>Your email configuration is working correctly.</p>
        <p>Email User: ${emailUser}</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("✅ Test email sent! Message ID:", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test email sent successfully!",
        messageId: info.messageId,
        details: {
          emailUser: emailUser,
          testEmailSentTo: testEmail,
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Test Email Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}