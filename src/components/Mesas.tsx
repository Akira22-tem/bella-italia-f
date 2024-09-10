// components/Mesas.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Mesa } from '../interfaces/Mesa';
import { getMesas, createMesa, updateMesa, deleteMesa } from '../services/mesaServices';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import './mesaStilos.css';

const estadoTemplate = (rowData: Mesa) => (
    <Tag value={rowData.estado} severity={rowData.estado === 'Disponible' ? 'success' : 'danger'} />
);

const actionBodyTemplate = (rowData: Mesa, openEdit: (mesa: Mesa) => void, handleDelete: (id: number) => void) => (
    <div className="actions">
        <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-rounded p-button-outlined"
            onClick={() => openEdit(rowData)}
        />
        <Button
            icon="pi pi-trash"
            className="p-button-danger p-button-rounded p-button-outlined"
            onClick={() => handleDelete(rowData.id)}
        />
    </div>
);

export const Mesas: React.FC = () => {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [mesa, setMesa] = useState<Mesa | null>(null);
    const [mesaDialog, setMesaDialog] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const estados = [
        { label: 'Disponible', value: 'Disponible' },
        { label: 'No disponible', value: 'No disponible' }
    ];

    const ubicaciones = [
        { label: 'Terraza', value: 'Terraza' },
        { label: 'Patio', value: 'Patio' },
        { label: 'Interior', value: 'Interior' },
        { label: 'Balcón', value: 'Balcón' },
        { label: 'Salón privado', value: 'Salón privado' }
    ];

    const tipos = [
        { label: 'Al aire libre', value: 'Al aire libre' },
        { label: 'Familiar', value: 'Familiar' },
        { label: 'Ejecutivo', value: 'Ejecutivo' },
        { label: 'Para parejas', value: 'Para parejas' },
        { label: 'VIP', value: 'VIP' }
    ];

    useEffect(() => {
        const fetchMesas = async () => {
            try {
                const data = await getMesas();
                setMesas(data);
            } catch (error) {
                console.error('Error fetching mesas', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error fetching mesas', life: 3000 });
            }
        };
        fetchMesas();
    }, []);

    const openNew = () => {
        setMesa({ id: 0, numero: 0, capacidad: 0, estado: '', ubicacion: '', tipo: '' });
        setIsEditing(false);
        setMesaDialog(true);
    };

    const openEdit = (mesa: Mesa) => {
        setMesa(mesa);
        setIsEditing(true);
        setMesaDialog(true);
    };

    const handleSave = async () => {
        if (mesa) {
            try {
                if (isEditing) {
                    await updateMesa(mesa);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Actualizado con Éxito', life: 3000 });
                } else {
                    await createMesa(mesa);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Mesa creada correctamente', life: 3000 });
                }
                const data = await getMesas();
                setMesas(data);
                setMesaDialog(false);
            } catch (error) {
                console.error(isEditing ? 'Error updating mesa:' : 'Error creating mesa:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: isEditing ? 'Error updating mesa' : 'Error creating mesa', life: 3000 });
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMesa(id);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Mesa eliminada correctamente', life: 3000 });
            const data = await getMesas();
            setMesas(data);
        } catch (error) {
            console.error('Error deleting mesa:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error deleting mesa', life: 3000 });
        }
    };

    const footer = (
        <div>
            <Button label="Guardar cambios" icon="pi pi-save" onClick={handleSave} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setMesaDialog(false)} />
        </div>
    );

    return (
        <div className="mesas-container">
            <Toast ref={toast} />
            <Button label="Añadir Mesa" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            <DataTable value={mesas} paginator rows={5}>
                <Column field="id" header="ID" />
                <Column field="numero" header="Número" />
                <Column field="capacidad" header="Capacidad" />
                <Column field="estado" header="Estado" body={estadoTemplate} />
                <Column field="ubicacion" header="Ubicación" />
                <Column field="tipo" header="Tipo" />
                <Column body={(rowData) => actionBodyTemplate(rowData, openEdit, handleDelete)} />
            </DataTable>

            <Dialog visible={mesaDialog} header={isEditing ? "Editar Mesa" : "Nueva Mesa"} modal footer={footer} onHide={() => setMesaDialog(false)}>
                <div className="p-field">
                    <label htmlFor="numero">Número:</label>
                    <InputText
                        id="numero"
                        value={mesa?.numero.toString() || ''}
                        onChange={(e) => setMesa({ ...mesa!, numero: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="capacidad">Capacidad:</label>
                    <InputText
                        id="capacidad"
                        value={mesa?.capacidad.toString() || ''}
                        onChange={(e) => setMesa({ ...mesa!, capacidad: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="estado">Estado:</label>
                    <Dropdown
                        id="estado"
                        value={mesa?.estado}
                        options={estados}
                        onChange={(e) => setMesa({ ...mesa!, estado: e.value })}
                        placeholder="Seleccionar estado"
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="ubicacion">Ubicación:</label>
                    <Dropdown
                        id="ubicacion"
                        value={mesa?.ubicacion}
                        options={ubicaciones}
                        onChange={(e) => setMesa({ ...mesa!, ubicacion: e.value })}
                        placeholder="Seleccionar ubicación"
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="tipo">Tipo:</label>
                    <Dropdown
                        id="tipo"
                        value={mesa?.tipo}
                        options={tipos}
                        onChange={(e) => setMesa({ ...mesa!, tipo: e.value })}
                        placeholder="Seleccionar tipo"
                    />
                </div>
            </Dialog>
        </div>
    );
};
