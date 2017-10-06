exports.init = function(appPath,configPath){
	//const request = require("request");
	const httpConfig = require(configPath+"trackerServer.js");
	const http = require("http");
	return {
		post : function(data){
			
		},
		get  : function(data){
			data.method = "get";
			if(!data.callBack){
				new ReferenceError("data.callBack is not defined.")
			}
			if(data.data){
				data.url += "?";
				let first=true;
				Object.keys(data.data).forEach(value=>{
					if(first){
						first=false;
					} else {
						data.url +="&";
					}
					data.url +=value+"="+data.data[value];
				});
			}
			this.send(data);
		},
		send : function(data){
			const url = "/"+httpConfig.base_url + "/api/" +data.url;
			if(data.method == "get"){
				let req = http.get(
					{
						hostname : httpConfig.host,
						port     : httpConfig.port || 80,
						path     : url,
						headers  : {
							pad_token : httpConfig.code
						}
					},
					resp =>{
						let respData = "";
						resp.on("data",chunk => {
							respData += chunk;
						});
						resp.on("end",()=>{
							let returnData;
							let hasErrored=false;
							try{
								returnData = JSON.parse(respData)
							}
							catch(e){
								console.log(e);
								console.log(respData);
								hasErrored = true;
							}
							if(!hasErrored){
								data.callBack(returnData);
							}
							
						});
					}
				)
				req.on('error', function (err) {
					console.log('error: ' + err.message);
				});
			}
			
		}
	}
}
