// services/transaccionServices.ts
import { Transaccion } from "../interfaces/Transaccion";

const urlBase = "http://localhost:8000/transacciones/";

export const getTransacciones = async (): Promise<Transaccion[]> => {
    try {
        const response = await fetch(urlBase);
        if (!response.ok) {
            throw new Error("Error al traer datos de transacciones");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching transacciones:", error);
        throw error;
    }
};

export const createTransaccion = async (transaccion: Transaccion) => {
    try {
        const response = await fetch(urlBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaccion),
        });
        if (!response.ok) {
            throw new Error('Error creando transacción');
        }
        return response.json();
    } catch (error) {
        console.error('Error creating transaccion:', error);
        throw error;
    }
};

export const updateTransaccion = async (transaccion: Transaccion) => {
    try {
        const response = await fetch(`${urlBase}${transaccion.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaccion),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error actualizando transacción: ${errorText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error updating transaccion:', error);
        throw error;
    }
};

export const deleteTransaccion = async (id: number) => {
    try {
        const response = await fetch(`${urlBase}${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error eliminando transacción: ${errorText}`);
        }
        return response.text(); // O `response.json()` si el servidor devuelve JSON
    } catch (error) {
        console.error('Error deleting transaccion:', error);
        throw error;
    }
};
