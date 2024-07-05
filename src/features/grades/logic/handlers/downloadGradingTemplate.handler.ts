import { Request, Response } from "express";
import { generateExcelTemplate } from "../../../utils/grade-template";

type HandlerRequest = Request;


/*
 * Downlaod grading template
 * */
const downloadGradingTemplateHandler = async (req: HandlerRequest, res: Response) => {
    try {
        const workbook = await generateExcelTemplate();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="grading_template.xlsx"');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to generate template');
    }
}

export default downloadGradingTemplateHandler;