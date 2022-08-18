/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */

const bcrypt = require('bcrypt');
const User = require('../model/user');
const authConstant = require('../constants/authConstant');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const { replaceAll } = require('../utils/common');
const dbService = require('../utils/dbService');

/* seeds default users */
async function seedUser () {
  try {
    let userToBeInserted = {};
    userToBeInserted = {
      'password':'123',
      'isDeleted':false,
      'username':'Andrew',
      'email':'andrew@gmail.com',
      'name':'Andrew Maina',
      'isActive':true,
      'userType':authConstant.USER_TYPES.User
    };
    userToBeInserted.password = await  bcrypt.hash(userToBeInserted.password, 8);
    await dbService.updateOne(User, { 'username':'Andrew' }, userToBeInserted,  { upsert: true });
    userToBeInserted = {
      'password':'admin',
      'isDeleted':false,
      'username':'kasuku',
      'email':'kasuku@gmail.com',
      'name':'Kasuku',
      'isActive':true,
      'userType':authConstant.USER_TYPES.Admin
    };
    userToBeInserted.password = await  bcrypt.hash(userToBeInserted.password, 8);
    await dbService.updateOne(User, { 'username':'kasuku' }, userToBeInserted,  { upsert: true });
    console.info('Users seeded 🍺');
  } catch (error){
    console.log('User seeder failed due to ', error.message);
  }
}
/* seeds roles */
async function seedRole () {
  try {
    const roles = [ 'User', 'Admin', 'System_User' ];
    const insertedRoles = await dbService.findMany(Role, { code: { '$in': roles.map(role => role.toUpperCase()) } });
    const rolesToInsert = [];
    roles.forEach(role => {
      if (!insertedRoles.find(insertedRole => insertedRole.code === role.toUpperCase())) {
        rolesToInsert.push({
          name: role,
          code: role.toUpperCase(),
          weight: 1
        });
      }
    });
    if (rolesToInsert.length) {
      const result = await dbService.create(Role, rolesToInsert);
      if (result) console.log('Role seeded 🍺');
      else console.log('Role seeder failed!');
    } else {
      console.log('Role is upto date 🍺');
    }
  } catch (error) {
    console.log('Role seeder failed due to ', error.message);
  }
}

