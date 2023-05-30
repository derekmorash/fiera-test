class MediaSlider extends HTMLElement {
  constructor() {
    super();

    const thumbsOptions = {
      spaceBetween: 5,
      slidesPerView: 'auto',
      freeMode: true,
      watchSlidesProgress: true,
    };

    this.thumbsContainer = this.querySelector('.media-thumbs');
    if (this.thumbsContainer) {
      this.thumbsSwiper = new Swiper(this.thumbsContainer, thumbsOptions);
    }

    const swiperOptions = {
      autoHeight: true,
      spaceBetween: 5,
      thumbs: {
        swiper: this.thumbsSwiper
      }
    };
    this.swiperContainer = this.querySelector('.media-slider');
    
    if (this.swiperContainer) {
      this.swiper = new Swiper(this.swiperContainer, swiperOptions);
    }
  }
}

customElements.define("media-slider", MediaSlider);
