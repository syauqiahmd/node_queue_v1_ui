import Joi from 'joi';

const articleSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': `Judul Artikel tidak boleh kosong`,
    'any.required': `Judul Artikel tidak boleh kosong`
  }),
  slug: Joi.string().required().messages({
    'string.empty': `Kustom Slug tidak boleh kosong`,
    'any.required': `Kustom Slug tidak boleh kosong`
  }),
  publishAt: Joi.string().required().messages({
    'string.empty': `Tanggal Publikasi tidak boleh kosong`,
    'any.required': `Tanggal Publikasi tidak boleh kosong`
  }),
  content: Joi.string().required().messages({
    'string.empty': `Isi Artikel tidak boleh kosong`,
    'any.required': `Isi Artikel tidak boleh kosong`
  }),
  image: Joi.any().when(Joi.ref('$articleId'), {
    is: Joi.exist(),
    then: Joi.any(),
    otherwise: Joi.any().required().messages({
      'any.required': `Thumbnail Artikel tidak boleh kosong`
    })
  }),
  categoryIds: Joi.array().min(1).required().messages({
    'array.min': `Kategori Artikel tidak boleh kosong`,
    'any.required': `Kategori Artikel tidak boleh kosong`
  }),
  status: Joi.string().valid('active', 'inactive').when(Joi.ref('$articleId'), {
    is: Joi.exist(),
    then: Joi.string().required().messages({
      'string.empty': `Status tidak boleh kosong`,
      'any.required': `Status tidak boleh kosong`,
      'any.only': `Status tidak valid`
    }),
    otherwise: Joi.any()
  })
});

export default articleSchema;
