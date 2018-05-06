exports.setWatched = async function(req,res,other){
	if( (!req.data.ids) || req.data.ids.length===0){
		return;
	}
	const db = other.db;
	const sql = `UPDATE alerts
		SET isRead = 1
		WHERE id IN (?)
		AND userId = ?`
	const success = await db.query({
		sql : sql,
		values : [req.data.ids,res.req.customData.userId]
	});
}
exports.getUnwatchedAlerts = async function(req,res,other){
	const sql = `SELECT alerts.id,alert_types.message,alert_types.name
		FROM alerts
		INNER JOIN alert_types
		ON alert_types.id= alerts.typeId
		WHERE userId = ?
		AND (
			isRead = 0
			OR time > ?
		)
		ORDER BY time DESC
		LIMIT 10
	`
	const db = other.db;
	const alertList = await db.query({
		sql : sql,
		values : [
			res.req.customData.userId,
			(Date.now()/1000) - (2*60*60) ] //hours * 60 minutes * 60 seconds
	});
	console.log(alertList);
	const returnList = []
	for(alert of alertList){
		const sql  = `SELECT name,value FROM alert_vars WHERE alertId=?`
		const vars = await db.query({sql:sql,values:[alert.id],nestTables:false});
		console.log(vars);
		returnList.push({
			alertId : alert.id,
			message : alert.message,
			type    : alert.name,
			vars    : vars
		});
	};
	res.reply({
		alerts : returnList
	});
}
