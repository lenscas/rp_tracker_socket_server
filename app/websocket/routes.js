const routePath = __dirname+"/routes/"
const routeList = {
	"test"     : require(routePath+"test.js"),
	"users"    : require(routePath+"users.js"),
	"pad"      : require(routePath+"pad.js")
}
exports.run=function(req,res,list){
	const headRoute  = req.route[0];
	const childRoute = req.route[1];
	const foundRoute = routeList[headRoute];
	if(foundRoute && foundRoute[childRoute]){
		foundRoute[childRoute](req,res,list);
	}
}
