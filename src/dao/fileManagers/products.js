import fs from 'fs';

export const saveJSON = (result) => {
    // Verificar si el archivo JSON existe
    if (fs.existsSync('products.json')) {
        // Leer el archivo JSON existente
        const productsData = fs.readFileSync('products.json', 'utf8');
        const products = JSON.parse(productsData);

        // Agregar el nuevo producto a la lista de productos
        products.push(result);

        // Escribir la lista de productos actualizada en el archivo JSON
        fs.writeFileSync('products.json', JSON.stringify(products), 'utf8');
    } else {
        // Crear un nuevo archivo JSON con el objeto directamente
        fs.writeFileSync('products.json', JSON.stringify([result]), 'utf8');
    }
}

export const editJSON = (productId, updatedProduct) => {

    // Lee el archivo JSON
    const data = fs.readFileSync('./products.json', 'utf8');

    // Parsea los datos del archivo JSON a un objeto
    const products = JSON.parse(data);

    // Busca el producto por ID en el array de productos
    const productIndex = products.findIndex(product => product._id === productId);
    /* console.log(productIndex) */


    if (productIndex === -1) {
        throw new Error('El producto no existe');
    }

    // Actualiza los datos del producto con los valores proporcionados
    products[productIndex] = {
        ...products[productIndex],
        ...updatedProduct
    };

    // Convierte el objeto de productos a formato JSON
    const updatedData = JSON.stringify(products, null, 2);

    // Escribe los datos actualizados en el archivo JSON
    fs.writeFileSync('./products.json', updatedData);

    // Devuelve el producto actualizado
    return products[productIndex];
};


export const removeFromJSON = (productId) => {
    // Lee el archivo JSON
    const data = fs.readFileSync('./products.json', 'utf8');

    // Parsea los datos del archivo JSON a un objeto
    const products = JSON.parse(data);

    // Busca el índice del producto por su ID en el array de productos
    const productIndex = products.findIndex(product => product._id === productId);
    if (productIndex === -1) {
        throw new Error('El producto no existe');
    }

    // Elimina el producto del array
    products.splice(productIndex, 1);

    // Convierte el objeto de productos a formato JSON
    const updatedData = JSON.stringify(products, null, 2);

    // Escribe los datos actualizados en el archivo JSON
    fs.writeFileSync('./products.json', updatedData);

    // Devuelve el ID del producto eliminado
    return productId;
};