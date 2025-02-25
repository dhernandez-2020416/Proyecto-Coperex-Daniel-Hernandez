import { Router } from 'express'
import { validateJwt, verifyAdminRole } from '../../middlewares/validate.jwt.js'
import { createCategory, getCategories } from './category.controller.js'
import { createCategoryValidator } from '../../helpers/validators.js'

const api = Router()

api.post(
    '/createCategory',
    [
        validateJwt,
        verifyAdminRole,
        createCategoryValidator
    ],
    createCategory
)

api.get(
    '/getCategory',
    [
        validateJwt,
        verifyAdminRole
    ],
    getCategories
)

export default api