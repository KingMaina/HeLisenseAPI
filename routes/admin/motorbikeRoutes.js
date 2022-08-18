/**
 * motorbikeRoutes.js
 * @description :: CRUD API routes for motorbike
 */

const express = require('express');
const router = express.Router();
const motorbikeController = require('../../controller/admin/motorbikeController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/motorbike/create').post(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.addMotorbike);
router.route('/admin/motorbike/list').post(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.findAllMotorbike);
router.route('/admin/motorbike/count').post(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.getMotorbikeCount);
router.route('/admin/motorbike/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.softDeleteManyMotorbike);
router.route('/admin/motorbike/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.bulkInsertMotorbike);
router.route('/admin/motorbike/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.bulkUpdateMotorbike);
router.route('/admin/motorbike/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.deleteManyMotorbike);
router.route('/admin/motorbike/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.softDeleteMotorbike);
router.route('/admin/motorbike/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.partialUpdateMotorbike);
router.route('/admin/motorbike/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.updateMotorbike);    
router.route('/admin/motorbike/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.getMotorbike);
router.route('/admin/motorbike/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,motorbikeController.deleteMotorbike);

module.exports = router;
