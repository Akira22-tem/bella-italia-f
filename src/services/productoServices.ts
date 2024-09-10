// services/productoServices.ts
import { Producto } from "../interfaces/Producto";

const urlBase = 'http://localhost:8000/productos';

// Obtener todos los productos
export const getProductos = async (): Promise<Producto[]> => {
    const response = await fetch(`${urlBase}/`);
    if (!response.ok) {
        throw new Error('Error al obtener productos');
    }
    return response.json();
};

// Obtener un producto por ID
export const getProductoById = async (id: number): Promise<Producto> => {
    const response = await fetch(`${urlBase}/${id}`);
    if (!response.ok) {
        throw new Error(`Error al obtener el producto con ID ${id}`);
    }
    return response.json();
};

// Crear un nuevo producto
export const createProducto = async (producto: Producto): Promise<void> => {
    const response = await fetch(`${urlBase}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
    });
    if (!response.ok) {
        throw new Error('Error al crear el producto');
    }
};

// Actualizar un producto existente
export const updateProducto = async (producto: Partial<Producto>): Promise<void> => {
    if (!producto.id) {
        throw new Error('El producto debe tener un ID para actualizarlo');
    }

    try {
        const response = await fetch(`${urlBase}/${producto.id}`, {
            method: 'PATCH', // Usar PATCH para actualizaciones parciales
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error al actualizar el producto: ${response.statusText}. Detalles: ${errorData}`);
        }
    } catch (error) {
        console.error('Error en updateProducto:', error);
        throw error;
    }
};
// Eliminar un producto por ID
export const deleteProducto = async (id: number): Promise<void> => {
    const response = await fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Error al eliminar el producto con ID ${id}`);
    }
};
