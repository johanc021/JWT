import Router from 'express';
import Products from '../dao/dbManagers/products.js'
import { productModel } from '../dao/models/products.js';


const productManager = new Products('./products.json');

const router = Router();


/* router.get('/', async (req, res) => {
    let products = await productManager.getAll();
    if (!products) return res.status(404).json({ status: "Usuarios no encontrados" })
    res.send({ status: "success", payload: products })
}) */



//Obtener productos, parametros opcionales limit, page, sort, query
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const query = req.query.query || '';

    const filterProducts = [
        {
            $match: {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            }
        },
        {
            $sort: { price: sort }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    ];

    try {
        const products = await productModel.aggregate(filterProducts);
        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los productos" });
    }
});

router.post('/', async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnail } = req.body

    let result = await productManager.saveProduct(
        {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        })

    res.send({ status: "success", payload: result })
})

router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        /* console.log(productId); */

        const { title, description, code, price, status, stock, category, thumbnail } = req.body;

        /* console.log(req.body) */

        // Verificar si el producto existe
        const existingProduct = await productManager.getProductById(productId);

        /* console.log(existingProduct) */

        if (!existingProduct) {
            return res.status(404).json({ error: 'El producto no existe' });
        }

        // Actualizar solo los campos proporcionados en el cuerpo de la solicitud
        if (title) existingProduct.title = title;
        if (description) existingProduct.description = description;
        if (code) existingProduct.code = code;
        if (price) existingProduct.price = price;
        if (status) existingProduct.status = status;
        if (stock) existingProduct.stock = stock;
        if (category) existingProduct.category = category;
        if (thumbnail) existingProduct.thumbnail = thumbnail;

        const productUpdated = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        }
        // Guardar los cambios en la base de datos
        await productManager.editProduct(productId, productUpdated)

        // Devolver una respuesta al cliente
        res.json({ mensaje: `Producto actualizado: ${productId}` });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Verificar si el producto existe
        const existingProduct = await productManager.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: 'El producto no existe' });
        }

        // Eliminar el producto de la base de datos
        await productManager.deleteProduct(productId);

        // Devolver una respuesta al cliente
        res.json({ mensaje: `Producto eliminado: ${productId}` });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});




export default router;

