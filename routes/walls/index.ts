export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const walls = await ModelWalls.find({ author })
  return walls
})
