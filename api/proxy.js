export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
 
  const secret = req.headers["x-proxy-secret"];
  if (!process.env.PROXY_SECRET || secret !== process.env.PROXY_SECRET) {
    return res.status(401).send("Unauthorized");
  }
 
  const { url, method, headers, data } = req.body;
  if (!url?.startsWith("https://discord.com/")) {
    return res.status(400).send("Invalid URL");
  }
 
  try {
    const r = await fetch(url, {
      method: method ?? "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    });
    const text = await r.text();
    res.status(r.status).setHeader("Content-Type", "application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
