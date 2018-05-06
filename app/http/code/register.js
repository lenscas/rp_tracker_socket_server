exports.register = async function(req,res,apis){
	const crypt   = require("crypto");
	const token   = crypt.randomBytes(10).toString("hex");
	const now     = new Date()
	const setTime = Math.floor(now / 1000);
	const endTime = setTime + (2*60*60) //2 hours = 2 * 60 minutes * 60 seconds
	await apis.db.getConnection();
	apis.db.query({
		sql : `
			DELETE FROM server_sessions
			WHERE endTime < ?
		`,
		values : [endTime - 30] 
	});
	await apis.db.simpleInsert({
		table : "server_sessions",
		values : {
			secret : token,
			beginTime : setTime,
			endTime : endTime,
		}
	});
	const expires = new Date(endTime*1000).toUTCString()
	res.writeHead(200,{
		'Set-Cookie' : "secret="+token+";expires="+expires+";Path=/",
		'Content-Type' : "text/plain"
	});
	res.write('{"secret":"'+token+'"}');
	return false;
}
