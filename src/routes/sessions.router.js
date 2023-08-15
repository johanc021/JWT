import { Router } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../utils.js";

const router = Router();

// Registrar un usuario
router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(400).json({ error: info.message });
        }
        return res.json({ status: "success", message: "User Register" });
    })(req, res, next);
});

// En caso de que falle el registro
router.get('/failRegister', async (req, res) => {
    res.send({ error: "failed" });
});


//Login Passport y jwt

router.post('/login', passport.authenticate('login', { passReqToCallback: true, session: false, failureRedirect: '/failLogin', failureMessage: true, }), async (req, res) => {

    const serialUser = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    const token = jwt.sign(serialUser, SECRET_KEY, { expiresIn: "1h" })

    // Devolver el resultado exitoso
    res.cookie('cookie', token, { maxAge: 360000000 }).send({ status: 'success', message: 'Inicio de sesión exitoso', payload: "OK" })

});

//Current

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json({ payload: req.user });
});

//en caso de que falle el login
router.get('/failLogin', async (req, res) => {
    res.send({ error: "failed" })
})

router.post('/resetPassword', passport.authenticate('resetPassword', { failureRedirect: '/failResetPassword' }), async (req, res) => {
    res.send({ status: "success", message: "Contraseña restaurada" });
});

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: "/login" }), async (req, res) => {
    req.user = req.user
    res.redirect('/profile')
})

//logout
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('cookie');

        return res.status(200).json({ status: 'success', message: 'Sesión cerrada correctamente' });
    } catch (err) {
        console.error('Error al cerrar la sesión:', err);
        res.status(500).json({ status: 'error', error: 'Error al cerrar la sesión' });
    }
});


export default router;