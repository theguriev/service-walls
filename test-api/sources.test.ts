import issueAccessToken from '@/utils/issueAccessToken'

describe('sources', () => {
  const secret = String(process.env.NITRO_SECRET)
  const accessToken = issueAccessToken({ userId: '123', email: 'test@test.com', name: 'some name' }, { secret })
  let postedId: string
  const wallId = '123'

  describe('GET /sources/[wallId]', () => {
    it('gets 200 items array', async () => {
      await $fetch(`/sources/${wallId}`, {
        baseURL: 'http://localhost:3000',
        headers: {
          Accept: 'application/json',
          Cookie: `accessToken=${accessToken};`
        },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data).toBeInstanceOf(Array)
        }
      })
    })
  })

  describe('POST /sources', () => {
    it('gets 400 on validation errors', async () => {
      await $fetch(`/sources/${wallId}`, {
        baseURL: 'http://localhost:3000',
        method: 'POST',
        ignoreResponseError: true,
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        body: { name: '1', type: 'no type' },
        onResponse: ({ response }) => {
          expect(response.status).toBe(400)
          expect(response._data).toMatchObject({
            url: `/sources/${wallId}`,
            statusCode: 400,
            statusMessage: 'Validation Error',
            message: 'Validation Error',
            data: [
              {
                code: 'too_small',
                minimum: 3,
                type: 'string',
                inclusive: true,
                exact: false,
                message: 'String must contain at least 3 character(s)',
                path: ['name']
              },
              {
                code: 'invalid_enum_value',
                message: "Invalid enum value. Expected 'instagram' | 'facebook' | 'x', received 'no type'",
                options: ['instagram', 'facebook', 'x'],
                path: ['type'],
                received: 'no type'
              }
            ]
          })
        }
      })
    })
    it('gets 200 on success creation', async () => {
      await $fetch(`/sources/${wallId}`, {
        baseURL: 'http://localhost:3000',
        method: 'POST',
        ignoreResponseError: true,
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        body: { name: 'Some name', type: 'instagram' },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data).toMatchObject({ name: 'Some name' })
          postedId = response._data._id
        }
      })
    })
    it('has one wall in it', async () => {
      await await $fetch(`/sources/${wallId}`, {
        baseURL: 'http://localhost:3000',
        headers: {
          Accept: 'application/json',
          Cookie: `accessToken=${accessToken};`
        },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data).toBeInstanceOf(Array)
          expect(response._data).toHaveLength(1)
        }
      })
    })
  })

  describe('GET /sources/[wallId]/[id]', () => {
    it('get source by id', async () => {
      await $fetch(`/sources/${wallId}/${postedId}`, {
        baseURL: 'http://localhost:3000',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data).toMatchObject({ name: 'Some name', type: 'instagram', author: '123', wallId })
        }
      })
    })

    it('invalid objectId', async () => {
      await $fetch(`/sources/${wallId}/123123123`, {
        baseURL: 'http://localhost:3000',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        ignoreResponseError: true,
        onResponse: ({ response }) => {
          expect(response.status).toBe(409)
          expect(response._data).toMatchObject({ message: 'Invalid id!' })
        }
      })
    })

    it('source not found', async () => {
      await $fetch(`/sources/${wallId}/65f8534bbbb8fac4c9825c00`, {
        baseURL: 'http://localhost:3000',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        ignoreResponseError: true,
        onResponse: ({ response }) => {
          expect(response.status).toBe(409)
          expect(response._data).toMatchObject({ message: 'Source not exists!' })
        }
      })
    })
  })

  describe('PUT /sources/[wallId]/[id]', () => {
    it('changes the source name and type', async () => {
      const newName = 'New Name of wall'
      const newType = 'x'
      await $fetch(`/sources/${wallId}/${postedId}`, {
        baseURL: 'http://localhost:3000',
        method: 'PUT',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        body: { name: newName, type: newType },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data.name).toBe(newName)
          expect(response._data.type).toBe(newType)
        }
      })
    })
  })

  describe('DELETE /sources/[id]', () => {
    it('delete the source', async () => {
      await $fetch(`/sources/${wallId}/${postedId}`, {
        baseURL: 'http://localhost:3000',
        method: 'DELETE',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data).toBeInstanceOf(Array)
          expect(response._data).toHaveLength(0)
        }
      })
    })
  })
})
