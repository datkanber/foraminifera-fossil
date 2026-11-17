const API_ORIGIN = "https://foraminifera-fossil.onrender.com";

export async function onRequest({ request }) {
  const incoming = new URL(request.url);
  const target = new URL(`${API_ORIGIN}${incoming.pathname}${incoming.search}`);
  const headers = new Headers(request.headers);
  headers.delete("host");

  return fetch(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });
}
