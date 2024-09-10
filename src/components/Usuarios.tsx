import React, { useEffect, useState, useRef } from 'react';
import { Usuario } from '../interfaces/Usuario';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuarioServices';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './usuarioStilos.css';
import { Toolbar } from 'primereact/toolbar';

export const Usuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await getUsuarios();
                setUsuarios(data);
            } catch (error) {
                console.log('Error fetching Usuarios', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error fetching usuarios', life: 3000 });
            } finally {
                setLoading(false);
            }
        }
        fetchUsuarios();
    }, []);

    const openNew = () => {
        setUsuario({ id: 0, nombre: '', apellido: '', telefono: '', correo: '', ciudad: '', direccion: '', cedula: '', password: '' });
        setIsEditing(false);
        setUsuarioDialog(true);
    }

    const openEdit = (usuario: Usuario) => {
        setUsuario(usuario);
        setIsEditing(true);
        setUsuarioDialog(true);
    }

    const handleSave = async () => {
        if (usuario) {
            try {
                if (isEditing) {
                    // Llama a la función de actualización con el objeto usuario completo
                    await updateUsuario(usuario);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado correctamente', life: 3000 });
                } else {
                    await createUsuario(usuario);
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 });
                }
                const data = await getUsuarios();
                setUsuarios(data);
                setUsuarioDialog(false);
            } catch (error) {
                console.error('Error al guardar usuario:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar usuario', life: 3000 });
            }
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteUsuario(id);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar usuario', life: 3000 });
        }
    }

    const confirmDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            handleDelete(id);
        }
    }

    const header = (
        <div className="table-header">
            <h3>Gestión de Usuarios</h3>
            <Button label="Añadir Usuario" icon="pi pi-user-plus" className="p-button-success" onClick={openNew} />
        </div>
    );

    return (
        <div className="usuarios-container">
            <Toast ref={toast} />
            <Toolbar className="p-mb-4" left={header}></Toolbar>
            <DataTable
                value={usuarios}
                loading={loading}
                showGridlines
                stripedRows
                tableStyle={{ minWidth: '60rem' }}
                breakpoint="960px"
                paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
            >
                <Column field="id" header="Id" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '50px' }} />
                <Column field="nombre" header="Nombre" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '150px' }} />
                <Column field="apellido" header="Apellido" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '150px' }} />
                <Column field="telefono" header="Teléfono" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '150px' }} />
                <Column field="correo" header="Correo" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '200px' }} />
                <Column field="ciudad" header="Ciudad" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '120px' }} />
                <Column field="direccion" header="Dirección" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '200px' }} />
                <Column field="cedula" header="Cédula" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '120px' }} />
                <Column field="password" header="Contraseña" headerStyle={{ textAlign: 'center' }} bodyStyle={{ textAlign: 'left' }} style={{ width: '120px' }} />
                <Column body={(rowData: Usuario) => (
                    <div>
                        <Button icon='pi pi-pencil' className="p-button-rounded p-button-info" onClick={() => openEdit(rowData)} />
                        <Button icon='pi pi-trash' className="p-button-rounded p-button-danger" onClick={() => confirmDelete(rowData.id)} />
                    </div>
                )} />
            </DataTable>
            <Dialog visible={usuarioDialog} header={isEditing ? "Editar Usuario" : "Nuevo Usuario"} modal className="p-fluid" onHide={() => setUsuarioDialog(false)}>
                <div className="p-field">
                    <label htmlFor="txtNombre">Nombre:</label>
                    <InputText id="txtNombre" value={usuario?.nombre} onChange={(e) => setUsuario({ ...usuario!, nombre: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtApellido">Apellido:</label>
                    <InputText id="txtApellido" value={usuario?.apellido} onChange={(e) => setUsuario({ ...usuario!, apellido: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtTelefono">Teléfono:</label>
                    <InputText id="txtTelefono" value={usuario?.telefono} onChange={(e) => setUsuario({ ...usuario!, telefono: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtCorreo">Correo:</label>
                    <InputText id="txtCorreo" value={usuario?.correo} onChange={(e) => setUsuario({ ...usuario!, correo: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtCiudad">Ciudad:</label>
                    <InputText id="txtCiudad" value={usuario?.ciudad} onChange={(e) => setUsuario({ ...usuario!, ciudad: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtDireccion">Dirección:</label>
                    <InputText id="txtDireccion" value={usuario?.direccion} onChange={(e) => setUsuario({ ...usuario!, direccion: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtCedula">Cédula:</label>
                    <InputText id="txtCedula" value={usuario?.cedula} onChange={(e) => setUsuario({ ...usuario!, cedula: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="txtPassword">Contraseña:</label>
                    <InputText id="txtPassword" value={usuario?.password} onChange={(e) => setUsuario({ ...usuario!, password: e.target.value })} />
                </div>
                <div className="p-d-flex p-jc-end">
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setUsuarioDialog(false)} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-success" onClick={handleSave} />
                </div>
            </Dialog>
        </div>
    );
};
