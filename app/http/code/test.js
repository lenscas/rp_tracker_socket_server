exports.test = function(req,res){
	res.write("awesome?");
	return {
		users : [
			"c21a91327ff0524e0e5c07997204e7f421611f78"
		],
		type : "test",
		vars : {
			"USERCODE" : "c21a91327ff0524e0e5c07997204e7f421611f78"
		}
	}
}
