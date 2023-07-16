// @ts-nocheck

window.onload = () => {
   const mainNext = document.querySelector('.main__sliderNext')
   const mainPrev = document.querySelector('.main__sliderPrev')
   const mainSliderLine = document.querySelector('.main__sliderLine')
   const servItems = document.querySelectorAll('.services__item')
   const servDesc = document.querySelectorAll('.services__aboutItem')
   let aboutOffset = 0
   const galleryAbsoluteContainers = document.querySelectorAll('.gallery__abs')
   const galleryCategories = document.querySelectorAll('.gallery__item')
   const priceCategories = document.querySelectorAll('.price__category')
   const priceItems = document.querySelectorAll('.price__item')


   for (let i = 0; i < (mainSliderLine.offsetWidth / 640); i++) {
      if (i == 0) {
         document.querySelector('.main__sliderDots').insertAdjacentHTML('beforeend', '<div class="main__sliderDot selected"></div>')
      } else {
         document.querySelector('.main__sliderDots').insertAdjacentHTML('beforeend', '<div class="main__sliderDot"></div>')
      }
   }
   const mainDots = Array.from(document.querySelectorAll('.main__sliderDot'))

   let mainOffset = 0
   let mainDot = 0

   mainNext.addEventListener('click', () => {
      if ((mainOffset - 640) * -1 > mainSliderLine.offsetWidth - 640) {
         mainOffset = 0
         mainDot = 0

      } else {
         mainOffset -= 640
         mainDot += 1
      }
      mainDots.map((item, index) => {
         if (index == mainDot) {
            item.classList.add('selected')
         } else {
            item.classList.remove('selected')
         }
      })
      mainSliderLine.style.left = mainOffset + 'px'
   })

   mainPrev.addEventListener('click', () => {
      if ((mainOffset + 640) > 0) {
         mainOffset = mainSliderLine.offsetWidth * -1 + 640
         mainDot = (mainSliderLine.offsetWidth / 640 - 1)
      } else {
         mainOffset += 640
         mainDot -= 1
      }
      mainDots.map((item, index) => {
         if (index == mainDot) {
            item.classList.add('selected')
         } else {
            item.classList.remove('selected')
         }
      })
      mainSliderLine.style.left = mainOffset + 'px'
   })


   document.querySelector('.main__sliderDots').style.left = `${(document.querySelector('.main__slider').offsetWidth - document.querySelector('.main__sliderDots').offsetWidth) / 2}px`

   servItems.forEach(item => {
      item.addEventListener('click', (e) => {
         for (let i of servDesc) {
            if (i.dataset.id != item.dataset.id) {
               i.classList.add('disabled')
            } else {
               i.classList.remove('disabled')
            }
         }
         for (let j of servItems) {
            if (e.target.closest('.services__item').dataset.id == j.dataset.id) {
               e.target.closest('.services__item').classList.add('selected')
            } else {
               j.classList.remove('selected')
            }
         }
      })
   })

   const timerId = setTimeout(function aboutTick() {
      document.querySelector('.about__bubbleLine').style.left = `${aboutOffset}px`
      if (aboutOffset - 320 < 320 * -2) {
         aboutOffset = 0
      } else {
         aboutOffset -= 320
      }
      timerIdTwo = setTimeout(aboutTick, 5000)
   }, 5000)
   galleryCategories.forEach((item) => {
      item.addEventListener('click', (e) => {
         for (let i of galleryAbsoluteContainers) {
            if (i.dataset.id == e.target.closest('.gallery__item').dataset.id) {
               i.style.top = `${window.pageYOffset}px`
               document.querySelector('body').classList.add('lock')
            }
         }
      })
   })
   document.querySelectorAll('.gallery__absTitle span').forEach(item => {
      item.addEventListener('click', (e) => {
         e.target.closest('.gallery__abs').style.top = '-100%'
         document.querySelector('body').classList.remove('lock')
      })
   })
   priceCategories.forEach(item => {
      item.addEventListener('click', (e) => {
         for (let i of priceItems) {
            if (i.dataset.id == e.target.dataset.id) {
               i.classList.remove('disabled')
            } else { i.classList.add('disabled'); }
         }
         for (let i of priceCategories) {
            if (i.dataset.id == item.dataset.id) {
               i.classList.add('selected')
            } else {
               i.classList.remove('selected')
            }
         }
      })
   })
}