const orderForm = document.getElementById("orderForm");
const cartItems = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const cartQuantity = document.getElementById("cartQuantity");
const totalInput = document.getElementById("total");
const totalDisplay = document.getElementById("totalDisplay");
const formProductTitle = document.getElementById("formProductTitle");
const cartStatus = document.getElementById("cartStatus");
const toast = document.getElementById("toast");
const cart = new Map();
let toastTimer;

function formatPrice(value) {
  return new Intl.NumberFormat("cs-CZ").format(value) + " Kč";
}
function normalizeQuantity(value) {
  return Math.min(999, Math.max(1, Math.floor(Number(value) || 1)));
}
function updateSummary() {
  const items = Array.from(cart.values());
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartSummary.value = items.map(item =>
    item.name + " (" + item.variant + ") — " + item.quantity + " ks × " +
    formatPrice(item.price) + " = " + formatPrice(item.price * item.quantity)
  ).join("\n");
  cartQuantity.value = count;
  totalInput.value = formatPrice(total);
  totalDisplay.textContent = formatPrice(total);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartEmpty").hidden = items.length > 0;
  formProductTitle.textContent = items.length ? "Produktů: " + items.length + " · Kusů: " + count : "Váš košík je prázdný";
  document.querySelectorAll(".product-select button").forEach(button => {
    button.classList.toggle("active", cart.has(button.dataset.product));
  });
}
function renderCart() {
  cartItems.replaceChildren();
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    const info = document.createElement("div");
    info.className = "cart-item-info";
    const name = document.createElement("strong");
    name.textContent = item.name;
    const detail = document.createElement("small");
    detail.textContent = item.variant + " · " + formatPrice(item.price) + "/ks";
    info.append(name, detail);
    const controls = document.createElement("div");
    controls.className = "quantity-control";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Odebrat kus: " + item.name);
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "999";
    input.step = "1";
    input.value = item.quantity;
    input.setAttribute("aria-label", "Počet kusů: " + item.name);
    const subtotal = document.createElement("strong");
    subtotal.className = "cart-subtotal";
    subtotal.textContent = formatPrice(item.quantity * item.price);
    input.addEventListener("input", () => {
      item.quantity = normalizeQuantity(input.value);
      subtotal.textContent = formatPrice(item.quantity * item.price);
      updateSummary();
    });
    input.addEventListener("change", () => { input.value = item.quantity; });
    minus.addEventListener("click", () => {
      if (item.quantity === 1) cart.delete(item.name);
      else item.quantity--;
      renderCart();
    });
    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "＋";
    plus.setAttribute("aria-label", "Přidat kus: " + item.name);
    plus.addEventListener("click", () => {
      item.quantity = normalizeQuantity(item.quantity + 1);
      renderCart();
    });
    controls.append(minus, input, plus);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-remove";
    remove.textContent = "Odebrat";
    remove.setAttribute("aria-label", "Odebrat z košíku: " + item.name);
    remove.addEventListener("click", () => { cart.delete(item.name); renderCart(); });
    row.append(info, controls, subtotal, remove);
    cartItems.append(row);
  });
  updateSummary();
}
document.querySelectorAll("[data-product]").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.product;
    const existing = cart.get(name);
    if (existing) existing.quantity = normalizeQuantity(existing.quantity + 1);
    else cart.set(name, { name, price: Number(button.dataset.price), variant: button.dataset.variant, quantity: 1 });
    cartStatus.textContent = "";
    renderCart();
    clearTimeout(toastTimer);
    toast.textContent = name + " přidán do košíku";
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  });
});
orderForm.addEventListener("submit", event => {
  updateSummary();
  if (!cart.size) {
    event.preventDefault();
    cartStatus.textContent = "Přidejte prosím alespoň jeden produkt do košíku.";
    document.querySelector(".product-select button").focus();
  }
});
renderCart();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".product-card, .story-content, .order-form").forEach((element) => {
  element.classList.add("reveal");
  observer.observe(element);
});