const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('static website entry points', function () {
	const publicDirectory = path.join(__dirname, '..', 'public');
	const rootPage = fs.readFileSync(path.join(publicDirectory, 'index.html'), 'utf8');
	const legacyPage = fs.readFileSync(path.join(publicDirectory, 'views', 'index.html'), 'utf8');
	const menuSource = fs.readFileSync(path.join(publicDirectory, 'js', 'src', 'app', 'components', 'menu.js'), 'utf8');

	it('declares UTF-8 before text with accented characters', function () {
		assert(rootPage.indexOf('<meta charset="utf-8">') < rootPage.indexOf('<title>'));
		assert(legacyPage.indexOf('<meta charset="utf-8">') < legacyPage.indexOf('<title>'));
	});

	it('has a deployable index at the static root', function () {
		assert(rootPage.includes('src="js/mocks/odiometro.js"'));
		assert(rootPage.includes('href="css/style.css"'));
		assert(!rootPage.includes('<base'));
	});

	it('keeps internal view controls on the current document', function () {
		assert.strictEqual((menuSource.match(/@click\.prevent=/g) || []).length, 4);
	});
});
