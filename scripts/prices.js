

const productStore = {
  "orbea-laufey-h10": {
    oldPrice: 8495,
    newPrice: 8495
  },
 
  "orbea-laufey-h30": {
    oldPrice: 7495,
    newPrice: 7495
  },

  "orbea-laufey-h-ltd": {
    oldPrice: 11495,
    newPrice: 11495
  },

  "orbea-occam-sl-h30": {
    oldPrice: 13500,
    newPrice: 12995
  },

  "orbea-occam-lt-h30": {
    oldPrice: 13995,
    newPrice: 13000
  },

  "orbea-occam-sl-h10": {
    oldPrice: 13995,
    newPrice: 13995
  },

  "orbea-occam-lt-h10": {
    oldPrice: 16995,
    newPrice: 16995
  },

  "orbea-occam-sl-m30": {
    oldPrice: 19495,
    newPrice: 19495
  }
};

function calculateDiscount(oldPrice, newPrice) {
  return oldPrice > newPrice
    ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    : 0;
}

function syncProduct(productName) {
  const product = productStore[productName];
  const discount = calculateDiscount(product.oldPrice, product.newPrice);

  const elements = document.querySelectorAll(`[data-product="${productName}"]`);

  elements.forEach(el => {
    // Main page selectors
    const oldMain = el.querySelector(".old-price");
    const newMain = el.querySelector(".new-price");
    const discMain = el.querySelector(".discount-tab");

    if (newMain) newMain.textContent = `AED. ${product.newPrice}`;

    if (product.newPrice < product.oldPrice) {
      if (oldMain) {
        oldMain.textContent = `AED. ${product.oldPrice}`;
        oldMain.style.display = "inline"; // force visible
      }
      if (discMain) {
        discMain.textContent = `-${discount}%`;
        discMain.style.display = "block"; // force visible
      }
    } else {
      if (oldMain) oldMain.remove();
      if (discMain) discMain.remove();
    }

    // Carousel selectors
    const oldCard = el.querySelector(".card-old-price");
    const newCard = el.querySelector(".card-price");
    const discCard = el.querySelector(".card-discount");

    if (newCard) newCard.textContent = `AED. ${product.newPrice}`;

    if (product.newPrice < product.oldPrice) {
      if (oldCard) {
        oldCard.textContent = `AED. ${product.oldPrice}`;
        oldCard.style.display = "inline"; // force visible
      }
      if (discCard) {
        discCard.textContent = `-${discount}%`;
        discCard.style.display = "block"; // force visible
        newCard.style.color = "var(--tc-400)"; // highlight new price
      }
    } else {
      if (oldCard) oldCard.remove();
      if (discCard) discCard.remove();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  Object.keys(productStore).forEach(syncProduct);
});
