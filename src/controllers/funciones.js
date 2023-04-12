import fs from 'fs';
import { Articulos, Color, Talles } from '../../dataParaValidar.js';

//@ts-ignore
export const proximoId = async (path) => {
    //@ts-ignore
    const respose = await fs.readFileSync(path)
    const data = JSON.parse(respose)
    if(data.length === 0) return 1;
    return data.map(n => n.id).sort((a, b) => b - a)[0] + 1
}

const validacionArticulos = (valor) => {
    return !Articulos.includes(valor)
}

const validacionTalles = (valor) => {
    return !Talles.includes(valor)
}

const validacionColor = (valor) => {
    return !Color.includes(valor)
}

export const validacionCrear = (pedido) => {
    let correoValidacion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    let retorno = true;

    if(
        typeof(pedido.titular) !== "boolean" ||
        !correoValidacion.test(pedido.correo) ||
        pedido.pagado ||
        pedido.retirado ||
        pedido.senia ||
        pedido.cliente === "" || 
        pedido.telefono === null ||
        pedido.dni === null
    ) return false;
    
    pedido.productos.map((n) => {
        if(!retorno) return;
        if(
            validacionArticulos(n.articulo) ||
            validacionTalles(n.talle) ||
            validacionColor(n.color) ||
            n.cantidad < 0
        ) retorno = false;
    })

    return retorno;
}

//este se pudiera validar que si tiene la misma compra que antes...
export const validacionDeTocken = (tocken) => {    
    const clave = process.env.CLAVE
    return tocken === clave;
}

export const validacionId = (id , elementos) => {
    const ids = elementos.map(n => n.id);
    return ids.includes(id); 
}