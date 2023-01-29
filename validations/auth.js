import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен состоять минимум из 5 символов").isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("about", "").optional(),
  body("password", "Пароль должен состоять минимум из 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Введите коректное имя").isLength({ min: 2 }),
  body("avatarUrl", "Неверная ссылка").optional(),
];
