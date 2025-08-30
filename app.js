/* Keyboard-safe viewport height to avoid layout jumps */
(function setVh() {
  const set = () => {
    const vh = window.innerHeight + "px"; // stable even when mobile keyboard opens
    document.documentElement.style.setProperty('--vh', vh);
  };
  set();
  window.addEventListener('resize', set);
  window.addEventListener('orientationchange', set);
})();

/* Elements */
const rows = Array.from(document.querySelectorAll('.row'));
const NUM_DECIMALS = 2;

/* Restore saved values (optional convenience) */
(function restore(){
  try{
    const saved = JSON.parse(localStorage.getItem('bvf_pp100g_v1') || '[]');
    rows.forEach((row, idx) => {
      const g = row.querySelector('.g-input');
      const p = row.querySelector('.p-input');
      if(saved[idx]){
        if(saved[idx].g !== undefined) g.value = saved[idx].g;
        if(saved[idx].p !== undefined) p.value = saved[idx].p;
      }
    });
  }catch{}
})();

/* Attach handlers */
rows.forEach(row => {
  const g = row.querySelector('.g-input');
  const p = row.querySelector('.p-input');
  const onInput = () => computeAll();
  g.addEventListener('input', onInput, {passive:true});
  p.addEventListener('input', onInput, {passive:true});
});

/* Core compute */
function computeAll(){
  const results = []; // {row, valueRounded, valid}

  rows.forEach(row => {
    const grams = parseFloat(row.querySelector('.g-input').value);
    const price = parseFloat(row.querySelector('.p-input').value);
    const out = row.querySelector('.resultValue');

    // Reset display first
    out.textContent = '';
    results.push({ row, valueRounded: Infinity, valid: false });

    if (isFinite(grams) && grams > 0 && isFinite(price) && price >= 0){
      const per100 = (price / grams) * 100;
      const rounded = Math.round(per100 * 100) / 100; // 2 decimals
      out.textContent = `₱${rounded.toFixed(NUM_DECIMALS)}`;
      const slot = results[results.length - 1];
      slot.valueRounded = rounded;
      slot.valid = true;
    }
  });

  // Find min among valid
  const validValues = results.filter(r => r.valid).map(r => r.valueRounded);
  const min = validValues.length ? Math.min(...validValues) : Infinity;

  // Clear badges
  rows.forEach(row => {
    const badge = row.querySelector('.badge');
    badge.textContent = '';
    badge.classList.remove('best', 'tie');
  });

  if (min !== Infinity){
    // Determine ties by exact 2-decimal equality
    const winners = results.filter(r => r.valid && r.valueRounded === min);

    if (winners.length === 1){
      const badge = winners[0].row.querySelector('.badge');
      badge.textContent = 'Best value';
      badge.classList.add('best');
    } else if (winners.length > 1){
      winners.forEach(w => {
        const badge = w.row.querySelector('.badge');
        badge.textContent = 'Best value (tie)';
        badge.classList.add('tie');
      });
    }
  }

  // Save state
  persist();
}

function persist(){
  const data = rows.map(row => ({
    g: row.querySelector('.g-input').value || '',
    p: row.querySelector('.p-input').value || ''
  }));
  try{
    localStorage.setItem('bvf_pp100g_v1', JSON.stringify(data));
  }catch{}
}

/* Initial compute (for restored values) */
computeAll();

/* PWA registration */
if ('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}
