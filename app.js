/* Keyboard-safe viewport height to avoid layout jumps */
(function setVh() {
  const set = () => {
    const vh = window.innerHeight + "px";
    document.documentElement.style.setProperty('--vh', vh);
  };
  set();
  window.addEventListener('resize', set);
  window.addEventListener('orientationchange', set);
})();

const rows = Array.from(document.querySelectorAll('.row'));
const NUM_DECIMALS = 2;

/* Restore saved values */
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

/* Compute logic */
function computeAll(){
  const results = [];

  rows.forEach(row => {
    const grams = parseFloat(row.querySelector('.g-input').value);
    const price = parseFloat(row.querySelector('.p-input').value);
    const out = row.querySelector('.resultValue');

    out.textContent = '';
    results.push({ row, valueRounded: Infinity, valid: false });

    if (isFinite(grams) && grams > 0 && isFinite(price) && price >= 0){
      const per100 = (price / grams) * 100;
      const rounded = Math.round(per100 * 100) / 100;
      out.textContent = `₱${rounded.toFixed(NUM_DECIMALS)}`;
      const slot = results[results.length - 1];
      slot.valueRounded = rounded;
      slot.valid = true;
    }
  });

  const validValues = results.filter(r => r.valid).map(r => r.valueRounded);
  const min = validValues.length ? Math.min(...validValues) : Infinity;

  rows.forEach(row => {
    const badge = row.querySelector('.badge');
    badge.textContent = '';
    badge.classList.remove('best', 'tie');
  });

  if (min !== Infinity){
    const winners = results.filter(r => r.valid && r.valueRounded === min);
    if (winners.length === 1){
      const badge = winners[0].row.querySelector('.badge');
      badge.textContent = 'Best Deal';
      badge.classList.add('best');
    } else if (winners.length > 1){
      winners.forEach(w => {
        const badge = w.row.querySelector('.badge');
        badge.textContent = 'Best Deal (tie)';
        badge.classList.add('tie');
      });
    }
  }

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

computeAll();

/* PWA registration */
if ('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}

/* Clear button functionality */
const clearBtn = document.getElementById('clearBtn');
if (clearBtn){
  clearBtn.addEventListener('click', () => {
    rows.forEach(row => {
      row.querySelector('.g-input').value = '';
      row.querySelector('.p-input').value = '';
      row.querySelector('.resultValue').textContent = '';
      const badge = row.querySelector('.badge');
      badge.textContent = '';
      badge.classList.remove('best', 'tie');
    });
    localStorage.removeItem('bvf_pp100g_v1');
  });
}
