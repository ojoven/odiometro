Contributing
================================

Hay varias maneras de contribuir al proyecto Odiómetro.

1. Darnos sugerencias e ideas.
2. Ayudar a dar a conocer el proyecto en tus redes y medios.
3. Añadir mejoras de código al proyecto.
4. Crear una versión específica del odiómetro para tu país.


1. SUGERENCIAS E IDEAS
============================
Puedes hacérnoslas llegar a nuestro Twitter (https://twitter.com/odiometrobot) o escribirnos en las issues de GitHub.
Ten en cuenta que este es un proyecto que se desarrolla en tiempo libre y que muchas funcionalidades acarrearían mucho tiempo de desarrollo.

2. DAR A CONOCER EL PROYECTO
============================
Igualmente pudes contribuir compartiendo el Odiómetro en tus redes:
* Twitter
* Facebook
* Instagram
* Whatsapp

O si escribes en algún medio, puedes escribir sobre el Odiómetro. Hay mucha información y anécdotas que pueden ser de interés para tus lectores y lectoras.

3. MEJORAS EN EL CÓDIGO
============================
El proyecto está desarrollado en NodeJS para el backend, con base de datos MySQL, y en Vue para el frontend.
Hay mucho espacio para la optimización, sobre todo a nivel de estructuración de código y legibilidad.
No se están utilizando promesas, por ejemplo, y nos podemos encontrar algún que otro pequeño callback hell.
Al no ser un proyecto muy grande y al disponer de poco tiempo, hemos decidido asumir esa deuda técnica, pero si te duelen los hojos y quieres contribuir puedes ayudarnos haciendo un pull request con los refactors que veas necesarios.

La app tiene unos pocos tests, están principalmente enfocados a los algoritmos de identificación, no tanto al funcionamiento general de la app.

4. TU PROPIO ODIÓMETRO
============================
Varias personas nos han escrito preguntándonos si podrían crear una versión del Odiómetro para su país.
El proyecto no estaba preparado porque recogía el odio de todos los países de habla hispana, pero centrándonos en algunos casos en listas de palabras que quizás se utilizaban más en España.

Le hemos dado una vuelta y ahora https://odiometro.es SÓLO mostrará el odio de Twitter en España (o esa es nuestra intención).
Entonces, si quieres crear tu versión del Odiómetro para Mexico, Argentina, Venezuela, Uruguay.....(países de habla no hispana, por favor ver INTERNATIONAL.md)

* Clona la aplicación tal y como se explica en el README.md
* Ahora tendrás que crear tu propia versión del odiómetro, para ello los archivos que tienes que configurar son:
	* /public/js/bots/odiometro.pais.js
	* /config/odiometro.pais.json


odiometro.pais.js
Aquí van los mensajes, puedes personalizarlos, sobre todo la parte de "info". Échale un ojo a /public/js/bots/odiometro.js para mayor claridad.

odiometro.pais.json ->
Puedes utilizar el config/odiometro.pais.json.example o config/odiometro.json como guía para crear el tuyo.

Los campos a personalizar son:

* language: idioma, presumiblemente "es"
* index: si no vas a modificar el layout, los colores, etc. del Odiómetro, puedes dejarlo como está. Si quieres una personalización profunda, tendrás que indicar aquí el path dentro de /public/views/ que va a tener tu odiómetro.
* port: puerto desde el que se servirá el proyecto
* saveTweets: si quieres guardar los tuits en tweets_store y retweets_store. Aunque se hayan optimizado para guardar solo lo imprescindible y que ocupe lo mínimo posible, las tablas crecerán en varios megas al día, así que necesitarás espacio si quieres almacenar los tuits.

A continuación, algunos campos para concretar los tuits que únicamente se generan en tu país:

* ignore_locations: aquí tendrías que colocar los nombres de países y principales ciudades que NO QUIERES QUE APAREZCAN en la versión de tu país.
* ignore_accounts: similar, pero con cuentas de Twitter que no quieres que aparezcan como generadoras o receptoras de odio. Es complicado añadir todas las que debería de ignorar, claro, pero al menos algunas de las más importantes pueden ayudar a que el odio que mida tu versión sea más específica aún del país.
* ignore_foreign_expressions: palabras clave que NO SE UTILIZAN EN TU PAÍS. El algoritmo de identificación ignorará los mensajes que incluyan estas expresiones.
* ignore_user_descriptions: similar pero con las bios de Twitter de los usuarios que tuitean, son retuiteados o citados.

Pasemos a los campos que alimentarán al algoritmo de identificación del odio:
* ignore_expressions: expresiones que si son incluidas en los tuits los descartarán como tuits de odio.
	* comical: palabras o expresiones que presumiblemente indican un tono jocoso, cómico o amistoso (Paco, qué tonto eres, jajaja xD).
	* self: palabras que indican que el uso despectivo va hacia uno mismo y por tanto no denota odio hacia terceros (qué tonto soy).
	* specific: palabras o expresiones que nos ayudan a identificar falsos positivos de las palabras trackeadas.
* hate_prefixes: expresiones que se utilizan previas a las palabras y que suman valor de odio (eres un mierda, pedazo de gilipollas)
* track: IMPORTANTE, aquí vienen las palabras con sus pesos (weight).
	* weight = 1: la palabra denota odio per se
	* weight = 0.8: la palabra denota odio solo si es una respuesta a otro usuario.
	* weight = 0.5: la palabra puede denotar odio o no, suma a otras palabras o llega a expresión de odio con los hate_prefixes.
	* weight = 0.2: la palabra en principio no denotará odio a no ser que vaya con un hate_prefix por delante

Es importante hacer una buena labor de clasificación de estas palabras para evitar al máximo los falsos positivos y falsos negativos.

Información adicional
-------------------
Si creas una versión del odiómetro para tu país, queda bajo tu responsabilidad la compra del dominio, configuración del servidor, el mantenimiento, etc. Es todo tuyo. Con que hagas una pequeña mención al Odiómetro original, puedes hacerlo tuyo. Si compras el dominio, por ejemplo, odiometro.com.mx que sea una vez que tengas claro que vas a dedicarle un poco de tiempo en ponerlo en marcha.

Podemos crear una pequeña comunidad por aquí, en los issues de GitHub para darnos soporte. Salut!

Contacta
------------
Si tienes alguna duda, sugerencia, crítica o palabra de odio, puedes contactarme en https://twitter.com/ojoven
