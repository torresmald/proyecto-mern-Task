import express  from "express";
import { registrarUsuarios, obtenerUsuarios, loginUsuarios, confirmarToken } from "../controllers/usuarioController.js";
const router = express.Router();

router.get('/', obtenerUsuarios);
router.get('/confirmar/:token', confirmarToken)
router.post('/', registrarUsuarios);
router.post('/login', loginUsuarios);


export default router;