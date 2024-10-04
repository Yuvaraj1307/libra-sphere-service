import { Response } from "express";
export const success = (res: Response, data: any, code = 200) => {
    res.statusCode = code;
    res.send({ success: true, data })
}

export const error = (res: Response, data: any, code = 500) => {
    if (typeof data === 'string') {
        res.status(code).send(data);
    } else {
        res.status(code).send({ success: false, data })
    }
}