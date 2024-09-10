// src/interfaces/Pedido.ts
import { Usuario } from './Usuario';
import { Mesa } from './Mesa';

export interface Pedido {
    id: number;
    fechaPedido: string; // Formato de fecha en ISO
    estado: string; // Ejemplo: "Activo", "Inactivo", "Cancelado"
    total: number;
    usuario: Usuario; // Referencia a la interfaz Usuario
    mesa: Mesa; // Referencia a la interfaz Mesa
}
