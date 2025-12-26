import clientPromise from "@/lib/dbConnect";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    console.log("📧 Invoice API Called");

    const body = await req.json();
    console.log("📨 Request body received:", {
      email: body.email,
      orderId: body.orderId,
      itemsCount: body.items?.length,
    });

    const {
      email,
      orderId,
      customerName,
      items,
      subtotal,
      deliveryCharge,
      total,
      deliveryArea,
      estimatedDelivery,
      customerInfo,
      couponDiscount = 0,
    } = body;

    // Validate required fields
    const errors = [];
    
    if (!email) {
      errors.push("Email is required");
      console.error("❌ Email missing");
    }
    if (!orderId) {
      errors.push("Order ID is required");
      console.error("❌ Order ID missing");
    }
    if (!items || items.length === 0) {
      errors.push("Items are required");
      console.error("❌ Items missing");
    }
    if (!customerName) {
      errors.push("Customer name is required");
      console.error("❌ Customer name missing");
    }
    if (subtotal === undefined || subtotal === null) {
      errors.push("Subtotal is required");
      console.error("❌ Subtotal missing");
    }
    if (total === undefined || total === null) {
      errors.push("Total is required");
      console.error("❌ Total missing");
    }

    if (errors.length > 0) {
      console.error("❌ Validation errors:", errors);
      return new Response(
        JSON.stringify({ 
          error: "Validation failed",
          missingFields: errors 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword) {
      console.error("❌ Missing EMAIL_USER or EMAIL_PASSWORD");
      return new Response(
        JSON.stringify({
          error: "Email service not configured. Missing EMAIL_USER or EMAIL_PASSWORD",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch logo from database
    let logoUrl = "";
    let logoWidth = 130;

    try {
      const client = await clientPromise;
      const db = client.db("snowfye");
      const settings = await db.collection("general-settings").findOne({});
      if (settings?.logo?.url) {
        logoUrl = settings.logo.url;
        logoWidth = settings.logo.width || 130;
        console.log("✅ Logo fetched from database");
      }
    } catch (dbError) {
      console.log("⚠️ Could not fetch logo from DB:", dbError.message);
    }

    // Create transporter
    console.log("🔌 Creating nodemailer transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Verify transporter
    try {
      await transporter.verify();
      console.log("✅ Email transporter verified successfully");
    } catch (verifyError) {
      console.error("❌ Transporter verification failed:", verifyError.message);
      return new Response(
        JSON.stringify({
          error: "Email service verification failed: " + verifyError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #ff6c2f 0%, #ff8a5e 100%);
            color: white;
            padding: 50px 20px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(255, 108, 47, 0.2);
          }
          
          .logo-section {
            margin-bottom: 25px;
          }
          
          .logo-section img {
            max-width: ${logoWidth}px;
            height: auto;
            filter: brightness(0) invert(1);
            transition: transform 0.3s ease;
          }
          
          .header h1 {
            font-size: 40px;
            margin-bottom: 5px;
            font-weight: 700;
            letter-spacing: 2px;
          }
          
          .order-id {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          
          .content {
            padding: 50px 30px;
          }
          
          .greeting {
            color: #2c3e50;
            margin-bottom: 35px;
            line-height: 1.8;
            background: linear-gradient(135deg, rgba(255, 108, 47, 0.05) 0%, rgba(0, 102, 204, 0.05) 100%);
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #ff6c2f;
          }
          
          .greeting p {
            margin-bottom: 12px;
            font-size: 15px;
          }
          
          .greeting p:first-child {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          .customer-info {
            background: linear-gradient(135deg, #fff8f3 0%, #f0f8ff 100%);
            border-left: 5px solid #ff6c2f;
            padding: 25px;
            margin-bottom: 35px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(255, 108, 47, 0.1);
          }
          
          .customer-info h3 {
            color: #ff6c2f;
            font-size: 13px;
            text-transform: uppercase;
            margin-bottom: 15px;
            font-weight: 700;
            letter-spacing: 1px;
          }
          
          .customer-info p {
            color: #2c3e50;
            font-size: 14px;
            margin-bottom: 8px;
            line-height: 1.7;
          }
          
          .customer-info p strong {
            color: #1a1a1a;
            font-weight: 600;
          }
          
          .items-section {
            margin-bottom: 35px;
          }
          
          .items-section h3 {
            color: #1a1a1a;
            font-size: 18px;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 3px solid #ff6c2f;
            font-weight: 700;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          table th {
            background: linear-gradient(135deg, #ff6c2f 0%, #ff8a5e 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.5px;
          }
          
          table td {
            padding: 15px;
            border-bottom: 1px solid #ecf0f1;
            color: #2c3e50;
            font-size: 14px;
          }
          
          table tbody tr:hover {
            background-color: #fff8f3;
          }
          
          table tr:last-child td {
            border-bottom: 2px solid #ff6c2f;
          }
          
          .text-right {
            text-align: right;
          }
          
          .summary {
            background: linear-gradient(135deg, #fff8f3 0%, #f0f8ff 100%);
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 108, 47, 0.2);
            box-shadow: 0 2px 8px rgba(255, 108, 47, 0.1);
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 14px;
            font-size: 15px;
            color: #2c3e50;
            padding: 8px 0;
          }
          
          .summary-row:last-child {
            margin-bottom: 0;
          }
          
          .summary-row span {
            font-weight: 500;
          }
          
          .summary-row.total {
            border-top: 2px solid #ff6c2f;
            padding-top: 15px;
            margin-top: 15px;
            font-weight: 700;
            color: #1a1a1a;
            font-size: 18px;
          }
          
          .summary-row.total .amount {
            color: #ff6c2f;
            font-size: 22px;
          }
          
          .delivery-info {
            background: linear-gradient(135deg, #e8f4f8 0%, #e8f8f4 100%);
            border-left: 5px solid #0066cc;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
          }
          
          .delivery-info p {
            color: #0066cc;
            font-size: 15px;
            margin-bottom: 10px;
            line-height: 1.7;
          }
          
          .delivery-info p:last-child {
            margin-bottom: 0;
          }
          
          .delivery-info strong {
            color: #004d99;
            font-weight: 600;
          }
          
          .footer {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-top: 3px solid #ff6c2f;
          }
          
          .footer p {
            color: #ecf0f1;
            font-size: 14px;
            margin-bottom: 12px;
            line-height: 1.8;
          }
          
          .footer p:last-child {
            margin-bottom: 0;
            font-size: 12px;
            color: #95a5a6;
          }
          
          .footer-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #ff6c2f, transparent);
            margin: 20px 0;
          }
          
          .footer-link {
            color: #ff6c2f;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${logoUrl ? `<div class="logo-section"><img src="${logoUrl}" alt="Logo" /></div>` : ""}
            <h1>INVOICE</h1>
            <p class="order-id">Order ID: <strong>#${String(orderId).slice(-6)}</strong></p>
          </div>
          
          <div class="content">
            <div class="greeting">
              <p>👋 Dear <strong>${customerName}</strong>,</p>
              <p>Thank you for your order! We're excited to process your purchase. Your order details are provided below:</p>
            </div>
            
            <div class="customer-info">
              <h3>📦 Shipping Address</h3>
              <p><strong>${customerInfo?.name || customerName}</strong></p>
              <p>📍 ${customerInfo?.address || ""}</p>
              <p>🏙️ ${customerInfo?.city || ""}</p>
              <p>📞 ${customerInfo?.phone || ""}</p>
              <p>✉️ ${email}</p>
            </div>
            
            <div class="items-section">
              <h3>🛍️ Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.title}</td>
                      <td>${item.quantity}</td>
                      <td>${item.currency || "৳"}${item.price}</td>
                      <td class="text-right"><strong>${item.currency || "৳"}${item.price * item.quantity}</strong></td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            
            <div class="summary">
              <div class="summary-row">
                <span>💰 Subtotal</span>
                <span>${items[0]?.currency || "৳"}${subtotal}</span>
              </div>
              <div class="summary-row">
                <span>🚚 Delivery Charge</span>
                <span>${deliveryCharge > 0 ? (items[0]?.currency || "৳") + deliveryCharge : "🎁 FREE"}</span>
              </div>
              ${
                couponDiscount > 0
                  ? `
              <div class="summary-row" style="color: #27ae60;">
                <span>🎟️ Discount</span>
                <span>-${items[0]?.currency || "৳"}${couponDiscount}</span>
              </div>
              `
                  : ""
              }
              <div class="summary-row total">
                <span>💳 Total Amount</span>
                <span class="amount">${items[0]?.currency || "৳"}${total}</span>
              </div>
            </div>
            
            <div class="delivery-info">
              <p><strong>📍 Delivery Area:</strong> ${deliveryArea || "Not specified"}</p>
              <p><strong>⏰ Estimated Delivery:</strong> <strong style="color: #ff6c2f;">${estimatedDelivery} days</strong></p>
              <p><strong>💵 Payment Method:</strong> Cash on Delivery</p>
            </div>
          </div>
          
          <div class="footer">
            <p>🎉 Thank you for your purchase!</p>
            <p>If you have any questions about your order, please don't hesitate to reach out to us.</p>
            <div class="footer-divider"></div>
            <p>📞 <span class="footer-link">support@snowfye.com</span> | 🌐 www.snowfye.com</p>
            <p>© 2024 snowfye. All rights reserved. 💙</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    console.log("📬 Sending email to:", email);
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: `Your Invoice - Order #${String(orderId).slice(-6)}`,
      html: invoiceHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully. Message ID:", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invoice email sent successfully",
        messageId: info.messageId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error in send-invoice API:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}