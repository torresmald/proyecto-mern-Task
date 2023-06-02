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

const servidor = server.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
})

// SOCKET IO

import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
});

io.on('connection', (socket) => {
    console.log('Conectado a Socket IO');
    socket.on('abrirProyecto', (proyecto) => {
        socket.join(proyecto)
    });

    socket.on('agregarTarea', (tarea) => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tareaAgreada', tarea)
    })
    socket.on('eliminarTarea', (tarea) => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tareaEliminada', tarea)
    })
    socket.on('editarTarea', (tarea) => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tareaActualizada', tarea)
    })
    socket.on('cambiarEstado', (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('estadoActualizado', tarea)
    })
})