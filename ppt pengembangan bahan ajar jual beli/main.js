let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function updateSlide() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    document.getElementById('slide-indicator').innerText = `Slide ${currentSlide + 1} dari ${totalSlides}`;
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlide();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
    }
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    closeOverview();
}

function setTheme(color) {
    document.body.className = `theme-${color} flex flex-col h-screen overflow-hidden font-['Quicksand'] select-none`;
}

// Pop Up Modal
function openPopup(title, desc) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;
    document.getElementById('modal').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('modal').classList.add('hidden');
}

// Slide Overview Modal
function openOverview() {
    const grid = document.getElementById('overview-grid');
    grid.innerHTML = '';
    slides.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = `p-3 rounded-2xl text-xs font-bold text-left transition border ${index === currentSlide ? 'bg-pink-500 text-white border-pink-500 shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'}`;
        btn.innerText = `Slide ${index + 1}`;
        btn.onclick = () => goToExerciseSlide(index);
        grid.appendChild(btn);
    });
    document.getElementById('overview-modal').classList.remove('hidden');
}

function goToExerciseSlide(index) {
    goToSlide(index);
}

function closeOverview() {
    document.getElementById('overview-modal').classList.add('hidden');
}

// Bilingual Toggle simulation
let isEnglish = false;
function toggleLang() {
    isEnglish = !isEnglish;
    const btn = document.getElementById('lang-btn');
    btn.innerText = isEnglish ? "🇬🇧 EN / 🇮🇩 ID" : "🇮🇩 ID / 🇬🇧 EN";
    alert(isEnglish ? "Bahasa diubah ke Inggris (Simulasi terjemahan singkat)." : "Bahasa dikembalikan ke Bahasa Indonesia.");
}

// Quiz Data & Logic (Slide 8)
const quizData = [
    { q: "Apa arti dari kegiatan jual beli?", options: ["Menukar barang dengan uang", "Membuang barang", "Menyimpan barang di rumah", "Meminta barang gratis"], correct: 0 },
    { q: "Siapa pihak yang menawarkan barang dagangan?", options: ["Pembeli", "Penjual", "Kurir", "Penonton"], correct: 1 },
    { q: "Apa alat transaksi yang sah dan umum digunakan?", options: ["Daun kering", "Uang", "Batu", "Kertas biasa"], correct: 1 },
    { q: "Sebelum membeli barang, langkah apa yang sebaiknya dilakukan?", options: ["Langsung bayar tanpa lihat", "Memeriksa kondisi dan harga", "Merusak barang", "Menyembunyikan barang"], correct: 1 },
    { q: "Apa hak seorang pembeli dalam kegiatan jual beli?", options: ["Mendapat barang sesuai kesepakatan", "Mengambil barang tanpa membayar", "Dimarahi penjual", "Tidak boleh bertanya"], correct: 0 }
];

let currentQuiz = 0;

function loadQuiz() {
    if (currentQuiz >= quizData.length) currentQuiz = 0;
    const data = quizData[currentQuiz];
    document.getElementById('quiz-progress').innerText = `Soal ${currentQuiz + 1} dari ${quizData.length}`;
    document.getElementById('quiz-question').innerText = data.q;
    document.getElementById('quiz-feedback').innerText = '';
    
    const optionsBox = document.getElementById('quiz-options');
    optionsBox.innerHTML = '';
    
    data.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "p-3 rounded-2xl bg-gray-50 hover:bg-pink-50 hover:text-pink-600 font-bold text-xs text-gray-700 border border-gray-200 transition text-left cursor-pointer";
        btn.innerText = `${String.fromCharCode(65 + idx)}. ${opt}`;
        btn.onclick = () => checkQuiz(idx, data.correct);
        optionsBox.appendChild(btn);
    });
}

function checkQuiz(selected, correct) {
    const feedback = document.getElementById('quiz-feedback');
    if (selected === correct) {
        feedback.className = "text-xs font-bold h-6 text-center text-emerald-600";
        feedback.innerText = "🎉 Benar sekali! Hebat!";
        triggerCoinRain();
        setTimeout(() => {
            currentQuiz++;
            loadQuiz();
        }, 1500);
    } else {
        feedback.className = "text-xs font-bold h-6 text-center text-rose-500";
        feedback.innerText = "❌ Belum tepat, coba lagi ya!";
    }
}

function triggerCoinRain() {
    const container = document.getElementById('coin-container');
    if (!container) return;
    for (let i = 0; i < 15; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.innerText = '🪙';
        coin.style.left = Math.random() * 90 + '%';
        coin.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(coin);
        setTimeout(() => coin.remove(), 1500);
    }
}

