import { ObjectId } from "mongoose";
import mongoose from 'mongoose';
//const userSample = require('./users.sample').usersSample;
const { User, Student, Student_Details } = require('../models/user');

const crypto = require('crypto');

export class UsersService {

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

    configResolvers(resolvers: any) {

       resolvers.Query.matchEmail = async() => {
          return await User.aggregate([{ $match :{"email":"roshan@roshan.com"}}]);
       }

       resolvers.Query.countEmail = async() => {
          return await User.aggregate([{ $count : "totalEmail"}]);
       }

       resolvers.Query.sortPermissionLevel = async() =>{
          return await User.aggregate([{ $sort : { "permissionLevel": 1 }}])
       }

       resolvers.Query.studentLookUp = async(_: any, {_id}:{_id: any}) =>{
          return await Student.aggregate (
            [
              {
                $match : { _id:  new mongoose.Types.ObjectId(_id)}
              },
              {
                $lookup: {      /* Left Outer Join */
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
            ]
          )
       }

       resolvers.Query.users = async() => {          /*query Users {
                                                                users {
                                                                    firstName
                                                                    lastName
                                                                    id
                                                                    password
                                                                    permissionLevel
                                                                    email
                                                                }
                                                        } */
          //  return this.users;
          return await User.find();
        };

        resolvers.Mutation.addUser = (_: any, {userInput}:{userInput: any}) => {
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
        
        resolvers.Mutation.updateUser = async (_: any, {id,userInput}:{id:Number,userInput:any}) =>{

        /*Query Variable ->  
          {
            "input": {
                "id":300,
                "firstName": "Natasha",
                "lastName": "SETH KOUL",
                "password": "",
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
          const user = await User.findOne({id:id}).exec();
          if(!user){
            throw new Error('User Not found!');
          }
          await User.updateOne(
            {"id": id},
            { "$set":{firstName: userInput.firstName , lastName:userInput.lastName, password:userInput.password, permissionLevel:userInput.permissionLevel, email:userInput.email}}
            ).exec();
          
          return userInput ;
        };

    }

}
