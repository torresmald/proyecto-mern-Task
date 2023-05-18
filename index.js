import express from 'express';
import conectarDB from './config/db.js';
import usuarioRouter from './routes/usuario.routes.js';
import proyectoRouter from './routes/proyecto.routes.js';
import tareaRouter from './routes/tarea.routes.js';
import cors from 'cors';
const server = express();
const PORT = process.env.PORT || 4000;
conectarDB()

server.use(cors());

server.use(express.json());
server.use('/api/usuarios', usuarioRouter);
server.use('/api/proyectos', proyectoRouter);
server.use('/api/tareas', tareaRouter);




server.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
})