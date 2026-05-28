import https from "https";
import fs from "fs";
import app from "./src/app.js";
import { server } from "./src/config/index.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : server.port || 4000;

// Start server only when not running on Vercel (Vercel expects the exported app)
if (!process.env.VERCEL) {
  if (process.env.NODE_ENV === "development") {
    // Development mode: use self‑signed HTTPS certificate.
    const httpsOptions = {
      key: fs.readFileSync("./cert/server.key"),
      cert: fs.readFileSync("./cert/server.cert"),
    };
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`HTTPS Server running on https://localhost:${PORT}`);
    });
  } else {
    // Production (non‑Vercel) mode: start plain HTTP server.
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

// Export the Express app for Vercel or other consumers.
export default app;
