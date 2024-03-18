import issueAccessToken from '@/utils/issueAccessToken'

describe('Walls', () => {
  const secret = String(process.env.NITRO_SECRET)
  const accessToken = issueAccessToken({ userId: '123', email: 'test@test.com', name: 'some name' }, { secret })
  let postedWallId: string

  describe('GET /walls', () => {
    it('gets 200 walls array', async () => {
      await $fetch('/walls', {
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

  describe('POST /walls', () => {
    it('gets 400 on validation errors', async () => {
      await $fetch('/walls', {
        baseURL: 'http://localhost:3000',
        method: 'POST',
        ignoreResponseError: true,
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        body: { name: '1' },
        onResponse: ({ response }) => {
          expect(response.status).toBe(400)
          expect(response._data).toMatchObject({
            url: '/walls',
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
              }
            ]
          })
        }
      })
    })
    it('gets 200 on success creation', async () => {
      await $fetch('/walls', {
        baseURL: 'http://localhost:3000',
        method: 'POST',
        ignoreResponseError: true,
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        body: { name: 'Some wall name' },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data).toMatchObject({ name: 'Some wall name' })
          postedWallId = response._data._id
        }
      })
    })
    it('has one wall in it', async () => {
      await await $fetch('/walls', {
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

  describe('GET /walls/[id]', () => {
    it('get wall by id', async () => {
      await $fetch(`/walls/${postedWallId}`, {
        baseURL: 'http://localhost:3000',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data).toMatchObject({ name: 'Some wall name', author: '123' })
        }
      })
    })

    it('invalid objectId', async () => {
      await $fetch('/walls/123123123', {
        baseURL: 'http://localhost:3000',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        ignoreResponseError: true,
        onResponse: ({ response }) => {
          expect(response.status).toBe(409)
          expect(response._data).toMatchObject({ message: 'Invalid id!' })
        }
      })
    })

    it('wall not found', async () => {
      await $fetch('/walls/65f8534bbbb8fac4c9825c00', {
        baseURL: 'http://localhost:3000',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        ignoreResponseError: true,
        onResponse: ({ response }) => {
          expect(response.status).toBe(409)
          expect(response._data).toMatchObject({ message: 'Wall not exists!' })
        }
      })
    })
  })

  describe('PUT /walls/[id]', () => {
    it('changes the wall name', async () => {
      const newName = 'New Name of wall'
      await $fetch(`/walls/${postedWallId}`, {
        baseURL: 'http://localhost:3000',
        method: 'PUT',
        headers: { Accept: 'application/json', Cookie: `accessToken=${accessToken};` },
        body: { name: newName },
        onResponse: ({ response }) => {
          expect(response.status).toBe(200)
          expect(response._data.name).toBe(newName)
        }
      })
    })
  })

  describe('DELETE /walls/[id]', () => {
    it('delete the wall', async () => {
      await $fetch(`/walls/${postedWallId}`, {
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
