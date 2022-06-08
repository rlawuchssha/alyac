import { Schema } from 'mongoose'

/**
 * alyac db table(schema) 를 정의한다.
 * @type {module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
const alyacSchema = new Schema({
    num: { type: String, required: true, index: true },
    name: { type: String, },
    company: { type: String, },
    component: { type: String, },
    effect: { type: String, },
    use: { type: String, },
    pre_condition: { type: String, },
    caution: { type: String, },
    caution_eat: { type: String, },
    caution_reaction: {type :String},
    keep: { type: String, },
    open_date: { type: String, },
    update_date: { type: String, },
})

export default alyacSchema
