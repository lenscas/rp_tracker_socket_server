function parseCookies (request) {
	let list = {},
	rc = request.headers.cookie;
	console.log(rc);
	rc && rc.split(';').forEach( cookie => {
		let parts = cookie.split('=');
		list[parts[0].trim()] = decodeURI(parts.slice(1).join('='))
	});
	return list;
}

exports.start = function(appPath,configPath,apis){
	const config = require(configPath+"config.js");
	apis.config = config;
	const http = require("http");
	const routes = require(configPath+"routes.js");
	const querystring = require('qs');
	const server = http.createServer(

		async (req,res) => {
			console.log(req.method);
			console.log("WE GOT AN HTTP REQUEST!");
			const chunks = [];
			req.on('data', function (data) {
				console.log("we got data!");
				console.log(data.toString());
				chunks.push(data);
			});
			req.on('end', async function () {
				console.log("does this work??");
				const data = Buffer.concat(chunks)
				console.log("total str")
				console.log(data.toString());
				req.body = JSON.parse(data.toString());
				console.log("as arr")
				console.log(req.body);
				try{
					req.cookies = parseCookies(req);
					await routes.run(req,res,apis);
				}
				catch(e){
					console.error(e);
					throw(e)
				}
				finally{
					res.end();
				}
			});

		}
	);
	server.on('clientError', (err, socket) => {
		socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
	});
	server.listen(8000);
}
