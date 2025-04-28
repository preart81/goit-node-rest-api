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

### Авторизація

#### Реєстрація користувача

**POST /api/auth/register**

-   Отримує `body` у форматі JSON з обов'язковими полями `{email, password}`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`.  
    **Registration request**

    ```json
    POST /api/auth/register
    Content-Type: application/json
    RequestBody: {
      "email": "example@example.com",
      "password": "examplepassword"
    }
    ```

    **Registration validation error**

    ```json
    Status: 400 Bad Request
    Content-Type: application/json
    ResponseBody: {
    "message": "Помилка від Joi або іншої бібліотеки валідації"
    }
    ```

    **Registration conflict error**

    ```json
    Status: 409 Conflict
    Content-Type: application/json
    ResponseBody: {
    "message": "Email in use"
    }
    ```

    **Registration success response**

    ```json
    Status: 201 Created
    Content-Type: application/json
    ResponseBody: {
    "user": {
        "email": "example@example.com",
        "subscription": "starter"
    }
    }
    ```

#### Верифікація email

**GET /api/auth/verify/:verificationCode**

-   Отримує код верифікації як параметр URL
-   Виконує верифікацію email користувача

    **Verification request**

    ```json
    GET /api/auth/verify/verification-code-here
    ```

    **Verification success response**

    ```json
    Status: 200 OK
    Content-Type: application/json
    ResponseBody: {
        "message": "Verification successful"
    }
    ```

#### Повторна відправка листа верифікації

**POST /api/auth/verify**

-   Отримує `body` у форматі JSON з обов'язковим полем `email`
-   Відправляє новий лист з кодом верифікації

    **Resend verification request**

    ```json
    POST /api/auth/verify
    Content-Type: application/json
    RequestBody: {
        "email": "example@example.com"
    }
    ```

    **Resend verification success response**

    ```json
    Status: 200 OK
    Content-Type: application/json
    ResponseBody: {
        "message": "Verify email resend"
    }
    ```

#### Логін користувача

**POST /api/auth/login**

-   Отримує `body` у форматі JSON з обов'язковими полями `{email, password}`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`.

    **Login request**

    ```json
    POST /api/auth/login
    Content-Type: application/json
    RequestBody: {
    "email": "example@example.com",
    "password": "examplepassword"
    }
    ```

    **Login validation error**

    ```json
    Status: 400 Bad Request
    Content-Type: application/json
    ResponseBody: {
    "message": "Помилка від Joi або іншої бібліотеки валідації"
    }
    ```

    **Login success response**

    ```json
    Status: 200 OK
    Content-Type: application/json
    ResponseBody: {
    "token": "exampletoken",
    "user": {
        "email": "example@example.com",
        "subscription": "starter"
    }
    }
    ```

    **Login auth error**

    ```json
    Status: 401 Unauthorized
    ResponseBody: {
    "message": "Email or password is wrong"
    }
    ```

#### Отримання поточного користувача

**GET /api/auth/current**

-   Вимагає токен авторизації в заголовку `Authorization: Bearer <token>`.

    **Current user request**

    ```json
    GET /api/auth/current
    Authorization: "Bearer {{token}}"
    ```

    **Current user unauthorized error**

    ```json
    Status: 401 Unauthorized
    Content-Type: application/json
    ResponseBody: {
    "message": "Not authorized"
    }
    ```

    **Current user success response**

    ```json
    Status: 200 OK
    Content-Type: application/json
    ResponseBody: {
    "email": "example@example.com",
    "subscription": "starter"
    }
    ```

#### Оновлення аватарки користувача

**PATCH /api/auth/avatars**

-   Вимагає токен авторизації.
-   Отримує файл аватарки через `multipart/form-data`.
-   Підтримує формати: JPG, PNG, GIF.

    **Update avatar request**

    ```json
    PATCH /api/auth/avatars
    Authorization: "Bearer {{token}}"
    Content-Type: multipart/form-data
    Body: form-data
    Key: avatar
    Value: [файл]
    ```

    **Update avatar validation error**

    ```json
    Status: 400 Bad Request
    Content-Type: application/json
    ResponseBody: {
        "message": "Аватар не завантажено"
    }
    ```

    **Update avatar success response**

    ```json
    Status: 200 OK
    Content-Type: application/json
    ResponseBody: {
        "avatarURL": "avatars/filename.jpg"
    }
    ```

#### Логаут користувача

**POST /api/auth/logout**

-   Вимагає токен авторизації в заголовку `Authorization: Bearer <token>`.

    **Logout request**

    ```json
    POST /api/auth/logout
    Authorization: "Bearer {{token}}"
    ```

    **Logout unauthorized error**

    ```json
    Status: 401 Unauthorized
    Content-Type: application/json
    ResponseBody: {
    "message": "Not authorized"
    }
    ```

    **Logout success response**

    ```json
    Status: 204 No Content
    ```

---

### Контакти

#### Отримання всіх контактів

**GET /api/contacts**

-   Вимагає токен авторизації.
-   Повертає масив усіх контактів поточного користувача у форматі JSON зі статусом `200`.

#### Отримання контакту за ID

**GET /api/contacts/:id**

-   Вимагає токен авторизації.
-   Якщо контакт знайдено – повертає об'єкт контакту у форматі JSON зі статусом `200`.
-   Якщо контакт не знайдено – повертає JSON `{ "message": "Contact with id=<id> not found" }` зі статусом `404`.

