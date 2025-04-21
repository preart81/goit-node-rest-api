# REST API для управління контактами

## Опис проекту

Цей проект є REST API для управління колекцією контактів. API дозволяє отримувати, додавати, видаляти та оновлювати контакти, використовуючи HTTP-запити. Для тестування API рекомендується використовувати [Postman](https://www.getpostman.com/).

## Встановлення та налаштування

1. Клонуйте репозиторій:
    ```sh
    git clone https://github.com/your-repo/goit-node-rest-api.git
    ```
2. Перейдіть у директорію проекту:
    ```sh
    cd goit-node-rest-api
    ```
3. Встановіть залежності:
    ```sh
    npm install
    ```
4. Запустіть сервер:
    ```sh
    npm start
    ```

## Доступні маршрути

### Отримання всіх контактів

**GET /api/contacts**

-   Повертає масив усіх контактів у форматі JSON зі статусом `200`.

### Отримання контакту за ID

**GET /api/contacts/:id**

-   Якщо контакт знайдено – повертає об'єкт контакту у форматі JSON зі статусом `200`.
-   Якщо контакт не знайдено – повертає JSON `{ "message": "Contact with id=<id> not found" }` зі статусом `404`.

### Видалення контакту

**DELETE /api/contacts/:id**

-   Якщо контакт знайдено та видалено – повертає об'єкт видаленого контакту у форматі JSON зі статусом `200`.
-   Якщо контакт не знайдено – повертає JSON `{ "message": "Contact with id=<id> not found" }` зі статусом `404`.

### Додавання нового контакту

**POST /api/contacts**

-   Отримує `body` у форматі JSON з обов'язковими полями `{name, email, phone}`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`, яка перевіряє коректність даних.
-   Якщо `body` некоректний – повертає JSON `{ "message": error.message }` зі статусом `400`.
-   Якщо `body` валідний – додає контакт і повертає новий об'єкт `{id, name, email, phone}` зі статусом `201`.

### Оновлення контакту

**PUT /api/contacts/:id**

-   Отримує `body` у форматі JSON із можливістю оновлення будь-яких полів (`name`, `email`, `phone`, `favorite`).
-   Якщо `body` порожній – повертає JSON `{ "message": "Body must have at least one field" }` зі статусом `400`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`, яка перевіряє коректність даних.
-   Якщо `body` некоректний – повертає JSON `{ "message": error.message }` зі статусом `400`.
-   Якщо контакт знайдено – оновлює його і повертає оновлений об'єкт зі статусом `200`.
-   Якщо контакт не знайдено – повертає JSON `{ "message": "Contact with id=<id> not found" }` зі статусом `404`.

### Оновлення статусу контакту

**PATCH /api/contacts/:id/favorite**

-   Отримує `body` у форматі JSON з обов'язковим полем `{favorite}`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`, яка перевіряє коректність даних.
-   Якщо `body` некоректний – повертає JSON `{ "message": error.message }` зі статусом `400`.
-   Якщо контакт знайдено – оновлює його статус і повертає оновлений об'єкт зі статусом `200`.
-   Якщо контакт не знайдено – повертає JSON `{ "message": "Contact with id=<id> not found" }` зі статусом `404`.

## Використання мідлвар

-   **`validateBody.js`**:
    -   Використовується для перевірки коректності `body` у запитах `POST`, `PUT` та `PATCH`.
    -   Забезпечує, що всі необхідні поля присутні та відповідають вимогам.
-   **`ctrlWrapper.js`**:
    -   Використовується для обгортання контролерів, щоб автоматично обробляти помилки та передавати їх у глобальний обробник помилок.
-   **`HttpError.js`**:
    -   Використовується для створення об'єктів помилок із відповідним статусом та повідомленням.

## Використані модулі

-   **`cors`**:
    -   Використовується для налаштування політики CORS (Cross-Origin Resource Sharing), що дозволяє обмін даними між різними доменами.
-   **`express`**:
    -   Використовується для створення серверу та маршрутизації.
-   **`joi`**:
    -   Використовується для валідації даних у запитах.
-   **`morgan`**:
    -   Логер HTTP-запитів для зручності розробки.
-   **`nanoid`**:
    -   Використовується для генерації унікальних ідентифікаторів контактів.
-   **`sequelize`**:
    -   Використовується для роботи з базою даних PostgreSQL.

## Структура проекту
```
goit-node-rest-api/
├── controllers/
│   └── contactsControllers.js   # Контролери для обробки запитів, пов'язаних із контактами.
│   └── authControllers.js       # Контролери для обробки запитів, пов'язаних із авторизацією.
├── db/
│   ├── Sequelize.js             # Налаштування підключення до бази даних через Sequelize.
│   └── models/
│       └── Contact.js           # Модель для роботи з таблицею "contacts" у базі даних.
├── helpers/
│   ├── HttpError.js             # Утиліта для створення об'єктів помилок із статусами.
│   ├── ctrlWrapper.js           # Обгортка для контролерів для автоматичної обробки помилок.
│   └── validateBody.js          # Мідлвара для валідації `body` запитів.
├── routes/
│   ├── contactsRouter.js        # Маршрути для роботи з контактами.
│   └── authRouter.js            # Маршрути для авторизації.
├── schemas/
│   └── contactsSchemas.js       # Joi-схеми для валідації даних контактів.
├── services/
│   └── contactsServices.js      # Логіка роботи з базою даних для контактів.
├── .env                         # Конфігураційний файл із секретними змінними середовища.
├── .env.example                 # Приклад файлу `.env` для налаштування середовища.
├── app.js                       # Основний файл додатку, налаштування серверу.
├── README.md                    # Документація проекту.
└── package.json                 # Інформація про проект та залежності.
```
### Пояснення директорій:

1. **[controllers](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**:

    - Містить функції-контролери, які обробляють HTTP-запити. Вони отримують дані з запиту, викликають відповідні сервіси та повертають відповіді клієнту.
2. **[db](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**:

    - Містить налаштування бази даних (`Sequelize.js`) і моделі для роботи з таблицями бази даних (наприклад, `Contact.js`).
3. **[helpers](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**:

    - Утиліти та мідлвари, які спрощують роботу з кодом:
        - `HttpError.js`: створює помилки з відповідними статусами.
        - `ctrlWrapper.js`: обгортає контролери для автоматичної обробки помилок.
        - `validateBody.js`: перевіряє коректність даних у `body` запитів.
4. **[routes](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**:

    - Містить маршрути для різних частин API:
        - `contactsRouter.js`: маршрути для роботи з контактами.
        - `authRouter.js`: маршрути для авторизації.
5. **[schemas](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**:

    - Містить Joi-схеми для валідації даних, які надходять у запитах. Наприклад, [contactsSchemas.js](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) перевіряє дані для створення, оновлення чи зміни статусу контактів.
6. **[services](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**:

    - Містить бізнес-логіку для роботи з базою даних. Наприклад, `contactsServices.js` виконує запити до бази даних для отримання, створення, оновлення чи видалення контактів.
7. **Кореневі файли**:

    - [.env](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): зберігає конфіденційні змінні середовища (наприклад, доступ до бази даних).
    - [.env.example](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): приклад файлу [.env](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) для налаштування середовища.
    - [app.js](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): основний файл додатку, де налаштовується сервер, підключаються маршрути та мідлвари.
    - [README.md](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): документація проекту.
    - [package.json](vscode-file://vscode-app/c:/Users/preart/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): опис проекту, залежності та скрипти для запуску.

Ця структура дозволяє легко підтримувати, розширювати та тестувати проект.

## Запуск у режимі розробки

Для зручної розробки можна використовувати `nodemon`:

```sh
npm run dev
```
