let numero = 0;
let corAtual = 0;

function passarPorAqui() {
  const frase = document.querySelector("#passa");
  frase.textContent = "Obrigado por passares!";
}

function sair() {
  const frase = document.querySelector("#passa");
  frase.textContent = "Passa por aqui!";
}

function pintar(cor) {
  const frase = document.querySelector("#pinta");
  frase.style.color = cor;
}

function escrever() {
  const texto = document.querySelector("#escrever");

  if (texto.value.length > 0) {
    corAtual++;

    if (corAtual === 1) {
      texto.style.backgroundColor = "blue";
    } else if (corAtual === 2) {
      texto.style.backgroundColor = "red";
    } else if (corAtual === 3) {
      texto.style.backgroundColor = "yellow";
      corAtual = 0;
    }
  }
}

function apagar() {
  const texto = document.querySelector("#escrever");

  if (texto.value.length === 0) {
    texto.style.backgroundColor = "darkgray";
    corAtual = 0;
  }
}

function mudarFundo() {
  const cor = document.querySelector("#cor");

  document.body.style.backgroundColor = cor.value;
}

function contar() {
  numero++;

  const resultado = document.querySelector("#numero");
  resultado.textContent = numero;
}
