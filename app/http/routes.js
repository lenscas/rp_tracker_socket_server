const urlApi = require("url");
const codePath = __dirname+"/code/";
const routeList = {
	test : require(codePath + "test.js"),
	alert : require(codePath + "alert.js"),
};

exports.run = async function(req,res,apis){
	const url = urlApi.parse(req.url,true);
	const parts = url.pathname.split("/");
	const fileRoute = routeList[parts[1]];;
	if(fileRoute){
		let funct = fileRoute[parts[2]];
		if(!funct){
			res.write("Not found!");
			console.log("Not found");
			return false;
		}
		console.log(req.cookies);
		if( !(req.cookies && req.cookies.secret)){
			res.write('{"success":false,"code":1}');
			console.log("Cookie not set");
			return false;
		}
		if(apis.config.secret != req.cookies.secret){
			res.write('{"success":false,"code":2}');
			console.log("Cookie not correct secret");
			return false;
		}
		apis.db = apis.makeDB();
		const returnValue = await funct(req,res,apis);
		apis.db.release();
		return returnValue
	} else {
		res.write("Not found");
		console.log("Major not found");
		return false;
	}
}
