export async function POST(req) {
  try {
    const body = await req.json();
    // Print to server console so the dev terminal shows events
    // Keep logs concise
    console.log('[CLIENT LOG]', body);
  } catch (e) {
    console.log('[CLIENT LOG] invalid payload', e?.message || e);
  }
  return new Response(null, { status: 204 });
}
