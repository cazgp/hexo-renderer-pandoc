var spawn = require('child_process').spawn;

var pandocRenderer = function(data, options, callback){

	var args = [ '-f', 'markdown', '-t', 'html', '--mathjax', '--smart'];
	
	var src = data.text.toString();
	
	var pandoc = spawn('pandoc', args);

	var result = '';
	var error = '';

	pandoc.stdout.setEncoding('utf8');
	
	pandoc.stdout.on('data', function (data) {
		result += data.toString();
	});

	pandoc.stderr.on('data', function (data) {
		error += data.toString();
	});

	pandoc.stdin.write(src, 'utf8');

	pandoc.on('close', function (code, signal) {
		var msg = '';
		if (code !== 0)
			msg += 'pandoc exited with code '+code+(error ? ': ' : '.');
		if (error)
			msg += error;
		if (msg)
			return callback(new Error(msg));
		else{
			if (result === '') console.log("The next file error: ");
			callback(null, result);
		}
	});
	
    pandoc.stdin.end();

}

hexo.extend.renderer.register('md', 'html', pandocRenderer);
hexo.extend.renderer.register('markdown', 'html', pandocRenderer);
hexo.extend.renderer.register('mkd', 'html', pandocRenderer);
hexo.extend.renderer.register('mkdn', 'html', pandocRenderer);
hexo.extend.renderer.register('mdwn', 'html', pandocRenderer);
hexo.extend.renderer.register('mdtxt', 'html', pandocRenderer);
hexo.extend.renderer.register('mdtext', 'html', pandocRenderer);
