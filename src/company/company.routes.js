import { Router } from 'express'
import { validateJwt, verifyAdminRole } from '../../middlewares/validate.jwt.js'
import { createCompany, getCompanies, getCompaniesByYearsInBusiness, getCompaniesSortedAsc, getCompaniesSortedDesc, updateCompany } from './company.controller.js'
import { createCompanyValidator, updateCompanyValidator } from '../../helpers/validators.js'

const api = Router()

api.post(
    '/createCompany',
    [
        validateJwt,
        verifyAdminRole,
        createCompanyValidator
    ],
    createCompany
)

api.get(
    '/getCompanies',
    [
        validateJwt,
        verifyAdminRole
    ],
    getCompanies
)

api.put(
    '/updateCompany/:idCompany',
    [
        validateJwt,
        verifyAdminRole,
        updateCompanyValidator
    ],
    updateCompany
)

api.get(
    '/getCompaniesByYearsInBusiness',
    [
        validateJwt,
        verifyAdminRole
    ],
    getCompaniesByYearsInBusiness
)

api.get(
    '/getCompaniesSortedAsc',
    [
        validateJwt,
        verifyAdminRole
    ],
    getCompaniesSortedAsc
)

api.get(
    '/getCompaniesSortedDesc',
    [
        validateJwt,
        verifyAdminRole
    ]
    ,getCompaniesSortedDesc
)

export default api