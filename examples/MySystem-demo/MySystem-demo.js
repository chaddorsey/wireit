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
		      "name": "Energy Form Label",
		      "container": {"xtype": "jsBox.Container"}
		   },
			{
		      "name": "Energy Transfer Label",
		      "container": {"xtype": "jsBox.Container"}
		   },
			{
				"name": "World",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/world-transp.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input", "output"]}}
 				]
				}
			},
			{
				"name": "Egg",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/egg-transp-70.png",

 				"terminals": [
 					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 12, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input", "output"]}},
					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [0,1], "offsetPosition": {"left": 12, "bottom": -25 },"ddConfig": {"type": "output","allowedTypes": ["input", "output"]}}
 				],
				}
			},
			{
				"name": "Burner",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/burner-transp-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input", "output"]}},
					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [0,1], "offsetPosition": {"left": 20, "bottom": -25 },"ddConfig": {"type": "output","allowedTypes": ["input", "output"]}}
 				]
				}
			},
			{
				"name": "Power Plant",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/power-plant-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input", "output"]}},
					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [0,1], "offsetPosition": {"left": 20, "bottom": -25 },"ddConfig": {"type": "output","allowedTypes": ["input", "output"]}}
 				]
				}
			},
			{
				"name": "Water",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/water-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 40, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input", "output"]}},
					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [0,1], "offsetPosition": {"left": 40, "bottom": -25 },"ddConfig": {"type": "output","allowedTypes": ["input", "output"]}}
 				]
				}
			},
			{
				"name": "Pot",

				"container" : {
					"xtype":"WireIt.ImageContainer", 
					"image": "../MySystem-demo/images/pot-70.png",
 				"terminals": [
 					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [1,0], "offsetPosition": {"left": 20, "top": -25 },"ddConfig": {"type": "input","allowedTypes": ["input","output"]}},
					{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "World", "direction": [0,1], "offsetPosition": {"left": 20, "bottom": -25 },"ddConfig": {"type": "output","allowedTypes": ["input", "output"]}}
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


   this.buildTextArea(options.codeText || "Label me!");
   /**this.buildTextArea(options.codeText || "Label Me!"); **/

};

YAHOO.extend(jsBox.Container, WireIt.Container, {
   
   /**
    * Create the textarea for the javascript code
    * @method buildTextArea
    * @param {String} codeText
    */
   buildTextArea: function(codeText) {

      this.textarea = WireIt.cn('textarea', null, {width: "70%", height: "20px", border: "0", padding: "5px"}, codeText);
      this.setBody(this.textarea);

      YAHOO.util.Event.addListener(this.textarea, 'change', this.createTerminals, this, true);
      
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