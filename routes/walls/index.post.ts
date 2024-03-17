const requestBodySchema = z.object({
  name: z.string().min(3).max(50)
})

export default eventHandler(async (event) => {
  const {
    name
  } = await zodValidateBody(event, requestBodySchema.parse)
  const author = await getUserId(event)
  const wallDocument = new ModelWalls({ name, timestamp: Date.now(), author })
  const userSaved = await wallDocument.save()
  return userSaved.toJSON()
})
