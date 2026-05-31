const passwordInput = document.getElementById('passwordInput');
const crackBtn = document.getElementById('crackBtn');
const terminal = document.getElementById('terminal-overlay');
const crackingDisplay = document.getElementById('cracking-display');
const logScroll = document.getElementById('log-scroll');

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

crackBtn.addEventListener('click', async () => {
    const pwd = passwordInput.value;
    if (!pwd) return;

    terminal.style.display = 'flex';
    crackingDisplay.innerText = '';
    logScroll.innerHTML = '';

    // Schnelle gefälschte Logs
    for (let i = 0; i < 15; i++) {
        const div = document.createElement('div');
        div.innerText = `> Teste HEX_${Math.random().toString(16).slice(2,8)}... OK`;
        logScroll.prepend(div);
        await sleep(30);
    }

    // Knack-Animation
    let current = "";
    for (let i = 0; i < pwd.length; i++) {
        for (let j = 0; j < 3; j++) {
            crackingDisplay.innerText = current + chars[Math.floor(Math.random() * chars.length)];
            await sleep(25);
        }
        current += pwd[i];
        crackingDisplay.innerText = current;
    }

    await sleep(600);
    terminal.style.display = 'none';
    showResults(pwd);
});

function showResults(pwd) {
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;

    const combinations = Math.pow(charsetSize, pwd.length);
    const guessesPerSec = 100_000_000_000; // 100 Milliarden/Sek
    const seconds = combinations / guessesPerSec;

    document.getElementById('resultsArea').style.display = 'block';
    document.getElementById('timeVal').innerText = formatPreciseTime(seconds);
    document.getElementById('attemptsVal').innerText = formatBigNumber(combinations) + " (" + combinations.toExponential(2) + ")";

    const rating = document.getElementById('ratingVal');
    if (seconds < 1) {
        rating.innerText = "KRITISCHE SCHWACHSTELLE";
        rating.style.color = "var(--danger)";
    } else if (seconds < 31536000) {
        rating.innerText = "SCHWACHE VERSCHLÜSSELUNG";
        rating.style.color = "#f59e0b";
    } else {
        rating.innerText = "SICHER (AES-NIVEAU)";
        rating.style.color = "var(--success)";
    }
}

function formatPreciseTime(s) {
    if (s < 0.000001) return ((s * 1000000).toFixed(3) + " μs (Mikrosekunden)").replace('.', ',');
    if (s < 0.001) return ((s * 1000).toFixed(3) + " ms (Millisekunden)").replace('.', ',');
    if (s < 1) return (s.toFixed(4) + " Sekunden").replace('.', ',');
    if (s < 60) return (s.toFixed(2) + " Sekunden").replace('.', ',');
    if (s < 3600) return ((s / 60).toFixed(2) + " Minuten").replace('.', ',');
    if (s < 86400) return ((s / 3600).toFixed(2) + " Stunden").replace('.', ',');
    if (s < 31536000) return ((s / 86400).toFixed(2) + " Tage").replace('.', ',');
    return (s / 31536000).toLocaleString(undefined, {
        maximumFractionDigits: 1
    }) + " Jahre";
}

function formatBigNumber(n) {
    if (n < 1e6) return n.toLocaleString();

    const units = [{
            val: 1e63,
            name: " Dezilliarden"
        },
        {
            val: 1e60,
            name: " Dezillionen"
        },
        {
            val: 1e57,
            name: " Nonilliarden"
        },
        {
            val: 1e54,
            name: " Nonillionen"
        },
        {
            val: 1e51,
            name: " Oktilliarden"
        },
        {
            val: 1e48,
            name: " Oktillionen"
        },
        {
            val: 1e45,
            name: " Septilliarden"
        },
        {
            val: 1e42,
            name: " Septillionen"
        },
        {
            val: 1e39,
            name: " Sextilliarden"
        },
        {
            val: 1e36,
            name: " Sextillionen"
        },
        {
            val: 1e33,
            name: " Quintilliarden"
        },
        {
            val: 1e30,
            name: " Quintillionen"
        },
        {
            val: 1e27,
            name: " Quadrilliarden"
        },
        {
            val: 1e24,
            name: " Quadrillionen"
        },
        {
            val: 1e21,
            name: " Trilliarden"
        },
        {
            val: 1e18,
            name: " Trillionen"
        },
        {
            val: 1e15,
            name: " Billiarden"
        },
        {
            val: 1e12,
            name: " Billionen"
        },
        {
            val: 1e9,
            name: " Milliarden"
        },
        {
            val: 1e6,
            name: " Millionen"
        }
    ];

    for (let unit of units) {
        if (n >= unit.val) {
            return (n / unit.val).toFixed(2).replace('.', ',') + unit.name;
        }
    }
    return n.toFixed(0);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}