/* seeds routes of project */
async function seedProjectRoutes (routes) {
  try {
    if (routes  && routes.length) {
      let routeName = '';
      const dbRoutes = await dbService.findMany(ProjectRoute, {});
      let routeArr = [];
      let routeObj = {};
      routes.forEach(route => {
        routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
        route.methods.forEach(method => {
          routeObj = dbRoutes.find(dbRoute => dbRoute.route_name === routeName && dbRoute.method === method);
          if (!routeObj) {
            routeArr.push({
              'uri': route.path.toLowerCase(),
              'method': method,
              'route_name': routeName,
            });
          }
        });
      });
      if (routeArr.length) {
        const result = await dbService.create(ProjectRoute, routeArr);
        if (result) console.info('ProjectRoute model seeded 🍺');
        else console.info('ProjectRoute seeder failed.');
      } else {
        console.info('ProjectRoute is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('ProjectRoute seeder failed due to ', error.message);
  }
}

/* seeds role for routes */
async function seedRouteRole () {
  try {
    const routeRoles = [ 
      {
        route: '/admin/detection/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/detection/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/detection/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/detection/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/detection/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/detection/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/detection/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/detection/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/detection/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/detection/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/detection/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/detection/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/detection/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/detection/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/detection/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/detection/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/detection/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/detection/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/detection/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/detection/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/detection/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/detection/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/detection/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/detection/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/detection/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/detection/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/detection/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/motorbike/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/motorbike/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/motorbike/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/motorbike/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/motorbike/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/motorbike/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/motorbike/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/motorbike/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/motorbike/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/motorbike/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/motorbike/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/motorbike/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/admin/motorbike/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/motorbike/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/motorbike/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/motorbike/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/delete/:id',
        role: 'User',
        method: 'DELETE' 
      },
      {
        route: '/admin/user/delete/:id',
        role: 'Admin',
        method: 'DELETE' 
      },
      {
        route: '/admin/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/user/deletemany',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/user/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/usertokens/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/usertokens/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/role/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/role/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/routerole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/userrole/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/detection/list',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/detection/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/detection/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/detection/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/detection/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/detection/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/detection/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/detection/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/detection/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/detection/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/detection/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/detection/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/detection/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/detection/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/detection/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/list',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/motorbike/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/motorbike/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/motorbike/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/motorbike/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/motorbike/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/motorbike/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/user/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/softdelete/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/softdeletemany',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/delete/:id',
        role: 'User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/user/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/user/deletemany',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/deletemany',
        role: 'Admin',
        method: 'POST'
      },

    ];
    if (routeRoles && routeRoles.length) {
      const routes = [...new Set(routeRoles.map(routeRole => routeRole.route.toLowerCase()))];
      const routeMethods = [...new Set(routeRoles.map(routeRole => routeRole.method))];
      const roles = [ 'User', 'Admin', 'System_User' ];
      const insertedProjectRoute = await dbService.findMany(ProjectRoute, {
        uri: { '$in': routes },
        method: { '$in': routeMethods },
        'isActive': true,
        'isDeleted': false
      });
      const insertedRoles = await dbService.findMany(Role, {
        code: { '$in': roles.map(role => role.toUpperCase()) },
        'isActive': true,
        'isDeleted': false
      });
      let projectRouteId = '';
      let roleId = '';
      let createRouteRoles = routeRoles.map(routeRole => {
        projectRouteId = insertedProjectRoute.find(pr => pr.uri === routeRole.route.toLowerCase() && pr.method === routeRole.method);
        roleId = insertedRoles.find(r => r.code === routeRole.role.toUpperCase());
        if (projectRouteId && roleId) {
          return {
            roleId: roleId.id,
            routeId: projectRouteId.id
          };
        }
      });
      createRouteRoles = createRouteRoles.filter(Boolean);
      const routeRolesToBeInserted = [];
      let routeRoleObj = {};

      await Promise.all(
        createRouteRoles.map(async routeRole => {
          routeRoleObj = await dbService.findOne(RouteRole, {
            routeId: routeRole.routeId,
            roleId: routeRole.roleId,
          });
          if (!routeRoleObj) {
            routeRolesToBeInserted.push({
              routeId: routeRole.routeId,
              roleId: routeRole.roleId,
            });
          }
        })
      );
      if (routeRolesToBeInserted.length) {
        const result = await dbService.create(RouteRole, routeRolesToBeInserted);
        if (result) console.log('RouteRole seeded 🍺');
        else console.log('RouteRole seeder failed!');
      } else {
        console.log('RouteRole is upto date 🍺');
      }
    }
  } catch (error){
    console.log('RouteRole seeder failed due to ', error.message);
  }
}

/* seeds roles for users */
async function seedUserRole (){
  try {
    const userRoles = [{
      'username':'Andrew',
      'password':'123'
    },{
      'username':'kasuku',
      'password':'admin'
    }];
    const defaultRole = await dbService.findOne(Role, { code: 'SYSTEM_USER' });
    const insertedUsers = await dbService.findMany(User, { username: { '$in': userRoles.map(userRole => userRole.username) } });
    let user = {};
    const userRolesArr = [];
    userRoles.map(userRole => {
      user = insertedUsers.find(user => user.username === userRole.username && user.isPasswordMatch(userRole.password) && user.isActive && !user.isDeleted);
      if (user) {
        userRolesArr.push({
          userId: user.id,
          roleId: defaultRole.id
        });
      }
    });
    let userRoleObj = {};
    const userRolesToBeInserted = [];
    if (userRolesArr.length) {
      await Promise.all(
        userRolesArr.map(async userRole => {
          userRoleObj = await dbService.findOne(UserRole, {
            userId: userRole.userId,
            roleId: userRole.roleId
          });
          if (!userRoleObj) {
            userRolesToBeInserted.push({
              userId: userRole.userId,
              roleId: userRole.roleId
            });
          }
        })
      );
      if (userRolesToBeInserted.length) {
        const result = await dbService.create(UserRole, userRolesToBeInserted);
        if (result) console.log('UserRole seeded 🍺');
        else console.log('UserRole seeder failed');
      } else {
        console.log('UserRole is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('UserRole seeder failed due to ', error.message);
  }
}

async function seedData (allRegisterRoutes){
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();

};
module.exports = seedData;