import { Schema } from 'mongoose'

const streamSchema = new Schema({
  name: String,
  timestamp: Number,
  author: String,
  sources: [
    {
      type: {
        type: String,
        enum: ['instagram', 'facebook', 'x', 'youtube']
      },
      access: Object,
      options: Object
    }]
})

export default streamSchema
