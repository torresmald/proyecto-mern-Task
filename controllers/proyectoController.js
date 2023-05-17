import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerProyectos = async (request, response, next) => {
    const proyectos = await Proyecto.find().where('creador').equals(request.usuario)
    response.status(200).json(proyectos);
}
const obtenerProyecto = async (request, response, next) => {
    const { id } = request.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
        return response.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    if (proyecto.creador.toString() !== request.usuario._id.toString()) {
        return response.status(404).json({ msg: 'No tienes permisos' });
    }
    const tareas = await Tarea.find().where('proyecto').equals(id);
    response.status(200).json({proyecto, tareas});
}

const nuevoProyecto = async (request, response, next) => {
    const proyecto = new Proyecto(request.body);
    proyecto.creador = request.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        response.status(200).json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const editarProyecto = async (request, response, next) => {
    const { id } = request.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
        return response.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    if (proyecto.creador.toString() !== request.usuario._id.toString()) {
        return response.status(404).json({ msg: 'No tienes permisos' });
    }

    const proyectoModificado = new Proyecto({ ...request.body });
    proyectoModificado._id = id;
    const proyectoUpdated = await Proyecto.findByIdAndUpdate(
        id,
        proyectoModificado,
        { new: true }
    );
    return response.status(200).json(proyectoUpdated)
}

const eliminarProyecto = async (request, response, next) => {
    const { id } = request.params;
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
        return response.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    if (proyecto.creador.toString() !== request.usuario._id.toString()) {
        return response.status(404).json({ msg: 'No tienes permisos' });
    }

    try {
        const deletedProyecto = await Proyecto.findByIdAndDelete(id);
        return response.status(200).json({ msg: 'Eliminado con Éxito' })
    } catch (error) {
        console.log(error);
    }
}

const agregarColaborador = async (request, response, next) => {
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

const eliminarColaborador = async (request, response, next) => {
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


export {
    obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, eliminarColaborador, agregarColaborador
}