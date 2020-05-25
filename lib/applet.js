const utils = require('@aspectron/flow-utils');
const { dpc } = require('@aspectron/flow-async');
const FlowRPC = require('@aspectron/flow-rpc');
const EventEmitter = require('events');


// true && nw.Window.get().showDevTools();

class Applet extends EventEmitter {
	constructor(){
        super();
		this._flow_init();
	}
	async _flow_init(){
		this._flow_initRPC();
		this._flow_appData = await this.get("get-app-data");
		console.log("this._flow_appData", this._flow_appData)
		let { config } = this._flow_appData;
        
        // TODO - get main appfolder and applet folder

        this.qS = document.querySelector.bind(document);
        this.qSA = document.querySelectorAll.bind(document);
        
		dpc(() => {
			this.main();
		})
	}
	_flow_initRPC(){
		this.rpc = new FlowRPC({bcastChannel:'kdx'});
		this.rpc.on("disable-ui", (args)=>{
			$('body').addClass("disable");
		});
		this.rpc.on("enable-ui", (args)=>{
			$('body').removeClass("disable");
		});
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

