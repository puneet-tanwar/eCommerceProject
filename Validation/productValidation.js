const Joi =require('@hapi/joi');
const productValidation=(data)=>{
    const schema = Joi.object({
        ProductName: Joi.string().min(2).required(),
        ProductDescription: Joi.string().min(6).required(),
        Price: Joi.number().required(),
        Tags: Joi.array(),
        Seller: Joi.string()
    })
    const validation= schema.validate(data);
    return validation;
}
const productUpdateValidation=(data)=>{
    const schema = Joi.object({
        ProductName: Joi.string().min(2),
        ProductDescription: Joi.string().min(6),
        Price: Joi.number(),
        Tags: Joi.array(),
        Seller: Joi.string()
    })
    const validation= schema.validate(data);
    return validation;
}
module.exports = {productValidation, productUpdateValidation};