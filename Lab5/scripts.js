// event 1
const interactiveBox = document.getElementById("hover-target");

interactiveBox.addEventListener("mouseenter", () => {
    interactiveBox.textContent = "Pompompurin";
})

interactiveBox.addEventListener("mouseleave", () => {
    interactiveBox.textContent = "Hover over me!";
})

// event 2
const title = document.getElementById("paint-title");
const swatchButtons = document.querySelectorAll(".colour-swatch");

swatchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const colour = btn.dataset.color;
        title.style.color = colour;
    })
});

// event 3
const textBox = document.getElementById("text-box");
const colours = ["lightblue", "lightgreen", "hotpink"];

textBox.addEventListener("input", () => {
    const randomColour = Math.floor(Math.random() * colours.length);
    textBox.style.backgroundColor = colours[randomColour];
})

// event 4
const themeSelector = document.getElementById("theme-selector");

themeSelector.addEventListener("change", function() {
    let chosenTheme = this.value;
    document.body.style.background = chosenTheme;
})

// event 5
const flexSelector = document.getElementById("flex-selector");
const flexContainer = document.getElementById("flex-container");

flexSelector.addEventListener("change", () => {
    const chosenFlex = flexSelector.value;
    flexContainer.style.flexDirection = chosenFlex;
})

// event 6
const form = document.getElementById("user-form");
const nameInput = document.getElementById("name-input");
const ageInput = document.getElementById("age-input");
const formOutput = document.getElementById("form-output");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const insertedName = nameInput.value;
    const insertedAge = ageInput.value;

    formOutput.textContent = `Olá, a/o ${insertedName} tem ${insertedAge} anos!`;
})

// event 7
const counterDisplay = document.getElementById("counter-value");
const incrementButton = document.getElementById("btn-increment");
const decrementButton = document.getElementById("btn-decrement");
const resetButton = document.getElementById("btn-reset");

if (!localStorage.getItem("counterDisplay")) {
    localStorage.setItem("counterDisplay", 0);
}

let currentCount = Number(localStorage.getItem("counterDisplay"));
counterDisplay.textContent = currentCount;

incrementButton.addEventListener("click", () => {
    currentCount++;
    localStorage.setItem("counterDisplay", currentCount);
    counterDisplay.textContent = currentCount;
})

decrementButton.addEventListener("click", () => {
    currentCount--;
    localStorage.setItem("counterDisplay", currentCount);
    counterDisplay.textContent = currentCount;
})

resetButton.addEventListener("click", () => {
    currentCount = 0;
    localStorage.setItem("counterDisplay", currentCount);
    counterDisplay.textContent = currentCount;
})
