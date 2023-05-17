import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';

const obtenerUsuarios = async (request, response, next) => {
    try {
        const usuarios = await Usuario.find();
        if (!usuarios) {
            const error = new Error('No hay Usuarios')
            return response.status(404).json({ msg: error.message })
        }
        response.status(200).json(usuarios)
    } catch (error) {
        console.log(error);
    }
}

const registrarUsuarios = async (request, response, next) => {
    try {
        const { email, password, nombre } = request.body;
        const usuarioExistente = await Usuario.findOne({ email })
        if (usuarioExistente) {
            const error = new Error('El usuario ya existe')
            return response.status(404).json({ msg: error.message })
        }
        const encryptedPassword = await bcrypt.hash(password.toString(), parseInt(10));
        if (!encryptedPassword) {
            return next();
        }
        const usuario = new Usuario({
            email,
            password: encryptedPassword,
            nombre,
            token: generarId()
        });
        const usuarioAlmacenado = await usuario.save();
        response.status(200).json(usuarioAlmacenado)
    } catch (error) {
        console.log(error);
    }
}

const loginUsuarios = async (request, response, next) => {
    const { email, password } = request.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error('El usuario no existe')
        return response.status(404).json({ msg: error.message })
    }
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada')
        return response.status(404).json({ msg: error.message })
    }
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    if (!isValidPassword) {
        const error = new Error('El password no es válido')
        return response.status(403).json({ msg: error.message })
    }
    usuario.token = generarJWT(usuario._id)
    response.status(200).json(usuario);
}

const confirmarToken = async (request, response, next) => {
    const { token } = request.params;
    const usuarioConfirmado = await Usuario.findOne({ token });
    if (!usuarioConfirmado) {
        const error = new Error('El Token no es válido')
        return response.status(404).json({ msg: error.message })
    }
    try {
        usuarioConfirmado.confirmado = true;
        usuarioConfirmado.token = '';
        await usuarioConfirmado.save();
        response.status(200).json({ msg: 'Usuario confirmado' })
    } catch (error) {
        console.log(error);
    }
}

const forgotPassword = async (request, response, next) => {
    const { email } = request.body;
    const usuarioExistente = await Usuario.findOne({ email })
    if (!usuarioExistente) {
        const error = new Error('El usuario no existe')
        return response.status(404).json({ msg: error.message })
    }
    try {
        usuarioExistente.token = generarId();
        await usuarioExistente.save();
        response.status(200).json({ msg: 'Se han enviado las instrucciones para resetar el password' })
    } catch (error) {
        console.log(error);
    }
}
const comprobarToken = async (request, response, next) => {
    const { token } = request.params;
    const tokenValido = await Usuario.findOne({ token });
    if (tokenValido) {
        response.status(200).json({ msg: 'Token Valido' })
    } else {
        const error = new Error('El Token no es valido')
        return response.status(404).json({ msg: error.message })
    }
}
const nuevoPassword = async (request, response, next) => {
    const { token } = request.params;
    const { password } = request.body;
    const usuario = await Usuario.findOne({ token });
    if (usuario) {
        const encryptedPassword = await bcrypt.hash(password.toString(), parseInt(10));
        usuario.password = encryptedPassword;
        usuario.token = '';
        await usuario.save();
        response.status(200).json({ msg: 'Password Modificado' });
    } else {
        const error = new Error('El Token no es valido')
        return response.status(404).json({ msg: error.message })
    }
}

const perfil = async (request, response, next) => {
    const {usuario } = request;
    response.status(200).json(usuario);
}


export { registrarUsuarios, obtenerUsuarios, loginUsuarios, confirmarToken, forgotPassword, comprobarToken, nuevoPassword, perfil }