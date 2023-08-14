import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt, { genSaltSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

export const SECRET_KEY = 'CoderH1234'

export const createHast = password => bcrypt.hashSync(password, genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

const generateToken = (user) => {
    const token = jwt.sign({ ...user }, SECRET_KEY, { expiresIn: '24h' });
    return token
}

const cookieExtractor = (req, res) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['cookie']
    }
    return token
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { generateToken, cookieExtractor };

export default __dirname