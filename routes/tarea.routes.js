import express from 'express';
import { obtenerTarea, agregarTarea, editarTarea, eliminarTarea, cambiarEstado } from '../controllers/tareaController.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/', isAuth, agregarTarea);
router.route('/:id')
    .get(isAuth, obtenerTarea)
    .put(isAuth, editarTarea)
    .delete(isAuth, eliminarTarea);
router.post('/cambiarEstado/:id', isAuth, cambiarEstado);

export default router;