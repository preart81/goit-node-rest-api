import { nanoid } from "nanoid";
import fs from "node:fs/promises";
import path from "path";

// шлях до файлу contacts.json
const contactsPath = path.resolve("db", "contacts.json");

/**
 * Оновлює файл contacts.json новим масивом контактів.
 *
 * @param {Array} contacts масив контактів
 * @returns {Promise<void>}
 */
async function updateContacts(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

/**
 * Повертає масив контактів.
 *
 * @returns {Promise<Array>} Масив контактів
 */
async function listContacts() {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
}

/**
 * Повертає об'єкт контакту за ідентифікатором.
 *
 * @param {string} contactId ідентифікатор контакту
 * @returns {Promise<{}>} об'єкт контакту, якщо контакт з таким ідентифікатором існує, або null, якщо не існує
 */
async function getContactById(contactId) {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
}

/**
 * Видаляє контакт за ідентифікатором.
 *
 * @param {string} contactId ідентифікатор контакту
 * @returns {Promise<{}>} об'єкт видаленого контакту, якщо контакт з таким id існує, або null, якщо не існує
 */
async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [deletedContact] = contacts.splice(index, 1);
    await updateContacts(contacts);
    return deletedContact;
}

/**
 * Додає новий контакт до списку контактів.
 *
 * @param {string} name Ім'я контакту
 * @param {string} email Email контакту
 * @param {string} phone Номер телефону контакту
 * @returns {Promise<Object>} Повертає об'єкт доданого контакту, що містить унікальний ідентифікатор
 */
async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}

/**
 * Оновлює контакт за id.
 *
 * @param {string} contactId ідентифікатор контакту
 * @param {Object} data об'єкт з оновленими даними контакту
 * @returns {Promise<Object>} об'єкт оновленого контакту, якщо контакт з таким id існує, або null, якщо не існує
 */
async function updateContact(contactId, data) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = { ...contacts[index], ...data };
    await updateContacts(contacts);
    return contacts[index];
}

export default { listContacts, getContactById, removeContact, addContact, updateContact };
