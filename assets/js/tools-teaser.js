/**
 * Rangga Portfolio / TKJ.OS — Tools Teaser Component
 * Interactive Mini CIDR Subnet Calculator
 */

export function initToolsTeaser() {
  const cidrSelect = document.getElementById('cidr-select');
  const resMask = document.getElementById('calc-res-mask');
  const resTotal = document.getElementById('calc-res-total');
  const resUsable = document.getElementById('calc-res-usable');
  const resWildcard = document.getElementById('calc-res-wildcard');

  if (!cidrSelect || !resMask || !resTotal || !resUsable || !resWildcard) {
    return;
  }

  // Populate CIDR dropdown if empty
  if (cidrSelect.options.length === 0) {
    const popularCIDRs = [
      { prefix: 24, label: "/24 (Class C Default — 254 Hosts)" },
      { prefix: 25, label: "/25 (Half Class C — 126 Hosts)" },
      { prefix: 26, label: "/26 (Quarter Class C — 62 Hosts)" },
      { prefix: 27, label: "/27 (Small Subnet — 30 Hosts)" },
      { prefix: 28, label: "/28 (Lab Pod — 14 Hosts)" },
      { prefix: 29, label: "/29 (Server Cluster — 6 Hosts)" },
      { prefix: 30, label: "/30 (Point-to-Point Link — 2 Hosts)" },
      { prefix: 16, label: "/16 (Class B Default — 65,534 Hosts)" },
      { prefix: 8,  label: "/8 (Class A Default — 16.7M Hosts)" }
    ];

    popularCIDRs.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.prefix;
      opt.textContent = item.label;
      if (item.prefix === 24) opt.selected = true;
      cidrSelect.appendChild(opt);
    });
  }

  function updateCalculations(prefix) {
    prefix = parseInt(prefix, 10);
    if (isNaN(prefix) || prefix < 0 || prefix > 32) return;

    // Calculate Subnet Mask
    const maskLong = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const maskOctets = [
      (maskLong >>> 24) & 255,
      (maskLong >>> 16) & 255,
      (maskLong >>> 8) & 255,
      maskLong & 255
    ];
    const maskStr = maskOctets.join('.');

    // Calculate Wildcard Mask
    const wildcardStr = maskOctets.map(oct => 255 - oct).join('.');

    // Calculate Total & Usable IPs
    const totalIPs = Math.pow(2, 32 - prefix);
    let usableHosts = 0;
    if (prefix === 32) {
      usableHosts = 1;
    } else if (prefix === 31) {
      usableHosts = 2; // RFC 3021 Point-to-Point
    } else {
      usableHosts = Math.max(0, totalIPs - 2);
    }

    // Render to DOM
    resMask.textContent = maskStr;
    resTotal.textContent = totalIPs.toLocaleString('id-ID');
    resUsable.textContent = usableHosts.toLocaleString('id-ID');
    resWildcard.textContent = wildcardStr;
  }

  cidrSelect.addEventListener('change', (e) => {
    updateCalculations(e.target.value);
  });

  // Initial calculation on load
  updateCalculations(cidrSelect.value || 24);
}
