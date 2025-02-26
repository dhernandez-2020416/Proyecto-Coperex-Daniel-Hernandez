import Category from './category.model.js'

export const createCategory = async(req, res) => {
    try {
        const { title, description } = req.body
        const category = new Category({ title, description})

        const existingCategory = await Category.findOne({ title: title })

        if(existingCategory){
            return res.status(400).send(
                {
                    success: false,
                    message: 'Category with this name already exists'
                }
            )
        }

        await category.save()

        return res.send(
            {
                success: true,
                message: 'Category created successfully',
                category
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const getCategories = async(req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query
        const categories = await Category.find()
        .populate(
            {
                path: 'companies',
                select: 'name impactLevel yearInBusines'
            }
        )
        .skip(skip)
        .limit(limit)

        return res.send(
            {
                success: true,
                message: 'Categories found',
                categories,
                total: categories.length
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}