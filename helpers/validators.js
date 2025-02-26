import { body } from 'express-validator'
import { existUsername, existEmail, objectIdValid } from './db.validators.js'
import { validateErrors } from './validate.error.js'

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone()
        .isLength({min: 8, max: 8}),
    body('role', 'Role cannot be added')
        .not()
        .exists(),
    body('status', 'Status cannot be added')
        .not()
        .exists(),
    validateErrors
]

export const loginValidator = [
    body('identifier', 'Identifier cannot be empty')
        .notEmpty(),
    body('password', 'Password cannot be empty')
        .notEmpty(),
    validateErrors
]

export const createCategoryValidator = [
    body('title', 'Title cannot be empty')
        .notEmpty(),
    body('description', 'Description cannot be empty')
        .notEmpty(),
    body('companies', 'Companies cannot be added')
        .not()
        .exists(),
    validateErrors
]

export const createCompanyValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('impactLevel', 'ImpactLevet cannot be empty')
        .notEmpty()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Impact Level must be one of: LOW, MEDIUM, HIGH'),
    body('yearsInBusiness', 'YearInBussines cannot be empty')
        .notEmpty()
        .isInt()
        .withMessage('Years in Business must be a number')
        .isInt({ gt: 0 })
        .withMessage('Years in Business must be greater than 0'),
    body('category', 'Category cannot be empty')
        .notEmpty()
        .custom(objectIdValid),
    validateErrors
]

export const updateCompanyValidator = [
    body('name', 'Name cannot be empty')
        .optional()
        .notEmpty(),
    body('impactLevel', 'ImpactLevet cannot be empty')
        .optional()
        .notEmpty()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Impact Level must be one of: LOW, MEDIUM, HIGH'),
    body('yearsInBusiness', 'YearInBussines cannot be empty')
        .optional()
        .notEmpty()
        .isInt()
        .withMessage('Years in Business must be a number')
        .isInt({ gt: 0 })
        .withMessage('Years in Business must be greater than 0'),
    body('category', 'Category cannot be empty')
        .optional()
        .notEmpty()
        .custom(objectIdValid),
    validateErrors
]