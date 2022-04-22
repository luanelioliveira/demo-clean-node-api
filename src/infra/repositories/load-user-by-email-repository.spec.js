class LoadUserByUserRepository {
  async load (email) {
    return null
  }
}

describe('LoadUserByEmail Repository', () => {
  test('should return null if no user is found', async () => {
    const sut = new LoadUserByUserRepository()

    const user = await sut.load('invalid_email@mail.com')

    expect(user).toBe(null)
  })
})
