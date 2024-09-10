// interfaces/Producto.ts
export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    inventario: any[]; // Puedes definir la estructura del inventario más específicamente si tienes detalles
}
