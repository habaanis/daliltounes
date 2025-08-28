🔹 1. netlify/functions/get-etablissements.js
export async function handler(event, context) {
  // Exemple de données simulées
  const etablissements = [
    { id: 1, nom: "Lycée Jean Jaurès" },
    { id: 2, nom: "Collège Victor Hugo" },
    { id: 3, nom: "École Primaire Jules Ferry" },
  ]

  return {
    statusCode: 200,
    body: JSON.stringify(etablissements),
    headers: {
      "Content-Type": "application/json",
    },
  }
}