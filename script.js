// Digunakan hanya sebagai pemanis variasi saat layar proyektor mengacak visual secara cepat
const bankBenderaAnimasi = [
    "https://flagcdn.com/id.svg", "https://flagcdn.com/ar.svg", "https://flagcdn.com/fr.svg", "https://flagcdn.com/br.svg",
    "https://flagcdn.com/jp.svg", "https://flagcdn.com/de.svg", "https://flagcdn.com/gb-eng.svg", "https://flagcdn.com/nl.svg"
];

let potPeserta = []; 
let hasilKocokan = [];
let isDrawing = false;

const musik = document.getElementById("bg-music");
const btnMusik = document.getElementById("btn-musik");

function putarMusik() {
    if (musik.paused) {
        musik.play().then(() => {
            btnMusik.innerHTML = "⏸️ Musik: On";
            btnMusik.style.background = "var(--accent-color)";
            btnMusik.style.color = "#000";
        }).catch(err => console.log("Menunggu klik user..."));
    }
}

function toggleMusik() {
    if (musik.paused) { putarMusik(); } 
    else {
        musik.pause();
        btnMusik.innerHTML = "🎵 Musik: Off";
        btnMusik.style.background = "rgba(13, 28, 46, 0.8)";
        btnMusik.style.color = "#fff";
    }
}

function renderPot() {
    const potContainer = document.getElementById("pot-teams");
    potContainer.innerHTML = "";
    if (potPeserta.length === 0) {
        potContainer.innerHTML = "<span style='color: #64748b; font-style: italic;'>Pot kosong. Daftarkan bendera & nama manual di atas!</span>";
        return;
    }
    potPeserta.forEach(p => {
        const span = document.createElement("span");
        span.className = "team-badge";
        span.innerHTML = `<img src="${p.flag}" class="pot-flag"> <span>${p.nama}</span>`;
        potContainer.appendChild(span);
    });
}

// Fungsi Menambahkan Pasangan secara Manual Total
function tambahPeserta() {
    putarMusik();
    const inputBendera = document.getElementById("input-bendera");
    const inputPeserta = document.getElementById("input-peserta");
    
    const kodeNegara = inputBendera.value.trim().toLowerCase();
    const nama = inputPeserta.value.trim();

    if (kodeNegara === "") return alert("Ketik kode benderanya dulu bos (misal: id / br / ar)!");
    if (nama === "") return alert("Ketik nama pemainnya dulu bos!");

    // Konversi input teks kode negara langsung ke endpoint gambar CDN
    const urlFlag = `https://flagcdn.com/${kodeNegara}.svg`;

    // Daftarkan ke paket pot
    potPeserta.push({
        nama: nama,
        flag: urlFlag
    });

    // Bersihkan semua kolom input setelah berhasil menambah
    inputBendera.value = "";
    inputPeserta.value = "";
    renderPot();
}

function kocokSatuPeserta() {
    putarMusik();
    if (isDrawing) return;
    if (potPeserta.length === 0) return alert("Pot kosong! Isi negara & nama manual dulu di atas.");

    isDrawing = true;
    const screen = document.getElementById("draw-screen");

    let counter = 0;
    const intervalAcak = setInterval(() => {
        const flagAcak = bankBenderaAnimasi[Math.floor(Math.random() * bankBenderaAnimasi.length)];
        const dummy = potPeserta[Math.floor(Math.random() * potPeserta.length)];
        screen.innerHTML = `
            <div class="animated-result" style="opacity: 0.5; filter: blur(1px);">
                <img src="${flagAcak}">
                <span>${dummy.nama.toUpperCase()}</span>
            </div>`;
        counter++;
        if (counter > 10) clearInterval(intervalAcak);
    }, 80);

    setTimeout(() => {
        clearInterval(intervalAcak);

        const indexTerpilih = Math.floor(Math.random() * potPeserta.length);
        const dataTerpilih = potPeserta.splice(indexTerpilih, 1)[0];

        screen.innerHTML = `
            <div class="animated-result">
                <img src="${dataTerpilih.flag}">
                <span style="color: var(--accent-color); text-transform: uppercase;">⚡ ${dataTerpilih.nama} ⚡</span>
            </div>`;

        setTimeout(() => {
            hasilKocokan.push(dataTerpilih);
            const nomorUrut = hasilKocokan.length;

            const tbody = document.getElementById("table-body");
            const row = document.createElement("tr");
            row.className = "row-animation";
            row.innerHTML = `
                <td style="color: var(--accent-color); font-weight: bold;">${nomorUrut}</td>
                <td><img src="${dataTerpilih.flag}" class="table-flag"></td>
                <td style="color: #fff;">${dataTerpilih.nama}</td>
            `;
            tbody.appendChild(row);

            screen.innerHTML = `<div class="placeholder-text">Menunggu kocokan berikutnya...</div>`;
            renderPot();
            isDrawing = false;
        }, 1200);

    }, 800);
}

function resetDraw() {
    if (isDrawing) return;
    potPeserta = [];
    hasilKocokan = [];
    document.getElementById("draw-screen").innerHTML = `<div class="placeholder-text">Masukkan pasangan nama & bendera di atas...</div>`;
    document.getElementById("table-body").innerHTML = "";
    renderPot();
}

renderPot();
