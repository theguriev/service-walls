import { Schema } from 'mongoose'

const wallSchema = new Schema({
  name: String,
  timestamp: Number,
  author: String
})

export default wallSchema
