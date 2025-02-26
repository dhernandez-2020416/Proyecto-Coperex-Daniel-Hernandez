import Company from './company.model.js'
import Category from '../category/category.model.js'

export const createCompany = async (req, res) => {
    try {
        const { name, impactLevel, yearsInBusiness, category } = req.body

        const existingCategory = await Category.findById(category)

        if (!existingCategory) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Category not found'
                }
            )
        }
        const existingCompany = await Company.findOne({ name })
        if (existingCompany) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'Company already exists'
                }
            )
        }
        const newCompany = new Company(
            {
                name,
                impactLevel,
                yearsInBusiness,
                category
            }
        )
        
        await newCompany.save()

        existingCategory.companies.push(newCompany._id)
        await existingCategory.save()

        const populatedCompany = await Company.findById(newCompany._id)
            .populate(
                {
                    path: 'category',
                    select: 'name description'
                }
            )

        return res.send(
            {
                success: true,
                message: 'Company created successfully',
                company: populatedCompany
            }
        )

    } catch (error) {
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const getCompanies = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query
        const companies = await Company.find()
            .populate(
                {
                    path: 'category',
                    select: 'title description'
                }
            )
            .skip(skip)
            .limit(limit)

        return res.send(
            {
                success: true,
                message: 'Companies found',
                companies,
                total: companies.length
            }
        )
    } catch (error) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const updateCompany = async(req, res) => {
    try {
        const { name, impactLevel, yearsInBusiness, category } = req.body
        const { idCompany } = req.params

        const company = await Company.findById(idCompany)

        if(!company){
            return res.status(404).send(
                {
                    success: false,
                    message: 'Company not found'
                }
            )
        }

        if(category){
            const existingCategory = await Category.findById(category)

            if(!existingCategory){
                return res.status(404).send(
                    {
                        success: false,
                        message: 'Category not found'
                    }
                )
            }
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            idCompany,
            {
                name,
                impactLevel,
                yearsInBusiness,
                category
            },
            {
                new: true
            }
        )

        if(category && category.toString() !== company.category.toString()){
            await Category.findByIdAndUpdate(company.category, {
                $pull: { companies: company._id }
            })

            await Category.findByIdAndUpdate(category, {
                $push: { companies:  updatedCompany._id}
            })
        }

        return res.send(
            {
                success: true,
                message: 'Company updated successfully',
                updatedCompany
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

export const getCompaniesByYearsInBusiness = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query
        const { yearsInBusiness } = req.body

        const companies = await Company.find({ yearsInBusiness: yearsInBusiness })
            .populate(
                {
                    path: 'category',
                    select: 'title description'
                }
            )
            .skip(skip)
            .limit(limit)

        return res.send(
            {
                success: true,
                message: 'Companies found by years in business',
                companies,
                total: companies.length
            }
        )

    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const getCompaniesSortedAsc = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query

        const companies = await Company.find()
            .populate({
                path: 'category',
                select: 'title description'
            })
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)

        return res.send(
            {
                success: true,
                message: 'Companies sorted A-Z',
                companies,
                total: companies.length
            }
        )

    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}

export const getCompaniesSortedDesc = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query

        const companies = await Company.find()
            .populate(
                {
                    path: 'category',
                    select: 'title description'
                }
            )
            .sort({ name: -1 })
            .skip(skip)
            .limit(limit)

        return res.send(
            {
                success: true,
                message: 'Companies sorted Z-A',
                companies,
                total: companies.length
            }
        )

    } catch (error) {
        console.error(error)
        return res.status(500).send(
            {
                success: false,
                message: 'General error'
            }
        )
    }
}
