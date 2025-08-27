import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// Utilisez cette apiKey pour initialiser la carte

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string;
          user_email: string;
          plan_id: string;
          plan_name: string;
          amount: number;
          currency: string;
          status: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string;
          dotripe_customer_id?: string;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          user_email: string;
          plan_id: string;
          plan_name: string;
          amount: number;
          currency?: string;
          status?: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          created_at?: string;
          expires_at: string;
        };
        Update: {
          id?: string;
          user_email?: string;
          plan_id?: string;
          plan_name?: string;
          amount?: number;
          currency?: string;
          status?: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          created_at?: string;
          expires_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_email: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed';
          stripe_payment_intent_id: string;
          plan_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_email: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed';
          stripe_payment_intent_id: string;
          plan_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_email?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed';
          stripe_payment_intent_id?: string;
          plan_id?: string;
          created_at?: string;
        };
      };
    };
  };
};