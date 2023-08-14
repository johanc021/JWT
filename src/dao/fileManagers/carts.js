import fs from 'fs';

export const saveJSON = (result) => {
    // Verificar si el archivo JSON existe
    if (fs.existsSync('carts.json')) {
        // Leer el archivo JSON existente
        const cartsData = fs.readFileSync('carts.json', 'utf8');
        const carts = JSON.parse(cartsData);

        // Agregar el nuevo producto a la lista de productos
        carts.push(result);

        // Escribir la lista de productos actualizada en el archivo JSON
        fs.writeFileSync('carts.json', JSON.stringify(carts), 'utf8');
    } else {
        // Crear un nuevo archivo JSON con el objeto directamente
        fs.writeFileSync('carts.json', JSON.stringify([result]), 'utf8');
    }
}