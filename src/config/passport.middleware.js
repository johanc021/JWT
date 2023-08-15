import passport from "passport";
import passportJWT from "passport-jwt";
import local from 'passport-local'
import { cookieExtractor, SECRET_KEY, isValidPassword, createHast } from "../utils.js";
import userModel from "../dao/models/users.js";

const localStrategy = local.Strategy;
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const initializedPassport = () => {
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY,
      },
      async (jwt_payload, done) => {
        try {

          //Opcion 1 - para devolver el usuario de la base de datos de acuerdo a la cookie (funciona)
          /* const user = await userModel.findOne({ email: jwt_payload.email });
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          return done(null, user); */

          //Opcion 2 - devuelve los datos de la cookie - se debe comentar si se va a utilizar el codigo comentado
          return done(null, jwt_payload);

        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use('register', new localStrategy(
    { passReqToCallback: true, usernameField: 'email', session: false }, async (req, username, password, done) => {
      const { first_name, last_name, email, age } = req.body;
      try {
        let user = await userModel.findOne({ email: username });
        if (user) {
          return done(null, false, { message: 'Correo electrónico ya registrado' });
        }
        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: createHast(password)
        };
        let result = await userModel.create(newUser);
        return done(null, result);
      } catch (error) {
        return done("Error de usuario" + error);
      }
    }
  ));

  passport.use('login', new localStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!isValidPassword(user, password)) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use('resetPassword', new localStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Actualizar la contraseña en la base de datos
        const newHashedPassword = createHast(password);
        await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

        // Retorna el usuario actualizado (opcional)
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
  })
};

export default initializedPassport;
