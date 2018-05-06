let pool = {};
exports.start = function(config){
	const mysql  = require('promise-mysql');
	const db = require(config.config+"db.js");
	pool = mysql.createPool(db);
	return function(){
		let inTransaction    = false;
		let failedAQuery     = false;
		let connection       = false;
		return {
			_query : async function(data){
				if(inTransaction && failedAQuery){
					return false;
				}
				try{
					return await connection.query(data);
				}
				catch(e){
					console.error(e);
					if(inTransaction){
						failedAQuery = true;
					}
					throw(e)
				}
			},
			query : async function(data){
				if(!connection){
					console.log("??");
					await this.getConnection();;
				}
				return await this._query(data);
			},
			beginTransactionAuto : async function(){
				inTransaction = true
				return await this.beginTransaction();
			},
			beginTransaction : async function(){
				await connection.beginTransaction();
				return this;
			},
			endTransactionAuto : async function(){
				inTransaction = false;
				await this.endTransaction(!failedAQuery);
				failedAQuery  = false;
			},
			endTransaction : async function(success=true){
				if(success){
					await connection.commit();
				} else {
					await connection.rollback();
				}
				return this;
			},
			setAutoTransactionStatus : function(status){
				failedAQuery = status
			},
			getConnection : async function(){
				connection = await pool.getConnection();
			},
			simpleInsert : async function(data){
				const queryData = {
					sql : "INSERT INTO ?? (??) VALUES (?)",
					values : [
						data.table,
						[],
						[],
					]
				}
				Object.keys(data.values).forEach((value)=>{
					queryData.values[1].push(value);
					queryData.values[2].push(data.values[value]);
				});
				return await this.query(queryData);
			},
			release : function(){
				if(connection){
					pool.releaseConnection(connection);
					connection = null;
				}
			}
		}

	}
}

exports.end = function(){
	pool.end();
}
