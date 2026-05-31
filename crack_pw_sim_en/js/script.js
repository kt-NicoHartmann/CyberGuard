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

    // Fast fake logs
    for (let i = 0; i < 15; i++) {
        const div = document.createElement('div');
        div.innerText = `> Testing HEX_${Math.random().toString(16).slice(2,8)}... OK`;
        logScroll.prepend(div);
        await sleep(30);
    }

    // Crack Animation
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
    const guessesPerSec = 100_000_000_000; // 100 Billion/sec
    const seconds = combinations / guessesPerSec;

    document.getElementById('resultsArea').style.display = 'block';
    document.getElementById('timeVal').innerText = formatPreciseTime(seconds);
    document.getElementById('attemptsVal').innerText = formatBigNumber(combinations) + " (" + combinations.toExponential(2) + ")";

    const rating = document.getElementById('ratingVal');
    if (seconds < 1) {
        rating.innerText = "CRITICAL VULNERABILITY";
        rating.style.color = "var(--danger)";
    } else if (seconds < 31536000) {
        rating.innerText = "WEAK ENCRYPTION";
        rating.style.color = "#f59e0b";
    } else {
        rating.innerText = "SECURE (AES-LEVEL)";
        rating.style.color = "var(--success)";
    }
}

function formatPreciseTime(s) {
    if (s < 0.000001) return (s * 1000000).toFixed(3) + " μs (Microseconds)";
    if (s < 0.001) return (s * 1000).toFixed(3) + " ms (Milliseconds)";
    if (s < 1) return s.toFixed(4) + " Seconds";
    if (s < 60) return s.toFixed(2) + " Seconds";
    if (s < 3600) return (s / 60).toFixed(2) + " Minutes";
    if (s < 86400) return (s / 3600).toFixed(2) + " Hours";
    if (s < 31536000) return (s / 86400).toFixed(2) + " Days";
    return (s / 31536000).toLocaleString(undefined, {
        maximumFractionDigits: 1
    }) + " Years";
}

function formatBigNumber(n) {
    if (n < 1e6) return n.toLocaleString();

    const units = [{
            val: 1e63,
            name: " Vigintillion"
        },
        {
            val: 1e60,
            name: " Novemdecillion"
        },
        {
            val: 1e57,
            name: " Octodecillion"
        },
        {
            val: 1e54,
            name: " Septendecillion"
        },
        {
            val: 1e51,
            name: " Sexdecillion"
        },
        {
            val: 1e48,
            name: " Quindecillion"
        },
        {
            val: 1e45,
            name: " Quattuordecillion"
        },
        {
            val: 1e42,
            name: " Tredecillion"
        },
        {
            val: 1e39,
            name: " Duodecillion"
        },
        {
            val: 1e36,
            name: " Undecillion"
        },
        {
            val: 1e33,
            name: " Decillion"
        },
        {
            val: 1e30,
            name: " Nonillion"
        },
        {
            val: 1e27,
            name: " Octillion"
        },
        {
            val: 1e24,
            name: " Septillion"
        },
        {
            val: 1e21,
            name: " Sextillion"
        },
        {
            val: 1e18,
            name: " Quintillion"
        },
        {
            val: 1e15,
            name: " Quadrillion"
        },
        {
            val: 1e12,
            name: " Trillion"
        },
        {
            val: 1e9,
            name: " Billion"
        },
        {
            val: 1e6,
            name: " Million"
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