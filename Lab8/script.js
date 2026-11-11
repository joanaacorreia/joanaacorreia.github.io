/* VARIABLES */

const listaProdutos = document.querySelector("#lista-produtos")
const listaCesto = document.querySelector("#lista-cesto")
const total = document.querySelector("#total")

const categoria = document.querySelector("#categoria")
const preco = document.querySelector("#preco")
const pesquisa = document.querySelector("#pesquisa")
const secaoCesto = document.querySelector("#cesto")

let produtos = []

// Get the saved basket from localStorage
const cesto = JSON.parse(localStorage.getItem("produtos-selecionados")) || []


// Create the checkout button
const botaoComprar = document.createElement("button")
botaoComprar.textContent = "Comprar"
botaoComprar.id = "comprar"

secaoCesto.append(botaoComprar)

// Message to display the checkout result
const mensagemCompra = document.createElement("p")
secaoCesto.append(mensagemCompra)


/* UTILITY FUNCTIONS */

// Save the basket in the browser
function guardarCesto() {
    localStorage.setItem("produtos-selecionados", JSON.stringify(cesto))
}


// Create a product card
function criarProduto(produto) {

    const artigo = document.createElement("article")

    const imagem = document.createElement("img")
    imagem.src = "https://deisishop.pythonanywhere.com" + produto.image
    imagem.alt = produto.title

    const titulo = document.createElement("h3")
    titulo.textContent = produto.title

    const tipo = document.createElement("p")
    tipo.textContent = produto.category

    const valor = document.createElement("p")
    valor.textContent = Number(produto.price).toFixed(2) + " €"
    valor.classList.add("preco")

    const botao = document.createElement("button")
    botao.textContent = "Adicionar ao cesto"

    botao.addEventListener("click", function() {

        cesto.push(produto.id)

        guardarCesto()
        atualizarCesto()
    })

    artigo.append(imagem)
    artigo.append(titulo)
    artigo.append(tipo)
    artigo.append(valor)
    artigo.append(botao)

    return artigo
}


// Create a product card for the basket
function criarProdutoCesto(produto, posicao) {

    const artigo = document.createElement("article")

    const imagem = document.createElement("img")
    imagem.src = "https://deisishop.pythonanywhere.com" + produto.image
    imagem.alt = produto.title

    const titulo = document.createElement("h3")
    titulo.textContent = produto.title

    const valor = document.createElement("p")
    valor.textContent = Number(produto.price).toFixed(2) + " €"
    valor.classList.add("preco")

    const botao = document.createElement("button")
    botao.textContent = "Remover"

    botao.addEventListener("click", function() {

        // Remove only the selected item
        cesto.splice(posicao, 1)

        guardarCesto()
        atualizarCesto()
    })

    artigo.append(imagem)
    artigo.append(titulo)
    artigo.append(valor)
    artigo.append(botao)

    return artigo
}


/* DISPLAY PRODUCTS */

function renderizarProdutos(lista) {

    listaProdutos.innerHTML = ""

    lista.forEach(function(produto) {

        const artigo = criarProduto(produto)
        listaProdutos.append(artigo)
    })

    if (lista.length === 0) {
        const mensagem = document.createElement("p")
        mensagem.textContent = "Nenhum produto encontrado."
        listaProdutos.append(mensagem)
    }
}


/* FILTER, SORT AND SEARCH */

function atualizarProdutos() {

    // Copy the array to keep the original product order
    let lista = [...produtos]

    const categoriaEscolhida = categoria.value
    const ordem = preco.value
    const texto = pesquisa.value.toLowerCase().trim()

    // Filter by category
    if (categoriaEscolhida !== "todos") {

        lista = lista.filter(function(produto) {

            const tipo = produto.category.toLowerCase()

            if (categoriaEscolhida === "tshirts") {
                return tipo === "t-shirts"
            }

            return tipo === categoriaEscolhida
        })
    }

    // Search by product title
    if (texto !== "") {

        lista = lista.filter(function(produto) {
            return produto.title.toLowerCase().includes(texto)
        })
    }

    // Sort by price
    if (ordem === "crescente") {

        lista.sort(function(a, b) {
            return a.price - b.price
        })

    } else if (ordem === "decrescente") {

        lista.sort(function(a, b) {
            return b.price - a.price
        })
    }

    renderizarProdutos(lista)
}


