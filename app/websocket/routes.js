const routePath = __dirname+"/routes/"
const routeList = {
	"test"     : require(routePath+"test.js"),
	"users"    : require(routePath+"users.js"),
	"pad"      : require(routePath+"pad.js"),
	"alerts"   : require(routePath+"alerts.js"),
}
exports.run=async function(req,res,list){
	const headRoute  = req.route[0];
	const childRoute = req.route[1];
	const foundRoute = routeList[headRoute];
	if(foundRoute && foundRoute[childRoute]){
		await foundRoute[childRoute](req,res,list);
	} else {
		console.error("couldn't find route:");
		console.log(req.route);
	}
	return;
}
