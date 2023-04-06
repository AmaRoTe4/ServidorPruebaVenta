import { proximoId, validacionCrear, validacionDeTocken, validacionId} from './funciones.js'
import fs from 'fs';

const path = 'data/pedidos.json'

const individualPedido = async (id) => {
    try{
        const data = await fs.readFileSync(path);
        const dataJson = JSON.parse(data);
        return dataJson.find(n => n.id === id);
    }catch(error){
        console.log(error.message)
        return undefined;
    }
}

//validado
export const todosLosPedidos = async (req , res) => {
    try{
        const data = await fs.readFileSync(path);
        res.json(JSON.parse(data));
    }catch(error){
        console.log(error.message)
    }
}

//validado
export const crearPedido = async (req , res) => {
    //pedido
    try{
        const aux = await fs.readFileSync(path)
        let pedidosActuales = JSON.parse(aux)
        
        const today = new Date().getTime()
        
        let newPedido = {
            id: await proximoId(path),
	        cliente: req.body.cliente,
	        correo: req.body.correo,
	        dni: req.body.dni,
	        createdAt: today,
	        telefono: req.body.telefono,
	        productos: req.body.productos,
	        retirado: false,
	        senia: false,
	        pagado: false,
        }

        if(!validacionCrear(newPedido) || !validacionDeTocken(req.body.tocken)){
            res.status(403)
            res.json("Error de Validacion al crear, datos invalidos")
            return
        }
        
        pedidosActuales.push(newPedido)
        const newFichero = JSON.stringify(pedidosActuales);
        await fs.writeFileSync(path , newFichero);

        res.json(true);
    }catch(error){
        console.error(error)
        res.json(false);
    }
}

export const editarPedido = async (req , res) => {
    //id
    //pedido
    try{
        const body = await individualPedido(Number(req.body.id))
	    
        if(body === undefined) {
            res.status(403)
            res.json("Error de Validacion con el cuerpo al editar, datos invalidos")
            return
        }
        
        body.retirado = req.body.retirado
        body.senia = req.body.senia
	    body.pagado = req.body.pagado

        const aux = await fs.readFileSync(path)
        const jsonAux = JSON.parse(aux)

        if(!validacionDeTocken(req.body.tocken) || !validacionId(Number(req.params.id) , jsonAux)) {
            res.status(403)
            res.json("Error de Validacion al editar, datos invalidos")
            return
        }

        if(body.pagado && body.retirado && body.senia){
            const resultado = borrarPedido(Number(req.params.id))
            if(!resultado) {
                res.status(403)
                res.json("Error de Validacion al borrar, datos invalidos")
                return
            }
            res.json(true);
            return
        }
    
        let pedidosActualesFiltrada = jsonAux.filter(n => n.id !== Number(req.params.id))
        
        if(pedidosActualesFiltrada === undefined) return

        pedidosActualesFiltrada.push(body)
    
        const newFichero = JSON.stringify(pedidosActualesFiltrada);
        await fs.writeFileSync(path , newFichero);
        res.json(true);
    }catch(error){
        console.error(error)
        res.json(false);
    }
}

const borrarPedido = async (id) => {
    //id
    try{
        const aux = await fs.readFileSync(path)
        const jsonAux = JSON.parse(aux);

        if(!validacionId(id , jsonAux)) {
            return false
        }

        const dataAux = jsonAux.filter(n => n.id !== id)
        const newFichero = JSON.stringify(dataAux)
        await fs.writeFileSync(path , newFichero);
        return true;
    }catch(error){
        console.error(error)
        return false;
    }
}