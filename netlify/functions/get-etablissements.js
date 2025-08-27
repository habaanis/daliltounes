const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Variables d\'environnement Supabase manquantes.' }),
        };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from('etablissements').select('*');

    if (error) {
      console.error('Erreur de requête Supabase :', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erreur de la base de données.' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };

  } catch (err) {
    console.error('Erreur du serveur interne :', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur du serveur interne' }),
    };
  }
};