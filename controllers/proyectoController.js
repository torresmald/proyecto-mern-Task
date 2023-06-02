import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (request, response, next) => {
    const proyectos = await Proyecto.find({
        $or : [
            {colaboradores : {$in : request.usuario}},
            {creador : {$in : request.usuario}}

        ]
    })
    response.status(200).json(proyectos);
}
const obtenerProyecto = async (request, response, next) => {
    const { id } = request.params;
    const proyecto = await Proyecto.findById(id).populate({path: 'tareas', populate: {path: 'completado', select: 'nombre'}}).populate('colaboradores', 'nombre email');
    if (!proyecto) {
        return response.status(404).json({ msg: 'Proyecto no encontrado' });
    }
    if (proyecto.creador.toString() !== request.usuario._id.toString() && !proyecto.colaboradores.some((colaborador) => colaborador._id.toString() === request.usuario._id.toString())) {
        return response.status(404).json({ msg: 'No tienes permisos' });
    }
    const tareas = await Tarea.find().where('proyecto').equals(id);
    response.status(200).json({ proyecto, tareas });
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

const buscarColaborador = async (request, response, next) => {
    const { email } = request.body;

    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -updatedAt -token -password -__v');

    if (!usuario) {
        const error = new Error('No existe el usuario')
        return response.status(404).json({ msg: error.message })
    }

    response.status(200).json(usuario)
}
const agregarColaborador = async (request, response, next) => {
    const proyecto = await Proyecto.findById(request.params.id);
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado')
        return response.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== request.usuario._id.toString()) {
        const error = new Error('Accion No Válida')
        return response.status(404).json({ msg: error.message })
    }
    const { email } = request.body;

    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -updatedAt -token -password -__v');

    if (!usuario) {
        const error = new Error('No existe el usuario')
        return response.status(404).json({ msg: error.message })
    }

    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error('El Creador del Proyecto no puede ser Colaborador')
        return response.status(404).json({ msg: error.message })
    }

    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El Usuario ya pertenece al Proyecto')
        return response.status(404).json({ msg: error.message })
    }

    proyecto.colaboradores.push(usuario._id);
    await proyecto.save()
    response.status(200).json({msg: 'Agregado Correctamente'})

}

const eliminarColaborador = async (request, response, next) => {
    const proyecto = await Proyecto.findById(request.params.id);
    if (!proyecto) {
        const error = new Error('Proyecto no encontrado')
        return response.status(404).json({ msg: error.message })
    }
    if (proyecto.creador.toString() !== request.usuario._id.toString()) {
        const error = new Error('Accion No Válida')
        return response.status(404).json({ msg: error.message })
    }
   
    proyecto.colaboradores.pull(request.body.id);
    await proyecto.save()
    response.status(200).json({msg: 'Eliminado Correctamente'})

    
}


export {
    obtenerProyectos, obtenerProyecto, nuevoProyecto, editarProyecto, eliminarProyecto, buscarColaborador, eliminarColaborador, agregarColaborador
}