
module.exports = class LoadUserByUserRepository {
  constructor (users) {
    this.users = users
  }

  async load (email) {
    const user = await this.users.findOne({ email }, { projection: { password: 1 } })
    return user
  }
}
