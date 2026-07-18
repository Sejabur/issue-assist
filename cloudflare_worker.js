export default {
  async fetch(request, env) {
    // These environment variables must be configured in your Cloudflare Worker Settings
    const JSONBIN_URL = env.JSONBIN_URL; // e.g. "https://api.jsonbin.io/v3/b/YOUR_BIN_ID"
    const MASTER_KEY = env.MASTER_KEY;   // e.g. "$2a$10$YOUR_SECRET_KEY"

    // Handle CORS Preflight (OPTIONS request)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // Change "*" to your URL for extra security (e.g. "https://issue-assist.io")
          "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Prepare headers for the JSONBin request
    const jsonbinHeaders = new Headers();
    jsonbinHeaders.set("X-Master-Key", MASTER_KEY);
    
    let fetchOptions = {
      method: request.method,
      headers: jsonbinHeaders,
    };

    // If it's a PUT request, pass along the body data and Content-Type
    if (request.method === "PUT") {
      jsonbinHeaders.set("Content-Type", "application/json");
      fetchOptions.body = await request.clone().text();
    }

    try {
      // Forward the request to JSONBin
      const response = await fetch(JSONBIN_URL, fetchOptions);
      const data = await response.text();

      // Return the JSONBin response back to the frontend with CORS headers
      return new Response(data, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Proxy Request Failed" }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }
  },
};
