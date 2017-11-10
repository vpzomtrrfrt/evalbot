const phantomPool = require('phantom-pool');

const pool = phantomPool({
	phantomArgs: [[], {
	}]
});

module.exports = {
	run: function(code) {
		return pool.use(function(instance) {
			return instance.createPage()
			.then(function(page) {
				const consoleLogs = []
				page.on('onConsoleMessage', function(msg) {
					console.log("message");
					consoleLogs.push(msg);
				});
				console.log("hello");
				return new Promise(function(resolve, reject) {
					let completed = false;
					setTimeout(function() {
						completed = true;
						instance.kill();
						reject("TimeoutError");
					}, 10000);
					page.evaluateJavaScript("function(){return "+code+"}", code)
					.then(function(returned) {
						if(!completed) {
							completed = true;
							resolve(returned);
						}
					}, function(error) {
						if(!completed) {
							completed = true;
							reject(error);
						}
					});
				})
				.then(function(result) {
					return {result, console: consoleLogs};
				})
				.catch(function(err) {
					return {result: err, console: consoleLogs};
				});
			});
		});
	}
};