/* SHOPPING BASKET */

function atualizarCesto() {

    listaCesto.innerHTML = ""

    let soma = 0

    cesto.forEach(function(id, posicao) {

        // Find the product that matches the saved ID
        const produto = produtos.find(function(p) {
        return String(p.id) === String(id)
        })

        if (produto) {

            const artigo = criarProdutoCesto(produto, posicao)

            listaCesto.append(artigo)

            soma = soma + Number(produto.price)
        }
    })

    total.textContent = soma.toFixed(2) + " €"

    if (cesto.length === 0) {

        const mensagem = document.createElement("p")
        mensagem.textContent = "O teu cesto está vazio!"

        listaCesto.append(mensagem)
    }

    botaoComprar.disabled = cesto.length === 0
}


/* CHECKOUT */

function comprarProdutos() {

    if (cesto.length === 0) {
        mensagemCompra.textContent = "O cesto está vazio."
        return
    }

    const compra = {
        products: cesto
    }

    mensagemCompra.textContent = "A processar compra..."
    botaoComprar.disabled = true

    fetch("https://deisishop.pw.deisi.ulusofona.pt/buy", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(compra)
    })
    .then(resposta => {

        if (!resposta.ok) {
            throw new Error("Erro ao realizar a compra")
        }

        return resposta.json()
    })
    .then(dados => {

        console.log("Compra:", dados)

        if (dados.reference !== undefined && dados.total !== undefined) {

            mensagemCompra.textContent =
                "Referência: " + dados.reference +
                " | Total: " + dados.total + " €"

            // Clear the basket after a successful purchase
            cesto.length = 0
            guardarCesto()
            atualizarCesto()

        } else {
            mensagemCompra.textContent =
                "Resposta recebida. Verifica os dados da compra na consola."
        }
    })
    .catch(erro => {

        console.log("Erro:", erro)
        mensagemCompra.textContent = "Não foi possível realizar a compra."
    })
    .finally(function() {
        botaoComprar.disabled = cesto.length === 0
    })
}


/* EVENT LISTENERS */

categoria.addEventListener("change", atualizarProdutos)

preco.addEventListener("change", atualizarProdutos)

pesquisa.addEventListener("input", atualizarProdutos)

botaoComprar.addEventListener("click", comprarProdutos)


/* LOAD PRODUCTS FROM API */

fetch("https://deisishop.pw.deisi.ulusofona.pt/products")
    .then(resposta => {

        if (!resposta.ok) {
            throw new Error("Erro ao carregar produtos")
        }

        return resposta.json()
    })
    .then(dados => {

        // Accept an array or an object containing a products array
        if (Array.isArray(dados)) {
            produtos = dados
        } else if (Array.isArray(dados.products)) {
            produtos = dados.products
        } else {
            throw new Error("Formato dos produtos desconhecido")
        }

        atualizarProdutos()
        atualizarCesto()
    })
    .catch(erro => {

        console.log("Erro:", erro)
        listaProdutos.textContent = "Não foi possível carregar os produtos."
    })


    /* CHEAT SHEET */

/* ==========================================================
   EXERCISE 1 - CREATE HTML ELEMENTS AND CLICK EVENTS
   Original: Add a paragraph whenever a button is clicked.
   Lab 8: Add a shop message every time a button is clicked.
   ========================================================== */

// const botaoMensagem = document.createElement("button")
// botaoMensagem.textContent = "Mensagem"
// const caixaMensagens = document.createElement("div")
// secaoCesto.append(botaoMensagem)
// secaoCesto.append(caixaMensagens)

// botaoMensagem.addEventListener("click", function() { // Runs the function on every click
//     const mensagem = document.createElement("p") // Creates a new paragraph
//     mensagem.textContent = "Verifica os produtos antes de comprar." // Sets the paragraph text
//     caixaMensagens.append(mensagem) // Adds the paragraph without deleting previous ones
// }) // Ends the event listener


