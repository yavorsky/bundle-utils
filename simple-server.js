const http = require("http");
const parseUA = require("ua-parser-js");

const PORT = 4000;

const server = http.createServer((request, response) => {
  const parsed = parseUA(request.headers["user-agent"]).browser;
  browser = parsed.name;
  version = parsed.version;
  response.end(JSON.stringify(parsed));
});

server.listen(PORT, () => {
  console.log(`Server os listening on port: ${PORT}`);
});
