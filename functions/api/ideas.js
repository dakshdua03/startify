// GET /api/ideas - list ideas, POST /api/ideas - create idea
export async function onRequestGet() {
  return new Response(JSON.stringify({ ideas: [], note: "Connect Supabase for real DB" }), {
    headers: { "Content-Type": "application/json" }
  });
}
export async function onRequestPost(context) {
  const body = await context.request.json();
  return new Response(JSON.stringify({ success: true, idea: body }), {
    headers: { "Content-Type": "application/json" }
  });
}