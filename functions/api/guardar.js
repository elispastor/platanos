import { MongoClient } from "mongodb";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const datos = await request.json();

    const client = new MongoClient(env.MONGODB_URI);
    await client.connect();
    
    const db = client.db("platanos_db");
    const coleccion = db.collection("tickets");

    await coleccion.updateOne(
      { celular: datos.celular },
      { 
        $set: { nombre: datos.nombre, ultimaCompra: new Date() },
        $inc: { tickets: 1 }
      },
      { upsert: true }
    );

    await client.close();

    return new Response(JSON.stringify({ ok: true, mensaje: "Guardado en Mongo" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
