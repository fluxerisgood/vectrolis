// 🛒 Load cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

// 📋 Render cart items and total
const cartList = document.getElementById("cart-list");
const totalElement = document.getElementById("total");

if (cartList && totalElement) {
  cartList.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.product} <span>€${item.price.toFixed(2)}</span>`;
    cartList.appendChild(li);
  });
  totalElement.textContent = total;
}

// 💳 PayPal button
paypal.Buttons({
  createOrder: (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: { value: total }
      }]
    });
  },

  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      alert("✅ Payment successful!");

      // 📝 Build order object
      const orderData = {
        name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
        email: details.payer.email_address,
        cart: cart.map(item => ({ product: item.product, price: item.price })),
        total: total,
        transactionId: details.id,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem("customerName", orderData.name);

      // 📤 Log order to Google Sheets via Apps Script
      fetch("https://script.google.com/macros/s/AKfycbz1-7Rox-lLLlBm5pDrpgZ_agiQz41Ot_fta3zCdl8ptq0juLEzaDQ-6VH59SnulXxC/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      })
      .then(res => res.text())
      .then(response => {
        console.log("🧾 Order logged:", response);
        localStorage.removeItem("cart");
        window.location.href = "thankyou.html";
      })
      .catch(error => {
        console.error("❌ Logging error:", error);
        alert("Payment succeeded, but we couldn’t log your order. Please contact support.");
      });
    });
  },

  onError: (err) => {
    console.error("💥 PayPal error:", err);
    alert("There was a problem with your payment. Please try again.");
  }
}).render("#paypal-button-container");
