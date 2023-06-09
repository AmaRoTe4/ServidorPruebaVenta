import { 
    todosLosPedidos,
    crearPedido,
    editarPedido, 
} from "../controllers/funcionesJson.js"
import express from 'express'

const router = express.Router()

router.get('/Pedidos', todosLosPedidos);
router.post('/Pedidos/', crearPedido);
router.post('/Pedidos/:id', editarPedido);

export default router