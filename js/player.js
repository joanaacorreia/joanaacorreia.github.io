function initPlayer() {
    const player = document.getElementById('player');
    const container = document.getElementById('player-container');

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

        if (Math.abs(diff) > 1) {
            currentX += diff * 0.12;
        } 
        else {
            currentX = targetX;
        }

        // player div is 128px wide, so it's offset by 64 to center it
        player.style.left = `${currentX - 64}px`;
        requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', (e) => {
        if (isAttacking) return;

        const diff = e.clientX - targetX;
        if (diff < -10) {
            setWalking('walk-left');
        } 
        else if (diff > 10) {
            setWalking('walk-right');
        }
        targetX = e.clientX;

        clearTimeout(idleTimer);
        idleTimer = setTimeout(setIdle, 150);
    });

    window.addEventListener('player-attack', attack);

    setIdle();
    loop();
}