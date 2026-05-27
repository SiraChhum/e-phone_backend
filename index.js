import https from "https";
import fs from "fs";
import app from "./src/app.js";
import { server } from "./src/config/index.js";

// const PORT = server.port || 443;

const PORT = 4000;

if (process.env.NODE_ENV === "development") {
  const httpsOptions = {
    key: fs.readFileSync("./cert/server.key"),
    cert: fs.readFileSync("./cert/server.cert"),
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log("Server is running on port 3000");
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
