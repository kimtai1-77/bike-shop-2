
// ========================================
// COMPARE LIGHTBOX FUNCTIONALITY
// ========================================

/**

 * 
 * @param {Object} hostPageData - Data from the current/host page
 * @param {string} hostPageData.title - Product name/title
 * @param {HTMLElement} hostPageData.imgElement - Image element to clone
 * @param {HTMLElement} hostPageData.contentElement - Content wrapper to clone
 * 
 * @param {Object} targetPageData - Data from the page being compared
 * @param {string} targetPageData.title - Product name/title
 * @param {HTMLElement} targetPageData.imgElement - Image element to clone
 * @param {HTMLElement} targetPageData.contentElement - Content wrapper to clone
 */


function normalizeKey(title) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

function createCompareLightbox(hostPageData, targetPageData) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'compare-overlay';

  // Create lightbox container
  const lightbox = document.createElement('div');
  lightbox.className = 'compare-lightbox';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'compare-close-btn';
  closeBtn.setAttribute('aria-label', 'Close comparison');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => overlay.remove());

  // Main comparison container
  const compareContainer = document.createElement('div');
  compareContainer.className = 'compare-container';

  // --- LEFT SIDE ---
  const leftSide = document.createElement('div');
  leftSide.className = 'compare-side compare-side-left';

  const leftHeader = document.createElement('div');
  leftHeader.className = 'compare-header';

  const leftTitle = document.createElement('div');
  leftTitle.className = 'compare-title';
  leftTitle.textContent = hostPageData.title;

  const leftPrice = document.createElement('div');
  leftPrice.className = 'compare-price-cont';

  const leftKey = normalizeKey(hostPageData.title);
  if (productStore[leftKey]) {
    const newPriceEl = document.createElement('span');
    newPriceEl.className = 'new-price';
    newPriceEl.textContent = `AED. ${productStore[leftKey].newPrice}`;
    leftPrice.appendChild(newPriceEl);
    //hideCompareExtras(leftPrice);
  }

  leftHeader.appendChild(leftTitle);
  leftHeader.appendChild(leftPrice);
  leftSide.appendChild(leftHeader);

  const leftContentCont = document.createElement('div');
  leftContentCont.className = 'compare-content-cont';

  const leftImgSection = document.createElement('div');
  leftImgSection.className = 'compare-img';
  leftImgSection.appendChild(hostPageData.imgElement.cloneNode(true));
  leftImgSection.querySelector('.magnify-icon')?.remove();

  const leftContentSection = document.createElement('div');
  leftContentSection.className = 'compare-content';
  leftContentSection.appendChild(hostPageData.contentElement.cloneNode(true));

  leftContentCont.appendChild(leftImgSection);
  leftContentCont.appendChild(leftContentSection);

  leftSide.appendChild(leftContentCont);
  compareContainer.appendChild(leftSide);

  // --- RIGHT SIDE ---
  const rightSide = document.createElement('div');
  rightSide.className = 'compare-side compare-side-right';

  const rightHeader = document.createElement('div');
  rightHeader.className = 'compare-header';

  const rightTitle = document.createElement('div');
  rightTitle.className = 'compare-title';
  rightTitle.textContent = targetPageData.title;

  const rightPrice = document.createElement('div');
  rightPrice.className = 'compare-price-cont';

  const rightKey = normalizeKey(targetPageData.title);
  if (productStore[rightKey]) {
    const newPriceEl = document.createElement('span');
    newPriceEl.className = 'new-price';
    newPriceEl.textContent = `AED. ${productStore[rightKey].newPrice}`;
    rightPrice.appendChild(newPriceEl);
    //hideCompareExtras(rightPrice);
  }

  rightHeader.appendChild(rightTitle);
  rightHeader.appendChild(rightPrice);
  rightSide.appendChild(rightHeader);

  const rightContentCont = document.createElement('div');
  rightContentCont.className = 'compare-content-cont';

  const rightImgSection = document.createElement('div');
  rightImgSection.className = 'compare-img';
  rightImgSection.appendChild(targetPageData.imgElement.cloneNode(true));
  rightImgSection.querySelector('.magnify-icon')?.remove();

  const rightContentSection = document.createElement('div');
  rightContentSection.className = 'compare-content';
  rightContentSection.appendChild(targetPageData.contentElement.cloneNode(true));

  rightContentCont.appendChild(rightImgSection);
  rightContentCont.appendChild(rightContentSection);

  rightSide.appendChild(rightContentCont);

  // Divider + assembly
  const divider = document.createElement('div');
  divider.className = 'compare-divider';
  compareContainer.appendChild(divider);
  compareContainer.appendChild(rightSide);

  // Assemble lightbox
  lightbox.appendChild(closeBtn);
  lightbox.appendChild(compareContainer);
  overlay.appendChild(lightbox);
  document.body.appendChild(overlay);

  // Final cleanup
  hideCompareExtras(lightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}