// Shopping Simulation & Drag Drop (Slide 9)
const items = [
    { name: "Sayuran", price: 11000, specs: ["1. Masih segar", "2. Sudah dipacking rapi", "3. Gampang membusuk jika di luar kulkas terlalu lama"] },
    { name: "Boneka", price: 154000, specs: ["1. Bahan halus dan lembut", "2. Jahitan rapi dan kuat", "3. Cocok untuk mainan anak"] },
    { name: "Minuman", price: 15000, specs: ["1. Segar dan dingin", "2. Kemasan botol rapat", "3. Tanggal kedaluwarsa masih lama"] },
    { name: "Baju", price: 200000, specs: ["1. Bahan katun adem", "2. Ukuran pas di badan", "3. Warna tidak mudah luntur"] },
    { name: "Apel", price: 7500, specs: ["1. Manis dan renyah", "2. Sedikit memar di bagian kulit", "3. Kaya vitamin C"] }
];

let selectedItem = null;

function loadItems() {
    const list = document.getElementById('item-list');
    if (!list) return;
    list.innerHTML = '';
    items.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = "p-2.5 rounded-xl bg-gray-50 hover:bg-pink-50 border border-gray-200 cursor-pointer text-xs font-bold text-gray-700 flex justify-between items-center transition";
        div.innerHTML = `<span>🛍️ ${item.name}</span><span class="text-pink-600">Rp ${item.price.toLocaleString()}</span>`;
        div.onclick = () => selectItem(idx);
        list.appendChild(div);
    });
}

function selectItem(idx) {
    selectedItem = items[idx];
    const specBox = document.getElementById('item-spec');
    specBox.innerHTML = `<p class="font-bold text-gray-800 mb-1">Spesifikasi ${selectedItem.name}:</p>` + 
        selectedItem.specs.map(s => `<p>${s}</p>`).join('');
    
    const btnAgree = document.getElementById('btn-agree');
    btnAgree.disabled = false;
    btnAgree.className = "mt-3 w-full py-2 bg-pink-500 text-white font-bold rounded-xl text-xs hover:bg-pink-600 transition cursor-pointer";
    btnAgree.innerText = "Setuju & Lanjut Bayar";
}

function proceedToPay() {
    if (!selectedItem) return;
    document.getElementById('target-price').innerText = `Rp ${selectedItem.price.toLocaleString()}`;
    document.getElementById('payment-instruction').innerText = `Seret uang sejumlah Rp ${selectedItem.price.toLocaleString()} ke area kasir!`;
    const dropZone = document.getElementById('drop-zone');
    dropZone.innerHTML = `<span class="text-xs text-gray-600 font-bold">Seret uang ke sini (Target: Rp ${selectedItem.price.toLocaleString()})</span>`;
    document.getElementById('payment-panel').className = "bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between transition-colors duration-300";
    document.getElementById('payment-status').innerText = "Belum lunas";
    document.getElementById('payment-status').className = "text-gray-400";
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.getAttribute('data-value'));
}

const dropZone = document.getElementById('drop-zone');
if (dropZone) {
    dropZone.addEventListener('dragover', (ev) => ev.preventDefault());
    dropZone.addEventListener('drop', (ev) => {
        ev.preventDefault();
        if (!selectedItem) return;
        const val = parseInt(ev.dataTransfer.getData("text"));
        const panel = document.getElementById('payment-panel');
        const status = document.getElementById('payment-status');
        
        if (val === selectedItem.price) {
            panel.className = "bg-emerald-50 p-4 rounded-2xl shadow-xs border border-emerald-300 flex flex-col justify-between transition-colors duration-300";
            dropZone.innerHTML = `<span class="text-xs text-emerald-700 font-bold">✅ Pembayaran Pas & Lunas!</span>`;
            status.innerText = "Lunas (Berhasil)";
            status.className = "text-emerald-600 font-bold";
        } else {
            panel.className = "bg-rose-50 p-4 rounded-2xl shadow-xs border border-rose-300 flex flex-col justify-between transition-colors duration-300";
            dropZone.innerHTML = `<span class="text-xs text-rose-700 font-bold">❌ Gagal! Nominal tidak sesuai (Rp ${val.toLocaleString()})</span>`;
            status.innerText = "Transaksi Gagal";
            status.className = "text-rose-600 font-bold";
        }
    });
}

// Inisialisasi awal aman saat dokumen siap
document.addEventListener("DOMContentLoaded", () => {
    loadQuiz();
    loadItems();
});