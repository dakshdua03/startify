// Cloudflare Pages Function - POST /api/bookings
// Saves bookings to KV or returns success. Free tier: 100k req/day
// Commercial use allowed on free tier

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, idea, help, budget, service, email } = body;

    // Basic validation — accept both idea posts and auth registrations
    if (!name || (!idea && !email)) {
      return new Response(JSON.stringify({ error: "name and email/idea required" }), { status: 400 });
    }

    // If KV bound, save there (uncomment after creating KV)
    // if (context.env.BOOKINGS_KV) {
    //   const id = Date.now().toString();
    //   await context.env.BOOKINGS_KV.put(id, JSON.stringify({ ...body, at: new Date().toISOString() }));
    // }

    // For now, just log and return success - frontend saves to Firestore + localStorage
    // In future, insert to Firestore via Firebase Admin SDK here

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Booking received - Daksh will DM on WhatsApp",
      data: body,
      commercial: "Cloudflare Pages free tier allows commercial use - you can charge after Jan 2026"
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}

export async function onRequestGet(context) {
  // GET /api/bookings - list bookings (admin only - add auth check)
  return new Response(JSON.stringify({ 
    message: "Use POST to create booking. GET is admin only.",
    hint: "Firestore handles persistence via src/lib/firebase.js"
  }), { headers: { "Content-Type": "application/json" } });
}