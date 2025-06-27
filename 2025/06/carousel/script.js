class Carousel {
  constructor(id) {
    this.container = id;
    this.currentIndex = 0;

    this.track = document.querySelector(`#${this.container} .carousel__slides`);
    this.slides = this.track.children;

    this.btnPrev = document.querySelector(
      `#${this.container} .carousel__navigation__btn--prev`
    );
    this.btnNext = document.querySelector(
      `#${this.container} .carousel__navigation__btn--next`
    );

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    this.btnPrev.addEventListener("click", () => this.goPrev());
    this.btnNext.addEventListener("click", () => this.goNext());
  }

  goPrev() {
    this.currentIndex =
      this.currentIndex == 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.updateCarousel();
  }

  goNext() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
  }

  updateCarousel() {
    const translateX = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
  }
}

let carousel = null;
document.addEventListener("DOMContentLoaded", function (e) {
  carousel = new Carousel("carousel");
  window.carousel = carousel;
});
