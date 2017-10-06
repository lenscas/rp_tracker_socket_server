exports.getPad = async function(req,res,other){
	const battleId = req.data.battleId;
	const rpCode = req.data.rpCode;
	if(!battleId && !rpCode){
		res.reply({
			error   : true,
			message : "Missing battleId and/or rpCode"
		});
		return;
	}
	
	let db = other.db();
	const messages = await db.query({
		sql : `SELECT 
				messages.createDate,
				messages.text,
				characters.code,
				characters.textColor,
				characters.backgroundColor
			FROM messages 
			INNER JOIN characters
			ON characters.code = messages.charCode
			WHERE messages.rpCode = ?
			AND messages.battleId = ?`,
		values : [rpCode,battleId],
		nestTables : true
	});
	const messageList = [];
	messages.forEach(
		value=>
			messageList.push({
				createDate : value.messages.createDate,
				text : value.messages.text,
				textColor : value.characters.textColor || "#000000",
				backgroundColor : value.characters.backgroundColor || "#FFFFFF",
				charCode : value.characters.charCode 
			})
	);
	res.reply({
		messages : messageList
	});
	db.release();
}
exports.addMessage = function(req,res,apis){
	const data = req.data;
	if(!data.charCode && data.rpCode){
		res.reply({
			error : true,
			message : "Missing charCode, and/or rpCode"
		});
		return;
	}
	if(!data.message) {
		res.reply({
			error : true,
			message : "missing message"
		});
	}
	apis.http.get({
		url  : "rp/"+data.rpCode+"/characters/"+data.charCode+"/userId",
		callBack : async (httpData) =>{
			if(httpData.data.userId===res.req.customData.userId){
				const db = apis.db();
				const result = await db.query({
					sql : "SELECT code FROM characters WHERE ? LIMIT 1",
					values : [{code : data.charCode}],
				});
				const needInsert = result.length!==1
				if(needInsert){
					await db.simpleInsert({
						table : "characters",
						values : {
							code : data.charCode,
							color : "#000000",
							rpCode : data.rpCode
						}
					})
				}
				await db.simpleInsert({
					table : "messages",
					values : {
						charCode : data.charCode,
						battleId : data.battleId,
						text     : data.message,
						createDate : Math.floor(Date.now() / 1000), //we need the Unix time stamp in seconds rather then milliseconds
						rpCode   : data.rpCode
					}
				});
				db.release();
				res.reply({
					success : true
				});
				apis.http.get({
					url : "rp/"+data.rpCode+"/battles/"+data.battleId+"/users",
					callBack : userList =>{
						res.sendMatching(
							userList.data,
							[res.req],
							{
								route : "newMessage/"+data.rpCode+"/"+data.battleId
							}
						);
					}
				})
			}
		}
			
	})
}