/* ==========================================================
   EXERCISE 2 - SUM NUMBERS FROM HTML ELEMENTS
   Original: Add together the numbers inside li elements.
   Lab 8: Calculate the sum of the product prices in the basket.
   ========================================================== */

// const botaoSoma = document.createElement("button") // Creates a button
// botaoSoma.textContent = "Calcular total" // Sets the button text
// const resultadoSoma = document.createElement("div") // Creates a div for the result
// secaoCesto.append(botaoSoma) // Adds the button to the page
// secaoCesto.append(resultadoSoma) // Adds the result div to the page

// botaoSoma.addEventListener("click", function() { // Executes when the button is clicked
//     const precos = listaCesto.querySelectorAll(".preco") // Selects all prices currently displayed in the basket
//     let soma = 0 // Starts the total at zero

//     precos.forEach(function(elemento) { // Goes through each price element
//         const valor = parseFloat(elemento.textContent.replace(",", ".")) // Converts the displayed price into a number
//         if (!Number.isNaN(valor)) { // Checks that the converted value is a valid number
//             soma = soma + valor // Adds the price to the total
//         } // Ends the condition
//     }) // Ends the loop

//     resultadoSoma.textContent = "Total: " + soma.toFixed(2) + " €" // Displays the calculated total
// }) // Ends the event listener


/* ==========================================================
   EXERCISE 3 - FUNCTIONS, ARRAYS AND FOREACH
   Original: Show each city's name and temperature.
   Lab 8: Show each product's name and price in the console.
   ========================================================== */

// function mostrarPrecos(lista) { // Creates a function that receives an array
//     lista.forEach(function(produto) { // Goes through each product in the array
//         const nome = produto.title // Gets the product name
//         const preco = Number(produto.price) // Converts the price into a number
//         console.log(nome + ": " + preco.toFixed(2) + " €") // Displays the name and price
//     }) // Ends the loop
// } // Ends the function

// mostrarPrecos(produtos) // Call this after the API has finished loading the products


/* ==========================================================
   EXERCISE 4 - LOCAL STORAGE
   Lab 8: Save the user's last search and restore it after
   refreshing the page.
   ========================================================== */

// const pesquisaGuardada = localStorage.getItem("ultima-pesquisa") // Gets the saved search text

// if (pesquisaGuardada !== null) { // Checks if a previous search exists
//     pesquisa.value = pesquisaGuardada // Restores the saved text into the search input
// } // Ends the condition

// pesquisa.addEventListener("input", function() { // Runs whenever the user types
//     localStorage.setItem("ultima-pesquisa", pesquisa.value) // Saves the current search text
// }) // Ends the event listener


// EXTRA - SAVING ARRAYS WITH LOCAL STORAGE

// const exemploCesto = [1, 7, 10] // Creates an array containing product IDs
// localStorage.setItem("exemplo-cesto", JSON.stringify(exemploCesto)) // Converts the array to JSON text and saves it
// const cestoGuardado = JSON.parse(localStorage.getItem("exemplo-cesto")) || [] // Converts the saved JSON text back into an array
// console.log(cestoGuardado) // Displays the restored array
// localStorage.removeItem("exemplo-cesto") // Deletes the example from localStorage


/* ==========================================================
   EXERCISE 5 - FETCH AND API
   Lab 8: Get products from the API and display only those
   that cost less than 15 euros.
   ========================================================== */

// const botaoApi = document.createElement("button") // Creates a button
// botaoApi.textContent = "Produtos abaixo de 15 €" // Sets the button text
// document.querySelector("#produtos").append(botaoApi) // Adds the button to the products section

// botaoApi.addEventListener("click", function() { // Runs when the button is clicked

//     fetch("https://deisishop.pw.deisi.ulusofona.pt/products")
//         .then(function(resposta) { // Receives the HTTP response
//             if (!resposta.ok) { // Checks whether the request was successful
//                 throw new Error("Erro ao obter produtos") // Creates an error if the request failed
//             } // Ends the condition
//             return resposta.json() // Converts the JSON response into JavaScript data
//         }) // Ends the first then

