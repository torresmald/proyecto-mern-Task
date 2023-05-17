import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";
const obtenerTarea = async (request, response) => {
    const { id } = request.params;
    const tarea = await Tarea.findById(id).populate('proyecto');
    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return response.status(404).json({ msg: error.message })
    }
    if (tarea.proyecto.creador.toString() !== request.usuario._id.toString()) {
        const error = new Error('No tienes los permisos');
        return response.status(403).json({ msg: error.message })
    }
    return response.status(200).json(tarea);
}

const agregarTarea = async (request, response) => {
    const { proyecto } = request.body;
    const proyectoExistente = await Proyecto.findById(proyecto);
    if (!proyectoExistente) {
        const error = new Error('No existe Proyecto');
        return response.status(404).json({ msg: error.message })
    }
    if (proyectoExistente.creador.toString() !== request.usuario._id.toString()) {
        const error = new Error('No tienes los permisos');
        return response.status(404).json({ msg: error.message })
    }
    try {
        const tareaAlmacenada = await Tarea.create(request.body);
        return response.status(200).json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
    }
}
const editarTarea = async (request, response) => {
    const { id } = request.params;
    const tarea = await Tarea.findById(id).populate('proyecto');
    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return response.status(404).json({ msg: error.message })
    }
    if (tarea.proyecto.creador.toString() !== request.usuario._id.toString()) {
        const error = new Error('No tienes los permisos');
        return response.status(403).json({ msg: error.message })
    }
    const tareaModificada = new Tarea({ ...request.body });
    tareaModificada._id = id;
    const tareaActualizada = await Tarea.findByIdAndUpdate(
        id,
        tareaModificada,
        { new: true }
    );
    return response.status(200).json(tareaActualizada)
}

const eliminarTarea = async (request, response) => {
    const { id } = request.params;
    const tarea = await Tarea.findById(id).populate('proyecto');
    if (!tarea) {
        const error = new Error('Tarea no encontrada');
        return response.status(404).json({ msg: error.message })
    }
    if (tarea.proyecto.creador.toString() !== request.usuario._id.toString()) {
        const error = new Error('No tienes los permisos');
        return response.status(403).json({ msg: error.message })
    }
    try {
        const tareaEliminada = await Tarea.findByIdAndDelete(id);
        return response.status(200).json({msg: 'Tarea Eliminada'})        
    } catch (error) {
        console.log(error);
    }
    
}
const cambiarEstado = async (request, response) => {

}

export { obtenerTarea, agregarTarea, editarTarea, eliminarTarea, cambiarEstado }