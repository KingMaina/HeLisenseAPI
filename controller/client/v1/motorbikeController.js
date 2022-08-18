/**
 * motorbikeController.js
 * @description : exports action methods for motorbike.
 */

const Motorbike = require('../../../model/motorbike');
const motorbikeSchemaKey = require('../../../utils/validation/motorbikeValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Motorbike in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Motorbike. {status, message, data}
 */ 
const addMotorbike = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      motorbikeSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Motorbike(dataToCreate);

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Motorbike,[ 'vehicleRegistrationNumber' ],dataToCreate,'INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdMotorbike = await dbService.create(Motorbike,dataToCreate);
    return res.success({ data : createdMotorbike });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Motorbike in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Motorbikes. {status, message, data}
 */
const bulkInsertMotorbike = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Motorbike,[ 'vehicleRegistrationNumber' ],dataToCreate,'BULK_INSERT');
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let createdMotorbikes = await dbService.create(Motorbike,dataToCreate);
    createdMotorbikes = { count: createdMotorbikes ? createdMotorbikes.length : 0 };
    return res.success({ data:{ count:createdMotorbikes.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Motorbike from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Motorbike(s). {status, message, data}
 */
const findAllMotorbike = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      motorbikeSchemaKey.findFilterKeys,
      Motorbike.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Motorbike, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundMotorbikes = await dbService.paginate( Motorbike,query,options);
    if (!foundMotorbikes || !foundMotorbikes.data || !foundMotorbikes.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundMotorbikes });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Motorbike from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Motorbike. {status, message, data}
 */
const getMotorbike = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundMotorbike = await dbService.findOne(Motorbike,query, options);
    if (!foundMotorbike){
      return res.recordNotFound();
    }
    return res.success({ data :foundMotorbike });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Motorbike.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getMotorbikeCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      motorbikeSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedMotorbike = await dbService.count(Motorbike,where);
    return res.success({ data : { count: countedMotorbike } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Motorbike with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Motorbike.
 * @return {Object} : updated Motorbike. {status, message, data}
 */
const updateMotorbike = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      motorbikeSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Motorbike,[ 'vehicleRegistrationNumber' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedMotorbike = await dbService.updateOne(Motorbike,query,dataToUpdate);
    if (!updatedMotorbike){
      return res.recordNotFound();
    }
    return res.success({ data :updatedMotorbike });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update multiple records of Motorbike with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Motorbikes.
 * @return {Object} : updated Motorbikes. {status, message, data}
 */
const bulkUpdateMotorbike = async (req,res)=>{
  try {
    let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    let dataToUpdate = {};
    delete dataToUpdate['addedBy'];
    if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
      dataToUpdate = { 
        ...req.body.data,
        updatedBy : req.user.id
      };
    }

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Motorbike,[ 'vehicleRegistrationNumber' ],dataToUpdate,'BULK_UPDATE', filter);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedMotorbike = await dbService.updateMany(Motorbike,filter,dataToUpdate);
    if (!updatedMotorbike){
      return res.recordNotFound();
    }
    return res.success({ data :{ count : updatedMotorbike } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : partially update document of Motorbike with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Motorbike.
 * @return {obj} : updated Motorbike. {status, message, data}
 */
const partialUpdateMotorbike = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      motorbikeSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };

    let checkUniqueFields = await utils.checkUniqueFieldsInDatabase(Motorbike,[ 'vehicleRegistrationNumber' ],dataToUpdate,'UPDATE', query);
    if (checkUniqueFields.isDuplicate){
      return res.validationError({ message : `${checkUniqueFields.value} already exists.Only unique ${checkUniqueFields.field} are allowed.` });
    }

    let updatedMotorbike = await dbService.updateOne(Motorbike, query, dataToUpdate);
    if (!updatedMotorbike) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedMotorbike });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
/**
 * @description : deactivate document of Motorbike from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Motorbike.
 * @return {Object} : deactivated Motorbike. {status, message, data}
 */
const softDeleteMotorbike = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    let query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedMotorbike = await dbService.updateOne(Motorbike, query, updateBody);
    if (!updatedMotorbike){
      return res.recordNotFound();
    }
    return res.success({ data:updatedMotorbike });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : delete document of Motorbike from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Motorbike. {status, message, data}
 */
const deleteMotorbike = async (req,res) => {
  try { 
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const deletedMotorbike = await dbService.deleteOne(Motorbike, query);
    if (!deletedMotorbike){
      return res.recordNotFound();
    }
    return res.success({ data :deletedMotorbike });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : delete documents of Motorbike in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyMotorbike = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const deletedMotorbike = await dbService.deleteMany(Motorbike,query);
    if (!deletedMotorbike){
      return res.recordNotFound();
    }
    return res.success({ data :{ count :deletedMotorbike } });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
/**
 * @description : deactivate multiple documents of Motorbike from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Motorbike.
 * @return {Object} : number of deactivated documents of Motorbike. {status, message, data}
 */
const softDeleteManyMotorbike = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedMotorbike = await dbService.updateMany(Motorbike,query, updateBody);
    if (!updatedMotorbike) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedMotorbike } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addMotorbike,
  bulkInsertMotorbike,
  findAllMotorbike,
  getMotorbike,
  getMotorbikeCount,
  updateMotorbike,
  bulkUpdateMotorbike,
  partialUpdateMotorbike,
  softDeleteMotorbike,
  deleteMotorbike,
  deleteManyMotorbike,
  softDeleteManyMotorbike    
};