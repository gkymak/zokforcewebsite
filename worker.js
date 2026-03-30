// Cloudflare Worker for ZOKFORCE Contact Form API
// This worker handles contact form submissions and can integrate with email services

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);

    // Normalize path: collapse multiple spaces to a single space (including percent-encoded spaces)
    try {
      const decodedPath = decodeURIComponent(url.pathname);
      const normalizedDecoded = decodedPath.replace(/\s{2,}/g, ' ');
      if (normalizedDecoded !== decodedPath) {
        const normalizedUrl = new URL(url);
        normalizedUrl.pathname = normalizedDecoded
          .split('/')
          .map(segment => encodeURIComponent(segment))
          .join('/');
        return Response.redirect(normalizedUrl.toString(), 301);
      }
    } catch (e) {
      console.warn('Path decode failed, skipping normalization:', e);
    }

    // Handle contact form submission
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContactForm(request, env);
    }

    // Handle AI Assessment PDF email submission
    if (url.pathname === '/send-assessment-report' && request.method === 'POST') {
      return handleAssessmentReport(request, env);
    }

    // Handle static file serving (fallback to default behavior)
    try {
      return env.ASSETS.fetch(request);
    } catch (err) {
      console.error('Static asset fetch error:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

// Handle contact form submissions
async function handleContactForm(request, env) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    const { name, email, message, company, service } = formData;
    
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: name, email, and message are required.' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format.' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Format the message for Dify API
    let formattedMessage = `Full Name: ${name}, Email: ${email}`;
    if (company && company.trim()) {
      formattedMessage += `, Company: ${company}`;
    }
    if (service && service.trim()) {
      const serviceLabels = {
        'ai-strategy': 'AI Strategy & Consulting',
        'llm-integration': 'LLM Integration',
        'chatbots': 'Smart Chatbots & Digital Humans',
        'automation': 'Process Automation',
        'analytics': 'Data Analytics & Insights',
        'digital-twin': 'Digital Twin Solutions'
      };
      formattedMessage += `, Service Interest: ${serviceLabels[service] || service}`;
    }
    formattedMessage += `, Message: ${message}`;

    // Send to Dify API via worker (avoiding CORS issues)
    const difyResponse = await sendToDifyAPI(formattedMessage, env);
    
    // Optional: Store in KV storage for backup
    if (env.CONTACT_FORMS) {
      const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const contactData = {
        timestamp: new Date().toISOString(),
        name,
        email,
        company: company || 'Not provided',
        service: service || 'Not specified',
        message,
        source: 'Website Contact Form',
        difyResponse: difyResponse
      };
      await env.CONTACT_FORMS.put(contactId, JSON.stringify(contactData));
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! Your inquiry has been sent to our AI assistant.',
        difyResponse: difyResponse,
        id: `contact_${Date.now()}`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Sorry, there was an error sending your message. Please try again or use the chat widget.' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Handle AI Assessment PDF email submissions
async function handleAssessmentReport(request, env) {
  try {
    const requestData = await request.json();
    
    // Validate required fields - support both 'email' and 'to' for compatibility
    const { email, to, contactName, companyName, pdfData, subject, message } = requestData;
    const recipientEmail = email || to; // Support both field names
    
    if (!recipientEmail || !contactName || !companyName || !pdfData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: email, contactName, companyName, and pdfData are required.' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid email format.' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Send email with PDF attachment
    const emailResult = await sendAssessmentEmail({
      to: recipientEmail,
      contactName,
      companyName,
      pdfData,
      subject: subject || `AI Assessment Report - ${companyName}`,
      message: message || `Dear ${contactName},\n\nThank you for completing the ZOKFORCE AI Assessment. Please find your comprehensive report attached.\n\nIf you have any questions or would like to discuss the findings, please don't hesitate to contact us.\n\nBest regards,\nZOKFORCE Team`
    }, env);

    // If SMTP is not configured or email failed, return fallback details
    if (!emailResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: emailResult.error || 'Failed to send email',
          fallback: emailResult.fallback,
          mailtoUrl: emailResult.mailtoUrl
        }),
        {
          status: 200, // return 200 so frontend can handle fallback without throwing
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Optional: Store assessment submission in KV storage
    if (env.ASSESSMENT_REPORTS) {
      const reportId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const reportData = {
        timestamp: new Date().toISOString(),
        contactName,
        email: recipientEmail,
        companyName,
        source: 'AI Assessment Tool',
        emailSent: true,
        emailResult: emailResult
      };
      await env.ASSESSMENT_REPORTS.put(reportId, JSON.stringify(reportData));
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `AI Assessment report has been sent to ${recipientEmail}`,
        id: `assessment_${Date.now()}`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Assessment report email error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Sorry, there was an error sending the assessment report. Please try downloading the PDF instead.' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Send assessment email with PDF attachment using SMTP
async function sendAssessmentEmail(emailData, env) {
  try {
    const FROM_EMAIL = env.FROM_EMAIL || env.SMTP_USER;
    const FROM_NAME = env.FROM_NAME || 'ZOKFORCE AI Assessment';
    const filename = `AI-Assessment-Report-${emailData.companyName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

    // Prefer SendGrid when available (Cloudflare-native HTTP send, no SMTP relay needed)
    if (env.SENDGRID_API_KEY) {
      const htmlBody = `
        <h2>AI Assessment Report</h2>
        <p>Dear ${emailData.contactName},</p>
        <p>Thank you for completing the AI Assessment. Please find your detailed report attached.</p>
        <p><strong>Company:</strong> ${emailData.companyName}</p>
        <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p>If you have any questions about your assessment results, please don't hesitate to contact us.</p>
        <p>Best regards,<br>ZokForce Team</p>
      `;

      const textBody = `AI Assessment Report\n\nDear ${emailData.contactName},\n\nThank you for completing the AI Assessment. Please find your detailed report attached.\n\nCompany: ${emailData.companyName}\nAssessment Date: ${new Date().toLocaleDateString()}\n\nIf you have any questions about your assessment results, please don't hesitate to contact us.\n\nBest regards,\nZokForce Team`;

      const sgPayload = {
        personalizations: [
          { to: [{ email: emailData.to }] }
        ],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: emailData.subject,
        content: [
          { type: 'text/plain', value: textBody },
          { type: 'text/html', value: htmlBody }
        ],
        attachments: [
          {
            content: emailData.pdfData, // base64
            type: 'application/pdf',
            filename: filename,
            disposition: 'attachment'
          }
        ]
      };

      const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sgPayload)
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`SendGrid error: ${resp.status} ${errText}`);
      }

      return {
        success: true,
        method: 'sendgrid'
      };
    }

    // Fallback to external SMTP relay service when SendGrid is not configured
    if (!env.SMTP_RELAY_URL) {
      const mailtoLink = generateMailtoUrl(emailData, `AI Assessment Report - ${emailData.companyName}`);
      return {
        success: false,
        error: 'SMTP relay service not configured',
        fallback: 'mailto',
        mailtoUrl: mailtoLink
      };
    }

    // SMTP configuration for relay
    const SMTP_HOST = env.SMTP_HOST;
    const SMTP_PORT = env.SMTP_PORT || 587;
    const SMTP_USER = env.SMTP_USER;
    const SMTP_PASS = env.SMTP_PASS;
    const SMTP_SECURE = env.SMTP_SECURE === 'true';

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      const mailtoLink = generateMailtoUrl(emailData, `AI Assessment Report - ${emailData.companyName}`);
      return {
        success: false,
        error: 'Incomplete SMTP configuration',
        fallback: 'mailto',
        mailtoUrl: mailtoLink
      };
    }

    const messageData = {
      from: FROM_EMAIL,
      to: emailData.to,
      subject: emailData.subject,
      html: `
        <h2>AI Assessment Report</h2>
        <p>Dear ${emailData.contactName},</p>
        <p>Thank you for completing the AI Assessment. Please find your detailed report attached.</p>
        <p><strong>Company:</strong> ${emailData.companyName}</p>
        <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p>If you have any questions about your assessment results, please don't hesitate to contact us.</p>
        <p>Best regards,<br>ZokForce Team</p>
      `,
      text: `AI Assessment Report\n\nDear ${emailData.contactName},\n\nThank you for completing the AI Assessment. Please find your detailed report attached.\n\nCompany: ${emailData.companyName}\nAssessment Date: ${new Date().toLocaleDateString()}\n\nIf you have any questions about your assessment results, please don't hesitate to contact us.\n\nBest regards,\nZokForce Team`,
      attachments: [{
        filename: filename,
        content: emailData.pdfData,
        encoding: 'base64',
        contentType: 'application/pdf'
      }]
    };

    const response = await fetch(env.SMTP_RELAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': env.SMTP_RELAY_API_KEY ? `Bearer ${env.SMTP_RELAY_API_KEY}` : undefined
      },
      body: JSON.stringify({
        smtp: {
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_SECURE,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
          }
        },
        message: messageData
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'SMTP relay service error');
    }

    return {
      success: true,
      messageId: result.messageId,
      method: 'smtp'
    };

  } catch (error) {
    console.error('Email sending error:', error);
    const mailtoLink = generateMailtoUrl(emailData, `AI Assessment Report - ${emailData.companyName}`);
    return {
      success: false,
      error: error.message,
      fallback: 'mailto',
      mailtoUrl: mailtoLink
    };
  }
}

// Generate mailto URL as fallback
function generateMailtoUrl(emailData, subject) {
  const body = `Dear ZokForce Team,

Please find attached the AI Assessment Report for ${emailData.companyName}.

Company: ${emailData.companyName}
Contact: ${emailData.contactName}
Assessment Date: ${new Date().toLocaleDateString()}

Best regards,
${emailData.contactName}`;

  return `mailto:${emailData.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
async function sendToDifyAPI(message, env) {
  try {
    // Dify API configuration - use environment variables for security
    const DIFY_API_URL = env.DIFY_API_URL;
    const DIFY_API_KEY = env.DIFY_API_KEY;
    
    if (!DIFY_API_URL || !DIFY_API_KEY) {
      console.error('Dify API is not configured: missing DIFY_API_URL or DIFY_API_KEY');
      return {
        success: false,
        error: 'Dify API not configured',
        fallback: true,
        message: 'Your message has been received and will be processed manually.'
      };
    }
    
    console.log(`Attempting to connect to Dify API: ${DIFY_API_URL}`);
    
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'ZOKFORCE-ContactForm/1.0'
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'website-contact-form'
      })
    });

    console.log(`Dify API response status: ${response.status}`);
    console.log(`Dify API response headers:`, Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Dify API error response: ${errorText}`);
      throw new Error(`Dify API error: ${response.status} ${response.statusText}`);
    }

    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error(`Expected JSON but received: ${contentType}`);
      console.error(`Response body: ${responseText.substring(0, 500)}...`);
      throw new Error(`Invalid response format: expected JSON, got ${contentType}`);
    }

    const result = await response.json();
    console.log('Dify API response received successfully:', result);
    
    // Return structured response
    return {
      success: true,
      data: result,
      message: result.answer || 'Response received from AI assistant'
    };
    
  } catch (error) {
    console.error('Dify API error:', error);
    
    // Enhanced error logging
    if (error.message.includes('Unexpected token')) {
      console.error('Received HTML instead of JSON - likely tunnel routing issue');
    }
    
    // Return a fallback response instead of throwing
    return {
      success: false,
      error: error.message,
      fallback: true,
      message: 'Your message has been received and will be processed manually.'
    };
  }
}

// Optional: Send to external webhook (if configured)
async function sendToWebhook(formData, webhookUrl) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    console.log('Webhook sent successfully');
  } catch (error) {
    console.error('Webhook sending failed:', error);
  }
}

// Rate limiting helper (optional)
function isRateLimited(request, env) {
  // Implement rate limiting logic here if needed
  // You can use Cloudflare KV to store request counts
  return false;
}

// Security helper to validate origin (optional)
function isValidOrigin(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'https://www.zokforce.com',
    'https://zokforce.com',
    'http://localhost:9000', // For development
  ];
  
  return allowedOrigins.includes(origin);
}