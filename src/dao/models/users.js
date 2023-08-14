import mongoose from "mongoose";

const userCollection = 'Users'
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: String,
    password: String,
    cart: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Carts'
            }
        ]
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})
const userModel = mongoose.model(userCollection, userSchema)
export default userModel;