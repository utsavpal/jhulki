export async function sendOrderConfirmationEmail(order: any, customerEmail: string) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn('BREVO_API_KEY is missing. Skipping email trigger.');
    return;
  }

  try {
    const isFullPayment = order.isBalancePaid || (order.balanceDue !== undefined && order.balanceDue === 0);

    // Build Items HTML rows with discount price handling
    const itemsHtml = (order.items || [])
      .map((item: any) => {
        const itemPrice = item.price || item.product?.salePrice || item.product?.price || 0;
        const originalPrice = item.product?.price;
        const hasDiscount = originalPrice && originalPrice > itemPrice;

        return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #1a1a20;">
            <div style="font-size: 14px; font-weight: 500; color: #ffffff;">${item.product?.name || 'Handcrafted Ethnic Piece'}</div>
            <div style="font-size: 12px; color: #888899; margin-top: 4px;">Size: <span style="color: #cccccc;">${item.size || 'Standard'}</span></div>
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #1a1a20; text-align: center; font-size: 14px; color: #cccccc;">
            ${item.quantity || 1}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #1a1a20; text-align: right; font-size: 14px;">
            ${
              hasDiscount
                ? `<span style="font-size: 11px; color: #777788; text-decoration: line-through; margin-right: 6px;">₹${(originalPrice * (item.quantity || 1)).toLocaleString('en-IN')}</span>`
                : ''
            }
            <span style="font-weight: 600; color: #d4af37;">₹${((itemPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
          </td>
        </tr>
      `;
      })
      .join('');

    // Dynamic Financial Summary (Partial 20% vs Full Payment)
    let financialSummaryHtml = '';
    if (isFullPayment) {
      financialSummaryHtml = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
          <span style="color: #888899;">Grand Total:</span>
          <span style="color: #ffffff; font-weight: 600;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #4ade80; font-weight: 600; border-top: 1px dashed #22222a; padding-top: 8px; margin-top: 8px;">
          <span>Payment Status:</span>
          <span>FULL PAID (100%)</span>
        </div>
      `;
    } else {
      financialSummaryHtml = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
          <span style="color: #888899;">Grand Total:</span>
          <span style="color: #ffffff; font-weight: 600;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
          <span style="color: #888899;">Advance Paid (20%):</span>
          <span style="color: #4ade80; font-weight: 600;">₹${(order.advancePaid || 0).toLocaleString('en-IN')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; border-top: 1px dashed #22222a; padding-top: 8px; margin-top: 8px;">
          <span style="color: #888899;">Balance Due at Delivery:</span>
          <span style="color: #f87171; font-weight: 600;">₹${(order.balanceDue || 0).toLocaleString('en-IN')}</span>
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Jhulki</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08080a; color: #d1d1d6; margin: 0; padding: 40px 12px; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 560px; margin: 0 auto; background: #0f0f14; border: 1px solid #22222d; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.9);">
          
          <!-- Brand Header -->
          <div style="padding: 40px 32px 24px; text-align: center; border-bottom: 1px solid #1a1a24;">
            <div style="font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.25em; color: #d4af37; font-weight: 400; text-transform: uppercase;">JHULKI</div>
            <div style="font-size: 10px; letter-spacing: 0.2em; color: #666677; text-transform: uppercase; margin-top: 4px;">HAUTE COUTURE</div>
          </div>

          <!-- Order Summary Body -->
          <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 28px;">
              <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #d4af37; font-weight: 600; margin-bottom: 6px;">
                CONFIRMATION #${order.orderNumber}
              </div>
              <h1 style="font-family: Georgia, serif; font-size: 22px; color: #ffffff; margin: 0; font-weight: 400;">
                Thank you for your order, ${order.shippingName}
              </h1>
            </div>

            <!-- Items Section -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
              <thead>
                <tr style="border-bottom: 1px solid #22222d; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #666677;">
                  <th style="padding-bottom: 10px; text-align: left; font-weight: 500;">Item</th>
                  <th style="padding-bottom: 10px; text-align: center; font-weight: 500;">Qty</th>
                  <th style="padding-bottom: 10px; text-align: right; font-weight: 500;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Financial Calculation Card -->
            <div style="background: #14141c; border: 1px solid #22222d; border-radius: 8px; padding: 18px 20px; margin-top: 24px;">
              ${financialSummaryHtml}
            </div>

            <!-- Delivery Promise & Shipping Info Grid -->
            <div style="margin-top: 24px; display: grid; grid-template-columns: 1fr; gap: 16px;">
              
              <!-- Expected Delivery Date Notice -->
              <div style="background: rgba(212,175,55,0.05); border: 1px solid rgba(212,175,55,0.2); border-radius: 8px; padding: 16px;">
                <div style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #d4af37; font-weight: 600; margin-bottom: 4px;">
                  DELIVERY TIMELINE
                </div>
                <div style="font-size: 12px; color: #cccccc; leading-height: 1.5;">
                  Once we ship your product within our promised time, you will receive real-time delivery details.
                </div>
              </div>

              <!-- Shipping Address -->
              <div style="background: #14141c; border: 1px solid #22222d; border-radius: 8px; padding: 16px;">
                <div style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #666677; font-weight: 600; margin-bottom: 6px;">
                  SHIPPING ADDRESS
                </div>
                <div style="font-size: 13px; color: #cccccc; line-height: 1.5;">
                  <strong style="color: #ffffff;">${order.shippingName}</strong><br/>
                  ${order.shippingStreet}<br/>
                  ${order.shippingCity}, ${order.shippingState} – ${order.shippingZip}<br/>
                  <span style="color: #888899;">Phone: ${order.shippingPhone}</span>
                </div>
              </div>

            </div>

            <!-- Track Order Button Redirect -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="http://localhost:4200/track-order" target="_blank" style="display: inline-block; background: #d4af37; color: #000000; font-weight: 600; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; transition: background 0.2s;">
                TRACK YOUR ORDER IN REAL-TIME
              </a>
            </div>

          </div>

          <!-- Footer -->
          <div style="padding: 24px 32px; background: #0a0a0e; border-top: 1px solid #1a1a24; text-align: center; font-size: 11px; color: #555566; line-height: 1.6;">
            <p style="margin: 0 0 4px 0;">&copy; 2026 Jhulki Haute Couture Private Limited.</p>
            <p style="margin: 0;">Concierge: <a href="mailto:info@jhulki.store.com" style="color: #888899; text-decoration: none;">info@jhulki.store.com</a> | <a href="tel:+918732965683" style="color: #888899; text-decoration: none;">+91 87329 65683</a></p>
          </div>

        </div>
      </body>
      </html>
    `;

    // Direct HTTP request to Brevo Transactional Email REST API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: process.env.SENDER_NAME || 'Jhulki Haute Couture',
          email: process.env.SENDER_EMAIL || 'utsavpal40@gmail.com',
        },
        to: [{ email: customerEmail, name: order.shippingName || 'Valued Client' }],
        subject: `Order Confirmed #${order.orderNumber} - Jhulki Haute Couture`,
        htmlContent,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Brevo REST API Error]', data);
    } else {
      console.log(`[Brevo] Minimal order confirmation email sent to ${customerEmail} for order #${order.orderNumber}`, data);
    }
    return data;
  } catch (error: any) {
    console.error('[Brevo Error] Failed to send order confirmation email:', error?.message || error);
  }
}

/**
 * Sends a transactional SMS notification via Brevo's Transactional SMS API (/v3/transactionalSMS/send)
 */
export async function sendOrderTransactionalSms(order: any, recipientPhone: string) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn('BREVO_API_KEY is missing. Skipping SMS trigger.');
    return;
  }

  if (!recipientPhone) {
    console.warn('No recipient phone provided for order SMS trigger.');
    return;
  }

  // Format phone number to E.164 (default to India +91 if missing country code)
  let cleanPhone = recipientPhone.replace(/[^\d+]/g, '');
  if (!cleanPhone.startsWith('+')) {
    if (cleanPhone.length === 10) {
      cleanPhone = `+91${cleanPhone}`;
    } else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      cleanPhone = `+${cleanPhone}`;
    } else {
      cleanPhone = `+91${cleanPhone}`;
    }
  }

  const senderName = (process.env.BREVO_SMS_SENDER || 'JHULKI').substring(0, 11);
  const smsContent = `Jhulki Haute Couture: Thank you for your order #${order.orderNumber}! Total: Rs.${order.totalAmount || 0}. Track order: http://localhost:4200/track-order`;

  try {
    const response = await fetch('https://api.brevo.com/v3/transactionalSMS/send', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderName,
        recipient: cleanPhone,
        content: smsContent,
        type: 'transactional',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Brevo Transactional SMS API Error]', data);
    } else {
      console.log(`[Brevo] SMS order confirmation dispatched to ${cleanPhone} for order #${order.orderNumber}`, data);
    }
    return data;
  } catch (error: any) {
    console.error('[Brevo SMS Error] Failed to send order confirmation SMS:', error?.message || error);
  }
}

