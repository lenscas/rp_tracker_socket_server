const list = {};
const api  = require(__dirname+"/api.js");
exports.start = function(paths,apis){
	const routes  = require(paths.app+"routes.js");
	const ws      = require("nodejs-websocket")
	let server    = ws.createServer(function (conn) {
		conn.on("text", function (json) {
			let data;
			try{
				data =JSON.parse(json);
				if(!data.route){
					throw {message : "Missing route"};
				}
			}
			catch(err){
				let sendBack = {error : "Not vallid json."}
				if(err.message=="Missing route"){
					sendBack = {error : "Missing route"};
				}
				conn.sendText(JSON.stringify(sendBack));
				return;
			}
			const res = api.create({
				req     : conn,
				list    : list,
				curId   : data.curId || null,
				replyId : data.replyId,
				data    : data.data
			});
			if(conn.customData){
				console.log("customdata was set");
				console.log(conn.customData);
			} else {
				conn.customData= {};
				console.log("custom data was not set");
			}
			routes.run(data,res,{
				list : list,
				db   : apis.getDBConection,
				http : apis.httpSend
			});
		})
		conn.on("close", function (code, reason) {
			if(conn.customData.userId){
				const oldList = list[conn.customData.userId];
				const newList = [];
				oldList.forEach(value=>{
					if(value!==conn){
						newList.push(value);
					}
				});
				list[conn.customData.userId] = newList;
			}
			console.log("Connection closed")
		})
	}).listen(8001)
}

