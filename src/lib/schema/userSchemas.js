import Joi from "joi";

const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(8).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required(),
  password: Joi.string().min(8).required(),
});
const updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  avatarURL: Joi.string().uri().optional(),
  password: Joi.string().min(8).optional(),
});

const schemas = { registerSchema, emailSchema, loginSchema, updateProfileSchema };

export default schemas;
