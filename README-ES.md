# Odiómetro

El Odiómetro medía los insultos y mensajes hostiles publicados en español en Twitter. La web original reunía un flujo de tuits, una gráfica de mensajes por minuto y resúmenes de las cuentas que recibían y publicaban más ataques.

Este repositorio funciona ahora como un archivo interactivo. Todos los tuits, usuarios, imágenes y cifras que aparecen en el frontend principal son ficticios. La página no se conecta a X ni muestra datos en tiempo real.

## Abrir el archivo

No hace falta instalar nada ni configurar una base de datos, claves de API o un servidor de Node. Abre [`public/index.html`](public/index.html) en un navegador.

También puedes servir los archivos por HTTP:

```sh
python3 -m http.server --directory public 8000
```

Después abre <http://localhost:8000/>.

Para publicarlo, sube el contenido de `public/` a la raíz del sitio. `index.html` es la página de entrada y todos los recursos usan rutas que también funcionan cuando la web vive en un subdirectorio. Apache puede leer el archivo `.htaccess` incluido para enviar UTF-8 y usar `index.html` como índice; otros alojamientos estáticos pueden ignorarlo porque el propio HTML ya declara UTF-8.

La demostración recorre una colección fija de tuits y cifras en español. El panel principal, las gráficas, los resúmenes de usuarios, los rangos históricos y las manchas de sangre se comportan como en la web original. Si el navegador tiene activada la reducción de movimiento, la repetición permanece estática.

## Código del frontend

Los datos ficticios y el adaptador compatible con los eventos de Socket.IO están en [`public/js/mocks/odiometro.js`](public/js/mocks/odiometro.js). Los componentes de Vue siguen en `public/js/src/app/components`.

El repositorio incluye el archivo generado `public/js/app.min.js`, así que no hay que compilar nada para visitar la página. Después de modificar un componente, vuelve a generarlo con la tarea antigua de Grunt:

```sh
cd public
npm install
grunt concat
```

## Backend histórico

El código original de Node, Express, Socket.IO, MySQL y Twitter sigue en el repositorio como referencia histórica. El archivo interactivo no lo inicia ni lo consulta. Ese backend ya no tiene soporte y todavía espera la base de datos y las credenciales antiguas de Twitter si alguien intenta ejecutarlo.

Las pruebas existentes del backend se pueden ejecutar desde la raíz del repositorio:

```sh
npm install
npm test
```

## Enlaces del proyecto

- [@odiometrobot en X](https://x.com/odiometrobot)
- [Repositorio original en GitHub](https://github.com/ojoven/odiometro)
- [Genbeta: Odiómetro, una herramienta que te muestra el odio que hay en Twitter en tiempo real](https://www.genbeta.com/redes-sociales-y-comunidades/odiometro-herramienta-que-te-muestra-odio-que-hay-twitter-tiempo-real)
- [Microsiervos: El Odiómetro muestra en tiempo real cómo se odia la gente en Twitter](https://www.microsiervos.com/archivo/internet/odiometro-odio-tiempo-real.html)
- [Mikel Torres en Twitter](https://twitter.com/ojoven)

## Licencia

MIT
