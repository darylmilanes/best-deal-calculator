<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Best Deal Calculator</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#006666" />

  <link rel="manifest" href="manifest.webmanifest" />
  <link rel="apple-touch-icon" sizes="192x192" href="icon-192.png">
  <link rel="apple-touch-icon" sizes="512x512" href="icon-512.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Best Deal Calculator">

  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="app-shell" id="appShell">
    <header class="app-header">
      <h1>Best Deal Calculator</h1>
      <p class="sub">Calculates ₱ per 100g automatically</p>
    </header>

    <section class="table">
      <div class="table-head">
        <div>Net weight (grams)</div>
        <div>Price (₱)</div>
        <div>₱ / 100g</div>
      </div>

      <!-- Five fixed rows -->
      <div class="row" data-row="1">
        <div class="cell">
          <input type="number" inputmode="decimal" min="0" step="any" class="g-input" aria-label="Item 1 net weight in grams">
        </div>
        <div class="cell price">
          <span class="peso">₱</span>
          <input type="number" inputmode="decimal" min="0" step="any" class="p-input" aria-label="Item 1 price in pesos">
        </div>
        <div class="cell result">
          <div class="resultBox">
            <span class="resultValue" aria-live="polite"></span>
            <span class="badge" aria-hidden="true"></span>
          </div>
        </div>
      </div>

      <div class="row" data-row="2">
        <div class="cell">
          <input type="number" inputmode="decimal" min="0" step="any" class="g-input" aria-label="Item 2 net weight in grams">
        </div>
        <div class="cell price">
          <span class="peso">₱</span>
          <input type="number" inputmode="decimal" min="0" step="any" class="p-input" aria-label="Item 2 price in pesos">
        </div>
        <div class="cell result">
          <div class="resultBox">
            <span class="resultValue" aria-live="polite"></span>
            <span class="badge" aria-hidden="true"></span>
          </div>
        </div>
      </div>

      <div class="row" data-row="3">
        <div class="cell">
          <input type="number" inputmode="decimal" min="0" step="any" class="g-input" aria-label="Item 3 net weight in grams">
        </div>
        <div class="cell price">
          <span class="peso">₱</span>
          <input type="number" inputmode="decimal" min="0" step="any" class="p-input" aria-label="Item 3 price in pesos">
        </div>
        <div class="cell result">
          <div class="resultBox">
            <span class="resultValue" aria-live="polite"></span>
            <span class="badge" aria-hidden="true"></span>
          </div>
        </div>
      </div>

      <div class="row" data-row="4">
        <div class="cell">
          <input type="number" inputmode="decimal" min="0" step="any" class="g-input" aria-label="Item 4 net weight in grams">
        </div>
        <div class="cell price">
          <span class="peso">₱</span>
          <input type="number" inputmode="decimal" min="0" step="any" class="p-input" aria-label="Item 4 price in pesos">
        </div>
        <div class="cell result">
          <div class="resultBox">
            <span class="resultValue" aria-live="polite"></span>
            <span class="badge" aria-hidden="true"></span>
          </div>
        </div>
      </div>

      <div class="row" data-row="5">
        <div class="cell">
          <input type="number" inputmode="decimal" min="0" step="any" class="g-input" aria-label="Item 5 net weight in grams">
        </div>
        <div class="cell price">
          <span class="peso">₱</span>
          <input type="number" inputmode="decimal" min="0" step="any" class="p-input" aria-label="Item 5 price in pesos">
        </div>
        <div class="cell result">
          <div class="resultBox">
            <span class="resultValue" aria-live="polite"></span>
            <span class="badge" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </section>

    <div class="clear-wrap">
      <button id="clearBtn" type="button">Clear All</button>
    </div>

    <footer class="note">
      Use <strong>net weight</strong> in grams. Lowest ₱/100g gets “Best Deal”.
    </footer>
  </main>

  <script src="app.js"></script>
</body>
</html>
