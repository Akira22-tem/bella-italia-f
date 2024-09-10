// services/usuarioServices.ts
import { Usuario } from '../interfaces/Usuario';

const urlBase = "http://localhost:8000/usuario/";

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await fetch(urlBase);
        if (!response.ok) {
            throw new Error(`Error al traer datos: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching usuarios:", error);
        throw error;
    }
}

// Crear un nuevo usuario
export const createUsuario = async (usuario: Usuario) => {
    try {
        const response = await fetch(urlBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            throw new Error(`Error creating usuario: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error creating usuario:', error);
        throw error;
    }
}

// Actualizar un usuario existente
export const updateUsuario = async (usuario: Usuario) => {
    try {
        const url = urlBase; // La URL es la base del endpoint para PUT
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            throw new Error(`Error updating usuario: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error updating usuario:', error);
        throw error;
    }
}

// Eliminar un usuario
export const deleteUsuario = async (id: number) => {
    try {
        const url = `${urlBase}${id}`; // Concatenar el ID para formar la URL correcta
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            
            throw new Error(`Error deleting usuario: ${response.statusText}`);
        }
        // Para DELETE, no es necesario leer la respuesta si solo queremos eliminar el recurso
        return await response.text(); // Devuelve el mensaje de confirmación
    } catch (error) {
        console.error('Error deleting usuario:', error);
        throw error;
    }
}
