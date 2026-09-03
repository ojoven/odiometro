const messages = {

	// GENERAL
	archive_notice: 'Esta es una versión de archivo. Los tuits, usuarios y cifras son ficticios. El Odiómetro ya no se conecta a X ni muestra datos en tiempo real.',
	footer: 'El Odiómetro fue una iniciativa para hacernos conscientes de la cantidad de odio que vertíamos en nuestros mensajes y respuestas de Twitter. Hecho con ❤ por <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/ojoven">@ojoven</a>',

	// ABOUT
	about: {
		title: '¿Qué es el Odiómetro?',
		body: '<p>El Odiómetro fue una aplicación que buscaba insultos y descalificaciones en Twitter, los contabilizaba y los mostraba mientras se publicaban.</p>' +
			'<p>Quería ser un espejo para <b>hacernos conscientes de la cantidad de odio que vertíamos en las redes</b>. No era una herramienta científica ni pretendía identificar todo el odio que circulaba por Twitter.</p>' +
			'<p>Esta versión conserva el aspecto y el movimiento de la web original, pero funciona con tuits, usuarios y cifras ficticios. No consulta X ni ningún otro servicio de datos.</p>' +
			'<p>El código sigue disponible <a target="_blank" rel="noopener noreferrer" href="https://github.com/ojoven/odiometro">en GitHub</a>. También puedes visitar <a target="_blank" rel="noopener noreferrer" href="https://x.com/odiometrobot">@odiometrobot en X</a> y leer lo que publicaron <a target="_blank" rel="noopener noreferrer" href="https://www.genbeta.com/redes-sociales-y-comunidades/odiometro-herramienta-que-te-muestra-odio-que-hay-twitter-tiempo-real">Genbeta</a> y <a target="_blank" rel="noopener noreferrer" href="https://www.microsiervos.com/archivo/internet/odiometro-odio-tiempo-real.html">Microsiervos</a> sobre el proyecto.</p>' +
			'<p>También puedes escribirme en Twitter en <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/ojoven">@ojoven</a>.</p>'
	},

	// USERS
	hated_user: 'es el usuario <b>recibiendo más odio</b><var class="hide-mobile"><br>en esta simulación</var>.',
	hateful_user: 'es el usuario <b>generando más odio</b><var class="hide-mobile"><br>en esta simulación</var>.',

	// TWEETS
	tweets_minute: 'tuits de odio / minuto (simulación)',
	see_tweet: 'ver tuit',

	// HISTORIC
	historic: {
		title: 'Histórico simulado de odio',

		// Menu
		show: 'Mostrar',
		type_graph: {
			graph: 'gráfico',
			table: 'tabla',
			hateful: 'usuario más odiador',
			hated: 'usuario más odiado'
		},
		for: 'de',
		time_graph: {
			last_fs: 'última',
			last_fp: 'últimas',
			last_ms: 'último',
			last_mp: 'últimos',
			hour_s: 'hora',
			hour_p: 'horas',
			day_s: 'día',
			day_p: 'días'
		},

		// GRAPH
		graph: {
			tweets_at: ' tuits de odio a las ',
			average_tweets_at: ' es la media mensual de tuits de odio a las ',
			number_tweets: 'Número de tuits de odio por minuto',
			hateful: ' es el usuario que más odio ha generado',
			hated: ' es el usuario que más odio ha recibido'
		},

		// RESUME
		resume: {
			hated: 'es el usuario que <b>más odio ha recibido</b> durante este tiempo',
			hateful: 'es el usuario que <b>más odio ha generado</b> durante este tiempo',
			others: 'Otros',
			example: 'Ejemplo',
			tweet: 'Tuit'
		}

	}

}
