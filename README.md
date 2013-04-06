# Boilerplates
Boilerplates is an index of code templates designed to work with the 
[boilerplate](http://ajaymt.github.com/boilerplate) tool. Assuming you have the `boilerplate` tool installed, 
you can clone boilerplates from the index with the following command -

	$ boilerplate <boilerplate-name> <project-name>

Where `<boilerplate-name>` is the name of a boilerplate in the index, or a git clone URL, or the path to a local
git repository.

## Downloading And Running -
This app was created with [Meteor](http://meteor.com) and [Meteorite](http://oortcloud.github.com/meteorite).
You can `git clone` this repo and run the app with `mrt`.

	$ git clone http://github.com/AjayMT/boilerplates.git
	$ cd boilerplates && mrt

## Contributing -
Feel free to contribute code. You can fork the repo, make changes, and send a pull request. Just make sure you 
follow these rules -
* Client code goes in `client.js`.
* Server code goes in `server.js`.
* Shared code goes in `model.js`.
* Use two-space indents, no tabs.
* Preferably `''` instead of `""`.
* `if (! something)` instead of `if(!something)`.
* Don't hesitate to add comments and whitespace!
