# ZOKFORCE Website - Cloudflare Worker Backend Deployment

This document explains how to deploy the ZOKFORCE website with the new Cloudflare Worker backend for handling contact form submissions.

## 🚀 Quick Start

### 1. Deploy to Cloudflare Workers

```bash
# Install Wrangler CLI (if not already installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

### 2. Configure Environment Variables

Set up the following secrets in your Cloudflare Worker:

```bash
# Required: Dify API integration
wrangler secret put DIFY_API_URL
# Enter: http://31172269os.zicp.vip:5301/v1/chat-messages (or your Dify API endpoint)

wrangler secret put DIFY_API_KEY
# Enter: app-ALXmHrqK7sbUx0C6AEdTARl5 (or your Dify API key)

# Optional: Webhook integration (e.g., Zapier, Make.com)
wrangler secret put WEBHOOK_URL
```

### 3. Set up KV Storage (Optional)

```bash
# Create KV namespace for storing contact form submissions
wrangler kv:namespace create "CONTACT_FORMS"
wrangler kv:namespace create "CONTACT_FORMS" --preview

# Update wrangler.jsonc with the returned namespace IDs
```

## 📧 Integration Options

### Option 1: Email Service Integration

**SendGrid Example:**
```bash
wrangler secret put EMAIL_SERVICE_URL
# Enter: https://api.sendgrid.v3/mail/send

wrangler secret put EMAIL_API_KEY
# Enter: your-sendgrid-api-key
```

**Mailgun Example:**
```bash
wrangler secret put EMAIL_SERVICE_URL
# Enter: https://api.mailgun.net/v3/your-domain/messages

wrangler secret put EMAIL_API_KEY
# Enter: your-mailgun-api-key
```

### Option 2: Webhook Integration

**Zapier Webhook:**
```bash
wrangler secret put WEBHOOK_URL
# Enter: https://hooks.zapier.com/hooks/catch/your-webhook-id
```

**Make.com Webhook:**
```bash
wrangler secret put WEBHOOK_URL
# Enter: https://hook.integromat.com/your-webhook-id
```

### Option 3: Slack Notifications

```bash
wrangler secret put SLACK_WEBHOOK_URL
# Enter: https://hooks.slack.com/services/your/slack/webhook
```

## 🔧 Configuration Details

### wrangler.jsonc Configuration

```json
{
  "name": "zokforcewebsite",
  "main": "worker.js",
  "compatibility_date": "2025-01-08",
  "assets": {
    "directory": "./"
  },
  "vars": {
    "ENVIRONMENT": "production"
  },
  "kv_namespaces": [
    {
      "binding": "CONTACT_FORMS",
      "id": "your-actual-kv-namespace-id",
      "preview_id": "your-preview-kv-namespace-id"
    }
  ],
  "secrets": [
    "EMAIL_SERVICE_URL",
    "EMAIL_API_KEY",
    "WEBHOOK_URL",
    "SLACK_WEBHOOK_URL"
  ]
}
```

### Custom Domain Setup

1. **Add Custom Domain in Cloudflare Dashboard:**
   - Go to Workers & Pages → Your Worker → Settings → Triggers
   - Add custom domain: `www.zokforce.com`

2. **Update DNS Records:**
   - Ensure your domain points to Cloudflare Workers
   - The worker will handle both static files and API endpoints

## 🛠️ Development & Testing

### Local Development

```bash
# Start local development server
wrangler dev

# Test the contact form API
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "company": "Test Company",
    "service": "ai-strategy"
  }'
```

### Testing Contact Form

1. **Open the website:** `http://localhost:8787` (or your deployed URL)
2. **Fill out the contact form** with test data
3. **Check the browser console** for API responses
4. **Verify integrations** (email, Slack, webhooks) are working

## 📊 Monitoring & Logs

### View Worker Logs

```bash
# Stream real-time logs
wrangler tail

# View logs in Cloudflare Dashboard
# Go to Workers & Pages → Your Worker → Logs
```

### KV Storage Management

```bash
# List stored contact forms
wrangler kv:key list --binding CONTACT_FORMS

# Get specific contact form
wrangler kv:key get "contact_id" --binding CONTACT_FORMS

# Delete old contact forms (optional cleanup)
wrangler kv:key delete "contact_id" --binding CONTACT_FORMS
```

## 🔒 Security Features

### Built-in Security

- **CORS Protection:** Configured for your domain
- **Input Validation:** Server-side validation of all form fields
- **Rate Limiting:** Can be implemented using KV storage
- **Origin Validation:** Optional origin checking

### Additional Security (Optional)

```javascript
// Add to worker.js for enhanced security
function isRateLimited(request, env) {
  // Implement rate limiting logic
  const clientIP = request.headers.get('CF-Connecting-IP');
  // Use KV to track request counts per IP
}

function isValidOrigin(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['https://www.zokforce.com', 'https://zokforce.com'];
  return allowedOrigins.includes(origin);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure the worker handles OPTIONS requests
   - Check Access-Control-Allow-Origin headers

2. **API Not Found (404):**
   - Verify `main: "worker.js"` in wrangler.jsonc
   - Check the API endpoint path: `/api/contact`

3. **Email Not Sending:**
   - Verify EMAIL_SERVICE_URL and EMAIL_API_KEY secrets
   - Check email service API documentation
   - Review worker logs for error messages

4. **Form Validation Errors:**
   - Ensure all required fields (name, email, message) are provided
   - Check email format validation

### Debug Commands

```bash
# Check worker configuration
wrangler whoami
wrangler kv:namespace list

# Test API endpoint directly
curl -X POST https://your-domain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

## 📈 Analytics & Monitoring

### Cloudflare Analytics

- **Worker Analytics:** Available in Cloudflare Dashboard
- **Request Metrics:** Monitor API usage and performance
- **Error Tracking:** Track failed requests and errors

### Custom Metrics (Optional)

```javascript
// Add to worker.js for custom analytics
const analytics = {
  contactFormSubmissions: 0,
  emailsSent: 0,
  errors: 0
};

// Track metrics in your functions
analytics.contactFormSubmissions++;
```

## 🔄 Backup & Recovery

### KV Storage Backup

```bash
# Export all contact forms
wrangler kv:key list --binding CONTACT_FORMS > contact_forms_backup.json

# Restore from backup (if needed)
# Use wrangler kv:key put for each entry
```

## 📞 Support

For deployment issues or questions:

1. **Check Cloudflare Workers Documentation:** https://developers.cloudflare.com/workers/
2. **Review Worker Logs:** `wrangler tail`
3. **Test API Endpoints:** Use curl or Postman
4. **Verify Configuration:** Check wrangler.jsonc and secrets

---

**Note:** After deployment, the contact form will use the new Cloudflare Worker backend instead of the external Dify API, resolving CORS issues and providing better reliability.