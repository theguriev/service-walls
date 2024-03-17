export default eventHandler(async (event) => {
  const oldRefreshToken = getCookie(event, 'refreshToken')
  const oldRefreshTokenDocument = await ModelToken.findOne({
    token: oldRefreshToken
  })

  if (oldRefreshTokenDocument === null) {
    throw createError({ message: 'Refresh token not found!', status: 404 })
  }
  const userId = oldRefreshTokenDocument.userId!
  const user = await ModelUser.findOne({ _id: userId })
  if (user === null) {
    throw createError({ message: 'User not found!', status: 404 })
  }

  const { save, deleteByUserId } = useTokens({
    event,
    userId,
    email: user.email!,
    name: user.name!
  })
  await deleteByUserId()
  await save()

  return user.toJSON()
})
