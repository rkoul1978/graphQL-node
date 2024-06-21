"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//const userSample = require('./users.sample').usersSample;
const { User, Student, Student_Details } = require('../models/user');
const crypto = require('crypto');
class UsersService {
    //   public users: any = userSample;
    configTypeDefs() {
        let typeDefs = `
          type User {
            firstName: String,
            lastName: String,
            id: Int,
            password: String,
            permissionLevel: Int,
            email: String
          }

          type Student {
            name: String,
            email: String,
            rollno: Int
          }

          type Student_Details {
            course: String,
            phoneno: String,
            address: String,
            hobbies: [String]
          }
          
          input UserInputData {
            id:Int,
            firstName:String,
            lastName: String,
            password: String,
            permissionLevel: Int,
            email: String
          }

          type Query {
            matchEmail : [User]
          }

          type Query {
            sortPermissionLevel : [User]
          }

          type TotalEmail {
            totalEmail: Int
          }

          type Query {
            countEmail : [TotalEmail]
          }

          type student_data {
            name: String,
            student_info: [Student_Details]
          }

          type Query {
            studentLookUp(_id:String!): [student_data]
          }
          
          type Query {
            users: [User]
          }
        
          type Mutation {
            addUser(userInput: UserInputData!): User!
          }
          
          type Mutation {
            updateUser(id:Int, userInput: UserInputData! ): User!
          }
          `;
        return typeDefs;
    }
    configResolvers(resolvers) {
        resolvers.Query.matchEmail = () => __awaiter(this, void 0, void 0, function* () {
            return yield User.aggregate([{ $match: { "email": "roshan@roshan.com" } }]);
        });
        resolvers.Query.countEmail = () => __awaiter(this, void 0, void 0, function* () {
            return yield User.aggregate([{ $count: "totalEmail" }]);
        });
        resolvers.Query.sortPermissionLevel = () => __awaiter(this, void 0, void 0, function* () {
            return yield User.aggregate([{ $sort: { "permissionLevel": 1 } }]);
        });
        resolvers.Query.studentLookUp = (_, { _id }) => __awaiter(this, void 0, void 0, function* () {
            return yield Student.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(_id) }
                },
                {
                    $lookup: {
                        from: "student_details",
                        localField: "_id",
                        foreignField: "student_id",
                        as: "student_info",
                    }
                },
                //  {
                //    $project:{      //use to select the fileds you want to select
                //      _id:0,                      //:0 will not select the field
                //      student_details:1,         //:1 will select the field
                //      name:1
                //    }
                //  }
            ]);
        });
        resolvers.Query.users = () => __awaiter(this, void 0, void 0, function* () {
            //  return this.users;
            return yield User.find();
        });
        resolvers.Mutation.addUser = (_, { userInput }) => {
            /*mutation AddUser($input:UserInputData!) {
              addUser( userInput: $input) {
                  id
                  firstName
                  lastName
                  password
                  permissionLevel
                  email
              }
            }*/
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(userInput.password).digest("base64");
            userInput.password = hash;
            //  this.users.push(user);
            User.create(userInput);
            return userInput;
        };
        resolvers.Mutation.updateUser = (_, { id, userInput }) => __awaiter(this, void 0, void 0, function* () {
            /*Query Variable ->
              {
                "input": {
                    "id":300,
                    "firstName": "Natasha",
                    "lastName": "SETH KOUL",
                    "password": "amaz1ingP4ss",
                    "permissionLevel": 10,
                    "email": "nat.koul@toptal.com"
                }
              }                                                    mutation updateUser($input:UserInputData!) {
                                                                    updateUser(id: 300, userInput: $input) {
                                                                      id
                                                                      firstName
                                                                      lastName
                                                                      password
                                                                      permissionLevel
                                                                      email
                                                                  }
                                                              }*/
            const user = yield User.findOne({ id: id }).exec();
            if (!user) {
                throw new Error('User Not found!');
            }
            yield User.updateOne({ "id": id }, { "$set": { firstName: userInput.firstName, lastName: userInput.lastName, password: userInput.password, permissionLevel: userInput.permissionLevel, email: userInput.email } }).exec();
            return userInput;
        });
    }
}
exports.UsersService = UsersService;
