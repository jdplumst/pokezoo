export function GET() {
  return new Response("blocked", { status: 429 });
}
