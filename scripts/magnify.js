

document.addEventListener("DOMContentLoaded", () => {
    createMagnifyingIcon();
    
    // Initialize magnify functionality after icon is created
    const mainImageContainer = document.querySelector(".main-product-img-cont");
    const sourceContainer = document.querySelector(".bike-images-cont");
    
    if (mainImageContainer && sourceContainer) {
        magnifyImage(mainImageContainer, sourceContainer);
    }
});

function createMagnifyingIcon() {
    const container = document.querySelector(".main-product-img-cont");
    if (!container) return;

    const icon = document.createElement("div");
    icon.className = "magnify-icon";
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>`;

    container.appendChild(icon);
}

function magnifyImage(mainImageContainer, sourceContainer) {
    const icon = mainImageContainer.querySelector(".magnify-icon");
    const img = mainImageContainer.querySelector("img");

    if (!icon || !img) return;

    // Collect all images from sourceContainer
    const sourceImages = Array.from(sourceContainer.querySelectorAll("img"));
    const source = sourceImages.map(currentImage => currentImage.src);

    // Initialize currentIndex - find matching image or start at 0
    let currentIndex = source.indexOf(img.src);
    if (currentIndex === -1) {
        currentIndex = 0; // Start at first image if main image not found in carousel
    }

    // Create icons container
    const iconsCont = document.createElement("div");
    iconsCont.className = "magnify-icons-cont";

    // Create left arrow
    const leftArrow = document.createElement("div");
    leftArrow.className = "arrow-left";
    leftArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>`;

    // Create close icon (top right)
    const closeIcon = document.createElement("div");
    closeIcon.className = "close-icon";
    closeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
    
    // Create right arrow
    const rightArrow = document.createElement("div");
    rightArrow.className = "arrow-right";
    rightArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`;

    // Append icons into container
    iconsCont.append(leftArrow, closeIcon, rightArrow);
    mainImageContainer.append(iconsCont);

    // Hide icons container by default
    iconsCont.classList.add("hidden");

    // Toggle fullscreen
    icon.addEventListener("click", () => {
        mainImageContainer.classList.add("fullscreen");
        iconsCont.classList.remove("hidden");
        updateArrows();
    });

    // Close logic
    closeIcon.addEventListener("click", () => {
        mainImageContainer.classList.remove("fullscreen");
        iconsCont.classList.add("hidden");
    });

    // Keyboard logic
    const keyHandler = (e) => {
        if (!mainImageContainer.classList.contains("fullscreen")) return;
        if (e.key === "Escape") {
            mainImageContainer.classList.remove("fullscreen");
            iconsCont.classList.add("hidden");
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            nextImage();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevImage();
        }
    };

    document.addEventListener("keydown", keyHandler);

    // Arrow click handlers
    rightArrow.addEventListener("click", nextImage);
    leftArrow.addEventListener("click", prevImage);

    // --- Enable click on left/right side of fullscreen image to scroll ---
    img.addEventListener("click", function (e) {
        if (!mainImageContainer.classList.contains("fullscreen")) return;
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
            prevImage();
        } else {
            nextImage();
        }
    });

    // --- Enable swipe on fullscreen image to scroll ---
    let touchStartX = null;
    img.addEventListener("touchstart", function (e) {
        if (!mainImageContainer.classList.contains("fullscreen")) return;
        touchStartX = e.touches[0].clientX;
    });
    img.addEventListener("touchend", function (e) {
        if (!mainImageContainer.classList.contains("fullscreen")) return;
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 50;
        if (swipeDistance > minSwipeDistance) {
            prevImage();
        } else if (swipeDistance < -minSwipeDistance) {
            nextImage();
        }
        touchStartX = null;
    });

    function nextImage() {
        if (currentIndex < source.length - 1) {
            currentIndex++;
            img.src = source[currentIndex];
            updateArrows();
        }
    }

    function prevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            img.src = source[currentIndex];
            updateArrows();
        }
    }

    function updateArrows() {
        const leftSvg = leftArrow.querySelector("svg");
        const rightSvg = rightArrow.querySelector("svg");

        // Disable left arrow if at start
        if (currentIndex === 0) {
            leftSvg.classList.add("disabled");
        } else {
            leftSvg.classList.remove("disabled");
        }

        // Disable right arrow if at end
        if (currentIndex === source.length - 1) {
            rightSvg.classList.add("disabled");
        } else {
            rightSvg.classList.remove("disabled");
        }
    }
}