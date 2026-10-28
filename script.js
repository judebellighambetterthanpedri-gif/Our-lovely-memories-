// PASSCODE CONFIGURATION
const CORRECT_PASSCODE = "29112023";

// BASELINE TIMING: 29/11/2023 at 01:58 AM
const LOVE_START_DATE = new Date(2023, 10, 29, 1, 58, 0); // Month index 10 = November

// DOM ELEMENTS
const lockScreen = document.getElementById('lock-screen');
const passInput = document.getElementById('passcode-input');
const unlockBtn = document.getElementById('unlock-btn');
const errorMsg = document.getElementById('error-msg');
const mainApp = document.getElementById('main-app');
const memoryForm = document.getElementById('memory-form');
const memoriesList = document.getElementById('memories-list');

// UNLOCK ACTION
function attemptUnlock() {
    const entered = passInput.value.trim();
    if (entered === CORRECT_PASSCODE) {
        errorMsg.style.display = 'none';
        lockScreen.classList.add('unlocked');
        setTimeout(() => {
            lockScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            initLoveTimer();
            loadMemories();
        }, 1200);
    } else {
        errorMsg.style.display = 'block';
        passInput.style.borderColor = '#ff4d4d';
        setTimeout(() => passInput.style.borderColor = '#ff758c', 1000);
    }
}

unlockBtn.addEventListener('click', attemptUnlock);
passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptUnlock();
});

// LIVE LOVE TIMER
function initLoveTimer() {
    function updateCounter() {
        const now = new Date();
        const diff = now - LOVE_START_DATE;

        if (diff < 0) return;

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        const years = Math.floor(totalDays / 365);
        const months = Math.floor((totalDays % 365) / 30);
        const days = Math.floor((totalDays % 365) % 30);

        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    updateCounter();
    setInterval(updateCounter, 1000);
}

// STORAGE ENGINE (LOCAL STORAGE FALLBACK FOR GITHUB PAGES)
function getSavedMemories() {
    const data = localStorage.getItem('medhu_ayushe_memories');
    return data ? JSON.parse(data) : getInitialMemories();
}

function saveMemoriesToStorage(memories) {
    localStorage.setItem('medhu_ayushe_memories', JSON.stringify(memories));
}

function getInitialMemories() {
    return [
        {
            id: '1',
            author: 'Medhu',
            mood: 'Forever & Always 💍',
            text: 'I genuinely love you, Ayushe. Everyday with you feels like a beautiful dream come true.',
            imageUrl: '',
            timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        },
        {
            id: '2',
            author: 'Ayushe',
            mood: 'Feeling Loved 🥰',
            text: 'You are my safest place, Medhu. Thank you for making every moment so special!',
            imageUrl: '',
            timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        }
    ];
}

let activeFilter = 'all';

function loadMemories() {
    const memories = getSavedMemories();
    memoriesList.innerHTML = '';

    const filtered = activeFilter === 'all' 
        ? memories 
        : memories.filter(m => m.author === activeFilter);

    if (filtered.length === 0) {
        memoriesList.innerHTML = '<p style="text-align:center; color:#888;">No memories found in this section yet. Add your first one!</p>';
        return;
    }

    filtered.forEach(m => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="author-tag">${m.author === 'Medhu' ? 'Medhu 💙' : 'Ayushe 💕'}</span>
                <span class="mood-badge">${m.mood}</span>
            </div>
            <div class="card-body">
                <p>${m.text}</p>
                ${m.imageUrl ? `<img src="${m.imageUrl}" class="card-img" alt="Memory Image">` : ''}
            </div>
            <div class="card-footer">
                <span>${m.timestamp}</span>
                <button class="delete-btn" onclick="deleteMemory('${m.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        memoriesList.appendChild(card);
    });
}

// ADD NEW MEMORY
memoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.getElementById('author-select').value;
    const mood = document.getElementById('mood-select').value;
    const text = document.getElementById('memory-text').value;
    const fileInput = document.getElementById('image-file');
    const urlInput = document.getElementById('image-url').value.trim();

    const saveAndRender = (imgData) => {
        const newMemory = {
            id: Date.now().toString(),
            author,
            mood,
            text,
            imageUrl: imgData || urlInput,
            timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        };

        const memories = getSavedMemories();
        memories.unshift(newMemory);
        saveMemoriesToStorage(memories);

        memoryForm.reset();
        loadMemories();
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => saveAndRender(event.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveAndRender('');
    }
});

// DELETE MEMORY
window.deleteMemory = function(id) {
    if (confirm("Are you sure you want to delete this memory?")) {
        let memories = getSavedMemories();
        memories = memories.filter(m => m.id !== id);
        saveMemoriesToStorage(memories);
        loadMemories();
    }
};

// FILTER BUTTONS
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        activeFilter = e.target.getAttribute('data-filter');
        loadMemories();
    });
});

// EVERY TOUCH 'I LOVE YOU' PARTICLES
const lovePhrases = [
    "I genuinely love you ❤️",
    "Medhu Loves Ayushe 💕",
    "Ayushe Loves Medhu 💖",
    "Forever & Always 💍",
    "You are my world 🌍",
    "I Love You 💖"
];

document.addEventListener('click', (e) => {
    // Avoid triggering on inputs/buttons to keep UX smooth
    if (['INPUT', 'BUTTON', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

    const particle = document.createElement('div');
    particle.className = 'tap-love-particle';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.textContent = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
});

// SYNTHESIZED AMBIENT AUDIO PLAYER
let audioCtx = null;
let isPlaying = false;
let audioTimer = null;

const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23]; // Soft Romantic Chords

document.getElementById('music-btn').addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (isPlaying) {
        clearInterval(audioTimer);
        document.getElementById('music-text').textContent = "Play Love Melody";
        isPlaying = false;
    } else {
        let step = 0;
        audioTimer = setInterval(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);
            
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 1.8);
            step++;
        }, 1000);

        document.getElementById('music-text').textContent = "Pause Love Melody";
        isPlaying = true;
    }
});
