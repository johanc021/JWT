import Router from 'express';
import Carts from '../dao/dbManagers/carts.js'

const cartManager = new Carts('./carts.json');

const router = Router();


//Obtener carritos
router.get('/', async (req, res) => {
    let carts = await cartManager.getAll();
    if (!carts) return res.status(404).json({ status: "Carritos no encontrados" })
    res.send({ status: "success", payload: carts })
})

//Crear carrito con producto
router.post('/', async (req, res) => {
    let { idProduct, idCart, quantity } = req.body

    let result = await cartManager.saveCart(idProduct, idCart, quantity)

    res.send({ status: "success", payload: result })
})

//eliminar un producto en un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid; // Obtiene el ID del carrito desde los parámetros de la ruta
    const productId = req.params.pid; // Obtiene el ID del producto desde los parámetros de la ruta

    try {
        // Busca el carrito por su ID
        await cartManager.deleteProductByIdFromCart(cartId, productId);
        res.json({ status: "Producto eliminado del carrito correctamente" });
    } catch (error) {
        res.status(500).json({ status: "Error al eliminar el producto del carrito" });
    }
});

// actualizar productos de un id de un carrito
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const { products } = req.body;

    try {
        const updatedCart = await cartManager.updateCartById(cartId, products);

        if (!updatedCart) {
            return res.status(404).json({ status: "Carrito no encontrado" });
        }

        res.json({ status: "Carrito actualizado correctamente", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "Error al actualizar el carrito" });
    }
});

//actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);

        if (!updatedCart) {
            return res.status(404).json({ status: "Carrito no encontrado o producto no encontrado en el carrito" });
        }

        res.json({ status: "Cantidad de ejemplares actualizada correctamente", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "Error al actualizar la cantidad de ejemplares" });
    }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const deletedCart = await cartManager.deleteAllProductsFromCart(cartId);
        if (!deletedCart) {
            // Si no se encuentra el carrito, se devuelve un mensaje de error o se redirige a una página de error
            res.status(404).json({ error: 'Carrito no encontrado' });
        } else {
            res.json({ message: 'Productos eliminados del carrito' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
    }
});



// lleve la peticion a views.router.js

/* router.get('/:cid', async (req, res) => {
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
}); */


export default router;

