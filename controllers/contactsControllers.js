import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    const { id: owner } = req.user;
    //todo const { page = 1, limit = 20, favorite } = req.query;

    const contacts = await contactsService.listContacts({ owner });
    res.json(contacts);
};

export const getOneContact = ctrlWrapper(async (req, res) => {
    const { id } = req.params;
    const { id: owner } = req.user;
    const data = await contactsService.getContactById({ id, owner });

    if (!data) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.json(data);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
    const { id } = req.params;
    const { id: owner } = req.user;
    const query = { id, owner };
    const contact = await contactsService.removeContact(query);

    if (!contact) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.json(contact);
});

export const createContact = ctrlWrapper(async (req, res) => {
    console.log("req.user: " + req.user);
    const { id: owner } = req.user;
    const newContact = await contactsService.addContact({ ...req.body, owner });

    res.status(201).json(newContact);
});

export const updateContact = ctrlWrapper(async (req, res) => {
    const { id } = req.params;
    const { id: owner } = req.user;
    const query = { id, owner };
    const data = req.body;
    const updatedContact = await contactsService.updateContact(query, data);

    if (!updatedContact) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(updatedContact);
});

export const updateStatusContact = ctrlWrapper(async (req, res) => {
    const { id } = req.params;
    const { id: owner } = req.user;
    const query = { id, owner };
    const data = req.body;
    const updatedContact = await contactsService.updateStatusContact(query, data);

    if (!updatedContact) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(updatedContact);
});
