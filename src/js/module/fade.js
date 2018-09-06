export default class Fade {
  constructor(el = 'msg') {
    this.el = document.getElementById(el)
    this.init()
  }

  init() {
    this.duration = 300
    this.limitEnd = 1
    this.limitStart = 0
    if (document.getElementById(this.el)) {
      this.fadeOut()
    }
  }

  fadeOut() {
    this.el.style.opacity = 1
    this.startOut = performance.now()
    requestAnimationFrame(this.tickOut.bind(this))
  }

  tickOut(timestamp) {
    const easing = (timestamp - this.startOut) / this.duration
    if (easing < this.limitEnd) {
      this.el.style.opacity = Math.max(this.limitEnd - easing, this.limitStart)
      requestAnimationFrame(this.tickOut.bind(this))
    } else {
      this.fadeIn()
    }
  }

  fadeIn() {
    this.el.textContent = 'webpack'
    this.el.style.color = 'blue'
    this.startIn = performance.now()
    requestAnimationFrame(this.tickIn.bind(this))
  }

  tickIn(timestamp) {
    const easing = (timestamp - this.startIn) / this.duration
    if (easing < this.limitEnd) {
      this.el.style.opacity = Math.min(easing, this.limitEnd)
      requestAnimationFrame(this.tickIn.bind(this))
    } else {
      this.el.style.opacity = ''
      this.el.style.display = 'block'
    }
  }
}
