export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const wallId = getRouterParam(event, 'wallId')
  const id = getRouterParam(event, 'id')
  const exist = await ModelSources.findOne({
    _id: id,
    author,
    wallId
  }).exec()

  if (exist === null) {
    throw createError({ message: 'Source not exists!', status: 409 })
  }

  return exist.toJSON()
})
