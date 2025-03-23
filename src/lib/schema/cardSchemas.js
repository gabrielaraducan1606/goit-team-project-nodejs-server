import Joi from "joi";

export const createCardSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  columnId: Joi.string().required(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  deadline: Joi.date().optional(),
});
