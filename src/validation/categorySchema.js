import Joi from 'joi';

const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': `Nama Kategori tidak boleh kosong`,
    'any.required': `Nama Kategori tidak boleh kosong`
  }),
  status: Joi.string().valid('active', 'inactive').when(Joi.ref('$id'), {
    is: Joi.exist(),
    then: Joi.string().required().messages({
      'string.empty': `Status tidak boleh kosong`,
      'any.required': `Status tidak boleh kosong`,
      'any.only': `Status tidak valid`
    }),
    otherwise: Joi.any()
  })
});

export default categorySchema;
