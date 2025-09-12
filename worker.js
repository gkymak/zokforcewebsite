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
    
    // Handle contact form submission
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContactForm(request, env);
    }

    // Handle static file serving (fallback to default behavior)
    return env.ASSETS.fetch(request);
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

// Send message to Dify API
async function sendToDifyAPI(message, env) {
  try {
    // Dify API configuration - use environment variables for security
    const DIFY_API_URL = env.DIFY_API_URL || 'http://31172269os.zicp.vip:5301/v1/chat-messages';
    const DIFY_API_KEY = env.DIFY_API_KEY || 'app-ALXmHrqK7sbUx0C6AEdTARl5';
    
    const response = await fetch(DIFY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'website-contact-form'
      })
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Dify API response received successfully');
    return result;
    
  } catch (error) {
    console.error('Dify API error:', error);
    // Return a fallback response instead of throwing
    return {
      success: false,
      error: error.message,
      fallback: true
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