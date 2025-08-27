import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@12.0.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY') ?? '',
      {
        apiVersion: '2022-11-15',
        httpClient: Stripe.createFetchHttpClient(),
      }
    )

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    )

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        
        // Update payment status
        await supabaseClient
          .from('payments')
          .update({ status: 'completed' })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        // Create or update subscription
        const { plan_id, user_email } = paymentIntent.metadata
        
        // Calculate expiry date based on plan
        const now = new Date()
        let expiresAt = new Date(now)
        
        // You would need to fetch plan details to determine duration
        // For now, defaulting to 1 month
        expiresAt.setMonth(now.getMonth() + 1)

        await supabaseClient
          .from('subscriptions')
          .insert({
            user_email,
            plan_id,
            plan_name: 'Subscription Plan',
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            status: 'active',
            stripe_customer_id: paymentIntent.customer,
            expires_at: expiresAt.toISOString(),
          })

        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        
        await supabaseClient
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', failedPayment.id)

        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})