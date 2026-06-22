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
let groups = { 'A': [], 'B': [], 'C': [], 'D': [] };
let groupOrder = ['A', 'B', 'C', 'D'];
let currentGroupIndex = 0;
let isDrawing = false; // Mencegah klik ganda saat animasi berjalan

function renderPot() {
    const potContainer = document.getElementById("pot-teams");
    potContainer.innerHTML = "";
    if (pesertas.length === 0) {
        potContainer.innerHTML = "<span style='color: #64748b; font-style: italic;'>Semua peserta sudah dikocok!</span>";
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
    const input = document.getElementById("input-peserta");
    const nama = input.value.trim();
    if (nama === "") return alert("Ketik namanya dulu bro!");
    pesertas.push(nama);
    input.value = "";
    renderPot();
}

function kocokSatuPeserta() {
    if (isDrawing) return; // Kunci tombol jika sedang mengacak
    if (pesertas.length === 0) return alert("Pot kosong!");
    if (benderas.length === 0) return alert("Bendera habis!");

    isDrawing = true;
    const screen = document.getElementById("draw-screen");

    // --- PROSES ANIMASI ACAKAN ACAK SECARA VISUAL (0.8 Detik) ---
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

    // --- KUNCI HASIL ASLI (Setelah 800ms) ---
    setTimeout(() => {
        clearInterval(intervalAcak);

        const indexPeserta = Math.floor(Math.random() * pesertas.length);
        const namaTerpilih = pesertas.splice(indexPeserta, 1)[0];

        const indexBendera = Math.floor(Math.random() * benderas.length);
        const benderaTerpilih = benderas.splice(indexBendera, 1)[0];

        // Tampilkan hasil final di panggung tengah dengan efek cetar
        screen.innerHTML = `
            <div class="animated-result">
                <img src="${benderaTerpilih.url}">
                <span style="color: var(--accent-color); text-transform: uppercase;">⚡ ${namaTerpilih} ⚡</span>
            </div>`;

        // Pindahkan ke Papan Grup setelah jeda 1 detik biar puas ngeliat hasilnya
        setTimeout(() => {
            const currentGroupLetter = groupOrder[currentGroupIndex];
            groups[currentGroupLetter].push({ nama: namaTerpilih, flag: benderaTerpilih.url });

            const groupUl = document.querySelector(`#group-${currentGroupLetter} .team-list`);
            const li = document.createElement("li");
            li.className = "team-item";
            li.innerHTML = `
                <span style="color: #64748b; font-size: 13px; margin-right: 4px;">#${groups[currentGroupLetter].length}</span>
                <img src="${benderaTerpilih.url}" class="flag-img">
                <span>${namaTerpilih}</span>
            `;
            groupUl.appendChild(li);

            // Bersihkan layar tengah kembali ke default
            screen.innerHTML = `<div class="placeholder-text">Menunggu kocokan berikutnya...</div>`;
            
            renderPot();
            currentGroupIndex = (currentGroupIndex + 1) % 4;
            isDrawing = false; // Buka kunci tombol
        }, 1200);

    }, 800);
}

function resetDraw() {
    if (isDrawing) return;
    benderas = [...bankBendera];
    pesertas = [...daftarPesertaAwal];
    groups = { 'A': [], 'B': [], 'C': [], 'D': [] };
    currentGroupIndex = 0;
    document.getElementById("draw-screen").innerHTML = `<div class="placeholder-text">Klik tombol di bawah untuk mengocok...</div>`;
    groupOrder.forEach(letter => {
        document.querySelector(`#group-${letter} .team-list`).innerHTML = "";
    });
    renderPot();
}

renderPot();
