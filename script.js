// Bank Data hanya digunakan untuk animasi acak cepat di layar proyektor
const bankBenderaAnimasi = [
    "https://flagcdn.com/id.svg", "https://flagcdn.com/ar.svg", "https://flagcdn.com/fr.svg", "https://flagcdn.com/br.svg",
    "https://flagcdn.com/jp.svg", "https://flagcdn.com/de.svg", "https://flagcdn.com/gb-eng.svg", "https://flagcdn.com/nl.svg",
    "https://flagcdn.com/ma.svg", "https://flagcdn.com/pt.svg", "https://flagcdn.com/es.svg", "https://flagcdn.com/sa.svg"
];

let potPeserta = []; // Berisi kumpulan objek { nama: "X", flag: "URL" } yang diinput user
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

// Menampilkan list apa saja yang sudah didaftarkan ke dalam POT
function renderPot() {
    const potContainer = document.getElementById("pot-teams");
    potContainer.innerHTML = "";
    if (potPeserta.length === 0) {
        potContainer.innerHTML = "<span style='color: #64748b; font-style: italic;'>Pot kosong. Daftarkan nama & bendera di atas!</span>";
        return;
    }
    potPeserta.forEach(p => {
        const span = document.createElement("span");
        span.className = "team-badge";
        span.innerHTML = `<img src="${p.flag}" class="pot-flag"> <span>${p.nama}</span>`;
        potContainer.appendChild(span);
    });
}

// Fungsi memasukkan Pasangan Nama + Bendera Pilihan Sendiri
function tambahPeserta() {
    putarMusik();
    const selectBendera = document.getElementById("select-bendera");
    const inputPeserta = document.getElementById("input-peserta");
    
    const nama = inputPeserta.value.trim();
    if (nama === "") return alert("Ketik namanya dulu bos!");

    // Ambil data bendera dari value dropdown (Format: "kode|NamaNegara")
    const dataBendera = selectBendera.value.split("|");
    const kodeNegara = dataBendera[0];
    const urlFlag = `https://flagcdn.com/${kodeNegara}.svg`;

    // Simpan ke array Pot
    potPeserta.push({
        nama: nama,
        flag: urlFlag
    });

    // Reset kolom input nama agar siap ngetik nama selanjutnya
    inputPeserta.value = "";
    renderPot();
}

// Mengocok urutan siapa yang keluar duluan ke tabel nomor urut
function kocokSatuPeserta() {
    putarMusik();
    if (isDrawing) return;
    if (potPeserta.length === 0) return alert("Daftarkan pasangan nama & bendera dulu di pot!");

    isDrawing = true;
    const screen = document.getElementById("draw-screen");

    // Efek Acak Kilat di Layar Proyektor
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

    // Hasil Final (Mengambil acak 1 pasang dari paket yang sudah kamu buat)
    setTimeout(() => {
        clearInterval(intervalAcak);

        const indexTerpilih = Math.floor(Math.random() * potPeserta.length);
        const dataTerpilih = potPeserta.splice(indexTerpilled, 1)[0]; // Mengambil objek {nama, flag}

        screen.innerHTML = `
            <div class="animated-result">
                <img src="${dataTerpilih.flag}">
                <span style="color: var(--accent-color); text-transform: uppercase;">⚡ ${dataTerpilih.nama} ⚡</span>
            </div>`;

        // Kirim ke baris tabel klasemen bawah
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

// Jalankan inisialisasi pot kosong di awal
renderPot();
