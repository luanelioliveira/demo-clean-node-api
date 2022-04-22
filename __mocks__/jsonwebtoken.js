module.exports = {
  token: 'any_token',
  data: '',
  secret: '',
  sign (data, secret) {
    this.data = data
    this.secret = secret
    return this.token
  }
}
