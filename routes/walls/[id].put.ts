const requestBodySchema = z.object({
  name: z.string().min(3).max(50)
})

export default eventHandler(async (event) => {
  const author = await getUserId(event)
  const id = getRouterParam(event, 'id')
  const {
    name
  } = await zodValidateBody(event, requestBodySchema.parse)
  const wallExist = ModelWalls.findOne({
    _id: id,
    author
  })

  if (wallExist === null) {
    throw createError({ message: 'Wall not exists!', status: 409 })
  }

  await ModelWalls.updateOne(
    {
      _id: id
    },
    {
      $set: {
        name
      }
    }
  )

  const updatedWall = await ModelWalls.findOne({
    _id: id
  })
  return updatedWall?.toJSON()
})
