
// update availablity on size selection

document.addEventListener('DOMContentLoaded', () => {
  const sizeBoxes = document.querySelectorAll('.size-box');
  const availabilityBlock = document.querySelector('.availability');
  const info = availabilityBlock.querySelector('.availability-info');
  const notifyDropdown = document.querySelector('.notify-dropdown');
  const notifyYes = document.querySelector('.notify-yes');
  const notifyCancel = document.querySelector('.notify-cancel');

  // Hide availability block initially
  availabilityBlock.classList.add('transparent');

  sizeBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const size = box.textContent.trim();

      // reset availability and dropdown every time
      availabilityBlock.className = 'availability';
      notifyDropdown.classList.remove('open'); // collapse dropdown

      if (size === 'S') {
        availabilityBlock.classList.add('blue');
        info.textContent = 'Available';
      } else if (size === 'M') {
        availabilityBlock.classList.add('blue');
        info.textContent = 'Available';
      } else if (size === 'L') {
        availabilityBlock.classList.add('gray');
        info.textContent = 'Out of Stock';
        notifyDropdown.classList.add('open'); // smooth slide down
      } else if (size === 'XL') {
        availabilityBlock.classList.add('orange');
        info.textContent = 'Few bikes remaining';
      }
    });
  });

  notifyYes.addEventListener('click', () => {
    alert('This feature is not available in the demo version');
    notifyDropdown.classList.remove('open');
  });

  notifyCancel.addEventListener('click', () => {
    notifyDropdown.classList.remove('open'); // smooth slide up
  });
});