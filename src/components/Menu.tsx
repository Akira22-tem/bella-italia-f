import { useNavigate } from "react-router-dom";
import { Menubar } from 'primereact/menubar';


export const Menu: React.FC= ()=> { 
    const navigate = useNavigate();

    const items = [
        {
            label: 'Usuarios',
            icon: 'pi pi-users',
            command: () => navigate('/usuarios')
        },
        {
            label: 'Roles',
            icon: 'pi pi-book',
            command: () => navigate('/roles')
        },
        {
            label: 'Mesas',
            icon: 'pi pi-th-large',
            command: () => navigate('/mesas')
        },
        {
            label: 'Proveedores',
            icon: 'pi pi-truck',
            command: () => navigate('/proveedores')
        },
        {
            label: 'Transacciones',
            icon: 'pi pi-credit-card',
            command: () => navigate('/transacciones')
        },
        {
            label: 'Produtos',
            icon: 'pi pi-shopping-cart',
            command: () => navigate('/productos')
        },

    ];
    return (
        <div className="card">
            <Menubar model={items} />
        </div>
    );
}
