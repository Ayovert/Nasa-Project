Heads up! If you're using the default Windows shell, the syntax to set an environment variable like PORT is slightly different than what we saw in the previous video. To set PORT in your package.json on Windows, you'll want to write:

"start": "set PORT=5000&& node src/server.js"

Instead of:

"start": "PORT=5000 node src/server.js"

Alternatively, there's the cross-env NPM package which will work all platforms. Both options work!


Friendly reminder! BUILD_PATH is an environment variable, just like PORT. On Windows, with the default shell, the way we set our BUILD_PATH variable is:

set BUILD_PATH=../server/public&& react-scripts build

Rather than the bash version:

BUILD_PATH=../server/public react-scripts build

Important! Copy the set command exactly, making sure there's no space between the word public and the && symbols. If you add a space, Windows will add that space to the name of the build folder, and our front end dashboard will never load.