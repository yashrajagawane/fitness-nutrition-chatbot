const baseUrl = (process.env.DEPLOYMENT_URL || "http://localhost:3000").replace(/\/$/, "");
const endpoint = baseUrl + "/api/health";

try {
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
  const body = await response.json();
  const requestId = response.headers.get("x-request-id");

  if (response.status !== 200 || body.status !== "ok" || !requestId) {
    console.error(JSON.stringify({ endpoint, status: response.status, body, requestId }));
    process.exit(1);
  }

  console.log(JSON.stringify({
    endpoint,
    status: response.status,
    service: body.service,
    geminiConfigured: body.geminiConfigured,
    requestId,
  }));
} catch (error) {
  console.error("Health check failed for " + endpoint + ": " + (error instanceof Error ? error.message : error));
  process.exit(1);
}