//         .then(function(dados) { // Receives the converted data
//             let listaApi = [] // Creates an empty array
//             if (Array.isArray(dados)) { // Checks whether the API returned an array
//                 listaApi = dados // Stores the returned array
//             } else if (dados && Array.isArray(dados.products)) { // Checks for an array inside a products property
//                 listaApi = dados.products // Stores that array
//             } // Ends the condition

//             const baratos = listaApi.filter(function(produto) { // Filters the API products
//                 return Number(produto.price) < 15 // Keeps products costing less than 15 euros
//             }) // Ends the filter

//             renderizarProdutos(baratos) // Displays the filtered products
//         }) // Ends the second then

//         .catch(function(erro) { // Handles request or processing errors
//             console.log("Erro:", erro) // Displays the error in the console
//         }) // Ends catch

// }) // Ends the button event listener


/* ==========================================================
   EXERCISE 6 - RATINGS, STARS AND SORTING
   Lab 8: Display product ratings, mark products with a star
   and sort products from highest to lowest rating.

   The Lab 7 data used rating.rate for the rating value.
   Check the API response to confirm the same structure.

   Giving a star here means marking a favourite locally.
   It does not change ratings on the API server.
   ========================================================== */


// PART A - GET THE PRODUCT RATING
// This function can be placed with the utility functions.

// function obterRating(produto) { // Creates a function that receives a product
//     if (produto.rating && typeof produto.rating === "object") { // Checks if rating is an object
//         return Number(produto.rating.rate) || 0 // Gets the rating from the object
//     } // Ends the condition
//     return Number(produto.rating) || 0 // Gets a numeric rating or uses zero
// } // Ends the function


// PART B - SAVE WHICH PRODUCTS HAVE A STAR
// This variable can be placed with the other global variables.

// const produtosComEstrela = JSON.parse(localStorage.getItem("produtos-estrela")) || [] // Loads starred product IDs


// PART C - DISPLAY THE RATING AND STAR BUTTON
// These lines would go inside criarProduto(), before return artigo.

// const classificacao = document.createElement("p") // Creates a paragraph for the rating
// classificacao.textContent = "Rating: " + obterRating(produto).toFixed(1) + " ★" // Displays the product rating
// const estrela = document.createElement("button") // Creates a button for starring the product
// const idProduto = String(produto.id) // Converts the product ID into text
// estrela.textContent = produtosComEstrela.includes(idProduto) ? "★ Com estrela" : "☆ Dar estrela" // Checks if the product is starred

// estrela.addEventListener("click", function() { // Runs when the star button is clicked
//     const posicao = produtosComEstrela.indexOf(idProduto) // Finds the product in the starred list
//     if (posicao === -1) { // Checks if the product is not already starred
//         produtosComEstrela.push(idProduto) // Adds the product to the starred list
//     } else { // Runs if the product already has a star
//         produtosComEstrela.splice(posicao, 1) // Removes its star
//     } // Ends the condition
//     localStorage.setItem("produtos-estrela", JSON.stringify(produtosComEstrela)) // Saves the starred IDs
//     atualizarProdutos() // Refreshes the product cards
// }) // Ends the event listener

// artigo.append(classificacao) // Adds the rating to the product card
// artigo.append(estrela) // Adds the star button to the product card


// PART D - ADD A RATING SORT OPTION
// These lines could be placed after the other dropdown setup.

// const opcaoRating = document.createElement("option") // Creates a new dropdown option
// opcaoRating.value = "rating" // Sets the option value
// opcaoRating.textContent = "Melhor avaliação" // Sets the visible option text
// preco.append(opcaoRating) // Adds the new option to the sorting dropdown


// PART E - SORT PRODUCTS BY RATING
// This condition would be added to the sorting logic
// inside atualizarProdutos(), after the existing price conditions.

// else if (ordem === "rating") { // Checks if rating sorting is selected
//     lista.sort(function(a, b) { // Sorts the products by rating
//         return obterRating(b) - obterRating(a) // Puts the highest-rated products first
//     }) // Ends sort
// } // Ends the condition
