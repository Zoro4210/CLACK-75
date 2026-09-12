const colorData = {
  blossom: { label: "BLOSSOM PINK", stage: "01 — BLOSSOM", alt: "CLACK/75 mechanical keyboard in Blossom Pink" },
  cocoa: { label: "COCOA CREAM", stage: "02 — COCOA", alt: "CLACK/75 mechanical keyboard in Cocoa Cream" },
  butter: { label: "BUTTER POP", stage: "03 — BUTTER", alt: "CLACK/75 mechanical keyboard in Butter Pop" },
  mono: { label: "INK + PAPER", stage: "04 — MONO", alt: "CLACK/75 mechanical keyboard in Ink and Paper" }
};

const swatches = document.querySelectorAll(".swatch");
const productStage = document.querySelector("#productStage");
const configVisual = document.querySelector("#configVisual");
const stageColor = document.querySelector("#stageColor");
const selectedColor = document.querySelector("#selectedColor");
const productImage = document.querySelector("#productImage");
const configImage = document.querySelector("#configImage");
let currentColor = "blossom";

function applyColor(color) {
  currentColor = color;
  const data = colorData[color];
  [productStage, configVisual].forEach((element) => {
    element.classList.remove("color-blossom", "color-cocoa", "color-butter", "color-mono");
    element.classList.add(`color-${color}`);
  });
  stageColor.textContent = data.stage;
  selectedColor.textContent = data.label;
  productImage.alt = data.alt;
  configImage.alt = `${data.alt} color preview`;
  swatches.forEach((button) => {
    const active = button.dataset.color === color;
    button.classList.toggle("active", active);
    button.setAttribute("aria-checked", String(active));
  });
}

swatches.forEach((button) => button.addEventListener("click", () => applyColor(button.dataset.color)));

const wave = document.querySelector("#wave");
const keyMessage = document.querySelector("#keyMessage");
const testKeys = document.querySelectorAll(".test-key");

function animateKey(button) {
  button.classList.add("pressed");
  wave.classList.remove("active");
  void wave.offsetWidth;
  wave.classList.add("active");
  keyMessage.textContent = `${button.dataset.key} — THOCK!`;
  window.setTimeout(() => button.classList.remove("pressed"), 130);
}

testKeys.forEach((button) => button.addEventListener("click", () => animateKey(button)));
document.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  const button = [...testKeys].find((item) => item.dataset.key === event.key.toUpperCase());
  if (button) animateKey(button);
});

let bagCount = 0;
const toast = document.querySelector("#toast");
document.querySelector("#addToBag").addEventListener("click", () => {
  bagCount += 1;
  document.querySelector("#bagCount").textContent = bagCount;
  toast.querySelector("span").textContent = colorData[currentColor].label;
  toast.classList.add("show");
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
});

document.querySelectorAll("[data-scroll-buy]").forEach((button) => button.addEventListener("click", () => document.querySelector("#colors").scrollIntoView({ behavior: "smooth" })));
