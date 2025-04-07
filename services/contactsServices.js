import Contact from "../db/models/Contact.js";

/**
 * Повертає масив контактів бази даних.
 */
const listContacts = async () => await Contact.findAll();

/**
 * Повертає об'єкт контакту за ідентифікатором.
 * @returns об'єкт контакту, якщо контакт з таким ідентифікатором існує, або null, якщо не існує
 */
const getContactById = async (contactId) => await Contact.findByPk(contactId);

/**
 * Видаляє контакт за ідентифікатором.
 *
 * @param {string} contactId ідентифікатор контакту
 * @returns об'єкт видаленого контакту, якщо контакт з таким id існує, або null, якщо не існує
 */
const removeContact = async (contactId) => {
    const deletedContact = await getContactById(contactId);
    if (!deletedContact) {
        return null;
    }
    await deletedContact.destroy();
    return deletedContact;
};

/**
 * Додає новий контакт до списку контактів.
 *
 * @param {string} name Ім'я контакту
 * @param {string} email Email контакту
 * @param {string} phone Номер телефону контакту
 * @param {boolean} favorite Вказує, чи є контакт улюбленим (за замовчуванням false)
 * @returns {Promise<Object>} Повертає об'єкт доданого контакту, що містить унікальний ідентифікатор
 */

const addContact = async ({ name, email, phone, favorite = false }) => {
    const newContact = await Contact.create({
        name,
        email,
        phone,
        favorite,
    });
    return newContact;
};

/**
 * Оновлює контакт за id.
 *
 * @param {string} contactId ідентифікатор контакту
 * @param {Object} data об'єкт з оновленими даними контакту
 * @returns об'єкт оновленого контакту, якщо контакт з таким id існує, або null, якщо не існує
 */
const updateContact = async (contactId, data) => {
    const contact = await getContactById(contactId);
    if (!contact) {
        return null;
    }
    return contact.update(data, { returning: true });
};

const updateStatusContact = async (contactId, { favorite }) => {
    const contact = await getContactById(contactId);
    if (!contact) return null;
    return contact.update({ favorite }, { returning: true });
};

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};
