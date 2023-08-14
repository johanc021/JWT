import userModel from '../models/users.js';
import { saveJSON, editJSON, removeFromJSON } from '../fileManagers/products.js';

export default class Users {
    constructor() {
        console.log("Trabajando con Mongo")
    }
    getAll = async () => {
        let users = await userModel.find().populate('Courses');
        return users.map(user => user.toObject())
    }

    saveUser = async (user) => {
        let result = await userModel.create(user);
        return result;
    }

    getById = async (param) => {
        let result = await userModel.findOne(param).populate('Courses').lean()
        return result
    }

    updateUser = async (id, user) => {
        delete user._id
        let result = await userModel.updateOne({ _id: id }, { $set: user })
        return result
    }
}