# Stripe Activation Checklist

**Status:** Stripe integration is dormant. No purchase buttons appear on the site until activated.

To activate Stripe checkout for video purchases, complete the following steps:

## 1. Get Stripe API Keys

- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Navigate to **Developers** → **API keys**
- Copy your **Secret key** (starts with `sk_test_` for testing, `sk_live_` for production)
- Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)

## 2. Set Environment Variables

Add both keys to two places:

### .env.local (for local development)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_PURCHASES_ENABLED=true
```

### Vercel Project Settings
In the Vercel dashboard for What-Men-Carry:
- Go to **Settings** → **Environment Variables**
- Add three variables (choose **Production** environment):
  - `STRIPE_SECRET_KEY` = your secret key
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your publishable key
  - `NEXT_PUBLIC_PURCHASES_ENABLED` = `true`

## 3. Verify Video Price

Check that video prices match your Stripe setup:
- Current code uses `$2.00` per video
- Verify this matches your Stripe product pricing
- If you need a different price, update in `components/VideoCard.tsx` line 18

## 4. Test the Checkout Flow (Test Mode)

Before deploying with live keys:

1. Keep `STRIPE_SECRET_KEY` as `sk_test_...` (test mode)
2. Deploy to Vercel (push to main)
3. Test a full purchase using [Stripe test card numbers](https://stripe.com/docs/testing):
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
4. Verify the buyer receives the video file or download link
5. Check your Stripe dashboard for the transaction

## 5. Switch to Live Mode (if ready)

Once testing is complete:

1. Replace `STRIPE_SECRET_KEY` with your live key (`sk_live_...`)
2. Replace `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with your live key (`pk_live_...`)
3. Update both `.env.local` and Vercel environment variables
4. Redeploy to production

## Important Notes

- **No code changes required** — activation uses environment variables only
- Purchase buttons **only appear** when `NEXT_PUBLIC_PURCHASES_ENABLED=true`
- Test mode is safe and doesn't charge real cards
- Keep your secret key confidential — never commit it to git (it's in `.gitignore`)
- Homepage shows video cards with quotes but **no purchase buttons** until activated

## Troubleshooting

If checkout fails after activation:

1. Verify the API keys are correct in Vercel (log into Vercel and check Environment Variables)
2. Check Stripe dashboard for API key scopes and restrictions
3. Ensure `NEXT_PUBLIC_PURCHASES_ENABLED` is exactly `"true"` (string, not boolean)
4. Review server logs in Vercel **Deployments** → **Runtime Logs**

## Rollback

To deactivate purchases temporarily:

- Set `NEXT_PUBLIC_PURCHASES_ENABLED=false` in Vercel environment variables
- Redeploy (or the next deployment will pick it up)
- Purchase buttons disappear immediately (no code changes needed)
