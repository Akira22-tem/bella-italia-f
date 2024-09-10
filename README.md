# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## NECESARIO

Para instalar los paquetes necesarios para tu proyecto de React, incluyendo `primereact`, `primeicons`, `primeflex`, y `date-fns`, puedes usar los siguientes comandos:

1. **React y ReactDOM**:
    ```bash
    npm install react react-dom
    ```

2. **PrimeReact** (para los componentes de PrimeReact):
    ```bash
    npm install primereact
    ```

3. **PrimeIcons** (para los iconos de PrimeReact):
    ```bash
    npm install primeicons
    ```

4. **PrimeFlex** (para las utilidades de diseño responsivo y flexbox de PrimeReact):
    ```bash
    npm install primeflex
    ```

5. **date-fns** (para el formato de fechas):
    ```bash
    npm install date-fns
    ```

Después de instalar estos paquetes, asegúrate de importarlos en tu proyecto y configurarlos según sea necesario. Por ejemplo:

- **En tu componente React**:

    ```typescript
    import { format } from 'date-fns';
    ```

- **En el archivo CSS de tu proyecto** (para estilos de PrimeReact y PrimeIcons):

    ```css
    /* PrimeIcons CSS */
    @import url('https://cdnjs.cloudflare.com/ajax/libs/primeicons/6.0.0-beta3/primeicons.min.css');
    
    /* PrimeReact CSS (si se necesita) */
    @import url('https://unpkg.com/primereact/resources/themes/saga-blue/theme.css');
    @import url('https://unpkg.com/primereact/resources/primereact.min.css');
    @import url('https://unpkg.com/primeicons/primeicons.css');
    @import url('https://unpkg.com/primeflex/primeflex.min.css');
    ```

- **Uso de `fechaTemplate`** en tu componente:

    ```typescript
    const fechaTemplate = (rowData: Rol, column: keyof Rol) => {
        const date = new Date(rowData[column]);
        return isNaN(date.getTime()) ? 'Fecha inválida' : format(date, 'dd/MM/yyyy');
    };
    ```

Asegúrate de ajustar los enlaces a los archivos CSS según la versión específica de PrimeReact que estés utilizando, o considera importar estos archivos en tu archivo CSS global o en el archivo CSS del componente según tu configuración de proyecto.