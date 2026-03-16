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

document.addEventListener("DOMContentLoaded", function() {
    createParticles();
});