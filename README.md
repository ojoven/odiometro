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
============

1. Clonar el repositorio

```git clone git@github.com:ojoven/odiometro.git```

2. Desde la raíz del proyecto (instalará express y socket)

```npm install```

3. También desde la carpeta /public (instalará grunt y plugins, vue)

```cd public && npm install```