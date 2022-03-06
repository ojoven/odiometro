HATE-O-METER (aka odiometro)
================================
An app to measure in real time the hate in Spanish - from Spain - Twitter.

If you want to check the README in Spanish, [please check the README-ES.md file](README-ES.md).

Available in https://odiometro.es

The goal of this project is to make us conscious of the debate level in Spain,
and the amount of insults that are posted to Twitter.

We're using the following technologies:
* Vue
* NodeJS / Express
* Socket.io
* MySQL
* SASS


Installation
-------------

1. Clone the repository

```git clone git@github.com:ojoven/odiometro.git```

2. From the root of the project (this will install express, socket and other libraries)

```npm install```

3. From the `/public` folder (this will install Vue, Grunt and plugins)

```cd public && npm install```

4. Create a database and import the dump from `db/odiometro.sql`

```mysql -u [username] -p [dbname] < db/odiometro.sql```

4.2 Configure your DB in /config/database_odiometro.json or if you're creating an hatemeter in your own country: database_odiometro.country.json

```mysql -u [username] -p [dbname] < db/odiometro.sql```

5. Run grunt from /public

```grunt```

6. Run the app

```node app.js```

6.2. Or if you've created your own version:

```node app.js [botname]```


IMPORTANT
-------------------------------
You must create an app in Twitter and fill the consumer key and secret, access_token and secret in twitter_odiometro.json or twitter_odiometro.country.json.

Twitter's API has changed since I started with this project and they started adding more restrictions that may not affect older apps but newer ones.
If you have any problem or you don't know how it works, please write an Issue.

Development additional notes
-------------------------------

* Vue's components can be found in `public/js/src/app/components`.
* Other interesting files are:
    * bus.js -> Event bus to emit / receive events.
    * lib.js -> Vue instance that serves as a function library for functionalities shared between components.
    * socket.js -> Initializes socket.io in the frontend.
    * store.js -> Store class for states shared between components.
    * vue-instance.js -> Initializes the main Vue instance.
* in `vendor/smoothie.js` we have the library that renders the real time graph.
* if you have suggestions on how to optimize the code, make it more readable, refactors, etc. suggestions and pull requests are always welcome.



Contact
------------
If you have any doubt, suggestion, criticism or hate word you can contact me in https://twitter.com/ojoven or post an Issue.
