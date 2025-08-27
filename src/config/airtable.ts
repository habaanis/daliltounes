// Configuration Airtable
export const airtableConfig = {
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || '',
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
  tableName: import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Establishments'
};

// Validation de la configuration Airtable
export const validateAirtableConfig = () => {
  const errors: string[] = [];
  
  if (!airtableConfig.apiKey) {
    errors.push('VITE_AIRTABLE_API_KEY manquante');
  }
  
  if (!airtableConfig.baseId) {
    errors.push('VITE_AIRTABLE_BASE_ID manquante');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration Airtable manquante:', errors);
    return false;
  }
  
  console.log('✅ Configuration Airtable OK');
  return true;
};