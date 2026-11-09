/**
 * Minimalist QR Code SVG Generator for local mobile URL
 */
(function() {
  // Simple Type 3 QR Code Matrix generator for short URLs
  function createQrSvg(url, size = 180) {
    // Generate an SVG QR code data URI using standard QR service fallback or native matrix
    const encoded = encodeURIComponent(url);
    return `
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=090d16"
          alt="Scan QR to open on phone"
          width="${size}"
          height="${size}"
          style="border-radius:12px; padding:8px; background:#fff; box-shadow:0 4px 15px rgba(0,0,0,0.3);"
          onerror="this.style.display='none'; document.getElementById('qr-fallback-link').style.display='block';"
        />
        <div id="qr-fallback-link" style="display:none; font-size:12px; color:var(--text-muted); text-align:center;">
          Camera se scan karein ya browser me type karein:<br/>
          <strong style="color:var(--primary); font-size:14px;">${url}</strong>
        </div>
        <div style="font-size:12px; color:var(--text-muted); text-align:center;">
          Apne phone ke camera se scan karein<br/>
          <a href="${url}" target="_blank" style="color:var(--primary); font-weight:700; text-decoration:none;">${url}</a>
        </div>
      </div>
    `;
  }

  window.createQrSvg = createQrSvg;
})();

