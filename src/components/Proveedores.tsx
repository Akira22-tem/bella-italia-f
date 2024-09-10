import React, { useEffect, useState, useRef } from 'react';
import { Proveedor } from '../interfaces/Proveedor';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../services/proveedorServices';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { format } from 'date-fns';
import './proveedorStilos.css';

const estadoTemplate = (rowData: Proveedor) => (
    <span className={`estado ${rowData.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
        {rowData.estado}
    </span>
);

const fechaTemplate = (rowData: Proveedor, column: keyof Proveedor) => {
    const date = new Date(rowData[column]);
    return isNaN(date.getTime()) ? 'Fecha inválida' : format(date, 'dd/MM/yyyy');
};

const actionBodyTemplate = (rowData: Proveedor, openEdit: (proveedor: Proveedor) => void, handleDelete: (id: number) => void) => (
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

export const Proveedores: React.FC = () => {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [proveedor, setProveedor] = useState<Proveedor | null>(null);
    const [proveedorDialog, setProveedorDialog] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const estados = [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' }
    ];

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const data = await getProveedores();
                setProveedores(data);
            } catch (error) {
                console.error('Error fetching proveedores', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error fetching proveedores', life: 3000 });
            }
        };
        fetchProveedores();
    }, []);

    const openNew = () => {
        setProveedor({ id: 0, nombre: '', telefono: '', producto: '', estado: '', precioCompra: 0, fechaIngreso: '', direccion: '' });
        setIsEditing(false);
        setProveedorDialog(true);
    };

    const openEdit = (proveedor: Proveedor) => {
        setProveedor(proveedor);
        setIsEditing(true);
        setProveedorDialog(true);
    };

    const handleSave = async () => {
        if (proveedor) {
            try {
                if (isEditing) {
                    await updateProveedor(proveedor);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Actualizado con Éxito', life: 3000 });
                } else {
                    await createProveedor(proveedor);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Proveedor creado correctamente', life: 3000 });
                }
                const data = await getProveedores();
                setProveedores(data);
                setProveedorDialog(false);
            } catch (error) {
                console.error(isEditing ? 'Error updating proveedor:' : 'Error creating proveedor:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: isEditing ? 'Error updating proveedor' : 'Error creating proveedor', life: 3000 });
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteProveedor(id);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado correctamente', life: 3000 });
            const data = await getProveedores();
            setProveedores(data);
        } catch (error) {
            console.error('Error deleting proveedor:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error deleting proveedor', life: 3000 });
        }
    };

    const footer = (
        <div>
            <Button label="Guardar cambios" icon="pi pi-save" onClick={handleSave} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setProveedorDialog(false)} />
        </div>
    );

    return (
        <div className="proveedores-container">
            <Toast ref={toast} />
            <div className="table-header">
                <h3>Proveedores</h3>
                <Button label="Añadir Proveedor" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            </div>
            <DataTable value={proveedores} paginator rows={5}>
                <Column field="id" header="ID" />
                <Column field="nombre" header="Nombre" />
                <Column field="telefono" header="Teléfono" />
                <Column field="producto" header="Producto" />
                <Column field="estado" header="Estado" body={estadoTemplate} />
                <Column field="precioCompra" header="Precio Compra" />
                <Column field="fechaIngreso" header="Fecha Ingreso" body={(rowData) => fechaTemplate(rowData, 'fechaIngreso')} />
                <Column field="direccion" header="Dirección" />
                <Column body={(rowData) => actionBodyTemplate(rowData, openEdit, handleDelete)} />
            </DataTable>

            <Dialog visible={proveedorDialog} header={isEditing ? "Editar Proveedor" : "Nuevo Proveedor"} modal footer={footer} onHide={() => setProveedorDialog(false)}>
                <div className="p-field">
                    <label htmlFor="nombre">Nombre:</label>
                    <InputText
                        id="nombre"
                        value={proveedor?.nombre || ''}
                        onChange={(e) => setProveedor({ ...proveedor!, nombre: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="telefono">Teléfono:</label>
                    <InputText
                        id="telefono"
                        value={proveedor?.telefono || ''}
                        onChange={(e) => setProveedor({ ...proveedor!, telefono: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="producto">Producto:</label>
                    <InputText
                        id="producto"
                        value={proveedor?.producto || ''}
                        onChange={(e) => setProveedor({ ...proveedor!, producto: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="estado">Estado:</label>
                    <Dropdown
                        id="estado"
                        value={proveedor?.estado}
                        options={estados}
                        onChange={(e) => setProveedor({ ...proveedor!, estado: e.value })}
                        placeholder="Seleccionar estado"
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="precioCompra">Precio Compra:</label>
                    <InputText
                        id="precioCompra"
                        type="number"
                        value={proveedor?.precioCompra.toString() || ''}
                        onChange={(e) => setProveedor({ ...proveedor!, precioCompra: parseFloat(e.target.value) })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="fechaIngreso">Fecha Ingreso:</label>
                    <InputText
                        id="fechaIngreso"
                        type="date"
                        value={proveedor?.fechaIngreso || ''}
                        onChange={(e) => setProveedor({ ...proveedor!, fechaIngreso: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="direccion">Dirección:</label>
                    <InputText
                        id="direccion"
                        value={proveedor?.direccion || ''}
                        onChange={(e) => setProveedor({ ...proveedor!, direccion: e.target.value })}
                    />
                </div>
            </Dialog>
        </div>
    );
};
