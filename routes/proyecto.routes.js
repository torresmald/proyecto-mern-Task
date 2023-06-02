import { obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, buscarColaborador, eliminarColaborador, agregarColaborador } from '../controllers/proyectoController.js';
import isAuth from '../middlewares/isAuth.js';
import express from 'express';

const router = express.Router();

router.route('/')
    .get(isAuth, obtenerProyectos)
    .post(isAuth, nuevoProyecto);

router.route('/:id')
    .get(isAuth,  obtenerProyecto)
    .put(isAuth, editarProyecto)
    .delete(isAuth, eliminarProyecto);

router.route('/buscarColaborador')
    .post(isAuth, buscarColaborador)
router.route('/agregarColaborador/:id')
    .post(isAuth, agregarColaborador);
router.route('/eliminarColaborador/:id')
    .post(isAuth, eliminarColaborador);

export default router;