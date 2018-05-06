exports["new"] = async function(req,res,apis){
	const noteData = req.body;
	if(
		noteData === null      ||
		noteData === undefined ||
		noteData === false
	){
		return
	}
	if(noteData.users.length == 0){
		return
	}
	const alertType = await apis.db.query(
		{
			sql : `SELECT id,message FROM alert_types WHERE name = ? LIMIT 1`,
			values : [noteData.type]
		}
	)
	if(alertType.length!==1){
		console.error(noteData.type + " is not a valid type name");
		return;
	}
	const arrayVars = []
	Object.keys(noteData.vars)
		.forEach(
			value => arrayVars.push(
				{
					name  : value,
					value : noteData.vars[value]
				}
			)
	);
	for (user of noteData.users){
		console.log(user)
		if(user==null){
			console.debug(noteData)
		}
		try {
			apis.db.beginTransactionAuto();
			let userId = user;
			if(typeof(user)=="object"){
				userId = user.userId;
			}
			const alert = await apis.db.simpleInsert({
				table : "alerts",
				values : {
					userId : userId,
					typeId :alertType[0].id,
					isRead : 0,
					time   : Math.floor(Date.now() / 1000)
				}
			});
			for(key of Object.keys(noteData.vars)){
				await apis.db.simpleInsert({
					table : "alert_vars",
					values : {
						alertId : alert.insertId,
						name : key,
						value : noteData.vars[key]
					}
				});
			}
			await apis.sock.sendMatching([user],[],{
				route   : "notification/get",
				message : alertType[0].message,
				alertId : alert.insertId,
				type    : noteData.type,
				vars    : arrayVars,

			})
		}
		catch(e){
			console.error(e);
			throw(e);
		}
		finally{
			apis.db.endTransactionAuto();
		}
	}
}
