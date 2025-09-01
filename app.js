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

document.addEventListener('DOMContentLoaded', function() {
  computeAll();
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

  updateResults(results);

  persist();
}

function updateResults(results) {
  // Find best value
  let min = Infinity;
  let minIndexes = [];
  results.forEach((res, i) => {
    if (res.valid && res.valueRounded < min) {
      min = res.valueRounded;
      minIndexes = [i];
    } else if (res.valid && res.valueRounded === min) {
      minIndexes.push(i);
    }
  });

  // Update UI
  rows.forEach((row, i) => {
    row.classList.remove('best', 'tie');
    const resultBox = row.querySelector('.resultBox');
    const badge = row.querySelector('.badge');
    if (results[i].valid) {
      row.querySelector('.resultValue').textContent = `₱${results[i].valueRounded.toFixed(NUM_DECIMALS)}`;
      if (minIndexes.includes(i)) {
        if (minIndexes.length > 1) {
          row.classList.add('tie');
        } else {
          row.classList.add('best');
        }
      }
    } else {
      row.querySelector('.resultValue').textContent = '';
    }
    if (badge) badge.textContent = '';
    if (resultBox) resultBox.classList.remove('best', 'tie');
  });
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
