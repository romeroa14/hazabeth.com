console.log('accedi a github');

console.log(window.ShopifyAnalytics.meta.product.variants);

document.addEventListener("DOMContentLoaded", () => {
  const descriptionTab = document.getElementById("description-tab");
  const sizeGuideTab = document.getElementById("size-guide-tab");
  const descriptionContent = document.getElementById("description-content");
  const sizeGuideContent = document.getElementById("size-guide-content");

  descriptionTab.addEventListener("click", () => {
    console.log('Descripción activada');
    descriptionTab.classList.add("active");
    sizeGuideTab.classList.remove("active");
    descriptionContent.classList.add("active");
    sizeGuideContent.classList.remove("active");
  });

  sizeGuideTab.addEventListener("click", () => {
    console.log('Guía de Tallas activada');
    sizeGuideTab.classList.add("active");
    descriptionTab.classList.remove("active");
    sizeGuideContent.classList.add("active");
    descriptionContent.classList.remove("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const decrementBtn = document.querySelector(".decrement");
  const incrementBtn = document.querySelector(".increment");
  const quantityInput = document.querySelector(".quantity-input");

  decrementBtn.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value, 10);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  incrementBtn.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value, 10);
    quantityInput.value = currentValue + 1;
  });
});

document.querySelectorAll('.size-option').forEach(button => {
  button.addEventListener('click', function() {
    // Remueve la clase 'active' de todos los botones
    document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
    
    // Agrega la clase 'active' al botón seleccionado
    this.classList.add('active');
    
    // Actualiza el ID de la variante en los botones
    const variantId = this.getAttribute('data-variant-id');
    document.querySelector('.add-to-cart-btn').setAttribute('data-product-id', variantId);
    document.querySelector('.buy-now-btn').setAttribute('data-product-id', variantId);
  });
});

document.querySelector('.add-to-cart-btn').addEventListener('click', function () {
    const variantId = this.getAttribute('data-variant-id');
    const quantity = document.querySelector('.quantity-input').value;

    if (!variantId) {
        alert('Error: No se encontró la variante.');
        return;
    }

    fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: variantId,
            quantity: parseInt(quantity),
        }),
    })
        .then((response) => {
            if (!response.ok) throw new Error('Error al agregar el producto al carrito.');
            return response.json();
        })
        .then((data) => {
            console.log('Producto agregado al carrito:', data);
          updateCartModal();
            // window.location.href = '/cart'; // Redirige al carrito
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al agregar el producto al carrito.');
        });
});

 

document.querySelector('.buy-now-btn').addEventListener('click', function () {
  const variantId = this.getAttribute('data-variant-id');
  const quantity = parseInt(document.querySelector('.quantity-input').value);

   fetch('/cart/clear.js', { // Limpia el carrito actual para asegurar que solo este producto esté en el checkout
    method: 'POST',
  })
    .then(() => {
      return fetch('/cart/add.js', { // Agrega el producto al carrito temporalmente
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify({
      id: variantId,
      quantity: quantity,
    }),
  });
         })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al agregar el producto al carrito.');
      }
      return response.json();
    })
    .then(() => {
      const checkoutUrl = `/checkout?updates[${variantId}]=${quantity}`;
      window.location.href = checkoutUrl;
      // window.location.href = '/checkout';
    })
    .catch((error) => {
      console.error('Error al comprar:', error);
      alert('Hubo un error al procesar la compra.');
    });
});

// Función para actualizar y mostrar el modal
function updateCartModal() {
  fetch('/cart.js')
    .then((response) => response.json())
    .then((cart) => {
      const cartItemsContainer = document.getElementById('cart-items');
      const cartSubtotal = document.getElementById('cart-subtotal');
      cartItemsContainer.innerHTML = '';
      
      // Renderiza cada producto del carrito
      cart.items.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
          <img src="${item.image}" alt="${item.title}" width="50">
          <p>${item.title} (${item.quantity})</p>
          <p>${item.line_price / 100}</p>
        `;
        cartItemsContainer.appendChild(itemElement);
      });

      // Actualiza el subtotal
      cartSubtotal.textContent = `Subtotal: $${cart.total_price / 100}`;

      // Muestra el modal
      const modal = document.getElementById('cart-modal');
      modal.classList.remove('hidden');

      // Agrega eventos para cerrar el modal
      document.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
      });

      document.getElementById('view-cart').addEventListener('click', () => {
        window.location.href = '/cart';
      });

      document.getElementById('checkout').addEventListener('click', () => {
        window.location.href = '/checkout';
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".upsell-add-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productId,
          quantity: 1,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al agregar el producto al carrito.");
          }
          return response.json();
        })
        .then(() => {
          // Actualiza el contenido del modal con los productos del carrito
          return fetch("/cart.js");
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener el carrito.");
          }
          return response.json();
        })
        .then((cartData) => {
          const modalContent = document.querySelector("#cart-modal .modal-content");
          const cartItemsContainer = document.querySelector("#cart-items");

          // Limpia el contenido actual
          cartItemsContainer.innerHTML = "";

          // Agrega los nuevos productos al modal
          cartData.items.forEach((item) => {
            const itemHTML = `
              <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image" />
                <div class="cart-item-details">
                  <p>${item.title} (${item.quantity})</p>
                  <p>${Shopify.formatMoney(item.line_price)}</p>
                </div>
              </div>
            `;
            cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
          });

          // Muestra el modal
          modalContent.classList.remove("hidden");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Hubo un problema al actualizar el carrito.");
        });
    });
  });

  // Botón para cerrar el modal
  document.querySelector(".close-modal").addEventListener("click", () => {
    document.querySelector("#cart-modal .modal-content").classList.add("hidden");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const productInfo = document.querySelector(".product-info");

  document.addEventListener("wheel", (event) => {
    if (productInfo.scrollHeight > productInfo.clientHeight) {
      const atBottom = productInfo.scrollTop + productInfo.clientHeight >= productInfo.scrollHeight;
      const atTop = productInfo.scrollTop === 0;

      if (!atBottom && event.deltaY > 0) {
        // Scroll down within product-info
        productInfo.scrollTop += event.deltaY;
        event.preventDefault();
      } else if (!atTop && event.deltaY < 0) {
        // Scroll up within product-info
        productInfo.scrollTop += event.deltaY;
        event.preventDefault();
      }
    }
  }, { passive: false });
});




