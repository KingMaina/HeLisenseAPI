
# NodeJS,Mongoose,Express Project in MVC Architecture

**Supported version of nodejs >= 12**,
**Supported version of mongoose >= 6**

## About 
- This is the API logic for the Deep learning project HeLisense(admin panel), which servers to detect presence/absence of helmets on motorcycle riders after which it sends feedback to the system based on the detection. The model is created using Python and is not included here therefore reproducibility using the model is not possible yet but will be added in the near future.

- This is a Node application, developed using MVC pattern with Node.js, ExpressJS, and Mongoose. 
- MongoDB database is used for data storage, with object modeling provided by Mongoose.

## Initial
1. ```$ npm install```
2. ```$ npm start```
3. Credentials

	- One user with User role,
	# Default User credentials
	**username** : Andrew
	**password** : 123

	- One user with Admin role,
	# Default Admin credentials
	**username** : kasuku
	**password** : admin

## How to run with Docker ? :

 ***Create a .\env.docker file and add the commandds as in [env section](#env).***

- if you have docker file you can execute following command
- build the image
	```$ docker build --pull --rm -f "Dockerfile" -t <imageName>:latest "." ```
- execute the command
	```$ docker run -p 3000:3000 <imageName> ```


## Folder structure:
```
  ├── app.js       - starting point of the application
  ├── config
  │   └── db.js    - contains api database connection
  ├── constants    - contains commonly used constants 
  ├── controllers               
  │   └── platform - contains business logic
  ├── jobs         - cron jobs
  ├── models       - models of application
  ├── postman      - postman collection files
  ├── routes       - contains all the routes of application
  ├── services     - contains commonly used services
  ├── views        - templates
  └── utils        - contains utility functions    
```

## Detail Description of Files and folders

1. app.js
- entry point of application.

2. config
- passport strategy files
- database connection files

3. constants
- constants used across application.

4. controllers
- Controller files that contains Business logic
```
	├── controller
		├── platform
			└── modelNameController.js        - contains CRUD Operations
```

5. jobs
- Cron jobs

6. middleware
- Middleware files for authentication, authorization and role-access.

7. models
- Database models 

8. postman
- Postman collection of APIs (Import this JSON in Postman to run the APIs)

9. public 
- Assets used in application

10. routes
```
	├── routes
		├── platform
			├── modelNameRoutes.js   - contains CRUD operation routes
			└── index.js             - exports model Routes
		└── index.js                 - exports platform routes

```
- index.js file, exports platform routes, imported into app.js to access all the routes.

11. services
```
	├── services
		├── jobs                     - cron jobs
		└── auth.js                  - Authentication module service

```

12. utils
```
	├── utils
		├── validations              - joi validations files for every model
		├── dbService.js             - Database functions 
		├── messages.js              - Messages used in sending response 
		├── responseCode.js          - response codes 
		└── validateRequest.js       - validate request based on model schema

```

### 13. env files {#env}
- You can add credentials and port, database, e-mail values as per your environment(Development/Production).
- Create a .env file in your root folder and add the following:
	- PORT=5000
	- DB_URL=your-mongodb-url 
	- DB_TEST_URL=your-mongodb-test-url e.g. mongodb://mongodb:27017/testdb 
	- ALLOW_ORIGIN=*
	- MAILGUN_USER=your-mailgun-user
	- MAILGUN_PASSWORD=your-mailgun-password
- If you are running test environment then test cases will run using test database,and its configuration is there inside app.js

## This project was created with the assistance of low-code tools from [Dhiwise](https://www.dhiwise.com)