// --- Dynamic helper: fetch page and extract required elements ---
async function fetchPageDataFromUrl(url) {
  try {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Failed to fetch target page');
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const titleEl = doc.querySelector('.name-box');
    const imgEl = doc.querySelector('.main-product-img-cont');
    const priceEl = doc.querySelector('.price-cont');
    // Try the more specific combined classes first, then fall back
    let contentEl = doc.querySelector('.wrapper.mid-section.dark-section');
    if (!contentEl) contentEl = doc.querySelector('.wrapper.mid-section');
    if (!contentEl) contentEl = doc.querySelector('.wrapper');

    return {
      title: titleEl ? titleEl.textContent.trim() : doc.title || '',
      imgElement: imgEl || document.createElement('div'),
      priceElement: priceEl || document.createElement('div'),
      contentElement: contentEl || document.createElement('div')
    };
  } catch (err) {
    console.error('Error fetching page data:', err);
    throw err;
  }
}

// --- Build host data from current document ---
function gatherHostPageData() {
  const titleEl = document.querySelector('.name-box');
  const imgEl = document.querySelector('.main-product-img-cont');
  const priceEl = document.querySelector('.price-cont');
  let contentEl = document.querySelector('.wrapper.mid-section.dark-section');
  if (!contentEl) contentEl = document.querySelector('.wrapper.mid-section');
  if (!contentEl) contentEl = document.querySelector('.wrapper');

  return {
    title: titleEl ? titleEl.textContent.trim() : document.title || '',
    imgElement: imgEl || document.createElement('div'),
    priceElement: priceEl || document.createElement('div'),
    contentElement: contentEl || document.createElement('div')
  };
}

// --- Click handler for compare buttons ---
async function handleCompareButtonClick(event) {
  event.preventDefault();
  const btn = event.currentTarget;

  // Find closest anchor for the target URL (cards are wrapped in <a>)
  const cardAnchor = btn.closest('a');
  if (!cardAnchor) return console.warn('Compare button not inside a link/card');
  const href = cardAnchor.getAttribute('href');
  if (!href) return console.warn('No href found on card link');

  try {
    // Gather host data from the current page
    const hostData = gatherHostPageData();

    // Show loading indicator while fetching remote page
    showCompareLoader();

    // Fetch and gather target page data
    const targetData = await fetchPageDataFromUrl(href);
    // Open compare lightbox with gathered data
    createCompareLightbox(hostData, targetData);
    // hide loader after creating lightbox
    hideCompareLoader();
  } catch (err) {
    // Graceful fallback: show simple message
    hideCompareLoader();
    alert('Unable to open comparison - One or more key details is missing.\n\nPlease inform us about it through the \'contact\' tab.');
  }
}

// --- Loading indicator helpers ---
function ensureCompareLoader() {
  if (document.querySelector('.compare-loader-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'compare-loader-overlay';
  overlay.innerHTML = `<div class="compare-loader"><div class="spinner"></div><div class="compare-loader-text">Loading comparison…</div></div>`;
  document.body.appendChild(overlay);
}

function showCompareLoader() {
  ensureCompareLoader();
  const el = document.querySelector('.compare-loader-overlay');
  if (el) el.style.display = 'flex';
}

function hideCompareLoader() {
  const el = document.querySelector('.compare-loader-overlay');
  if (el) el.style.display = 'none';
}

// Expose a global function so the compare behaviour can be attached via HTML `onclick`
// Usage in HTML: <button onclick="openCompare(this)">Compare</button>
// The function accepts either an Event or an HTMLElement (the clicked element).
window.openCompare = async function openCompare(elOrEvent) {
  let btn = elOrEvent;
  // If passed an Event, get the currentTarget or target
  if (btn && btn.currentTarget) btn = btn.currentTarget;
  if (btn && btn.target) btn = btn.target;

  // If a DOM element wrapper was passed (e.g. this from onclick), use it
  if (!(btn instanceof HTMLElement)) {
    console.warn('openCompare: expected an Event or HTMLElement');
    return;
  }

  // Find closest anchor for the target URL (cards are wrapped in <a>)
  const cardAnchor = btn.closest('a');
  if (!cardAnchor) return console.warn('Compare button not inside a link/card');
  const href = cardAnchor.getAttribute('href');
  if (!href) return console.warn('No href found on card link');

  try {
    const hostData = gatherHostPageData();
    showCompareLoader();
    const targetData = await fetchPageDataFromUrl(href);
    createCompareLightbox(hostData, targetData);
    hideCompareLoader();
  } catch (err) {
    hideCompareLoader();
    alert('Unable to open comparison - One or more key details is missing.\n\nPlease inform us about it through the \'contact\' tab.');
  }
};




function hideCompareExtras(container) {
  const oldPrice = container.querySelector('.old-price');
  if (oldPrice) oldPrice.style.display = 'none';

  const discountTab = container.querySelector('.discount-tab');
  if (discountTab) discountTab.style.display = 'none';
}
