import { Schema } from 'mongoose'

const sourceSchema = new Schema({
  name: String,
  timestamp: Number,
  author: String,
  wall: String
})

export default sourceSchema
