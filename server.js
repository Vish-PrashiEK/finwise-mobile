const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;

function getWifiOrLanIp() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(nets)) {
    const isVirtual = name.toLowerCase().includes('vethernet') || name.toLowerCase().includes('virtual') || name.toLowerCase().includes('switch');
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (!isVirtual && !net.address.startsWith('172.18.')) {
          return net.address; // Best match: Wi-Fi or physical LAN
        }
        candidates.push(net.address);
      }
    }
  }
  return candidates[0] || 'localhost';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

const mobileIp = getWifiOrLanIp();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=============================================================`);
  console.log(`📱 FINWISE MOBILE APP - FAST ENTRY RUNNING!`);
  console.log(`=============================================================`);
  console.log(`📲 APNE MOBILE PHONE PAR YEH LINK KHOLEN:`);
  console.log(`   👉 http://${mobileIp}:${PORT}`);
  console.log(`-------------------------------------------------------------`);
  console.log(`💻 PC Browser me dekhne ke liye:`);
  console.log(`   👉 http://localhost:${PORT}`);
  console.log(`=============================================================\n`);
});
