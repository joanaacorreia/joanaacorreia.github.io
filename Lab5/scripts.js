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
