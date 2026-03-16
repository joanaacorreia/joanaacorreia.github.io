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
    // name in binary
    const name = "01101010 01101111 01100001 01101110 01100001 00100000 01100011 01101111 01110010 01110010 01100101 01101001 01100001";
    const text = (name + ' ').repeat(12);

    for (let i = 0; i < 4; i++) {
        const row = document.createElement("div");
        row.className = "binary-row";
        row.textContent = text;
        binaryStrip.appendChild(row);
    }
}

// replaces an img with a fresh clone to reset animation
function swapImg(oldImg, newSrc, className) {
    const parent = oldImg.parentNode;
    const newImg = document.createElement('img');

    newImg.src = newSrc;
    newImg.className = className;
    newImg.id = oldImg.id;
    if (oldImg.alt) newImg.alt = oldImg.alt;

    oldImg.remove();
    // forces browser to recalculate the layout
    void parent.offsetWidth;
    parent.appendChild(newImg);

    return newImg;
}

function initPlayer() {
    const player = document.getElementById("player");
    const container = document.getElementById("player-container");

    let targetX = window.innerWidth / 2;
    let currentX = targetX;
    let lastDir = null;
    let idleTimer = null;
    let isAttacking = false;

    function getImg() {
        return document.getElementById('player-sprite');
    }

    function setIdle() {
        if (lastDir === 'idle') return;
        lastDir = 'idle';
        swapImg(getImg(), 'assets/character-spritesheet.png', 'pixelart');
        container.className = 'player-container idle';
    }

    function setWalking(dir) {
        if (lastDir === dir) return;
        lastDir = dir;
        swapImg(getImg(), 'assets/character-spritesheet.png', 'pixelart');
        container.className = `player-container ${dir}`;
    }

    function attack() {
        if (isAttacking) return;
        isAttacking = true;
        clearTimeout(idleTimer);

        const dir = lastDir === 'walk-left' ? 'attack-left' : 'attack-right';
        swapImg(getImg(), 'assets/character-spritesheet-attack.png', 'pixelart');
        container.className = `player-container ${dir}`;

        setTimeout(() => {
            isAttacking = false;
            setIdle();
        }, 320);
    }

    function loop() {
        const diff = targetX - currentX;

        // math.abs gives absolute value
        if (Math.abs(diff) > 1) {
            currentX += diff * 0.12;
        } else {
            currentX = targetX;
        }

        // player div is 128px wide, so it's offset by 64 to center it
        player.style.left = `${currentX - 64}px`;
        requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', (e) => {
        if (isAttacking) return;

        // e.clientX gives horizontal position of mouse
        const diff = e.clientX - targetX;

        // only update target if mouse moves more than 10px to prevent jitter
        if (diff < -10) setWalking('walk-left');
        else if (diff > 10) setWalking('walk-right');
        targetX = e.clientX;

        clearTimeout(idleTimer);
        idleTimer = setTimeout(setIdle, 150);
    });

    window.addEventListener('player-attack', attack);

    setIdle();
    loop();
}

document.addEventListener("DOMContentLoaded", function() {
    createParticles();
    createBinaryStrip();
    initPlayer();
});