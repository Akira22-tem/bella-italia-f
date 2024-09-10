import { Pedido } from '../interfaces/Pedido';

const BASE_URL = 'http://localhost:8000/pedido/'; // URL base para la API de pedidos

// Función para obtener todos los pedidos
export const getPedidos = async (): Promise<Pedido[]> => {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
    }
    return await response.json();
};

// Función para crear un nuevo pedido
export const createPedido = async (nuevoPedido: Pedido): Promise<Pedido> => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPedido),
    });
    if (!response.ok) {
        throw new Error('Error al crear el pedido');
    }
    return await response.json();
};

// Función para actualizar un pedido existente
export const updatePedido = async (pedidoActualizado: Pedido): Promise<Pedido> => {
    const response = await fetch(`${BASE_URL}${pedidoActualizado.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoActualizado),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el pedido');
    }
    return await response.json();
};

// Función para eliminar un pedido
export const deletePedido = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el pedido');
    }
};
