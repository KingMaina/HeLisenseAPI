/**
 * motorbikeRoutes.js
 * @description :: CRUD API routes for motorbike
 */

const express = require('express');
const router = express.Router();
const motorbikeController = require('../../../controller/client/v1/motorbikeController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/client/api/v1/motorbike/create').post(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.addMotorbike);
router.route('/client/api/v1/motorbike/list').post(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.findAllMotorbike);
router.route('/client/api/v1/motorbike/count').post(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.getMotorbikeCount);
router.route('/client/api/v1/motorbike/softDeleteMany').put(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.softDeleteManyMotorbike);
router.route('/client/api/v1/motorbike/addBulk').post(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.bulkInsertMotorbike);
router.route('/client/api/v1/motorbike/updateBulk').put(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.bulkUpdateMotorbike);
router.route('/client/api/v1/motorbike/deleteMany').post(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.deleteManyMotorbike);
router.route('/client/api/v1/motorbike/softDelete/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.softDeleteMotorbike);
router.route('/client/api/v1/motorbike/partial-update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.partialUpdateMotorbike);
router.route('/client/api/v1/motorbike/update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.updateMotorbike);    
router.route('/client/api/v1/motorbike/:id').get(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.getMotorbike);
router.route('/client/api/v1/motorbike/delete/:id').delete(auth(PLATFORM.CLIENT),checkRolePermission,motorbikeController.deleteMotorbike);

module.exports = router;
