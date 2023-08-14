import fs from 'fs';

export const saveJSON = (result) => {
    // Verificar si el archivo JSON existe
    if (fs.existsSync('chats.json')) {
        // Leer el archivo JSON existente
        const chatsData = fs.readFileSync('chats.json', 'utf8');
        const chats = JSON.parse(chatsData);

        // Agregar el nuevo producto a la lista de productos
        chats.push(result);

        // Escribir la lista de productos actualizada en el archivo JSON
        fs.writeFileSync('chats.json', JSON.stringify(chats), 'utf8');
    } else {
        // Crear un nuevo archivo JSON con el objeto directamente
        fs.writeFileSync('chats.json', JSON.stringify([result]), 'utf8');
    }
}

