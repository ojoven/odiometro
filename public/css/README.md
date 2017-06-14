SASS BOILERPLATE
===============================

This repository works as the Sass base for new projects.

It's a custom Sass boilerplate based on https://github.com/HugoGiraudel/sass-boilerplate

The structure is the following:
* app/
	* abstracts/ (abstract files and variables including animations, colors, fonts, media and mixins)
		* _animations.scss
		* _colors.scss
		* _fonts.scss
		* _media-declarations.scss
		* _mixins.scss
		* _variables.scss
		* _z-index-layers.scss
	* base/ (base, reset and component mixins or webcomponents)
		* _base.scss
		* _reset.scss
		* _component_mixins.scss
	* components/ (components including buttons, forms, icons, links, etc.)
		* _buttons.scss
		* _icons.scss
		* _links.scss
		* _texts.scss
		* _titles.scss
		* _thumbnails.scss
	* helpers/ (helpers: accessibility, print...)
		* _accessibility.scss
		* _desktop-mediaqueries.scss
		* _helpers.scss
		* _ie.scss
		* _print.scss
	* layout/ (layout related styles: grid, containers, header, footer...)
		* _container.scss
		* _footer.scss
		* _grid.scss
		* _header.scss
		* _sections.scss
	* pages/ (custom styles for specific pages)
		* _error.scss
		* _front.scss
		* _login.scss
	* _shame.scss (special file where to place styles that aren't included in any other file)
* vendor/ (styles imported from external plugins, libraries)


Some additional notes:
---------------------------
* Please consider this structure as the base from where to create new SCSS files (new components, pages, etc.)
* This is a personal customization based on Hugo Giraudel's Sass boilerplate and already successfully used on several projects
* Some of the files include additional instructions or examples on how to use them
* If you have any doubt or suggestion please contact me on http://twitter.com/ojoven
