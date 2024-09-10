// interfaces/Transaccion.ts
export interface Transaccion {
    id: number;
    descripcion: string;
    monto: number;
    tipo: 'Ingreso' | 'Egreso';
    fecha: string;
    categoria: string;
}