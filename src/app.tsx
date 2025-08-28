import { useEffect, useState } from "react"

function App() {
  const [etablissements, setEtablissements] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/.netlify/functions/get-etablissements")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API : " + res.status)
        return res.json()
      })
      .then((data) => setEtablissements(data))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>Liste des établissements</h1>
      {error && <p style={{ color: "red" }}>❌ {error}</p>}
      <ul>
        {etablissements.map((e) => (
          <li key={e.id}>{e.nom}</li>
        ))}
      </ul>
    </div>
  )
}

export default App

