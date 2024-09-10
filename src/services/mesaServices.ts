// services/mesaServices.ts
import { Mesa } from "../interfaces/Mesa";

const urlBase = "http://localhost:8000/mesas/";

export const getMesas = async (): Promise<Mesa[]> => {
    try {
        const response = await fetch(urlBase);
        if (!response.ok) {
            throw new Error("Error al traer datos de mesas");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching mesas:", error);
        throw error;
    }
};

export const createMesa = async (mesa: Mesa) => {
    try {
        const response = await fetch(urlBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mesa),
        });
        if (!response.ok) {
            throw new Error('Error creando mesa');
        }
        return response.json();
    } catch (error) {
        console.error('Error creating mesa:', error);
        throw error;
    }
};

export const updateMesa = async (mesa: Mesa) => {
    try {
        const response = await fetch(urlBase, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mesa),
        });
        if (!response.ok) {
            const errorText = await response.text(); // Obtén el texto de error
            throw new Error(`Error actualizando mesa: ${errorText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error updating mesa:', error);
        throw error;
    }
};

export const deleteMesa = async (id: number) => {
    try {
        const response = await fetch(`${urlBase}${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorText = await response.text(); // Obtén el texto de error
            throw new Error(`Error eliminando mesa: ${errorText}`);
        }
        return response.text(); // Cambiado para obtener un texto de respuesta
    } catch (error) {
        console.error('Error deleting mesa:', error);
        throw error;
    }
};
