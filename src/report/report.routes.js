import { Router } from 'express'
import { validateJwt, verifyAdminRole } from '../../middlewares/validate.jwt.js'
import { createExcelOfCompanies } from './report.controller.js'  

const api = Router()

api.get(
    '/createExcelOfCompanies',
    [
        validateJwt,
        verifyAdminRole
    ],
    createExcelOfCompanies
)

export default api
