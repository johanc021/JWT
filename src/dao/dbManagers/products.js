import { productModel } from '../models/products.js';
import { saveJSON, editJSON, removeFromJSON } from '../fileManagers/products.js';

export default class Product {
    constructor(path) {
        this.path = path
    }

    /* getAll = async () => {
        let products = await productModel.find().lean()
        return products
    } */

    getAll = async (page, limit) => {
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true
            };

            const result = await productModel.paginate({}, options);
            return result;
        } catch (error) {
            console.log('Error al obtener los productos:', error.message);
            return null;
        }
    }

    getProductById = async (productId) => {
        let product = await productModel.findById(productId).lean()
        return product
    }

    saveProduct = async product => {
        let result = await productModel.create(product)

        //funcion para guardar en JSON
        saveJSON(result)

        return result
    }

    editProduct = async (productId, updatedProduct) => {
        let result = await productModel.findByIdAndUpdate(
            productId,
            updatedProduct,
            { new: true }
        );
        editJSON(productId, updatedProduct);
        return result;
    };

    deleteProduct = async productId => {
        let result = await productModel.findByIdAndDelete(productId);

        removeFromJSON(productId);

        return result;
    };
    /*    //Actualizar un producto
          updateProduct(id, { title, description, code, price, status, stock, category, thumbnail } = {}) {
              console.log(id)
              const productIndex = this.products.findIndex((p) => p.id === id);
              console.log(productIndex)
              if (productIndex !== -1) {
                  const product = this.products[productIndex];
                  product.title = title || product.title;
                  product.description = description || product.description;
                  product.code = code || product.code;
                  product.price = price || product.price;
                  product.status = status || product.status;
                  product.stock = stock || product.stock;
                  product.category = category || product.category;
                  product.thumbnail = thumbnail || product.thumbnail;
                  this.products[productIndex] = product;
                  fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf8');
                  console.log(`Producto con ID ${id} ha sido actualizado.`);
              } else {
                  console.log(`Producto con ID ${id} no encontrado.`);
              }
          }
      
          //Eliminar un producto
      
          deleteProduct(id) {
              fs.promises.readFile(this.path, 'utf8')
                  .then((data) => {
                      let products = JSON.parse(data);
                      const productIndex = products.findIndex((p) => p.id === id);
      
                      if (productIndex !== -1) {
                          products.splice(productIndex, 1);
                          console.log(`Producto con id ${id} ha sido eliminado.`);
      
                          return fs.promises.writeFile(this.path, JSON.stringify(products), 'utf8');
                      } else {
                          console.log(`Producto con id ${id} no encontrado.`);
                          throw new Error('Producto no encontrado');
                      }
                  })
                  .catch((err) => {
                      console.log(`Error al eliminar el producto: ${err}`);
                  });
          } */
}