#### Видалення контакту

**DELETE /api/contacts/:id**

-   Вимагає токен авторизації.
-   Якщо контакт знайдено та видалено – повертає об'єкт видаленого контакту у форматі JSON зі статусом `200`.
-   Якщо контакт не знайдено – повертає JSON `{ "message": "Contact with id=<id> not found" }` зі статусом `404`.

#### Додавання нового контакту

**POST /api/contacts**

-   Вимагає токен авторизації.
-   Отримує `body` у форматі JSON з обов'язковими полями `{name, email, phone}`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`.
-   Якщо `body` некоректний – повертає JSON `{ "message": error.message }` зі статусом `400`.
-   Якщо контакт успішно створено – повертає новий об'єкт контакту зі статусом `201`.

#### Оновлення контакту

**PUT /api/contacts/:id**

-   Вимагає токен авторизації.
-   Отримує `body` у форматі JSON із можливістю оновлення будь-яких полів (`name`, `email`, `phone`, `favorite`).
-   Якщо `body` порожній – повертає JSON `{ "message": "Body must have at least one field" }` зі статусом `400`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`.
-   Якщо контакт знайдено – оновлює його і повертає оновлений об'єкт зі статусом `200`.
-   Якщо контакт не знайдено – повертає JSON `{ "message": "Contact with id=<id> not found" }` зі статусом `404`.

#### Оновлення статусу контакту

**PATCH /api/contacts/:id/favorite**

-   Вимагає токен авторизації.
-   Отримує `body` у форматі JSON з обов'язковим полем `{favorite}`.
-   Виконує валідацію за допомогою мідлвари `validateBody.js`.
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
│   ├── contactsControllers.js   # Контролери для обробки запитів, пов'язаних із контактами.
│   ├── authControllers.js       # Контролери для обробки запитів, пов'язаних із авторизацією.
├── db/
│   ├── Sequelize.js             # Налаштування підключення до бази даних через Sequelize.
│   └── models/
│       └── Contact.js           # Модель для роботи з таблицею "contacts" у базі даних.
├── helpers/
│   ├── HttpError.js             # Утиліта для створення об'єктів помилок із статусами.
│   ├── ctrlWrapper.js           # Обгортка для контролерів для автоматичної обробки помилок.
│   └── validateBody.js          # Мідлвара для валідації `body` запитів.
├── middlewares/
│   └── authenticate.js          # Мідлвара для перевірки автентифікації користувача.
├── routes/
│   ├── contactsRouter.js        # Маршрути для роботи з контактами.
│   └── authRouter.js            # Маршрути для авторизації.
├── schemas/
│   ├── contactsSchemas.js       # Joi-схеми для валідації даних контактів.
│   └── authSchemas.js           # Joi-схеми для валідації даних авторизації.
├── services/
│   └── contactsServices.js      # Логіка роботи з базою даних для контактів.
├── .env                         # Конфігураційний файл із секретними змінними середовища.
├── .env.example                 # Приклад файлу `.env` для налаштування середовища.
├── app.js                       # Основний файл додатку, налаштування серверу.
├── README.md                    # Документація проекту.
└── package.json                 # Інформація про проект та залежності.
```

### Пояснення директорій:

1. **`controllers/`**:

    - Містить функції-контролери, які обробляють HTTP-запити. Вони отримують дані з запиту, викликають відповідні сервіси та повертають відповіді клієнту.

2. **`db/`**:

    - Містить налаштування бази даних (`Sequelize.js`) і моделі для роботи з таблицями бази даних (наприклад, `Contact.js`).

3. **`helpers/`**:

    - Утиліти та мідлвари, які спрощують роботу з кодом:
        - `HttpError.js`: створює помилки з відповідними статусами.
        - `ctrlWrapper.js`: обгортає контролери для автоматичної обробки помилок.
        - `validateBody.js`: перевіряє коректність даних у `body` запитів.

4. **`middlewares/`**:

    - Містить мідлвари для обробки запитів:
        - `authenticate.js`: перевіряє автентифікацію користувача.

5. **`routes/`**:

    - Містить маршрути для різних частин API:
        - `contactsRouter.js`: маршрути для роботи з контактами.
        - `authRouter.js`: маршрути для авторизації.

6. **`schemas/`**:

    - Містить Joi-схеми для валідації даних, які надходять у запитах:
        - `contactsSchemas.js`: перевіряє дані для створення, оновлення чи зміни статусу контактів.
        - `authSchemas.js`: перевіряє дані для реєстрації та входу користувачів.

7. **`services/`**:

    - Містить бізнес-логіку для роботи з базою даних:
        - `contactsServices.js`: виконує запити до бази даних для отримання, створення, оновлення чи видалення контактів.

8. **Кореневі файли**:
    - `.env`: зберігає конфіденційні змінні середовища (наприклад, доступ до бази даних).
    - `.env.example`: приклад файлу `.env` для налаштування середовища.
    - `app.js`: основний файл додатку, де налаштовується сервер, підключаються маршрути та мідлвари.
    - `README.md`: документація проекту.
    - `package.json`: опис проекту, залежності та скрипти для запуску.

Ця структура дозволяє легко підтримувати, розширювати та тестувати проект.

## Запуск у режимі розробки

Для зручної розробки можна використовувати `nodemon`:

```sh
npm run dev
```
