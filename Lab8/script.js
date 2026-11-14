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
