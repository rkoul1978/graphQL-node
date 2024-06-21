const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  id:  Number,
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  permissionLevel: Number
}, { collection: 'users' });

let studentSchema = new Schema({
  name:  String,
  email: String,
  rollno:Number
}, { collection: 'students' });

let studentDetailsSchema = new Schema({
  course:  String,
  phoneno: String,
  address: String,
  hobbies:[String],
  date: { type: Date, default: Date.now },
  student_id: { type: Schema.ObjectId, ref:'Student'}
  }, { collection: 'student_details' });

const User = mongoose.model('User', userSchema)
const Student = mongoose.model('Student', studentSchema)
const Student_Details = mongoose.model('Student_Details', studentDetailsSchema)

module.exports =  { User, Student, Student_Details } 