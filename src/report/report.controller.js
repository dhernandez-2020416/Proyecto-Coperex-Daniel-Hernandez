import XlsxPopulate from 'xlsx-populate'
import Company from '../company/company.model.js'

export const createExcelOfCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate(
            {
                path: 'category',
                select: 'title'
            }
        )

        XlsxPopulate.fromBlankAsync()
            .then(async workbook => {
                workbook.sheet(0).cell('A1').value('id')
                workbook.sheet(0).cell('B1').value('Name')
                workbook.sheet(0).cell('C1').value('Impact Level')
                workbook.sheet(0).cell('D1').value('Years in Business')
                workbook.sheet(0).cell('E1').value('Category')

                companies.forEach((company, index) => {
                    const row = index + 2
                    workbook.sheet(0).cell(`A${row}`).value(company._id.toString())
                    workbook.sheet(0).cell(`B${row}`).value(company.name)
                    workbook.sheet(0).cell(`C${row}`).value(company.impactLevel)
                    workbook.sheet(0).cell(`D${row}`).value(company.yearsInBusiness)
                    workbook.sheet(0).cell(`E${row}`).value(company.category ? company.category.title : 'No Category')
                })

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                res.setHeader('Content-Disposition', 'attachment; filename=companies.xlsx')

                return workbook.outputAsync().then((data) => {
                    res.send(data)
                })
            })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error'
        })
    }
}