import React, { useState, useEffect, useRef } from 'react';
import { Producto } from '../interfaces/Producto';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productoServices';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import './productoStilos.css';

const actionBodyTemplate = (rowData: Producto, openEdit: (producto: Producto) => void, confirmDelete: (producto: Producto) => void) => (
    <div className="actions">
        <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-rounded p-button-outlined"
            onClick={() => openEdit(rowData)}
        />
        <Button
            icon="pi pi-trash"
            className="p-button-danger p-button-rounded p-button-outlined"
            onClick={() => confirmDelete(rowData)}
        />
    </div>
);

export const Productos: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const data = await getProductos();
            setProductos(data);
        } catch (error) {
            console.error('Error fetching productos:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener productos', life: 3000 });
        }
    };

    const handleSave = async () => {
        if (selectedProducto) {
            // Validar y corregir los valores
            const precio = isNaN(parseFloat(selectedProducto.precio.toString())) ? 0 : parseFloat(selectedProducto.precio.toString());
            const cantidad = isNaN(parseInt(selectedProducto.cantidad.toString(), 10)) ? 0 : parseInt(selectedProducto.cantidad.toString(), 10);
            
            // Crear un objeto parcial con solo los campos modificados
            const productoActualizado: Partial<Producto> = {
                id: selectedProducto.id,
                precio,
                cantidad,
                descripcion: selectedProducto.descripcion // Añadir otros campos si es necesario
            };
    
            try {
                if (isEditing) {
                    await updateProducto(productoActualizado);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado correctamente', life: 3000 });
                } else {
                    await createProducto(selectedProducto);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado correctamente', life: 3000 });
                }
                await fetchProductos(); // Asegúrate de que fetchProductos esté definido y funcione correctamente
                setShowDialog(false);
                resetForm(); // Asegúrate de que resetForm esté definido y funcione correctamente
            } catch (error) {
                console.error('Error al guardar el producto:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el producto', life: 3000 });
            }
        }
    };
    
    

    const handleDelete = async () => {
        if (selectedProducto) {
            try {
                await deleteProducto(selectedProducto.id);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado correctamente', life: 3000 });
                fetchProductos();
                setShowDeleteDialog(false);
                resetForm();
            } catch (error) {
                console.error('Error deleting producto:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
            }
        }
    };

    const openEdit = (producto: Producto) => {
        setSelectedProducto(producto);
        setIsEditing(true);
        setShowDialog(true);
    };

    const confirmDelete = (producto: Producto) => {
        setSelectedProducto(producto);
        setShowDeleteDialog(true);
    };

    const resetForm = () => {
        setSelectedProducto(null);
        setIsEditing(false);
    };

    const footer = (
        <div>
            <Button label="Guardar cambios" icon="pi pi-save" onClick={handleSave} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setShowDialog(false)} />
        </div>
    );

    return (
        <div className="productos-container">
            <Toast ref={toast} />
            <Button label="Añadir Producto" icon="pi pi-plus" className="p-button-success" onClick={() => { setSelectedProducto(null); setIsEditing(false); setShowDialog(true); }} />
            <DataTable value={productos} paginator rows={5}>
                <Column field="id" header="ID" />
                <Column field="nombre" header="Nombre" />
                <Column field="descripcion" header="Descripción" />
                <Column field="precio" header="Precio" />
                <Column field="cantidad" header="Cantidad" />
                <Column body={(rowData) => actionBodyTemplate(rowData, openEdit, confirmDelete)} header="Acciones" />
            </DataTable>

            <Dialog visible={showDialog} header={isEditing ? "Editar Producto" : "Nuevo Producto"} modal footer={footer} onHide={() => setShowDialog(false)}>
                <div className="p-field">
                    <label htmlFor="nombre">Nombre:</label>
                    <InputText
                        id="nombre"
                        value={selectedProducto?.nombre || ''}
                        onChange={(e) => setSelectedProducto({ ...selectedProducto!, nombre: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="descripcion">Descripción:</label>
                    <InputText
                        id="descripcion"
                        value={selectedProducto?.descripcion || ''}
                        onChange={(e) => setSelectedProducto({ ...selectedProducto!, descripcion: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="precio">Precio:</label>
                    <InputText
                        id="precio"
                        type="number"
                        value={selectedProducto?.precio?.toString() || ''}
                        onChange={(e) => setSelectedProducto({ ...selectedProducto!, precio: e.target.value ? parseFloat(e.target.value) : 0 })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="cantidad">Cantidad:</label>
                    <InputText
                        id="cantidad"
                        type="number"
                        value={selectedProducto?.cantidad?.toString() || ''}
                        onChange={(e) => setSelectedProducto({ ...selectedProducto!, cantidad: e.target.value ? parseInt(e.target.value, 10) : 0 })}
                    />
                </div>
            </Dialog>

            <Dialog visible={showDeleteDialog} header="Confirmar Eliminación" modal footer={
                <div>
                    <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete} />
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setShowDeleteDialog(false)} />
                </div>
            } onHide={() => setShowDeleteDialog(false)}>
                <p>¿Estás seguro de que deseas eliminar el producto "{selectedProducto?.nombre}"?</p>
            </Dialog>
        </div>
    );
};

export default Productos;
