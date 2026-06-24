const orderForm = document.querySelector("#orderForm");
const productInput = document.querySelector("#product");
const priceInput = document.querySelector("#price");
const quantityInput = document.querySelector("#quantity");
const totalInput = document.querySelector("#total");
const orderSection = document.querySelector("#order");

let selectedPrice = 0;

function selectProduct(name, price) {
  selectedPrice = Number(price);

  productInput.value = name;
  priceInput.value = `${selectedPrice} Kč`;
  quantityInput.value = 1;
  totalInput.value = `${selectedPrice} Kč`;

  orderSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function updateTotal() {
  const quantity = Number(quantityInput.value) || 1;
  const total = selectedPrice * quantity;

  totalInput.value = `${total} Kč`;
}

quantityInput.addEventListener("input", updateTotal);

orderForm.addEventListener("submit", () => {
  updateTotal();
});
