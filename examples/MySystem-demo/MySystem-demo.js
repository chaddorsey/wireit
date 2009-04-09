/**
 * jsBox
 */
var jsBox = {
   
   language: {
	   languageName: "jsBox",
		smdUrl: '../../backend/php/WiringEditor.smd',
		propertiesFields: [
			{"type": "string", inputParams: {"name": "name", label: "Title", typeInvite: "Enter a title" } },
			{"type": "text", inputParams: {"name": "description", label: "Description", cols: 30} }
		],
		modules: [
		   {
		      "name": "New Element",
		      "container": {"xtype": "jsBox.Container"}
		   },
			{
				"name": "World",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/world-transp.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}}
 				]
				}
			},
			{
				"name": "Egg",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/egg-transp-70.png",

 				"terminals": [
 					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 12, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}},
					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 12, "bottom": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}}
 				],
				}
			},
			{
				"name": "Burner",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/burner-transp-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}},
					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "bottom": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}}
 				]
				}
			},
			{
				"name": "Power Plant",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/power-plant-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}},
					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "bottom": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}}
 				]
				}
			},
			{
				"name": "Water",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/water-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 40, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}},
					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 40, "bottom": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}}
 				]
				}
			},
			{
				"name": "Pot",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/pot-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}},
					{"wireConfig": {"drawingMethod": "arrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "bottom": -25 },"ddConfig": {"type": "input","allowedTypes": ["input"]}}
 				]
				}
			},
		]
	},
   
   /**
    * @method init
    * @static
    */
   init: function() {
   	this.editor = new jsBox.WiringEditor(this.language);
   	this.editor.onHelp();
   },
   
   /**
    * Execute the module in the "ExecutionFrame" virtual machine
    * @method run
    * @static
    */
   run: function() {
      var ef = new ExecutionFrame( this.editor.getValue() );
      ef.run();
   }
   
};


/**
 * The wiring editor is overriden to add a button "RUN" to the control bar
 */
jsBox.WiringEditor = function(options) {
   jsBox.WiringEditor.superclass.constructor.call(this, options);
};

YAHOO.lang.extend(jsBox.WiringEditor, WireIt.WiringEditor, {
   
   /**
    * Update the module list right after loading the SMD
    */
   onSMDsuccess: function() {
      
      this.service.listWirings({language: this.options.languageName},{
   			success: function(result) {
   				this.pipes = result.result;
   				this.pipesByName = {};
   				this.renderLoadPanel();
               this.updateLoadPanelList();
               //this.loadPanel.show();
   			},
   			scope: this
   	});
   },
   
   
   /**
    * Add the "run" button
    */
   renderButtons: function() {
      jsBox.WiringEditor.superclass.renderButtons.call(this);
      var toolbar = YAHOO.util.Dom.get('toolbar');
      var runButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
      runButton.on("click", jsBox.run, jsBox, true);
   },
   
   /**
    * Overwrite updateLoadPanelList to add Composed modules to the module list
    */
   updateLoadPanelList: function() { 
      try {
       var left = YAHOO.util.Dom.get('left');
       var list = WireIt.cn("ul");
       if(YAHOO.lang.isArray(this.pipes)) {
          for(var i = 0 ; i < this.pipes.length ; i++) {
             var module = this.pipes[i];

             this.pipesByName[module.name] = module;
             
             // Add the module to the list
             var div = WireIt.cn('div', {className: "WiringEditor-module ComposedModule"});
             div.appendChild( WireIt.cn('span', null, null, module.name) );
             var ddProxy = new WireIt.ModuleProxy(div, this);
             ddProxy._module = {
                name: module.name,
                container: {
                   "xtype": "jsBox.ComposedContainer",
                   "title": module.name
                }
             };
             left.appendChild(div);
               

             var li = WireIt.cn('li',null,{cursor: 'pointer'},module.name);
             YAHOO.util.Event.addListener(li, 'click', function(e,args) {
                try {
                   this.loadPipe(YAHOO.util.Event.getTarget(e).innerHTML);
                }
                catch(ex) {
                   console.log(ex);
                }
             }, this, true);
             list.appendChild(li);
          }
       }
       var panelBody = YAHOO.util.Dom.get('loadPanelBody');
       panelBody.innerHTML = "";
       panelBody.appendChild(list);
       
      }catch(ex){console.log(ex);}
    }
   
});



/**
 * Container class used by the "jsBox" module (automatically sets terminals depending on the number of arguments)
 * @class Container
 * @namespace jsBox
 * @constructor
 */
