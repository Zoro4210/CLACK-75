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
const testKeys = document.querySelectorAll(".test-key");

function animateKey(button) {
  button.classList.add("pressed");
  wave.classList.remove("active");
  void wave.offsetWidth;
  wave.classList.add("active");
  window.setTimeout(() => button.classList.remove("pressed"), 130);
}

testKeys.forEach((button) => button.addEventListener("click", () => animateKey(button)));
document.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  const button = [...testKeys].find((item) => item.dataset.key === event.key.toUpperCase());
  if (button) animateKey(button);
});

const toast = document.querySelector("#toast");
const bag = {};
const unitPrice = 109.99;
const bagDrawer = document.querySelector("#bagDrawer");
const bagOverlay = document.querySelector("#bagOverlay");
const bagItems = document.querySelector("#bagItems");
const bagSummary = document.querySelector("#bagSummary");
const bagCount = document.querySelector("#bagCount");
const bagTotal = document.querySelector("#bagTotal");
const openBagButton = document.querySelector("#openBag");
const closeBagButton = document.querySelector("#closeBag");

function renderBag() {
  const entries = Object.entries(bag).filter(([, quantity]) => quantity > 0);
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  bagCount.textContent = count;
  bagTotal.textContent = `€${(count * unitPrice).toFixed(2)}`;
  bagSummary.hidden = count === 0;

  if (count === 0) {
    bagItems.innerHTML = `<div class="bag-empty"><strong>YOUR BAG IS QUIET.</strong><p>Choose a color and add a CLACK/75 to make some noise.</p><button type="button" data-close-bag>CHOOSE A KEYBOARD ↓</button></div>`;
    return;
  }

  bagItems.innerHTML = entries.map(([color, quantity]) => `
    <article class="bag-item" data-bag-color="${color}">
      <div class="bag-item-swatch ${color}" aria-hidden="true"></div>
      <div class="bag-item-copy"><strong>CLACK/75 B75 PRO</strong><span>${colorData[color].label}</span></div>
      <span class="bag-item-price">€${(quantity * unitPrice).toFixed(2)}</span>
      <div class="bag-controls">
        <div class="quantity" aria-label="Quantity for ${colorData[color].label}">
          <button type="button" data-bag-action="decrease" aria-label="Decrease quantity">−</button>
          <span>${quantity}</span>
          <button type="button" data-bag-action="increase" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-item" type="button" data-bag-action="remove">REMOVE</button>
      </div>
    </article>`).join("");
}

function openBag() {
  renderBag();
  bagOverlay.hidden = false;
  bagDrawer.classList.add("open");
  bagDrawer.setAttribute("aria-hidden", "false");
  openBagButton.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  closeBagButton.focus();
}

function closeBag() {
  bagDrawer.classList.remove("open");
  bagDrawer.setAttribute("aria-hidden", "true");
  openBagButton.setAttribute("aria-expanded", "false");
  bagOverlay.hidden = true;
  document.body.style.overflow = "";
  openBagButton.focus();
}

document.querySelector("#addToBag").addEventListener("click", () => {
  bag[currentColor] = (bag[currentColor] || 0) + 1;
  renderBag();
  toast.querySelector("span").textContent = colorData[currentColor].label;
  toast.classList.add("show");
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
});

openBagButton.addEventListener("click", openBag);
closeBagButton.addEventListener("click", closeBag);
bagOverlay.addEventListener("click", closeBag);
document.querySelector("#continueShopping").addEventListener("click", closeBag);

bagItems.addEventListener("click", (event) => {
  const closeTrigger = event.target.closest("[data-close-bag]");
  if (closeTrigger) {
    closeBag();
    document.querySelector("#colors").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const actionButton = event.target.closest("[data-bag-action]");
  if (!actionButton) return;
  const item = actionButton.closest("[data-bag-color]");
  const color = item.dataset.bagColor;
  const action = actionButton.dataset.bagAction;
  if (action === "increase") bag[color] += 1;
  if (action === "decrease") bag[color] = Math.max(0, bag[color] - 1);
  if (action === "remove") bag[color] = 0;
  renderBag();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bagDrawer.classList.contains("open")) closeBag();
});

renderBag();
