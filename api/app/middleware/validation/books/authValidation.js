const Joi = require('@hapi/joi')

const loginValidation = data => {
  const schema = {
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
  }
  return Joi.validate(data,schema)
}

const registervalidation = data => {
  const schema = {
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    mobile: Joi.number().integer().min(1000000000).max(9999999999).required(),
    bio: Joi.string(),
    profile_img: Joi.string(),
    last_login: Joi.string()
  }

  return Joi.validate(data,schema)
}

const resetPasswordValidation = data => {
  const schema = {
    email: Joi.string().email().lowercase().required(),
  }
  return Joi.validate(data,schema)
}
 
module.exports.loginValidation = loginValidation
module.exports.registervalidation = registervalidation
module.exports.resetPasswordValidation = resetPasswordValidation