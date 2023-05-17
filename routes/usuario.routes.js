import express  from "express";
import { registrarUsuarios, obtenerUsuarios, loginUsuarios, confirmarToken, forgotPassword, comprobarToken, nuevoPassword, perfil } from "../controllers/usuarioController.js";
import isAuth from "../middlewares/isAuth.js";
const router = express.Router();

router.get('/', obtenerUsuarios);
router.get('/confirmar/:token', confirmarToken)
router.post('/', registrarUsuarios);
router.post('/login', loginUsuarios);
router.post('/forgot-password', forgotPassword);
router.route('/forgot-password/:token').get(comprobarToken).post(nuevoPassword);

router.get('/perfil', isAuth, perfil);

export default router;