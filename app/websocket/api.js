class NoRequester extends Error {
	constructor() {
		super("Tried to send something back when there was no sender.")
		Error.captureStackTrace(this, NoRequester)
}
}
exports.NoRequester = NoRequester;
exports.create = function(data){
	return {
		req     : data.req,
		list    : data.list,
		curId   : data.userId,
		replyId : data.replyId,
		data    : data.data,
		simpleSend : function(data,callBack){
			if(!this.req){
				//if this happens, either someone is doing something stupid or weird stuff is happening.
				throw(new exports.NoRequester);
			}
			if(typeof(data) === "object"){
				data = JSON.stringify(data);
			}
			this.req.sendText(data,callBack);
		},
		reply : function(data,callBack){
			if(!this.replyId){
				throw("No reply id")
			}
			data.replyId = this.replyId;
			this.simpleSend(data,callBack);
			
		},
		sendMatching : function(userIdList,blackListConnections,message){
			userIdList.forEach(value=>{
				let userId = value;
				if(typeof(userId)==="object"){
					userId = userId.userId;
				}
				const list = this.list[userId] || [];
				list.forEach(connection=>{
					if (
						blackListConnections.every(
							blackListed =>{
								return blackListed!==connection;
							}
						)
					) {
						if(connection.readyState===connection.OPEN){
							connection.send(JSON.stringify(message));
						}
						
					}
				});
			});
		},
		didWork : function(data,callBack){
			if(data.success){
				this.simpleSend({
					success : data.success,
					message : data.message
				});
			} else {
				this.simpleSend({
					
				});
			}
		}
	}
}
