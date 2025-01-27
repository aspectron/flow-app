const utils = require('@aspectron/flow-utils');
const { dpc } = require('@aspectron/flow-async');
const { BroadcastChannelRPC : FlowRPC } = require('@aspectron/flow-rpc');
const EventEmitter = require('events');


// true && nw.Window.get().showDevTools();

class Applet extends EventEmitter {
	static get defaultOptions(){
		return {}
	}
	constructor(ident, options={}){
        super();
        this.ident = ident;
        this.options = Object.assign({
        	rpcIdent: ident
        }, this.constructor.defaultOptions, options)
		this._flow_init();
	}
	async _flow_init(){
		this._flow_initRPC();
		this._flow_initWin();
		this._flow_appData = await this.get("get-app-data");
		console.log("this._flow_appData", this._flow_appData)
        let { config, appFolder, binFolder, configFolder, dataFolder } = this._flow_appData;
        this.appFolder = appFolder;
        this.binFolder = binFolder;
        // this.configFolder = configFolder;
        // this.dataFolder = dataFolder;
        
        // TODO - get main appfolder and applet folder

        this.qS = document.querySelector.bind(document);
        this.qSA = document.querySelectorAll.bind(document);
        
		dpc(() => {
			this.main(config);
		})
	}
	_flow_initRPC(){
		this.rpc = new FlowRPC({bcastChannel:this.options.rpcIdent});
		this.rpc.on("disable-ui", (args)=>{
			$('body').addClass("disable");
		});
		this.rpc.on("enable-ui", (args)=>{
			$('body').removeClass("disable");
		});
	}
	_flow_initWin(){
		this.win = nw.Window.get();
		this._onWinClose = this.onWinClose.bind(this);
		this.win.on('close', this._onWinClose);
	}
	onWinClose(){
		this.closeWin(true);
	}
	closeWin(force){
		this.win.close(force);
	}

	// saveConfig(config){
	// console.log("saveConfig:config", config)
	// 	try{
	// 		config = JSON.parse(config);
	// 	}catch(e){
	// 		return
	// 	}
	// 	this.post("set-app-config", {config});
    // }
    
	setUiDisabled(disabled){
		document.body.classList.toggle("disable", disabled);
    }
    
	post(subject, data){
		this.rpc.dispatch(subject, data)
	}

	get(subject, data){
		return new Promise((resolve, reject)=>{
			this.rpc.dispatch(subject, data, (err, result)=>{
				if(err)
					return resolve(err)

				resolve(result);
			})
		})
	}

	main() {
        const el = this.qS('body');
		el.innerHTML = "Flow::Applet::main()";
	}
}

module.exports = Applet;

