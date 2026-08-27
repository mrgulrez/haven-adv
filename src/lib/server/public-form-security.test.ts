import { describe, expect, it } from "vitest";
import { escapeHtml, enforcePublicFormLimit, plainTextToHtml } from "./public-form-security";

describe("public form security", () => {
  it("escapes every HTML-significant character", () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')"> &`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt; &amp;",
    );
  });

  it("preserves line breaks only after escaping content", () => {
    expect(plainTextToHtml("hello\n<script>bad</script>")).toBe(
      "hello<br />&lt;script&gt;bad&lt;/script&gt;",
    );
  });

  it("rejects oversized bodies before parsing JSON", () => {
    const request = new Request("https://nuravya.com/api/contact", {
      method: "POST",
      headers: { "content-length": "20000", "x-forwarded-for": "192.0.2.1" },
    });
    expect(enforcePublicFormLimit(request, "contact")?.status).toBe(413);
  });
});
