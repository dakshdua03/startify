// GET /api/firebase-config — public Firebase web config for admin.html
// Values come ONLY from Cloudflare Pages environment variables
// (VITE_FIREBASE_* — the same variables the main site uses), so no API
// keys are hardcoded anywhere in the repo. Firebase web keys are
// public-by-design (Firestore rules enforce access); centralizing them
// here keeps rotation to one place (Pages > Settings > Variables).
export async function onRequestGet(context) {
  const env = (context && context.env) || {};
  const config = {
    apiKey: env.VITE_FIREBASE_API_KEY || "",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: env.VITE_FIREBASE_APP_ID || "",
  };
  const missing = Object.entries(config)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  return new Response(JSON.stringify({ config, missing }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
