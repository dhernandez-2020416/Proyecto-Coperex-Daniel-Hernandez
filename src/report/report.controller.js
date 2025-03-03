import XlsxPopulate from 'xlsx-populate'
import Company from '../company/company.model.js'
import fs from 'fs'
import path from 'path'

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

                const reportFolderPath = path.join(process.cwd(), 'src', 'report', 'Report')

                const now = new Date();
                const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0]; // Formato: YYYY-MM-DD_HH-MM-SS
                const fileName = `Report_${timestamp}.xlsx`;
                const filePath = path.join(reportFolderPath, fileName);

                await workbook.toFileAsync(filePath)

                return res.send(
                    {
                        success: true,
                        message: 'File has been saved successfully!'
                    }
                )
            })
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
