// 1
inscritos = document.querySelector("div"); fetch
(`http://ulusofona.pt/curso?params=alunos`) .then((response) => response.json())
.then((data) => { inscritos.textContent = `Alunos inscritos em DIW:
${data.alunos.DIW}`; })

// 2
const name = document.querySelector("#nome");
const course = document.querySelector("#curso");
const button = document.querySelector("#registar")
const result = document.querySelector("#resultado")

function registerStudent() {
    fetch("https://exemplo.pt/api/alunos", {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            nome: "Ana", curso: "DIW"
        })
    })

    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}, ${response.statusText}`);
        }

        return response.json();
    })

    .then(data => {
        result.textContent = "Aluno registado: " + data.aluno.nome + " - " + data.aluno.curso;
    })

    .catch(error => {
        result.textContent = "Erro: " + error.message
    });

}
button.onclick = registerStudent
