const nav = document.querySelector('#nav');
const open = document.querySelector('#open');
const close = document.querySelector('#close');

open.addEventListener('click', () => {
  nav.classList.add('visible');
});

close.addEventListener('click', () => {
    nav.classList.remove('visible');
});

function setupCarousel(carouselId, cardSelector, containerSelector) {
  let index = 0;
  const carousel = document.getElementById(carouselId);
  const cards = document.querySelectorAll(cardSelector);
  const total = cards.length;
  const container = document.querySelector(containerSelector);

  let cardWidth = cards[0].offsetWidth + 40;
  let visibleCards = Math.floor(container.offsetWidth / cardWidth);

  function updateSizes() {
    cardWidth = cards[0].offsetWidth + 40;
    visibleCards = Math.floor(container.offsetWidth / cardWidth);
  }

  function move(direction) {
    updateSizes();
    const maxIndex = total - visibleCards;
    if ((direction === -1 && index === 0) ||
        (direction === 1 && index >= maxIndex)) return;
    index += direction;
    carousel.style.transform = `translateX(${-index * cardWidth}px)`;
  }

  window.addEventListener("resize", updateSizes);

  return move;
}

// Usar para cada carrusel
const moveMain = setupCarousel("carousel", ".card", ".carousel-container");
const moveValues = setupCarousel("valuesCarousel", ".values-card", ".values-cards-container");

