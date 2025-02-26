import { Schema, model } from 'mongoose'

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Company name is required'],
            unique: true,
            maxLength: [100, 'Cannot exceed 100 characters']
        },
        impactLevel: {
            type: String,
            required: [true, 'Impact level is required'],
            enum: ['LOW', 'MEDIUM', 'HIGH']
        },
        yearsInBusiness: {
            type: Number,
            required: [true, 'Years in business is required'],
            min: [0, 'Years cannot be negative']
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required']
        }
    }
)

export default model('Company', companySchema)