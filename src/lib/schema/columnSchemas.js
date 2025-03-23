import Joi from "joi";

export const createColumnSchema = Joi.object({
  title: Joi.string().required(),
  boardId: Joi.string().required(),
});
