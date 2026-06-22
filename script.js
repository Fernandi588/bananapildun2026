// --- LOGIKA TAMBAHAN UNTUK MUSIK BACKSOUND ---
const musik = document.getElementById("bg-music");
const btnMusik = document.getElementById("btn-musik");

function toggleMusik() {
    if (musik.paused) {
        musik.play().catch(error => {
            console.log("Autoplay diblokir oleh browser, butuh interaksi user klik tombol terlebih dahulu.");
        });
        btnMusik.innerHTML = "⏸️ Pause Waka Waka";
        btnMusik.style.background = "var(--accent-color)";
        btnMusik.style.color = "#000";
    } else {
        musik.pause();
        btnMusik.innerHTML = "🎵 Play Waka Waka";
        btnMusik.style.background = "rgba(13, 28, 46, 0.8)";
        btnMusik.style.color = "#fff";
    }
}

// Opsional: Musik otomatis mencoba berputar begitu user mengklik tombol "KAMPANYE UNDIAN" pertama kali
document.getElementById("draw-btn").addEventListener("click", function() {
    if (musik.paused) {
        toggleMusik();
    }
});
