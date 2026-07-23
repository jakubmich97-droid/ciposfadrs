const productInput = document.getElementById("product");
const priceInput = document.getElementById("price");
const variantInput = document.getElementById("variant");
const quantityInput = document.getElementById("quantity");
const totalInput = document.getElementById("total");
const totalDisplay = document.getElementById("totalDisplay");
const formProductTitle = document.getElementById("formProductTitle");
const orderForm = document.getElementById("orderForm");
const toast = document.getElementById("toast");

let selectedPrice = 0;
let toastTimer;

function formatPrice(value) {
  return new Intl.NumberFormat("cs-CZ").format(value) + " Kč";
}

function updateTotal() {
  const quantity = Math.max(1, Number.parseInt(quantityInput.value, 10) || 1);
  quantityInput.value = quantity;
  const total = selectedPrice * quantity;
  totalInput.value = selectedPrice ? formatPrice(total) : "";
  totalDisplay.textContent = selectedPrice ? formatPrice(total) : "— Kč";
}

function showToast() {
  clearTimeout(toastTimer);
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function selectProduct(name, price, variant, shouldScroll = false) {
  productInput.value = name;
  priceInput.value = formatPrice(price);
  variantInput.value = variant;
  selectedPrice = Number(price);
  formProductTitle.textContent = name + " · " + variant;

  document.querySelectorAll(".product-select button").forEach((button) => {
    button.classList.toggle("active", button.dataset.product === name);
  });

  updateTotal();
  if (shouldScroll) {
    document.getElementById("objednavka").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast();
  }
}

document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => {
    selectProduct(
      button.dataset.product,
      Number(button.dataset.price),
      button.dataset.variant,
      button.classList.contains("product-button")
    );
  });
});

document.getElementById("quantityMinus").addEventListener("click", () => {
  quantityInput.value = Math.max(1, Number(quantityInput.value) - 1);
  updateTotal();
});

document.getElementById("quantityPlus").addEventListener("click", () => {
  quantityInput.value = Number(quantityInput.value || 1) + 1;
  updateTotal();
});

quantityInput.addEventListener("input", updateTotal);

orderForm.addEventListener("submit", (event) => {
  if (!productInput.value) {
    event.preventDefault();
    formProductTitle.textContent = "Vyberte prosím produkt";
    document.querySelector(".product-select").scrollIntoView({ behavior: "smooth", block: "center" });
    showToast();
    toast.textContent = "Nejdřív vyberte produkt";
    setTimeout(() => { toast.textContent = "Produkt přidán do objednávky"; }, 2400);
  }
});

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