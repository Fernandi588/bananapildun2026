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

// KOSONGKAN TOTAL NAMA BAWAAN LAMA AGAR BISA CUSTOM SENDIRI
let benderas = [...bankBendera];
let pesertas = []; 
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
        }).catch(err => console.log("Menunggu tindakan klik pengguna..."));
    }
}

function toggleMusik() {
    if (musik.paused) {
        putarMusik();
    } else {
        musik.pause();
        btnMusik.innerHTML = "🎵 Musik: Off";
        btnMusik.style.background = "rgba(13, 28, 46, 0.8)";
        btnMusik.style.color = "#fff";
    }
}

function renderPot() {
    const potContainer = document.getElementById("pot-teams");
    potContainer.innerHTML = "";
    if (pesertas.length === 0) {
        potContainer.innerHTML = "<span style='color: #64748b; font-style: italic;'>Pot kosong. Silakan ketik nama pemain di atas!</span>";
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
    putarMusik();
    const input = document.getElementById("input-peserta");
    const nama = input.value.trim();
    if (nama === "") return alert("Ketik namanya dulu bos!");
    
    pesertas.push(nama);
    input.value = "";
    renderPot();
}

function kocokSatuPeserta() {
    putarMusik();
    if (isDrawing) return;
    if (pesertas.length === 0) return alert("Masukkan nama custom dulu di pot!");
    if (benderas.length === 0) return alert("Bendera habis!");

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
                <td><img src="${benderaTerpilih.url}" class="table-flag"></td>
                <td style="color: #fff;">${namaTerpilih}</td>
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
    pesertas = [];
    hasilKocokan = [];
    document.getElementById("draw-screen").innerHTML = `<div class="placeholder-text">Masukkan nama di atas terlebih dahulu...</div>`;
    document.getElementById("table-body").innerHTML = "";
    renderPot();
}

renderPot();
