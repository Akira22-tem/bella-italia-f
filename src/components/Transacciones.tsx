// components/Transacciones.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Transaccion } from '../interfaces/Transaccion';
import { getTransacciones, createTransaccion, updateTransaccion, deleteTransaccion } from '../services/transaccionServices';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { format } from 'date-fns';
import './transaccionStilos.css';

// Opciones para el campo tipo
const tipoOptions = [
    { label: 'Ingreso', value: 'Ingreso' },
    { label: 'Egreso', value: 'Egreso' }
];

// Función para formatear las fechas en la tabla
const fechaTemplate = (rowData: Transaccion) => {
    const date = new Date(rowData.fecha);
    return isNaN(date.getTime()) ? 'Fecha inválida' : format(date, 'dd/MM/yyyy');
};

// Función para generar las acciones de cada fila (editar/eliminar)
const actionBodyTemplate = (rowData: Transaccion, openEdit: (transaccion: Transaccion) => void, handleDelete: (id: number) => void) => (
    <div className="actions">
        <Button icon="pi pi-pencil" className="p-button-warning p-button-rounded p-button-outlined" onClick={() => openEdit(rowData)} />
        <Button icon="pi pi-trash" className="p-button-danger p-button-rounded p-button-outlined" onClick={() => handleDelete(rowData.id)} />
    </div>
);

export const Transacciones: React.FC = () => {
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
    const [transaccion, setTransaccion] = useState<Transaccion | null>(null);
    const [transaccionDialog, setTransaccionDialog] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    // Fetch de transacciones al cargar el componente
    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const data = await getTransacciones();
                setTransacciones(data);
            } catch (error) {
                console.error('Error fetching transacciones:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener transacciones', life: 3000 });
            }
        };
        fetchTransacciones();
    }, []);

    // Abre el diálogo para crear una nueva transacción
    const openNew = () => {
        setTransaccion({ id: 0, descripcion: '', monto: 0, tipo: 'Ingreso', fecha: new Date().toISOString(), categoria: '' });
        setIsEditing(false);
        setTransaccionDialog(true);
    };

    // Abre el diálogo para editar una transacción existente
    const openEdit = (transaccion: Transaccion) => {
        setTransaccion(transaccion);
        setIsEditing(true);
        setTransaccionDialog(true);
    };

    // Maneja la acción de guardar la transacción (crear/actualizar)
    const handleSave = async () => {
        if (transaccion) {
            try {
                if (isEditing) {
                    await updateTransaccion(transaccion);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Transacción actualizada correctamente', life: 3000 });
                } else {
                    await createTransaccion(transaccion);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Transacción creada correctamente', life: 3000 });
                }
                const data = await getTransacciones();
                setTransacciones(data);
                setTransaccionDialog(false);
            } catch (error) {
                console.error(isEditing ? 'Error updating transaccion:' : 'Error creating transaccion:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: isEditing ? 'Error al actualizar transacción' : 'Error al crear transacción', life: 3000 });
            }
        }
    };

    // Maneja la acción de eliminar una transacción
    const handleDelete = async (id: number) => {
        try {
            await deleteTransaccion(id);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Transacción eliminada correctamente', life: 3000 });
            const data = await getTransacciones();
            setTransacciones(data);
        } catch (error) {
            console.error('Error deleting transaccion:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar transacción', life: 3000 });
        }
    };

    // Footer del diálogo para guardar/cancelar cambios
    const footer = (
        <div>
            <Button label="Guardar cambios" icon="pi pi-save" onClick={handleSave} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setTransaccionDialog(false)} />
        </div>
    );

    // Maneja el cambio en el campo monto asegurando que solo se permiten dos decimales
    const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Asegura que el valor ingresado es un número y tiene hasta dos decimales
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setTransaccion({ ...transaccion!, monto: parseFloat(value) });
        }
    };

    return (
        <div className="transacciones-container">
            <Toast ref={toast} />
            <div className="table-header">
                <h3>Transacciones</h3>
                <Button label="Añadir Transacción" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            </div>
            <DataTable value={transacciones} paginator rows={5}>
                <Column field="id" header="ID" />
                <Column field="descripcion" header="Descripción" />
                <Column field="monto" header="Monto" />
                <Column field="tipo" header="Tipo" />
                <Column field="fecha" header="Fecha" body={fechaTemplate} />
                <Column field="categoria" header="Categoría" />
                <Column body={(rowData) => actionBodyTemplate(rowData, openEdit, handleDelete)} />
            </DataTable>

            <Dialog visible={transaccionDialog} header={isEditing ? "Editar Transacción" : "Nueva Transacción"} modal footer={footer} onHide={() => setTransaccionDialog(false)}>
                <div className="p-field">
                    <label htmlFor="descripcion">Descripción:</label>
                    <InputText
                        id="descripcion"
                        value={transaccion?.descripcion || ''}
                        onChange={(e) => setTransaccion({ ...transaccion!, descripcion: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="monto">Monto:</label>
                    <InputText
                        id="monto"
                        type="text"
                        value={transaccion?.monto.toFixed(2) || ''}
                        onChange={handleMontoChange}
                        placeholder="0.00"
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="tipo">Tipo:</label>
                    <Dropdown
                        id="tipo"
                        value={transaccion?.tipo || 'Ingreso'}
                        options={tipoOptions}
                        onChange={(e) => setTransaccion({ ...transaccion!, tipo: e.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="fecha">Fecha:</label>
                    <Calendar
                        id="fecha"
                        value={transaccion ? new Date(transaccion.fecha) : null}
                        onChange={(e) => setTransaccion({ ...transaccion!, fecha: e.value ? e.value.toISOString() : '' })}
                        dateFormat="dd/mm/yy"
                        showIcon
                    />
                </div>

                {/* Agrega más campos de edición según sea necesario */}
            </Dialog>
        </div>
    );
};

export default Transacciones;
