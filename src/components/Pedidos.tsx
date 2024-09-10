import React, { useEffect, useState } from 'react';
import { Pedido } from '../interfaces/Pedido';
import {
    getPedidos,
    createPedido,
    updatePedido,
    deletePedido
} from '../services/pedidoServices';
import './pedidoStilos.css';
import { format } from 'date-fns';

// Función para formatear la fecha
const fechaTemplate = (fecha: string) => {
    const date = new Date(fecha);
    return isNaN(date.getTime()) ? 'Fecha inválida' : format(date, 'dd/MM/yyyy');
};

export const Pedidos: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [newPedido, setNewPedido] = useState<Partial<Pedido>>({
        fechaPedido: '',
        estado: '',
        total: 0,
        usuario: { id: 0 } as any,
        mesa: { id: 0 } as any
    });

    // Cargar pedidos al montar el componente
    useEffect(() => {
        fetchPedidos();
    }, []);

    // Función para cargar los pedidos
    const fetchPedidos = async () => {
        try {
            const pedidos = await getPedidos();
            setPedidos(pedidos);
        } catch (error) {
            console.error('Error fetching pedidos:', error);
        }
    };

    // Función para manejar la creación de un nuevo pedido
    const handleCreatePedido = async () => {
        if (newPedido.fechaPedido && newPedido.estado && newPedido.total !== undefined) {
            try {
                const pedidoCreado = await createPedido(newPedido as Pedido);
                if (pedidoCreado) {
                    setPedidos([...pedidos, pedidoCreado]);
                    setNewPedido({ fechaPedido: '', estado: '', total: 0, usuario: { id: 0 } as any, mesa: { id: 0 } as any });
                }
            } catch (error) {
                console.error('Error creando el pedido:', error);
            }
        }
    };

    // Función para manejar la eliminación de un pedido
    const handleDeletePedido = async (id: number) => {
        try {
            await deletePedido(id);
            setPedidos(pedidos.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error eliminando el pedido:', error);
        }
    };

    // Función para manejar la actualización de un pedido
    const handleUpdatePedido = async (pedido: Pedido) => {
        try {
            const updatedPedido = await updatePedido(pedido);
            if (updatedPedido) {
                setPedidos(pedidos.map(p => (p.id === updatedPedido.id ? updatedPedido : p)));
            }
        } catch (error) {
            console.error('Error actualizando el pedido:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Gestión de Pedidos</h1>
            
            {/* Formulario para crear un nuevo pedido */}
            <div className="form-container">
                <input
                    type="text"
                    placeholder="Fecha Pedido"
                    value={newPedido.fechaPedido || ''}
                    onChange={e => setNewPedido({ ...newPedido, fechaPedido: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Estado"
                    value={newPedido.estado || ''}
                    onChange={e => setNewPedido({ ...newPedido, estado: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Total"
                    value={newPedido.total || ''}
                    onChange={e => setNewPedido({ ...newPedido, total: parseFloat(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="ID Usuario"
                    value={newPedido.usuario?.id || ''}
                    onChange={e => setNewPedido({ ...newPedido, usuario: { id: parseInt(e.target.value) } as any })}
                />
                <input
                    type="number"
                    placeholder="ID Mesa"
                    value={newPedido.mesa?.id || ''}
                    onChange={e => setNewPedido({ ...newPedido, mesa: { id: parseInt(e.target.value) } as any })}
                />
                <button className="button-add" onClick={handleCreatePedido}>Crear Pedido</button>
            </div>

            {/* Lista de pedidos */}
            <div className="table-container">
                <table className="pedido-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{fechaTemplate(pedido.fechaPedido)}</td>
                                <td>{pedido.estado}</td>
                                <td>{pedido.total}</td>
                                <td>
                                    <button className="button-delete" onClick={() => handleDeletePedido(pedido.id)}>Eliminar</button>
                                    <button className="button-update" onClick={() => handleUpdatePedido(pedido)}>Actualizar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
