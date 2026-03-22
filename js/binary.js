function createBinaryStrip() {
    const binaryStrip = document.getElementById('binary-strip');
    // name in binary
    const name = '01101010 01101111 01100001 01101110 01100001 00100000 01100011 01101111 01110010 01110010 01100101 01101001 01100001';
    const text = (name + ' ').repeat(12);

    for (let i = 0; i < 4; i++) {
        const row = document.createElement('div');
        row.className = 'binary-row';
        row.textContent = text;
        binaryStrip.appendChild(row);
    }
}