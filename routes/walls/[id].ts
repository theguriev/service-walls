export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const _id = getRouterParam(event, 'id')
  if (!isValidObjectId(_id)) {
    throw createError({ message: 'Invalid id!', status: 409 })
  }
  const exist = await ModelWalls.findOne({
    _id,
    author
  }).exec()
  if (exist === null) {
    throw createError({ message: 'Wall not exists!', status: 409 })
  }

  return exist.toJSON()
})
