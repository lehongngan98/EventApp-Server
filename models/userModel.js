const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        
    },
    password:{
        type: String,
        
    },
    photoURL:{
        type: String,
        default: ''
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    },
    role:{
        type: String,
        default: 'user'
    },
    
    
})

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;