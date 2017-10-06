let pool = {};
exports.start = function(config){
	const mysql  = require('promise-mysql');
	const db = require(config.config+"db.js");
	pool = mysql.createPool(db);
	return function(){
		return {
			connection : false,
			queu : [],
			_query : async function(data){
				return await this.connection.query(data);
			},
			query : async function(data){
				if(!this.connection){
					console.log("we need to make a connection");
					await this.getConnection();
				}
				return await this._query(data);
			},
			getConnection : async function(){
				console.log("start making a connection");
				this.connection = await pool.getConnection();
				console.log("done making a connection");
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
				if(this.connection){
					pool.releaseConnection(this.connection);
					this.connection = null;
				}
				
			}
		}

	}
}

exports.end = function(){
	pool.end();
}
