import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': `Nama tidak boleh kosong`,
    'any.required': `Nama tidak boleh kosong`
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': `Email tidak boleh kosong`,
    'string.email': `Email tidak valid`,
    'any.required': `Email tidak boleh kosong`
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': `Password tidak boleh kosong`,
    'string.min': `Password minimal 6 karakter`,
    'any.required': `Password tidak boleh kosong`
  }),
  status: Joi.string().valid('active', 'inactive').when(Joi.ref('$userId'), {
    is: Joi.exist(),
    then: Joi.string().required().messages({
      'string.empty': `Status tidak boleh kosong`,
      'any.required': `Status tidak boleh kosong`,
      'any.only': `Status tidak valid`
    }),
    otherwise: Joi.any()
  })
});

export default userSchema;
