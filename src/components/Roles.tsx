import React, { useEffect, useState, useRef } from "react";
import { Rol } from "../interfaces/Rol";
import { getRoles, createRoles, updateRoles, deleteRole } from "../services/rolServices";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { format } from 'date-fns';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import './rolStilos.css';

const estadoOptions = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' }
];

const estadoTemplate = (rowData: Rol) => {
    return <Tag value={rowData.estado} severity={rowData.estado === 'Activo' ? 'success' : 'danger'} />;
}

const fechaTemplate = (rowData: Rol, column: keyof Rol) => {
    const date = new Date(rowData[column]);
    return isNaN(date.getTime()) ? 'Fecha inválida' : format(date, 'dd/MM/yyyy');
}

export const Roles: React.FC = () => {
    
    const [roles, setRoles] = useState<Rol[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toast = useRef<Toast>(null);
    const [rol, setRol] = useState<Rol | null>(null);
    const [rolDialog, setRolDialog] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await getRoles();
                setRoles(data);
            } catch (error) {
                console.log('Error fetching Roles', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error fetching roles', life: 3000 });
            } finally {
                setLoading(false);
            }
        }
        fetchRoles();
    }, []);

    const openNew = () => {
        setRol({ id: 0, rol: '', descripcion: '', estado: '', fechaCreacion: '', fechaActualizacion: '', usuarios: '' });
        setRolDialog(true);
    }

    const openEdit = (rol: Rol) => {
        setRol(rol);
        setRolDialog(true);
    }

    const confirmDelete = (rol: Rol) => {
        setSelectedRol(rol);
        setDeleteDialog(true);
    }

    const handleSave = async () => {
        if (rol) {
            try {
                if (rol.id === 0) { // Nuevo rol
                    await createRoles({
                        ...rol,
                        fechaCreacion: new Date().toISOString(),
                        fechaActualizacion: new Date().toISOString()
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Rol creado exitosamente', life: 3000 });
                } else { // Actualizar rol existente
                    await updateRoles({
                        ...rol,
                        fechaActualizacion: new Date().toISOString()
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Rol actualizado exitosamente', life: 3000 });
                }
                const data = await getRoles();
                setRoles(data);
                setRolDialog(false);
            } catch (error) {
                console.error('Error saving role:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el rol', life: 3000 });
            }
        }
    };
    
    

    const handleDelete = async () => {
        if (selectedRol) {
            try {
                await deleteRole(selectedRol.id);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Rol eliminado exitosamente', life: 3000 });
                const data = await getRoles();
                setRoles(data);
                setDeleteDialog(false);
            } catch (error) {
                console.error('Error deleting role:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el rol', life: 3000 });
            }
        }
    }

    const actionBodyTemplate = (rowData: Rol) => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => openEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDelete(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="table-header">
            <h3>Gestión de Roles</h3>
            <Button label="Añadir Rol" icon="pi pi-user-plus" className="p-button-success" onClick={openNew} />
        </div>
    );

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteDialog(false)} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={handleDelete} />
        </React.Fragment>
    );

    return (
        <div className="roles-container">
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={header}></Toolbar>
            <DataTable
                value={roles}
                loading={loading}
                showGridlines
                stripedRows
                tableStyle={{ minWidth: '60rem' }}
                breakpoint="960px"
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                scrollable
                scrollHeight="flex"
            >
                <Column field="id" header="Id" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '50px' }} />
                <Column field="rol" header="Rol" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '150px' }} />
                <Column field="descripcion" header="Descripción" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '300px' }} />
                <Column field="estado" header="Estado" body={estadoTemplate} headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '120px' }} />
                <Column field="fechaCreacion" header="Fecha de Creación" body={(rowData) => fechaTemplate(rowData, 'fechaCreacion')} headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '180px' }} />
                <Column field="fechaActualizacion" header="Fecha de Actualización" body={(rowData) => fechaTemplate(rowData, 'fechaActualizacion')} headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '180px' }} />
                <Column field="usuarios" header="Usuarios" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '150px' }} />
                <Column body={actionBodyTemplate} style={{ width: '150px' }} />
            </DataTable>
            <Dialog visible={rolDialog} header={rol?.id === 0 ? "Nuevo Rol" : "Editar Rol"} modal className="p-fluid" onHide={() => setRolDialog(false)}>
                <div className="p-field">
                    <label htmlFor="txtRol">Rol:</label>
                    <InputText id="txtRol" value={rol?.rol || ''} onChange={(e) => setRol({ ...rol!, rol: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtDescripcion">Descripción:</label>
                    <InputText id="txtDescripcion" value={rol?.descripcion || ''} onChange={(e) => setRol({ ...rol!, descripcion: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="ddlEstado">Estado:</label>
                    <Dropdown
                        id="ddlEstado"
                        value={rol?.estado || ''}
                        options={estadoOptions}
                        onChange={(e) => setRol({ ...rol!, estado: e.value })}
                        placeholder="Selecciona un estado"
                    />
                </div>
                <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={handleSave} />
                <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setRolDialog(false)} />
            </Dialog>
            <Dialog visible={deleteDialog} header="Confirmar" modal footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
                <div className="p-text-center">¿Estás seguro de que deseas eliminar este rol?</div>
            </Dialog>
        </div>
    );
}
