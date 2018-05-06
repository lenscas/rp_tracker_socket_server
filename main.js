//basic setup first
const appPath  = __dirname+"/app/";
const confPath = appPath+"config/";
//first, setup a connection to the MYSQL server
const db = require(appPath+"db/init.js").start({config : confPath});
//we now setup the api to make requests to the main HTTP server
const httpSendPath = appPath+"http_send/";
const httpSend     = require(httpSendPath+"init.js").init(httpSendPath,confPath);

//now its time to setup the websocket server.
const webPath      = appPath+"websocket/";
const socketServer = require(webPath+"init.js")
const socketApi    = socketServer.start(
	{
		app    : webPath,
		config : confPath
	},
	{
		httpSend : httpSend,
		getDBConection : db
	}
);
const httpServerPath = appPath+"http/";
const httpServer     = require(httpServerPath+"init.js").start(
	appPath,
	httpServerPath,
	{
		makeDB   : db,
		sock : socketApi
	}
);
