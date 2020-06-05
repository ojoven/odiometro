const messages = {

	// ABOUT
	about: {
		title: '¿Qué es el Odiómetro?',
		body: '<p>El odiómetro es una aplicación que rastrea en Twitter insultos, descalificaciones, etc. las contabiliza y las muestra.</p>' +
			'<p>Su objetivo es servir de espejo para <b>hacernos conscientes de la cantidad de odio que vertemos en las redes</b> y plantear una alternativa. ¿Somos conscientes del poder de la persuasión, de la inteligencia, de la empatía, de la educación y del humor para transmitir y discutir nuestras ideas?</p>' +
			'<p>Es éste un proyecto Open Source que no pretende ser una herramienta exhaustiva de identificación del odio, si quieres crear tu versión del odiómetro en tu país o contribuir puedes hacer una pull request <a target="_blank" href="https://github.com/ojoven/odiometro">en nuestro repositorio en GitHub</a> o hacerme alguna sugerencia vía Twitter en <a target="_blank" href="https://twitter.com/ojoven">@ojoven</a></p>'
	},

	// USERS
	hated_user: 'es el usuario <b>recibiendo más odio</b><var class="hide-mobile"><br>en estos momentos</var>.',
	hateful_user: 'es el usuario <b>generando más odio</b><var class="hide-mobile"><br>en estos momentos</var>.',

	// TWEETS
	tweets_minute: 'tuits de odio / minuto',
	see_tweet: 'ver tuit',

	// HISTORIC
	historic: {
		title: 'Histórico de odio',

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