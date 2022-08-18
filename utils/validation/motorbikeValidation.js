/**
 * motorbikeValidation.js
 * @description :: validate each post and put request as per motorbike model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');
const { convertObjectToEnum } = require('../common');  
const motorbikeConstantDefault = require('../../constants/motorbikeConstant');    

/** validation keys and properties of motorbike */
exports.schemaKeys = joi.object({
  vehicleRegistrationNumber: joi.string().required(),
  status: joi.number().allow(0),
  color: joi.string().allow(null).allow(''),
  vehicleOwner: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  imageUrl: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of motorbike for updation */
exports.updateSchemaKeys = joi.object({
  vehicleRegistrationNumber: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }),
  status: joi.number().allow(0),
  color: joi.string().allow(null).allow(''),
  vehicleOwner: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  imageUrl: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of motorbike for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      vehicleRegistrationNumber: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      color: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      vehicleOwner: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      imageUrl: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
