import { Schema } from 'mongoose'

const sourceSchema = new Schema({
  name: String,
  type: String,
  timestamp: Number,
  author: String,
  wallId: String
})

export default sourceSchema
