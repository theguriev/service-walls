const requestBodySchema = z.object({
  name: z.string().min(3).max(50),
  type: z.enum(['instagram', 'facebook', 'x'])
})

export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const wallId = getRouterParam(event, 'wallId')
  const id = getRouterParam(event, 'id')
  const {
    name,
    type
  } = await zodValidateBody(event, requestBodySchema.parse)
  const exist = await ModelSources.findOne({
    _id: id,
    author,
    wallId
  }).exec()

  if (exist === null) {
    throw createError({ message: 'Source not exists!', status: 409 })
  }

  await ModelSources.updateOne(
    {
      _id: id
    },
    {
      $set: {
        name,
        type
      }
    }
  )

  const updated = await ModelSources.findOne({
    _id: id
  }).exec()
  return updated?.toJSON()
})
