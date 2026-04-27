# Dodo Payment Subscription Setup

This document explains how to configure Dodo payments for the subscription system in Prospo.

## Overview

The pricing page now integrates with Dodo for payment processing. Users can upgrade from the free plan to Pro, Enterprise, or Lifetime plans using Dodo's checkout system.

## Required Environment Variables

Add the following variables to your `.env.local` file:

```env
# Dodo API Configuration
DODO_API_KEY=gp7JNyP1r6f0vWjP.DgjPHGtpx_Rm0uziclWRXo51Hf0PqfIgrcRcRgFrjAZSlX4T
DODO_API_BASE_URL=https://api.dodopayments.com/v1
DODO_WEBHOOK_URL=https://prospo.com/api/dodo/webhook
DODO_WEBHOOK_SECRET=whsec_VJAVe6hQ/aFiYGPZ66bqzF+C/ys0PNAg

# Plan Pricing (in cents)
DODO_PRO_PRICE_CENTS=500
DODO_ENTERPRISE_PRICE_CENTS=1500
DODO_LIFETIME_PRICE_CENTS=10000

# Plan Product IDs (optional - use if you have Dodo product IDs)
DODO_PRO_PRODUCT_ID=
DODO_ENTERPRISE_PRODUCT_ID=
DODO_LIFETIME_PRODUCT_ID=

# Currency
DODO_CURRENCY=USD

# App Configuration
APP_BASE_URL=http://localhost:3000

# Testing/Bypass (set to "true" only for development/testing)
DODO_BYPASS_VERIFY=true
DODO_VERIFY_URL_TEMPLATE=
```

## How It Works

### 1. Pricing Page Flow
- User clicks "Choose Plan" on a paid plan (Pro, Enterprise, or Lifetime)
- The `handlePlanSelection` function is triggered
- A POST request is sent to `/api/dodo/create-checkout` with:
  - `userId`: Current user's Firebase UID
  - `userEmail`: Current user's email
  - `targetPlan`: The selected plan ID (pro, enterprise, or lifetime)
  - `currentPlan`: User's current plan

### 2. Checkout Creation (`/api/dodo/create-checkout`)
- Validates required fields
- Prevents downgrading plans
- Creates a Dodo checkout session
- Returns the `checkout_url` for redirect

### 3. Checkout Confirmation (`/api/dodo/confirm-checkout`)
- Verifies the checkout session with Dodo
- Confirms payment status
- Updates user's plan in Firestore

### 4. Webhook Handling (`/api/dodo/webhook`)
- Receives payment events from Dodo
- Verifies webhook signature for security
- Updates user's subscription plan on payment success
- Accepted events: `checkout.completed`, `payment.succeeded`, `invoice.paid`, `subscription.activated`, `subscription.updated`

## API Endpoints

### Create Checkout
**POST** `/api/dodo/create-checkout`

Request body:
```json
{
  "userId": "user_firebase_uid",
  "userEmail": "user@example.com",
  "targetPlan": "pro",
  "currentPlan": "free",
  "origin": "https://yourdomain.com"
}
```

Response:
```json
{
  "checkoutUrl": "https://checkout.dodo.com/...",
  "sessionId": "session_id",
  "targetPlan": "pro"
}
```

### Confirm Checkout
**POST** `/api/dodo/confirm-checkout`

Request body:
```json
{
  "sessionId": "dodo_session_id",
  "targetPlan": "pro"
}
```

Response:
```json
{
  "verified": true,
  "status": "paid",
  "targetPlan": "pro"
}
```

## Database Schema

User profiles in Firestore now include billing information:

```typescript
{
  uid: string,
  email: string,
  current_plan: 'free' | 'pro' | 'enterprise' | 'lifetime',
  billing: {
    lastUpdateSource: string,
    lastCheckoutId: string,
    updatedAt: string,
  },
  // ... other fields
}
```

## Features Implemented

- ✅ Pricing page with plan selection
- ✅ Dodo checkout integration
- ✅ Plan upgrade/downgrade handling
- ✅ Current plan highlighting on pricing page
- ✅ Loading states during checkout
- ✅ Error handling and user feedback
- ✅ Webhook signature verification
- ✅ Firestore plan updates
- ✅ "Active" badge for current plan
- ✅ Plan comparison display

## Testing

### Development Mode
Set `DODO_BYPASS_VERIFY=true` in `.env.local` to skip Dodo verification during development.

### Test Payment Flow
1. Navigate to `/account/pricing`
2. Select a paid plan
3. Confirm checkout creation
4. The browser should redirect to Dodo checkout URL

### Webhook Testing
You can test webhooks locally using:
- Dodo Dashboard webhook testing tools
- Services like ngrok to expose your local server

## Security Considerations

- ✅ API keys stored in environment variables
- ✅ Webhook signatures verified using HMAC-SHA256
- ✅ HTTP-only cookie for user authentication
- ✅ Server-side plan updates via Firebase Admin SDK
- ✅ User ID validation in all transactions
- ✅ Plan validation against allowed plans

## Troubleshooting

### "Missing DODO_API_KEY"
- Ensure `DODO_API_KEY` is set in `.env.local`
- Restart the development server after adding env vars

### "Target plan is already active"
- User is already on the selected plan
- Current plan is correctly tracked in Firestore

### Checkout URL not received
- Verify Dodo API credentials are correct
- Check API response in browser console network tab
- Ensure `DODO_API_BASE_URL` is correct

### Webhook not triggering
- Verify `DODO_WEBHOOK_URL` is accessible from internet
- Check webhook secret matches in Dodo dashboard
- Verify signing algorithm is SHA256

## Pricing Configuration

Update prices in your `.env.local`:

- **Pro**: `DODO_PRO_PRICE_CENTS=500` = $5.00
- **Enterprise**: `DODO_ENTERPRISE_PRICE_CENTS=1500` = $15.00
- **Lifetime**: `DODO_LIFETIME_PRICE_CENTS=10000` = $100.00

Prices are in cents (multiply dollar amount by 100).

## Next Steps

1. Set up Dodo account at https://dodopayments.com
2. Get API keys from Dodo dashboard
3. Add environment variables to `.env.local`
4. Configure webhook in Dodo dashboard
5. Test payment flow in development mode
6. Deploy to production with proper SSL/HTTPS

## Support

For Dodo API documentation, visit: https://docs.dodopayments.com
