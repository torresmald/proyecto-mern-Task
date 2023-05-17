import express from 'express';
import conectarDB from './config/db.js';
import usuarioRouter from './routes/usuario.routes.js';

const server = express();
const PORT = process.env.PORT || 4000;
conectarDB()

// server.use('/', (request, response) => {
//     response.send('Hola Mundo')
// })
server.use(express.json());
server.use('/api/usuarios', usuarioRouter);


server.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
})