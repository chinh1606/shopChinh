if (!localStorage.getItem("cartCount")) {
  localStorage.setItem("cartCount", "0");
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.innerText = totalItems;
  }
  localStorage.setItem("cartCount", totalItems);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
  // Swal.fire({
  //   title: "Thành công!",
  //   text: "Sản phẩm đã được thêm vào giỏ hàng!",
  //   icon: "success",
  //   confirmButtonText: "OK",
  // });
  updateCartCount();
}

function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  let totalPrice = 0;

  cart.forEach((product, index) => {
    const productTotal = product.price * product.quantity;
    totalPrice += productTotal;

    const row = document.createElement("tr");

    row.innerHTML = `
          <td><img src="${product.image}" alt="${product.name}" width="50"> ${
      product.name
    }</td>
          <td>${product.price.toLocaleString()} VND</td>
          <td>
            <input type="number" value="${
              product.quantity
            }" min="1" class="form-control quantity-input" data-index="${index}">
          </td>
          <td>${productTotal.toLocaleString()} VND</td>
          <td>
            <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Xóa</button>
          </td>
        `;

    cartItemsContainer.appendChild(row);
  });

  const totalPriceElement = document.getElementById("total-price");
  if (totalPriceElement) {
    totalPriceElement.textContent = totalPrice.toLocaleString();
  }
}

function updateQuantity(index, quantity) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = quantity;
    saveCart(cart);
    displayCart();
    updateCartCount();
  }
}

function removeFromCart(index) {
  const cart = getCart();
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    updateCartCount();
  }
}

function clearCart() {
  localStorage.removeItem("cart");
  localStorage.setItem("cartCount", "0");
  updateCartCount();
  displayCart();
}

function initAddToCartButtons() {
  const buttons = document.querySelectorAll(".btn-add-to-cart");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const productElement =
        this.closest(".product") || this.closest("#product-detail-container");
      const priceText = productElement.querySelector(".clrchange").innerText;
      const price = parseFloat(
        priceText.replace(" VND", "").replace(/\./g, "")
      );

      const product = {
        id:
          productElement.dataset.id ||
          productElement.querySelector(".btn-add-to-cart").dataset.id,
        name: productElement.querySelector("h2").innerText,
        price: price,
        image: productElement.querySelector("img").src,
      };

      addToCart(product);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll(".btn-add-to-cart").length) {
    initAddToCartButtons();
  }

  if (document.getElementById("cart-items")) {
    displayCart();

    document.getElementById("cart-items").addEventListener("change", (e) => {
      if (e.target.classList.contains("quantity-input")) {
        const index = e.target.getAttribute("data-index");
        const quantity = parseInt(e.target.value);
        if (quantity > 0) {
          updateQuantity(index, quantity);
        }
      }
    });

    document.getElementById("cart-items").addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const index = e.target.getAttribute("data-index");
        removeFromCart(index);
      }
    });

    const checkoutBtn = document.querySelector(".btn-primary");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        const cart = getCart();
        if (cart.length === 0) {
          Swal.fire({
            title: "Giỏ hàng trống!",
            text: "Vui lòng thêm sản phẩm trước khi thanh toán.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          window.location.href = "checkout.html";
        }
      });
    }
  }

  updateCartCount();
});
