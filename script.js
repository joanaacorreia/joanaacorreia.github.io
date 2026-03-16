function createParticles() {
    const particles = document.getElementById("particles");

    for (let i = 0; i < 30; i++) {
        const orb = document.createElement("div");
        orb.className = "orb";

        orb.style.left = `${Math.random() * 100}%`;
        orb.style.top = `${Math.random() * 70}%`;
        orb.style.animationDuration = `${(3 + Math.random() * 5).toFixed(1)}s`;
        orb.style.animationDelay = `${(Math.random() * 3).toFixed(1)}s`;

        particles.appendChild(orb);
    }
}

function createBinaryStrip() {
    const binaryStrip = document.getElementById("binary-strip");
    // my name in binary
    const name = "01101010 01101111 01100001 01101110 01100001 00100000 01100011 01101111 01110010 01110010 01100101 01101001 01100001";
    const text = (name + ' ').repeat(12);

    for (let i = 0; i < 4; i++) {
        const row = document.createElement("div");
        row.className = "binary-row";
        row.textContent = text;
        binaryStrip.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    createParticles();
    createBinaryStrip();
});