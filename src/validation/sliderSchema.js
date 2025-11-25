import Joi from 'joi';

const sliderSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': `Judul Slider tidak boleh kosong`,
    'any.required': `Judul Slider tidak boleh kosong`
  }),
  description: Joi.string().required().messages({
    'string.empty': `Deskripsi tidak boleh kosong`,
    'any.required': `Deskripsi tidak boleh kosong`
  }),
  linkUrl: Joi.string().uri().required().messages({
    'string.empty': `URL Link tidak boleh kosong`,
    'string.uri': `URL Link harus berupa URL yang valid`,
    'any.required': `URL Link tidak boleh kosong`
  }),
  file: Joi.any().when(Joi.ref('$sliderId'), {
    is: Joi.exist(),
    then: Joi.any(),
    otherwise: Joi.any().when(Joi.ref('imageUrl'), {
      is: Joi.exist(),
      then: Joi.any(),
      otherwise: Joi.any().required().messages({
        'any.required': `Slider Image tidak boleh kosong`
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
  status: Joi.string().valid('active', 'inactive', 'pending').when(Joi.ref('$sliderId'), {
    is: Joi.exist(),
    then: Joi.string().required().messages({
      'string.empty': `Status tidak boleh kosong`,
      'any.required': `Status tidak boleh kosong`,
      'any.only': `Status tidak valid`
    }),
    otherwise: Joi.any()
  })
});

export default sliderSchema;
