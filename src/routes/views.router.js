import { Router } from 'express';
import passport from 'passport';

import Products from '../dao/dbManagers/products.js'
import Carts from '../dao/dbManagers/carts.js'
import Chats from '../dao/dbManagers/chats.js'

const productManager = new Products();
const cartManager = new Carts();
const chatManager = new Chats()

const router = Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get('/resetPassword', (req, res) => {
    res.render('resetPassword')
})

/* router.get("/profile", (req, res) => {
    res.render("profile", {
        user: req.user
    });
}); */
router.get("/profile", passport.authenticate('current', { session: false }), (req, res) => {
    res.render("profile", {
        user: req.user
    });
});

router.get('/products', async (req, res) => {
    const { page = 1 } = req.query;

    try {
        const result = await productManager.getAll(page, 5);
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

        res.render('products', {
            products: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

router.get('/carts', async (req, res) => {
    let carts = await cartManager.getAll();
    console.log(carts);
    res.render('carts', { carts });
});

router.get("/chat", async (req, res) => {
    let messages = await chatManager.getAll()
    res.render("chat", { messages })
})

router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    const cart = await cartManager.getCart(cartId);
    //console.log(cart)
    //res.json({ status: "El carrito", payload: cart })

    if (!cart) {
        // Si no se encuentra el carrito, se devuelve un mensaje de error o se redirige a una página de error
        res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
        // Renderizar la vista de carrito con los productos del carrito específico
        res.render('cart', { cart });
    }
});

export default router;