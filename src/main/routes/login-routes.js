module.exports = router => {
  router.get('/login', (req, res) => {
    res.send({ status: 'OK' })
  })
}
