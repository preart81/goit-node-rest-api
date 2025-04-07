import Joi from "joi";

export const createContactSchema = Joi.object({
    // всі поля є обов'язковими
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
    // всі поля є необов'язковими
    // але принаймні одне з них має бути присутнім
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    favorite: Joi.boolean().optional(),
}).or("name", "email", "phone", "favorite");

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});
