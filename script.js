const bankBendera = [
    { url: "https://flagcdn.com/id.svg" }, { url: "https://flagcdn.com/ar.svg" },
    { url: "https://flagcdn.com/fr.svg" }, { url: "https://flagcdn.com/br.svg" },
    { url: "https://flagcdn.com/jp.svg" }, { url: "https://flagcdn.com/de.svg" },
    { url: "https://flagcdn.com/gb-eng.svg" }, { url: "https://flagcdn.com/nl.svg" },
    { url: "https://flagcdn.com/ma.svg" }, { url: "https://flagcdn.com/pt.svg" },
    { url: "https://flagcdn.com/es.svg" }, { url: "https://flagcdn.com/sa.svg" },
    { url: "https://flagcdn.com/kr.svg" }, { url: "https://flagcdn.com/hr.svg" },
    { url: "https://flagcdn.com/uy.svg" }, { url: "https://flagcdn.com/sn.svg" }
];

const daftarPesertaAwal = ["Fernandi", "Budi", "Siti", "Roni", "Agus", "Dewi", "Eko", "Putri", "Rian", "Maman", "Reza", "Dina"];

let benderas = [...bankBendera];
let pesertas = [...daftarPesertaAwal];
let hasilKocokan = [];
let isDrawing = false;

// --- LOGIKA OTOMATIS PUTAR MUSIK (ANTI BLOCK BROWSER) ---
const musik = document.getElementById("bg-music");
const btnMusik = document.getElementById("btn-musik");

function putarMusikOtomatis() {
    if (musik.paused) {
        musik.play().then(() => {
            btnMusik.innerHTML = "⏸️ Musik: On";
            btnMusik.style.background = "var(--accent-color)";
            btnMusik.style.color = "#000";
        }).catch(err => console.log("Menunggu interaksi user..."));
    }
}

// Memicu musik otomatis menyala saat user klik bagian mana saja di halaman web
document.body.addEventListener("click", putarMusikOtomatis, { once: true });
document.getElementById("input-peserta").addEventListener("focus", putarMusikOtomatis, { once: true });

function toggleMusik() {
    if (musik.paused) {
        musik.play();
        btnMusik.innerHTML = "⏸️ Musik: On";
        btnMusik.style.background = "var(--accent-color)";
        btnMusik.style.color = "#000";
    } else {
        musik.pause();
        btnMusik.innerHTML = "🎵 Musik: Off";
        btnMusik.style.background = "rgba(13, 28, 46, 0.8)";
        btnMusik.style.color = "#fff";
    }
}

// --- LOGIKA UNDIAN & TABEL ---
function renderPot() {
    const potContainer = document.getElementById("pot-teams");
    potContainer.innerHTML = "";
    if (pesertas.length === 0) {
        potContainer.innerHTML = "<span style='color: #64748b; font-style: italic;'>Semua peserta sudah masuk tabel!</span>";
        return;
    }
    pesertas.forEach(nama => {
        const span = document.createElement("span");
        span.className = "team-badge";
        span.innerText = nama;
        potContainer.appendChild(span);
    });
}

function tambahPeserta() {
    putarMusikOtomatis();
    const input = document.getElementById("input-peserta");
    const nama = input.value.trim();
    if (nama === "") return alert("Ketik namanya dulu bos!");
    pesertas.push(nama);
    input.value = "";
    renderPot();
}

function kocokSatuPeserta() {
    putarMusikOtomatis();
    if (isDrawing) return;
    if (pesertas.length === 0) return alert("Pot peserta kosong!");
    if (benderas.length === 0) return alert("Persediaan bendera habis!");

    isDrawing = true;
    const screen = document.getElementById("draw-screen");

    let counter = 0;
    const intervalAcak = setInterval(() => {
        const namaAcak = pesertas[Math.floor(Math.random() * pesertas.length)];
        const benderaAcak = benderas[Math.floor(Math.random() * benderas.length)];
        screen.innerHTML = `
            <div class="animated-result" style="opacity: 0.5; filter: blur(1px);">
                <img src="${benderaAcak.url}">
                <span>${namaAcak.toUpperCase()}</span>
            </div>`;
        counter++;
        if (counter > 10) clearInterval(intervalAcak);
    }, 80);

    setTimeout(() => {
        clearInterval(intervalAcak);

        const indexPeserta = Math.floor(Math.random() * pesertas.length);
        const namaTerpilih = pesertas.splice(indexPeserta, 1)[0];

        const indexBendera = Math.floor(Math.random() * benderas.length);
        const benderaTerpilih = benderas.splice(indexBendera, 1)[0];

        screen.innerHTML = `
            <div class="animated-result">
                <img src="${benderaTerpilih.url}">
                <span style="color: var(--accent-color); text-transform: uppercase;">⚡ ${namaTerpilih} ⚡</span>
            </div>`;

        setTimeout(() => {
            hasilKocokan.push({ nama: namaTerpilih, flag: benderaTerpilih.url });
            const nomorUrut = hasilKocokan.length;

            const tbody = document.getElementById("table-body");
            const row = document.createElement("tr");
            row.className = "row-animation";
            row.innerHTML = `
                <td style="color: var(--accent-color); font-weight: bold;">${nomorUrut}</td>
                <td><img src="${benderaTerpilih.url}" class="table-flag" alt="flag"></td>
                <td style="text-align: left; padding-left: 40px; color: #fff;">${namaTerpilih}</td>
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
    benderas = [...bankBendera];
    pesertas = [...daftarPesertaAwal];
    hasilKocokan = [];
    document.getElementById("draw-screen").innerHTML = `<div class="placeholder-text">Klik tombol di bawah untuk mengocok...</div>`;
    document.getElementById("table-body").innerHTML = "";
    renderPot();
}

renderPot();
