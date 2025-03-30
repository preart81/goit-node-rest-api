import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    const contacts = await contactsService.listContacts();
    res.json(contacts);
};

export const getOneContact = ctrlWrapper(async (req, res) => {
    const { id } = req.params;
    const data = await contactsService.getContactById(id);

    if (!data) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.json(data);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);

    if (!contact) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.json(contact);
});

export const createContact = ctrlWrapper(async (req, res) => {
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact(name, email, phone);

    res.status(201).json(newContact);
});

export const updateContact = ctrlWrapper(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const updatedContact = await contactsService.updateContact(id, data);

    if (!updatedContact) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(updatedContact);
});
