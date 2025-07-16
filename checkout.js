// 🛒 Retrieve cart data
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

// 🎯 Render cart items and total
document.getElementById("total").textContent = total;
const cartList = document.getElementById("cart-list");

cart.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = `${item.product} - €${item.price.toFixed(2)}`;
  cartList.appendChild(li);
});

// 💳 PayPal checkout integration
paypal
  .Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: { value: total },
          },
        ],
      });
    },

    onApprove: (data, actions) => {
      return actions.order.capture().then((details) => {
        alert("✅ Payment successful!");

        const orderData = {
          name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
          email: details.payer.email_address,
          cart: cart.map((item) => ({
            product: item.product,
            price: item.price,
          })),
          total: total,
          transactionId: details.id,
          timestamp: new Date().toISOString(),
        };

        // Store customer's name for thank-you page personalization
        localStorage.setItem("customerName", orderData.name);

        // 📝 Send order to Google Sheets via Apps Script
        fetch(
          "https://script.google.com/macros/s/AKfycbxNU4_2dI_RcNILr1Y_Zp23h2nHAKYZau0hbnr-GKYKecvT1abIVDb55JGmi4hkqJya/exec",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          }
        )
          .then((response) => response.text())
          .then((result) => {
            console.log("Order successfully logged:", result);
            localStorage.removeItem("cart");
            window.location.href = "thankyou.html";
          })
          .catch((error) => {
            console.error("❌ Logging error:", error);
            alert(
              "Payment succeeded, but we couldn’t log your order. Please contact support."
            );
          });
      });
    },

    onError: (err) => {
      console.error("💥 PayPal error:", err);
      alert("There was a problem processing your payment. Please try again.");
    },
  })
  .render("#paypal-button-container");
