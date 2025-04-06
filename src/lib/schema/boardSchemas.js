import Joi from "joi";

export const createBoardSchema = Joi.object({
  title: Joi.string().required(),
  background: Joi.string().uri().optional(),
  icon: Joi.string().optional(),
});
