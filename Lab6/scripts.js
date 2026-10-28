
/* VARIABLES */

const nodeInputNumero = document.getElementById("number-input")
const nodeInputSubmit = document.getElementById("submit-input")

const nodeUlColecao = document.querySelector("#lista-colecao")
const nodeUlRepetidos = document.querySelector("#lista-repetidos")

const nodeTotalCromos = document.querySelector("#total-cromos")
const nodeTotalRepetidos = document.querySelector("#total-repetidos")

const nodeForm = document.querySelector("form")

// Load saved arrays, or create empty arrays
const colecao = JSON.parse(localStorage.getItem("colecao")) || []
const repetidos = JSON.parse(localStorage.getItem("repetidos")) || []


/* EVENT HANDLERS */

function guardaCarta() {

    // Get the number written by the user
    const numero = Number(nodeInputNumero.value)

    // Check if the number already exists
    if (colecao.includes(numero)) {

        // If it exists, add it to repeated cromos
        repetidos.push(numero)

    } else {

        // If it doesn't exist, add it to the collection
        colecao.push(numero)
    }

    // Sort both arrays numerically
    colecao.sort((a, b) => a - b)
    repetidos.sort((a, b) => a - b)

    // Update the lists on the page
    atualizaLista(colecao, nodeUlColecao)
    atualizaLista(repetidos, nodeUlRepetidos)

    // Save both arrays
    guardaDados()

    // Clear the input
    nodeInputNumero.value = ""
}


/* UPDATE LIST */

function atualizaLista(lista, nodeUl) {

    // Remove the old content
    nodeUl.innerHTML = ""

    // Go through every number in the array
    lista.forEach(function(numero) {

        // Create a new li element
        const nodeLi = document.createElement("li")

        // Put the cromo number inside
        nodeLi.textContent = numero

        // If this is the repeated list, add a delete button
        if (nodeUl === nodeUlRepetidos) {

            const nodeButton = document.createElement("button")

            nodeButton.textContent = "Eliminar"

            // Remove the cromo when the button is clicked
            nodeButton.addEventListener("click", function() {
                eliminaRepetido(numero)
            })

            nodeLi.append(nodeButton)
        }

        // Add the li to the ul
        nodeUl.append(nodeLi)
    })

    // Update the counters
    nodeTotalCromos.textContent = colecao.length
    nodeTotalRepetidos.textContent = repetidos.length
}


/* DELETE REPEATED CROMO */

function eliminaRepetido(numero) {

    // Find the position of the cromo
    const posicao = repetidos.indexOf(numero)

    // Remove one occurrence
    if (posicao !== -1) {
        repetidos.splice(posicao, 1)
    }

    // Update the repeated list
    atualizaLista(repetidos, nodeUlRepetidos)

    // Save the changes
    guardaDados()
}


/* LOCAL STORAGE */

function guardaDados() {

    localStorage.setItem("colecao", JSON.stringify(colecao))
    localStorage.setItem("repetidos", JSON.stringify(repetidos))
}


/* EVENT LISTENERS */

nodeForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault()

    // Add the cromo
    guardaCarta()
})


/* LOAD SAVED DATA */

atualizaLista(colecao, nodeUlColecao)
atualizaLista(repetidos, nodeUlRepetidos)
