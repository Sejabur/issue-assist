export default {
  async fetch(request, env) {
    const JSONBIN_URL = env.JSONBIN_URL; 
    const MASTER_KEY = env.MASTER_KEY;   
    
    // SECURITY LAYER 1: Define your allowed domain
    const ALLOWED_ORIGIN = "https://issue-assist.sejabur.dev";
    
    // Get the origin of the person making the request
    const requestOrigin = request.headers.get("Origin");

    // SECURITY LAYER 2: Block requests that don't come from your website
    // (We allow requests with no origin just in case, but block wrong domains)
    if (requestOrigin && requestOrigin !== ALLOWED_ORIGIN) {
      return new Response(JSON.stringify({ error: "Forbidden: Unauthorized Origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Handle CORS Preflight (OPTIONS request)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN, 
          "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const jsonbinHeaders = new Headers();
    jsonbinHeaders.set("X-Master-Key", MASTER_KEY);
    
    let fetchOptions = {
      method: request.method,
      headers: jsonbinHeaders,
    };

    if (request.method === "PUT") {
      jsonbinHeaders.set("Content-Type", "application/json");
      fetchOptions.body = await request.clone().text();
    }

    try {
      const response = await fetch(JSONBIN_URL, fetchOptions);
      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN, // Lock responses to your domain
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Proxy Request Failed" }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
      });
    }
  },
};