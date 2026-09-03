# Odiómetro

Odiómetro measured insults and hostile messages posted on Twitter in Spanish. The original site combined a live feed, a tweets-per-minute graph, and summaries of the accounts receiving and posting the most abuse.

This repository now runs as an interactive archive. Every tweet, account, image, and figure shown in the main frontend is fictional. The page does not connect to X and does not show live data.

For the Spanish README, see [README-ES.md](README-ES.md).

## Run the archive

No installation, database, API key, or Node server is required. Open [`public/index.html`](public/index.html) in a browser.

You can also serve the files over HTTP:

```sh
python3 -m http.server --directory public 8000
```

Then open <http://localhost:8000/>.

To deploy it, upload the contents of `public/` to the web root. `index.html` is the entry page, and all application assets use paths that also work when the site lives in a subdirectory. Apache can read the included `.htaccess` file to serve UTF-8 headers and use `index.html` as the directory index; other static hosts can ignore it because the HTML declares UTF-8 itself.

The demo rotates through a fixed set of Spanish posts and figures. Its dashboard, graph, user summaries, historical ranges, and blood-splatter effect behave like the original site. Browsers configured to reduce motion receive a static version of the replay.

## Frontend code

The mock data and Socket.IO-compatible event adapter live in [`public/js/mocks/odiometro.js`](public/js/mocks/odiometro.js). Vue components remain in `public/js/src/app/components`.

The repository commits the generated `public/js/app.min.js` file, so visitors do not need a build step. After changing a component, rebuild it with the legacy Grunt task:

```sh
cd public
npm install
grunt concat
```

## Historical backend

The original Node, Express, Socket.IO, MySQL, and Twitter integration remains in the repository as historical source code. The archive does not start or call it. That backend is unsupported and still expects the old database and Twitter credentials if someone tries to run it.

The existing backend tests can still be run from the repository root:

```sh
npm install
npm test
```

## Project links

- [@odiometrobot on X](https://x.com/odiometrobot)
- [The original GitHub repository](https://github.com/ojoven/odiometro)
- [Genbeta: Odiómetro, una herramienta que te muestra el odio que hay en Twitter en tiempo real](https://www.genbeta.com/redes-sociales-y-comunidades/odiometro-herramienta-que-te-muestra-odio-que-hay-twitter-tiempo-real)
- [Microsiervos: El Odiómetro muestra en tiempo real cómo se odia la gente en Twitter](https://www.microsiervos.com/archivo/internet/odiometro-odio-tiempo-real.html)
- [Mikel Torres on Twitter](https://twitter.com/ojoven)

## License

MIT
