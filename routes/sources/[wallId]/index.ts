export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const wallId = getRouterParam(event, 'wallId')
  return await ModelSources.find({ author, wallId })
})
