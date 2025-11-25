import Joi from 'joi';

const adsSchema = Joi.object({
  description: Joi.string().required().messages({
    'string.empty': `Deskripsi tidak boleh kosong`,
    'any.required': `Deskripsi tidak boleh kosong`
  }),
  type: Joi.string().required().messages({
    'string.empty': `Tipe Iklan tidak boleh kosong`,
    'any.required': `Tipe Iklan tidak boleh kosong`
  }),
  customCta: Joi.string().optional().allow(''),
  linkUrl: Joi.string().uri().optional().allow(''),
  image: Joi.any().when(Joi.ref('$adId'), {
    is: Joi.exist(),
    then: Joi.any(),
    otherwise: Joi.any().when(Joi.ref('imageUrl'), {
      is: Joi.exist(),
      then: Joi.any(),
      otherwise: Joi.any().required().messages({
        'any.required': `Iklan Image tidak boleh kosong`
      })
    })
  }),
  startDate: Joi.string().required().messages({
    'string.empty': `Tanggal Publikasi tidak boleh kosong`,
    'any.required': `Tanggal Publikasi tidak boleh kosong`
  }),
  endDate: Joi.string().required().messages({
    'string.empty': `Tanggal Akhir tidak boleh kosong`,
    'any.required': `Tanggal Akhir tidak boleh kosong`
  }),
  imageUrl: Joi.string().optional(), // Allow imageUrl for display purposes
  status: Joi.string().valid('active', 'inactive', 'pending').when(Joi.ref('$adId'), {
    is: Joi.exist(),
    then: Joi.string().required().messages({
      'string.empty': `Status tidak boleh kosong`,
      'any.required': `Status tidak boleh kosong`,
      'any.only': `Status tidak valid`
    }),
    otherwise: Joi.any()
  })
});

export default adsSchema;
