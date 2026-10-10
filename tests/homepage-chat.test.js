const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

test("homepage loads the shared chat widget instead of an inactive iframe toggle", () => {
  const root = path.join(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
  const chatScripts = scripts.filter((script) => script[1] === "/chat-widget.js");

  assert.equal(chatScripts.length, 1, "homepage must load exactly one chat widget");
  assert.match(chatScripts[0][0], /\bdefer\b/);
  assert.ok(fs.existsSync(path.join(root, "chat-widget.js")));
  assert.ok(fs.existsSync(path.join(root, "chat-widget.css")));
  assert.doesNotMatch(html, /id=["'](?:floating-chatbot|chatbot-toggle)["']/);
  assert.doesNotMatch(html, /<iframe\b[^>]*\bsrc=["'][^"']*\/embed\/chat/);
});
