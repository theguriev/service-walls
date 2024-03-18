export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const wallId = getRouterParam(event, 'wallId')
  const _id = getRouterParam(event, 'id')
  if (!isValidObjectId(_id)) {
    throw createError({ message: 'Invalid id!', status: 409 })
  }
  const exist = await ModelSources.findOne({
    _id,
    author,
    wallId
  }).exec()

  if (exist === null) {
    throw createError({ message: 'Source not exists!', status: 409 })
  }

  return exist.toJSON()
})
