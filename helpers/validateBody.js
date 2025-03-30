import HttpError from "./HttpError.js";

/**
 * Перевіряє тіло запиту на відповідність заданій схемі.
 *
 * @param {Object} schema Joi-схема для перевірки тіла запиту.
 * @returns {Function} Функція проміжного обробника, яка перевіряє тіло запиту 
 * та викликає наступний проміжний обробник або генерує помилку HttpError у 
 * разі невідповідності схемі.
 */

const validateBody = (schema) => {
    const func = (req, _, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            next(HttpError(400, error.message));
        }
        next();
    };

    return func;
};

export default validateBody;
