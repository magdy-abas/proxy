// Vercel Proxy API
export default async function handler(req, res) {
  const { path = "" } = req.query;
  const targetUrl = `https://farida.stepsio.com/${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
    });


    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    //  CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,HEAD");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept, Authorization, sessid"
    );

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
