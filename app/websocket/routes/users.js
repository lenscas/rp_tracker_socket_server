exports.register = function(req,res,apis){
	const validateUser = req.data.registerCode;
	if(!validateUser){
		res.reply({
			success : false,
			reason  : "Missing userValidatior"
		});
		return;
	}
	apis.http.get({
		url  : "socket/check/users/"+validateUser,
		callBack : (data) =>{
			console.log("in callback");
			console.log(data);
			let replyData = {
				success : true,
				message : "Successfully logged in"
			}
			if(data.data.code){
				apis.list[data.data.code] = apis.list[data.data.code] || [];
				apis.list[data.data.code].push(res.req);
				res.req.customData.userId = data.data.code;
			} else {
				replyData.success = false;
				replyData.message = "The given code does not exist";
			}
			res.reply(replyData);
		}
	})
}
