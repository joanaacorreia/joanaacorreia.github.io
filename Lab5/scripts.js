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
const pinkButton = document.getElementById("pink-button");
const purpleButton = document.getElementById("purple-button");
const yellowButton = document.getElementById("yellow-button");

pinkButton.addEventListener("click", () => {
    title.style.color = "hotpink";
})

purpleButton.addEventListener("click", () => {
    title.style.color = "#BDB2FF";
})

yellowButton.addEventListener("click", () => {
    title.style.color = "#FDFD96";
})

// event 3
const textBox = document.getElementById("text-box");
const colours = ["lightblue", "lightgreen", "hotpink"];

textBox.addEventListener("input", () => {
    const randomColour = Math.floor(Math.random() * colours.length);
    textBox.style.backgroundColor = colours[randomColour];
})

// event 4
const themeSelector = document.getElementById("theme-selector");

themeSelector.addEventListener("change", () => {
    const chosenTheme = themeSelector.value;
    document.body.style.background = chosenTheme;
})

// event 5
