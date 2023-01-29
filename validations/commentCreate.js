import { body } from "express-validator";

export const commentCreateValidation = [
  body("text", "Введите текст статьи")
    .isLength({
      min: 1,
    })
    .isString(),
  body("postId", "Неверное id поста").optional().isString(),
];
