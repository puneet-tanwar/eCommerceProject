const Joi =require('@hapi/joi');
const registerUserValidation=(data)=>{
    const schema = Joi.object({
        Name: Joi.string().min(6).required(),
        Email: Joi.string().min(6).required().email(),
        Password: Joi.string().min(8).required()
    });
    const validation= schema.validate(data);
    return validation;
}

const loginUserValidation=(data)=>{
    const schema = Joi.object({
        
        Email: Joi.string().min(6).required().email(),
        Password: Joi.string().min(8).required()
    });
    const validation= schema.validate(data);
    return validation;
}

const createAdminValidation=(data)=>{
    const schema = Joi.object({
        Name: Joi.string().min(3).required(),
        Email: Joi.string().min(6).required().email(),
        Password: Joi.string().min(8).required(),
        isAdmin: Joi.bool().required()
    });
    const validation= schema.validate(data);
    return validation;
}
module.exports={registerUserValidation,loginUserValidation};