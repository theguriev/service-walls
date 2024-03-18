export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const id = getRouterParam(event, 'id')
  const exist = ModelWalls.findOne({
    _id: id,
    author
  })

  if (exist === null) {
    throw createError({ message: 'Wall not exists!', status: 409 })
  }

  return exist
})
