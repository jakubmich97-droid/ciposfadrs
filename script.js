const productInput = document.getElementById("productName");
const priceInput = document.getElementById("productPrice");

function selectProduct(name, price) {
    productInput.value = name;
    priceInput.value = price;

    document.getElementById("objednavka").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
        if (!productInput.value) {
            e.preventDefault();
            alert("Nejprve vyberte produkt.");
            return;
        }
    });
});
// Animace karet při scrollování

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.15
    }
);

document.querySelectorAll(".product-card").forEach((card) => {
    card.classList.add("hidden");
    observer.observe(card);
});
