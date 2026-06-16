const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

let workerPromise;

async function loadWorker() {
  if (!workerPromise) {
    const workerPath = path.join(__dirname, "..", "worker.js");
    const source = fs
      .readFileSync(workerPath, "utf8")
      .replace("export default {", "const exportedWorker = {")
      .concat("\nexport default exportedWorker;\n");
    const encoded = Buffer.from(source).toString("base64");
    workerPromise = import(`data:text/javascript;base64,${encoded}`);
  }
  const module = await workerPromise;
  return module.default;
}

function chatRequest(message, ip = "203.0.113.10") {
  return new Request("https://www.zokforce.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Connecting-IP": ip,
    },
    body: JSON.stringify({ message, conversationHistory: [] }),
  });
}

async function withMockFetch(handler, run) {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (request) => {
    calls.push({
      url: request.url,
      authorization: request.headers.get("Authorization"),
      body: await request.clone().json(),
    });
    return handler(request);
  };

  try {
    return await run(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("user sends chat while proxy is configured without key -> worker fails closed", async () => {
  const worker = await loadWorker();
  let directFetchCalled = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    directFetchCalled = true;
    throw new Error("direct provider fetch must not be called");
  };

  try {
    const response = await worker.fetch(chatRequest("hello", "203.0.113.11"), {
      ZOKLENS_PROXY_BASE_URL: "https://zoklens-api-staging.zokforce.com/v1",
      ZOKLENS_PROXY_REQUIRED: "true",
      DEEPSEEK_API_KEY: "provider-secret",
    });
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.equal(body.success, false);
    assert.match(body.error, /assistant is temporarily unavailable/i);
    assert.equal(directFetchCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("worker config does not bind the legacy ZokLens proxy Worker", () => {
  const repoRoot = path.join(__dirname, "..");
  const wranglerToml = fs.readFileSync(path.join(repoRoot, "wrangler.toml"), "utf8");
  const wranglerJsonc = fs.readFileSync(path.join(repoRoot, "wrangler.jsonc"), "utf8");

  assert.equal(wranglerToml.includes("ZOKLENS_PROXY_SERVICE"), false);
  assert.equal(wranglerToml.includes("zoklens-api-staging-proxy"), false);
  assert.equal(wranglerJsonc.includes("ZOKLENS_PROXY_SERVICE"), false);
  assert.equal(wranglerJsonc.includes("zoklens-api-staging-proxy"), false);
});

test("user sends chat in BYOK proxy mode -> public fetch receives combined auth and trace id returns", async () => {
  const worker = await loadWorker();
  const env = {
    ZOKLENS_PROXY_BASE_URL: "https://zoklens-api-staging.zokforce.com/v1/",
    ZOKLENS_PROXY_API_KEY: "zok_test_proxy",
    ZOKLENS_PROXY_PROVIDER_API_KEY: "provider-secret",
    ZOKLENS_PROXY_REQUIRED: "true",
    ZOKLENS_PROXY_BYOK_REQUIRED: "true",
    BYOK_LLM_MODEL: "deepseek-v4-flash",
  };

  await withMockFetch(
    async () => new Response(
      JSON.stringify({
        choices: [{ message: { content: "pong" } }],
        usage: { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15 },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-ZOK-Trace-ID": "trace-proxy-123",
        },
      },
    ),
    async (fetchCalls) => {
      const response = await worker.fetch(chatRequest("Reply with pong", "203.0.113.12"), env);
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.success, true);
      assert.equal(body.answer, "pong");
      assert.equal(body.zoklens_proxy_mode, "proxy");
      assert.equal(body.zoklens_proxy_transport, "public-fetch");
      assert.equal(body.zoklens_proxy_auth_mode, "byok");
      assert.equal(body.zoklens_trace_id, "trace-proxy-123");
      assert.equal(response.headers.get("X-ZOK-Trace-ID"), "trace-proxy-123");
      assert.equal(fetchCalls.length, 1);
      assert.equal(fetchCalls[0].url, "https://zoklens-api-staging.zokforce.com/v1/chat/completions");
      assert.equal(fetchCalls[0].authorization, "Bearer zok_test_proxy:provider-secret");
      assert.equal(fetchCalls[0].body.model, "deepseek-v4-flash");
    },
  );
});

test("user sends chat in managed proxy mode -> provider secret is not required", async () => {
  const worker = await loadWorker();
  const env = {
    ZOKLENS_PROXY_BASE_URL: "https://zoklens-api-staging.zokforce.com/v1/",
    ZOKLENS_PROXY_API_KEY: "zok_test_proxy",
    ZOKLENS_PROXY_REQUIRED: "true",
    ZOKLENS_PROXY_BYOK_REQUIRED: "false",
    LLM_MODEL: "deepseek-v4-flash",
  };

  await withMockFetch(
    async () => new Response(
      JSON.stringify({
        choices: [{ message: { content: "pong" } }],
        usage: { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15 },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-ZOK-Trace-ID": "trace-managed-123",
        },
      },
    ),
    async (fetchCalls) => {
      const response = await worker.fetch(chatRequest("Reply with pong", "203.0.113.17"), env);
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.success, true);
      assert.equal(body.answer, "pong");
      assert.equal(body.zoklens_proxy_mode, "proxy");
      assert.equal(body.zoklens_proxy_transport, "public-fetch");
      assert.equal(body.zoklens_proxy_auth_mode, "managed");
      assert.equal(body.zoklens_trace_id, "trace-managed-123");
      assert.equal(response.headers.get("X-ZOK-Trace-ID"), "trace-managed-123");
      assert.equal(fetchCalls.length, 1);
      assert.equal(fetchCalls[0].url, "https://zoklens-api-staging.zokforce.com/v1/chat/completions");
      assert.equal(fetchCalls[0].authorization, "Bearer zok_test_proxy");
      assert.equal(fetchCalls[0].body.model, "zoklens-default");
    },
  );
});

test("user sends chat while BYOK is required without provider secret -> fetch is not called", async () => {
  const worker = await loadWorker();
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    fetchCalled = true;
    throw new Error("fetch must not be called");
  };

  try {
    const response = await worker.fetch(
      chatRequest("hello", "203.0.113.13"),
      {
        ZOKLENS_PROXY_BASE_URL: "https://zoklens-api-staging.zokforce.com/v1",
        ZOKLENS_PROXY_API_KEY: "zok_test_proxy",
        ZOKLENS_PROXY_REQUIRED: "true",
        ZOKLENS_PROXY_BYOK_REQUIRED: "true",
      },
    );
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.equal(body.success, false);
    assert.match(body.error, /assistant is temporarily unavailable/i);
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("legacy direct provider key does not satisfy explicit BYOK proxy mode", async () => {
  const worker = await loadWorker();
  let fetchCalled = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    fetchCalled = true;
    throw new Error("fetch must not be called");
  };

  try {
    const response = await worker.fetch(
      chatRequest("hello", "203.0.113.15"),
      {
        ZOKLENS_PROXY_BASE_URL: "https://zoklens-api-staging.zokforce.com/v1",
        ZOKLENS_PROXY_API_KEY: "zok_test_proxy",
        ZOKLENS_PROXY_REQUIRED: "true",
        ZOKLENS_PROXY_BYOK_REQUIRED: "true",
        DEEPSEEK_API_KEY: "legacy-provider-secret",
      },
    );
    const body = await response.json();
    const serialized = JSON.stringify(body);

    assert.equal(response.status, 503);
    assert.equal(body.success, false);
    assert.match(body.error, /assistant is temporarily unavailable/i);
    assert.equal(fetchCalled, false);
    assert.equal(serialized.includes("legacy-provider-secret"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("proxy success without trace id fails closed for observability verification", async () => {
  const worker = await loadWorker();
  await withMockFetch(
    async () => new Response(
      JSON.stringify({ choices: [{ message: { content: "pong" } }] }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
    async () => {
      const response = await worker.fetch(
        chatRequest("hello", "203.0.113.16"),
        {
          ZOKLENS_PROXY_BASE_URL: "https://zoklens-api-staging.zokforce.com/v1",
          ZOKLENS_PROXY_API_KEY: "zok_test_proxy",
          ZOKLENS_PROXY_PROVIDER_API_KEY: "provider-secret",
          ZOKLENS_PROXY_REQUIRED: "true",
          ZOKLENS_PROXY_BYOK_REQUIRED: "true",
        },
      );
      const body = await response.json();
      const serialized = JSON.stringify(body);

      assert.equal(response.status, 502);
      assert.equal(body.success, false);
      assert.equal(body.zoklens_proxy_mode, "proxy");
      assert.equal(body.zoklens_proxy_missing_trace_id, true);
      assert.equal(response.headers.get("X-ZOK-Proxy-Missing-Trace-ID"), "true");
      assert.equal(serialized.includes("zok_test_proxy"), false);
      assert.equal(serialized.includes("provider-secret"), false);
    },
  );
});

test("proxy upstream failure exposes non-secret diagnostics", async () => {
  const worker = await loadWorker();
  await withMockFetch(
    async () => new Response(
      JSON.stringify({
        error: {
          type: "invalid_request_error",
          code: "bad_model",
          message: "model is invalid",
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    ),
    async () => {
      const response = await worker.fetch(
        chatRequest("hello", "203.0.113.14"),
        {
          ZOKLENS_PROXY_BASE_URL: "https://zoklens-api-staging.zokforce.com/v1",
          ZOKLENS_PROXY_API_KEY: "zok_test_proxy",
          ZOKLENS_PROXY_PROVIDER_API_KEY: "provider-secret",
          ZOKLENS_PROXY_REQUIRED: "true",
          ZOKLENS_PROXY_BYOK_REQUIRED: "true",
        },
      );
      const body = await response.json();
      const serialized = JSON.stringify(body);

      assert.equal(response.status, 502);
      assert.equal(body.success, false);
      assert.equal(body.zoklens_proxy_mode, "proxy");
      assert.equal(body.zoklens_proxy_transport, "public-fetch");
      assert.equal(body.zoklens_proxy_auth_mode, "byok");
      assert.equal(body.zoklens_proxy_upstream_status, 400);
      assert.equal(body.zoklens_proxy_upstream_error.code, "bad_model");
      assert.equal(response.headers.get("X-ZOK-Proxy-Upstream-Status"), "400");
      assert.equal(serialized.includes("zok_test_proxy"), false);
      assert.equal(serialized.includes("provider-secret"), false);
    },
  );
});
