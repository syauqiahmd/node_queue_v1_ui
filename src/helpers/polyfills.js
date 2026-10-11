// Array.prototype.at is missing before Chrome 92 / Firefox 90 / Safari 15.4. web-vitals
// (loaded by Faro) calls it, so older browsers throw "x.at is not a function".
if (!Array.prototype.at) {
  Object.defineProperty(Array.prototype, 'at', {
    value: function at(index) {
      const n = Math.trunc(index) || 0
      const i = n < 0 ? this.length + n : n
      return i >= 0 && i < this.length ? this[i] : undefined
    },
    writable: true,
    configurable: true,
  })
}
