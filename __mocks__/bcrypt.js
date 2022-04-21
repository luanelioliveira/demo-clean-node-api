module.exports = {
  isValid: true,
  data: '',
  hash: '',
  async compare (data, hash) {
    this.data = data
    this.hash = hash
    return this.isValid
  }
}
