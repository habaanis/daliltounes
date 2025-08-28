export async function handler(event, context) {
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
  };
}