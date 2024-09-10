import { Rol } from "../interfaces/Rol";
const urlBase = 'http://localhost:8000/roles';


export const getRoles = async (): Promise<Rol[]> => {
    const response = await fetch(`${urlBase}/`);
    if (!response.ok) {
        throw new Error('Error al obtener roles');
    }
    return response.json();
};

// Función para obtener un rol por ID
export const getRolById = async (id: number): Promise<Rol> => {
    const response = await fetch(`${urlBase}/${id}`);
    if (!response.ok) {
        throw new Error(`Error al obtener el rol con ID ${id}`);
    }
    return response.json();
};

// Función para crear un nuevo rol
// rolServices.ts
// Función para crear un nuevo rol
export const createRoles = async (rol: Rol): Promise<void> => {
    try {
        const response = await fetch(`${urlBase}/`, { // Corregido para usar urlBase
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rol),
        });
        if (!response.ok) {
            throw new Error('Error al crear el rol');
        }
    } catch (error) {
        console.error('Error en la creación del rol:', error);
        throw error;
    }
};



// Función para actualizar un rol existente
export const updateRoles = async (rol: Rol): Promise<void> => {
    const response = await fetch(`${urlBase}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rol)
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el rol');
    }
};

// Función para eliminar un rol por ID
export const deleteRole = async (id: number): Promise<void> => {
    const response = await fetch(`${urlBase}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Error al eliminar el rol con ID ${id}`);
    }
};
