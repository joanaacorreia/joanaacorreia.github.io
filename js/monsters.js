function initMonsters() {
    const groundWidth = window.innerWidth;
    const wraps = document.querySelectorAll('.monster-wrap');

    wraps.forEach((wrap, i) => {
        const id = wrap.dataset.id;
        const spawn = (groundWidth / (wraps.length + 1)) * (i + 1);
        wrap.style.left = `${spawn}px`;

        monsterStates[id] = {
            x: spawn,
            dir: 1,
            speed: 0.4 + Math.random() * 0.5,
            walkTimer: Math.floor(Math.random() * 120) + 60,
            pauseTimer: 0,
            isDead: false,
            lastDirClass: '',
        };

        function getContainer() { 
            return document.getElementById(`sprite-container-${id}`); 
        }

        function getImg() { 
            return document.getElementById(`monster-sprite-${id}`); 
        }

        function roam() {
            const state = monsterStates[id];

            requestAnimationFrame(roam);

            if (state.isDead || sectionOpen) return;

            if (state.pauseTimer > 0) {
                state.pauseTimer--;

                const container = getContainer();
                if (container && state.lastDirClass !== '') {
                    state.lastDirClass = '';
                    container.className = 'monster-sprite-container';
                }
                return;
            }

            state.x += state.dir * state.speed;

            if (state.x < 40) { 
                state.x = 40;              
                state.dir = 1; 
            }
            else if (state.x > groundWidth - 40) { 
                state.x = groundWidth - 40; 
                state.dir = -1; 
            }

            const dirClass = state.dir === -1 ? 'walk-left' : 'walk-right';
            const newSrc = state.dir === -1
                ? 'assets/monster-walk-left-spritesheet.png'
                : 'assets/monster-walk-right-spritesheet.png';

            const monsterContainer = getContainer();
            const monsterImg = getImg();

            if (monsterContainer && monsterImg) {
                // only update sprite if direction changed
                if (dirClass !== state.lastDirClass) {
                    state.lastDirClass = dirClass;
                    swapImg(monsterImg, newSrc, 'monster-sprite pixelart');
                    monsterContainer.className = `monster-sprite-container ${dirClass}`;
                }
            }

            wrap.style.left = `${state.x}px`;

            state.walkTimer--;
            if (state.walkTimer <= 0) {
                state.pauseTimer = Math.floor(Math.random() * 80) + 40;
                state.walkTimer = Math.floor(Math.random() * 120) + 60;
                // 50% chance to flip direction when pausing
                if (Math.random() < 0.5) {
                    state.dir *= -1;
                }
            }

            // prevent monsters from overlapping
            const minDistance = 80;
            Object.entries(monsterStates).forEach(([otherId, otherState]) => {
                if (otherId === id || otherState.isDead) return;

                const distance = state.x - otherState.x;
                if (Math.abs(distance) < minDistance) {
                    // push away from the other
                    state.dir = distance > 0 ? 1 : -1;
                    state.x += state.dir * state.speed * 2;
                }
            });
        }

        roam();

        const spriteContainer = document.getElementById(`sprite-container-${id}`);
        spriteContainer.addEventListener('click', () => {
            const state = monsterStates[id];
            if (state.isDead || sectionOpen) return;
            openSection(id, wrap);
});
    });
}