
// ========================================
// CAROUSEL FUNCTIONALITY (supports multiple carousels)
// ========================================


document.querySelectorAll('.carousel').forEach((carousel) => {
 const carouselItems = carousel.querySelector('.carousel-items');
 const leftArrow = carousel.querySelector('.carousel-arrow-left');
 const rightArrow = carousel.querySelector('.carousel-arrow-right');
 const scrollBar = carousel.querySelector('.carousel-scrollbar-fill');


 if (!carouselItems) return; // nothing to do


 // Calculate scroll amount based on first card width + gap
 function getScrollAmount() {
   const firstCard = carouselItems.querySelector('.card');
   if (!firstCard) return 300;


   const cardWidth = firstCard.offsetWidth; // includes border and padding
   const cardStyle = window.getComputedStyle(firstCard);
   const marginLeft = parseFloat(cardStyle.marginLeft) || 0;


   const gap = parseFloat(window.getComputedStyle(carouselItems).gap) || 0;
   return cardWidth + marginLeft + gap;
 }


  // Update scroll bar (if present)
 function updateScrollBar() {
   if (!scrollBar) return;
   const totalScroll = carouselItems.scrollWidth - carouselItems.clientWidth;
   if (totalScroll <= 0) {
     scrollBar.style.width = '0%';
     return;
   }
   const currentScroll = carouselItems.scrollLeft;
   const scrollPercentage = (currentScroll / totalScroll) * 100;
   scrollBar.style.width = Math.min(100, Math.max(0, scrollPercentage)) + '%';
 }


 // scroll using arrows
 function scrollRight() {
   const scrollAmount = getScrollAmount();
   carouselItems.scrollBy({ left: scrollAmount, behavior: 'smooth' });
 }


 function scrollLeft() {
   const scrollAmount = getScrollAmount();
   carouselItems.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
 }


 // grey out arrows when at start/end
 function updateArrows() {
   if (!leftArrow || !rightArrow) return;


   const maxScroll = carouselItems.scrollWidth - carouselItems.clientWidth;
   const currentScroll = carouselItems.scrollLeft;


   // disable left arrow if at start
   if (currentScroll <= 0) {
     leftArrow.classList.add('disabled');
   } else {
     leftArrow.classList.remove('disabled');
   }


   // disable right arrow if at end
   if (currentScroll >= maxScroll) {
     rightArrow.classList.add('disabled');
   } else {
     rightArrow.classList.remove('disabled');
   }
 }


 // Attach arrow events if arrows exist
 if (leftArrow) leftArrow.addEventListener('click', scrollLeft);
 if (rightArrow) rightArrow.addEventListener('click', scrollRight);


 // Update on manual scroll
 carouselItems.addEventListener('scroll', () => {
   updateScrollBar();
    updateArrows();
   });


 // Initialize visual state
 updateScrollBar();
 updateArrows();
});
