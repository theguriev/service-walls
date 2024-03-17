export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const wallId = getRouterParam(event, 'wallId')
  const id = getRouterParam(event, 'id')
  await ModelSources.deleteOne({
    _id: id,
    author,
    wallId
  })
  const items = await ModelSources.find({
    author,
    wallId
  })
  return items
})
