
// word pools
const loremPool = (`lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`).split(' ');
const banglaPool = (`বাংলা টেক্সট পরীক্ষার জন্য উদাহরণ স্বরূপ কিছু সাধারণ শব্দ এখানে রয়েছে যা ডামি প্যারাগ্রাফ তৈরি করতে ব্যবহৃত হবে টেক্সট জেনারেটর সহজ এবং দ্রুত`).split(' ');

// elements
const paragraphs = document.getElementById('paragraphs');
const words = document.getElementById('words');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const pCount = document.getElementById('pCount');
const wCount = document.getElementById('wCount');
const mode = document.getElementById('mode');
const customField = document.getElementById('customField');
const customWords = document.getElementById('customWords');

function pick(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
}

function generate(pars, wordsPerPar, pool) {
    const paras = [];
    for (let i = 0; i < pars; i++) {
        const w = [];
        for (let j = 0; j < wordsPerPar; j++) {
            let word = pick(pool);
            // small chance to add punctuation
            if (Math.random() < 0.06 && j > 0) word = word + ',';
            w.push(word);
        }
        // capitalize first word and end with a period
        let sentence = w.join(' ');
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        if (!/[.?!]$/.test(sentence)) sentence = sentence + '.'.repeat(1);
        paras.push(sentence);
    }
    return paras.join('\n\n');
}

function updateCounts(text) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paras = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    pCount.textContent = paras;
    wCount.textContent = words;
}

generateBtn.addEventListener('click', () => {
    let p = parseInt(paragraphs.value) || 1;
    let w = parseInt(words.value) || 50;

    // clamp values
    p = Math.max(1, Math.min(50, p));
    w = Math.max(1, Math.min(2000, w));

    let pool;
    if (mode.value === 'lorem') pool = loremPool;
    else if (mode.value === 'bangla') pool = banglaPool;
    else {
        const custom = customWords.value.split(',').map(s => s.trim()).filter(Boolean);
        pool = custom.length ? custom : loremPool;
    }

    const result = generate(p, w, pool);
    output.value = result;
    updateCounts(result);
});

clearBtn.addEventListener('click', () => { output.value = ''; updateCounts(''); });

copyBtn.addEventListener('click', async () => {
    const text = output.value;
    if (!text) return alert('No text to copy');
    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied';
        setTimeout(() => copyBtn.textContent = 'Copy', 900);
    } catch (e) {
        alert('Copy failed — your browser may block clipboard access.');
    }
});

downloadBtn.addEventListener('click', () => {
    const text = output.value;
    if (!text) return alert('Nothing to download');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dummy-text.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

mode.addEventListener('change', () => {
    customField.style.display = mode.value === 'custom' ? 'block' : 'none';
});

// initialize counts
updateCounts('');
