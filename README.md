ODIÓMETRO
================================

Ya disponible en http://odiometro.es

Este es un proyecto que pretende medir el nivel de odio que se genera en Twitter en tiempo real.

Midiendo una serie de keywords estableceremos unas métricas en tiempo real.

El objetivo de este proyecto es hacernos conscientes del nivel de debate que se produce en España,
y el amplio uso de insultos, descalificaciones, etc. que se producen en Twitter.

La web hace uso de las siguientes tecnologías:
* NodeJS / Express
* Socket.io
* MySQL
* VueJS
* SASS
* Grunt



Instalación
-------------

1. Clonar el repositorio

```git clone git@github.com:ojoven/odiometro.git```

2. Desde la raíz del proyecto (instalará express y socket)

```npm install```

3. También desde la carpeta /public (instalará grunt y plugins, vue)

```cd public && npm install```

4. Crea una base de datos e importa el dump en db/odiometro.sql

```mysql -u [username] -p [dbname] < db/odiometro.sql```



Notas adicionales de desarrollo
-------------------------------

* Desde public tendrás que correr ```grunt``` para que los archivos SCSS compilen en CSS, se unifiquen los JS y el HTML.
* Los componentes Vue se encuentran en js/src/app/components
* Otros archivos interesantes son:
    * bus.js -> Lo utilizamos como bus de eventos para emitir / recibir eventos
    * lib.js -> Una instancia Vue que nos sirve como librería de funciones (para funcionalidades compartidas entre componentes)
    * socket.js -> Simplemente inicializa socket.io en el frontend
    * store.js -> Una clase "store" donde almacenamos variables que serán compartidas por varios componentes
    * vue-instance.js -> Inicializa la instancia Vue principal
* en vendor/smoothie.js tenemos la librería que renderiza la gráfica en tiempo real
* si tienes sugerencias sobre cómo optimizar el código, hacerlo más legible, refactorizar, etc. las sugerencias y los pull requests son bienvenidos.



Contacta
------------
Si tienes alguna duda, sugerencia, crítica o palabra de odio, puedes contactarme en https://twitter.com/ojoven