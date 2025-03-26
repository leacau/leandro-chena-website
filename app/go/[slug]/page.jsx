export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore"

export default async function RedirectPage({ params }) {
  const { slug } = params

  try {
    // Buscar la URL en Firestore
    const q = query(collection(db, "shortUrls"), where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      // Si no se encuentra, redirigir a la página principal
      return redirect("/")
    }

    // Obtener la URL larga
    const docData = querySnapshot.docs[0].data()
    const longUrl = docData.longUrl
    const docId = querySnapshot.docs[0].id

    // Incrementar el contador de clics
    await updateDoc(doc(db, "shortUrls", docId), {
      clicks: increment(1),
    })

    // Redirigir a la URL larga
    return redirect(longUrl)
  } catch (error) {
    console.error("Error al redirigir:", error)
    // En caso de error, redirigir a la página principal
    return redirect("/")
  }
}

