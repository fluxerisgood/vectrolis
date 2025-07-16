// Load cart from localStorage or start fresh
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🛒 Add item to cart and save
function addToCart(product, price) {
  cart.push({ product, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`✅ "${product}" added to cart`);

  const cartIcon = document.querySelector(".cart-link");
  if (cartIcon) {
    cartIcon.classList.add("added");
    setTimeout(() => cartIcon.classList.remove("added"), 300);
  }

  updateCartCount();
}

// 🧮 Show cart count
function updateCartCount() {
  const count = cart.length;
  const counter = document.querySelector(".cart-count");
  if (counter) counter.textContent = count;
}

// 📦 Load products from JSON and display
function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  fetch("products.json")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((p) => {
        const card = document.createElement("div");
        card.className = "product";
        card.innerHTML = `
          <img src="${p.image}" alt="${p.title}" />
          <h2>${p.title}</h2>
          <p class="price">€${p.price.toFixed(2)}</p>
          <p class="desc">${p.description}</p>
          <button onclick="addToCart('${p.title}', ${
          p.price
        })">Add to Cart</button>
        `;
        container.appendChild(card);
      });
    })
    .catch((err) => console.error("🛑 Failed to load products:", err));
}

// 🚀 Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadProducts();
});
