import { serve } from 'https://deno.land/std@0.210.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// L'httpClient doit être importé séparément pour Stripe
import { createFetchHttpClient } from 'https://esm.sh/@stripe/stripe-js@2/dist/esm/api/net/FetchHttpClient.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'eur', plan_id, user_email } = await req.json();

    // Initialisation de Stripe
    // Assurez-vous d'utiliser une version récente de Stripe pour éviter les problèmes d'API
    const Stripe = (await import('https://esm.sh/stripe@14.2.0?target=deno&pin=v135')).default;

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      // Le client HTTP doit être instancié via l'import correct
      httpClient: createFetchHttpClient(),
    });

    // Création du Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        plan_id,
        user_email,
      },
    });

    // Initialisation du client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Enregistrement du paiement
    await supabaseClient
      .from('payments')
      .insert({
        user_email,
        amount,
        currency,
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
        plan_id,
      });

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});