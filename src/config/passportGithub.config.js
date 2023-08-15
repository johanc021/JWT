import passport from 'passport';
import userModel from '../dao/models/users.js';
import gitHubStrategy from 'passport-github2';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../utils.js'; // Importa tu clave secreta aquí

const initPassportGithub = () => {
    passport.use(
        'github',
        new gitHubStrategy(
            {
                clientID: 'Iv1.5fc2ea363a045e15',
                clientSecret: '8cddbe51c0fcedc867d4e9014ab8b13ce500f581',
                callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await userModel.findOne({ email: profile._json.email });
                    if (!user) {
                        let newUser = {
                            first_name: profile._json.name,
                            last_name: profile._json.family_name || '',
                            email: profile._json.email,
                            age: '',
                            role: 'user',
                            password: '',
                        };
                        let result = await userModel.create(newUser);
                        user = result; // asigna el nuevo usuario al objeto user
                    }

                    // Generar un token JWT con la información del usuario
                    const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' });

                    // Pasar el token al callback 'done'
                    done(null, token);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

export default initPassportGithub;