jsBox.Container = function(options, layer) {
         
   jsBox.Container.superclass.constructor.call(this, options, layer);


   this.buildTextArea(options.codeText || "function(e){} Label me here!");
   /**this.buildTextArea(options.codeText || "Label Me!"); **/
   
   this.createTerminals();
   
   // Reposition the terminals when the jsBox is being resized
   this.ddResize.eventResize.subscribe(function(e, args) {
      this.positionTerminals();
      YAHOO.util.Dom.setStyle(this.textarea, "height", (args[0][1]-70)+"px");
   }, this, true);
};

YAHOO.extend(jsBox.Container, WireIt.Container, {
   
   /**
    * Create the textarea for the javascript code
    * @method buildTextArea
    * @param {String} codeText
    */
   buildTextArea: function(codeText) {

      this.textarea = WireIt.cn('textarea', null, {width: "90%", height: "70px", border: "0", padding: "5px"}, codeText);
      this.setBody(this.textarea);

      YAHOO.util.Event.addListener(this.textarea, 'change', this.createTerminals, this, true);
      
   },
   
   /**
    * Create (and re-create) the terminals with this.nParams input terminals
    * @method createTerminals
    */
   createTerminals: function() {
      
      // Output Terminal
      if(!this.outputTerminal) {
   	   this.outputTerminal = this.addTerminal({xtype: "WireIt.util.TerminalOutput", "name": "out"});      
         this.outputTerminal.jsBox = this;
      }
      
      // Input terminals :
      var match = (this.textarea.value).match((/^[ ]*function[ ]*\((.*)\)[ ]*\{/));
   	var sParamList = match ? match[1] : "";
      var params = sParamList.split(',');
      var nParams = (sParamList=="") ? 0 : params.length;
      
      var curTerminalN = this.nParams || 0;
      if(curTerminalN < nParams) {
         // add terminals
         for(var i = curTerminalN ; i < nParams ; i++) {
            var term = this.addTerminal({xtype: "WireIt.util.TerminalInput", "name": "param"+i});
            //term.jsBox = this;
            WireIt.sn(term.el, null, {position: "absolute", top: "-15px"});
         }
      }
      else if (curTerminalN > nParams) {
         // remove terminals
         for(var i = this.terminals.length-(curTerminalN-nParams) ; i < this.terminals.length ; i++) {
         	this.terminals[i].remove();
         	this.terminals[i] = null;
         }
         this.terminals = WireIt.compact(this.terminals);
      }
      this.nParams = nParams;
   
      this.positionTerminals();

      // Declare the new terminals to the drag'n drop handler (so the wires are moved around with the container)
      this.dd.setTerminals(this.terminals);
   },
   
   /**
    * Reposition the terminals
    * @method positionTerminals
    */
   positionTerminals: function() {
      var width = WireIt.getIntStyle(this.el, "width");

      var inputsIntervall = Math.floor(width/(this.nParams+1));

      for(var i = 1 ; i < this.terminals.length ; i++) {
         var term = this.terminals[i];
         YAHOO.util.Dom.setStyle(term.el, "left", (inputsIntervall*(i))-15+"px" );
         for(var j = 0 ; j < term.wires.length ; j++) {
            term.wires[j].redraw();
         }
      }
      
      // Output terminal
      WireIt.sn(this.outputTerminal.el, null, {position: "absolute", bottom: "-15px", left: (Math.floor(width/2)-15)+"px"});
      for(var j = 0 ; j < this.outputTerminal.wires.length ; j++) {
         this.outputTerminal.wires[j].redraw();
      }
   },
   
   /**
    * Extend the getConfig to add the "codeText" property
    * @method getConfig
    */
   getConfig: function() {
      var obj = jsBox.Container.superclass.getConfig.call(this);
      obj.codeText = this.textarea.value;
      return obj;
   }
   
});








/**
 * ComposedContainer is a class for Container representing Pipes.
 * It automatically generates the inputEx Form from the input Params.
 * @class ComposedContainer
 * @extends WireIt.inputExContainer
 * @constructor
 */
jsBox.ComposedContainer = function(options, layer) {
   
   if(!options.fields) {
      
      options.fields = [];
      options.terminals = [];
   
      var pipe = jsBox.editor.getPipeByName(options.title);
      for(var i = 0 ; i < pipe.modules.length ; i++) {
         var m = pipe.modules[i];
         if( m.name == "input") {
            m.value.input.inputParams.wirable = true;
            options.fields.push(m.value.input);
         }
         else if(m.name == "output") {
            options.terminals.push({
               name: m.value.name,
               "direction": [0,1], 
               "offsetPosition": {"left": options.terminals.length*40, "bottom": -15}, 
               "ddConfig": {
                   "type": "output",
                   "allowedTypes": ["input"]
                }
            });
         }
      }
   }
   
   jsBox.ComposedContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.extend(jsBox.ComposedContainer, WireIt.FormContainer, {
});