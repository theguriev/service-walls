export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const id = getRouterParam(event, 'id')
  await ModelWalls.deleteOne({
    _id: id,
    author
  })
  const walls = await ModelWalls.find({
    author
  })
  return walls
})
