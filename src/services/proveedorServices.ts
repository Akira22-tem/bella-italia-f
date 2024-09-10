// services/proveedorServices.ts
import { Proveedor } from "../interfaces/Proveedor";

const urlBase = "http://localhost:8000/proveedores/";

export const getProveedores = async (): Promise<Proveedor[]> => {
    try {
        const response = await fetch(urlBase);
        if (!response.ok) {
            throw new Error("Error al traer datos de proveedores");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching proveedores:", error);
        throw error;
    }
};

export const getProveedorById = async (id: number): Promise<Proveedor> => {
    try {
        const response = await fetch(`${urlBase}${id}`);
        if (!response.ok) {
            throw new Error("Error al traer proveedor");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching proveedor by id:", error);
        throw error;
    }
};

export const searchProveedores = async (texto: string): Promise<Proveedor[]> => {
    try {
        const response = await fetch(`${urlBase}search?texto=${encodeURIComponent(texto)}`);
        if (!response.ok) {
            throw new Error("Error al buscar proveedores");
        }
        return response.json();
    } catch (error) {
        console.error("Error searching proveedores:", error);
        throw error;
    }
};

export const createProveedor = async (proveedor: Proveedor) => {
    try {
        const response = await fetch(urlBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proveedor),
        });
        if (!response.ok) {
            throw new Error('Error creando proveedor');
        }
        return response.json();
    } catch (error) {
        console.error('Error creating proveedor:', error);
        throw error;
    }
};

export const updateProveedor = async (proveedor: Proveedor) => {
    try {
        const response = await fetch(urlBase, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proveedor),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error actualizando proveedor: ${errorText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error updating proveedor:', error);
        throw error;
    }
};

export const deleteProveedor = async (id: number) => {
    try {
        const response = await fetch(`${urlBase}${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error eliminando proveedor: ${errorText}`);
        }
        return response.text();
    } catch (error) {
        console.error('Error deleting proveedor:', error);
        throw error;
    }
};
