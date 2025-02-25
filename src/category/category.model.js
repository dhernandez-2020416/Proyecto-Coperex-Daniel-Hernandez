import { Schema, model } from 'mongoose'

const CategorySchema = Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            maxLength: [50, 'Title cannot exceed 50 characters'],
            unique: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [200, 'Description cannot exceed 200 characteres']
        },
        companies: [{
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }]
    }
)

CategorySchema.methods.toJSON = function(){
    const {__v, ...category} = this.toObject()
    return category
}

const Category = model('Category', CategorySchema)

const createDefaultCategory = async () => {
    try {
        const categoryExists = await Category.findOne({ title: 'Default' })
        if (!categoryExists) {
            const category = new Category({
                title: 'Default',
                description: 'Default category'
            })
            await category.save()
        }
    } catch (err) {
        console.error('Error creating default category:', err)
    }
}

createDefaultCategory()

export default Category