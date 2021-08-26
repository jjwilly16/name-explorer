import DefaultErrorPage from 'next/error';
import Joi from 'joi';
import { NameService } from '../../services';
import validateParams from '../../lib/middlewares/parameterValidation';

const schema = Joi.object({
    gender: Joi.string().valid('M', 'F', 'U'),
    pageSize: Joi.number().integer(),
    pageIndex: Joi.number().integer(),
    minLength: Joi.number().integer(),
    maxLength: Joi.number().integer(),
    startsWith: Joi.string().allow(''),
    endsWith: Joi.string().allow(''),
    contains: Joi.string().allow(''),
    minYear: Joi.number().integer(),
    maxYear: Joi.number().integer(),
    minOccurrences: Joi.number().integer().allow('null'),
    maxOccurrences: Joi.number().integer().allow('null'),
    sortOrder: Joi.string().valid('DESC', 'ASC').allow('null'),
    orderBy: Joi.string().valid('name', 'occurrences').allow('null'),
});

export default validateParams({ query: schema }, async (req, res) => {
    if (req.method === 'GET') {
        const { value } = schema.validate(req.query);
        const results = await NameService.getTotalsByYear(value);
        return res.json(results);
    }
    return (
        <DefaultErrorPage />
    );
});
