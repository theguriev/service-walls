const requestBodySchema = z.object({
  name: z.string().min(3).max(50),
  type: z.enum(['instagram', 'facebook', 'x'])
})

export default eventHandler(async (event) => {
  const {
    name,
    type
  } = await zodValidateBody(event, requestBodySchema.parse)
  const wallId = getRouterParam(event, 'wallId')
  const author = await getUserId(event)
  const doc = new ModelSources({ name, timestamp: Date.now(), author, wallId, type })
  const saved = await doc.save()
  return saved.toJSON()
})
