// Global Variables:
var Globals = {
  world: {},
  states: [],
  frame: 0,
  delay: 10,
  anim: {},
  running: false,
  initStates: [],
  finalStates: [],
  totalFrames: 4000,
  canvasId: "viewport",
  didMove: false,
  selectedBody: false,
  globAccel: false,
};

function onPropertyChanged(property, value){
	console.log(property + "," + value);
	
	var world = Globals.world;
	var body = Globals.selectedBody;
	var initStates = Globals.initStates;

  var floatVal = parseFloat(value);
  /* Skip switch statement of a string was inputted for any
     input field other than name */
  switch(property) {
    case 'posx':
      body.state.pos.x = floatVal;
      initStates[world.getBodies().indexOf(body)].pos.x = body.state.pos.x;
      break;
    case 'posy':
      body.state.pos.y = floatVal;
      initStates[world.getBodies().indexOf(body)].pos.y = body.state.pos.y;
      break;
    case 'velx':
      body.state.vel.x = floatVal;
      initStates[world.getBodies().indexOf(body)].vel.x = body.state.vel.x;
      break;
    case 'vely':
      body.state.vel.y = floatVal;
      initStates[world.getBodies().indexOf(body)].vel.y = body.state.vel.y;
      break;
    case 'accx':
      body.state.acc.x = floatVal;
      initStates[world.getBodies().indexOf(body)].acc.x = body.state.acc.x;
      break;
    case 'accy':
      body.state.acc.y = floatVal;
      initStates[world.getBodies().indexOf(body)].acc.y = body.state.acc.y;
      break;
    case 'mass':
      body.mass = floatVal;
      initStates[world.getBodies().indexOf(body)].mass = body.mass;
      break;
    case 'nickname':
      body.nickname = value;
      initStates[world.getBodies().indexOf(body)].nickname = body.nickname;
      break;
    case 'glob-xaccel':
      Globals.globAccel._acc.x = floatVal;
      break;
    case 'glob-yaccel':
      Globals.globAccel._acc.y = floatVal;
      break;
  }

	simulate();
	drawSimulator(0);
}

/* Scrubs to selected frame */
function onRangeUpdate(){
  Globals.frame = $("#simulatorFrameRange").val();
  drawSimulator(Globals.frame);
}


/* Toggles the state of the simulator between running and paused */
function toggleSimulator() {
  var span = $("#playpause").children()[0];
  Globals.running = !Globals.running;
  if (Globals.running) {
    Globals.anim = setInterval(function() {
      drawLoop()
    }, Globals.delay);

    document.getElementById("play-pause-icon").innerHTML ="pause";
   // span.className = "glyphicon glyphicon-pause";
  } else {
    clearInterval(Globals.anim);
    document.getElementById("play-pause-icon").innerHTML ="play_arrow";
  //  span.className = "glyphicon glyphicon-play";
  }
}


function drawLoop() {
  if (Globals.frame >= Globals.totalFrames) {
    Globals.frame = 0;
  }

  $("#simulatorFrameRange").val(Globals.frame)
  drawSimulator(Globals.frame);
  Globals.frame++;
}


/* Shows elements values in html elements */
function displayElementValues(bod) {
  if (bod) {
    $('#properties-position-x').val(bod.state.pos.x);
    $('#properties-position-y').val(bod.state.pos.y);
    $('#properties-velocity-x').val(bod.state.vel.x);
    $('#properties-velocity-y').val(bod.state.vel.y);
    $('#properties-acceleration-x').val(bod.state.acc.x);
    $('#properties-acceleration-y').val(bod.state.acc.y);
    $('#properties-mass').val(bod.mass);
    $('#properties-nickname').val(bod.nickname);
    if (bod.nickname) {
      $('#properties-nickname-title').text(bod.nickname + " ");
    } else {
      $('#properties-nickname-title').text("");
    }
  } else {
    $('#properties-position-x').val("");
    $('#properties-position-y').val("");
    $('#properties-velocity-x').val("");
    $('#properties-velocity-y').val("");
    $('#properties-acceleration-x').val("");
    $('#properties-acceleration-y').val("");
    $('#properties-mass').val("");
    $('#properties-name').val("");
    $('#properties-nickname-title').text("");
  }
}


function toggleGlobalProp() {
  var propWin = $("#global-properties")[0].classList;
  if (propWin.contains("hide")) {
    propWin.remove("hide");
  } else {
    propWin.add("hide");
  }
}


function renderWorld() {
  Globals.world.render();
  var propWin = $("#properties")[0].classList;
  if (Globals.selectedBody) {
    propWin.remove("hide");
  } else if (!propWin.contains("hide")) {
    propWin.add("hide");
  }
}


/* Draws highlight box around selected element */
function highlightSelection(body) {
  var img = body.view;
  var halfw = img["width"] / 2;
  var halfh = img["height"] / 2;
  var canvas = Globals.world.renderer();

  canvas.ctx.strokeStyle = '#ff0000';
  canvas.ctx.lineWidth = 2;

  renderWorld();
  var loc = body.state.pos;
  canvas.ctx.strokeRect(loc.x-halfw, loc.y-halfh, halfw*2, halfh*2);						

  /*	
  canvas.ctx.translate((loc.x), (loc.y));
  canvas.ctx.rotate(45 * Math.PI/180);
  canvas.ctx.strokeRect(loc.x, loc.y, halfw*2, halfh*2);				
  canvas.ctx.rotate(-45 * Math.PI/180);
  canvas.ctx.translate(-(loc.x), -(loc.y));

  canvas.ctx.strokeStyle = '#00ff00';		
  canvas.ctx.rotate(-45 * Math.PI/180);
  canvas.ctx.strokeRect(0, 0	, halfw*2, halfh*2);				
  canvas.ctx.rotate(45 * Math.PI/180);
  */
}


/* Draw the simulator at frame n */
function drawSimulator(n) {
	var world = Globals.world;
	var selectedBody = Globals.selectedBody;
	
	for (var i = 0; i < Globals.world.getBodies().length; i++) {
		world.getBodies()[i].state = Globals.states[i][n];
	}

  renderWorld();
  displayElementValues(selectedBody);
  if (selectedBody) {
    highlightSelection(selectedBody);
  }
}


function cloneState(state) {
  var acc = state.acc.clone();
  var vel = state.vel.clone();
  var pos = state.pos.clone();
  var ang = {"acc": state.angular.acc, "vel": state.angular.vel, "pos": state.angular.pos};
  var clone = {"acc": acc, "vel": vel, "pos": pos, "angular": ang};
  return clone;
}


function simulate() {
  var i = 0;
  var j = 0;

  Globals.frame = 0;
  if (Globals.running) {
    toggleSimulator();
  }
  $("#simulatorFrameRange").val(0); // Reset range

  Globals.states = [];	// Clear states global
  //Globals.world._animTime = undefined;
  //Globals.world._lastTime = undefined; // Unnecessary?
  Globals.world._time = 0;

  var old = {
    pos: new Physics.vector(),
    vel: new Physics.vector(),
    acc: new Physics.vector(),
    angular: { pos: 0.0, vel: 0.0, acc: 0.0}
  };

  
  // Restore objects to their initial state
  for (i = 0; i < Globals.world.getBodies().length; i++) {
    Globals.world.getBodies()[i].state = cloneState(Globals.initStates[i]);
    Globals.world.getBodies()[i].state["old"] = cloneState(old);
    Globals.world.getBodies()[i]._started = undefined;
    Globals.states[i] = [];
  }
  
  //Globals.world.step();	// Calling step once required for initialization?
  
  // For each frame
  for (i = 0; i < Globals.totalFrames; i++) {
    // For each body in the simulation
    for (j = 0; j < Globals.world.getBodies().length; j++) {
      // Clone the state information for the current body
      var curState = Globals.world.getBodies()[j].state;
      var saveState = cloneState(curState);

      // Save state information and advance the simulator
      if (i != 0) saveState["old"] = Globals.states[j][i-1]; {
        Globals.states[j].push(saveState);
      }
    }
    Globals.world.step();
  }
}


$(".draggable").draggable({
  cursor: 'move',
  containment: $(Globals.canvasId),
  scroll: false,
  stop: handleDragStop,
  helper: 'clone'
});

function handleDragStop(event, ui) {
  var type = ui.helper[0].getAttribute("component");

  // Left and top of helper img
  var left = ui.offset.left;
  var top = ui.offset.top;

  var width = event.target.width;
  var height = event.target.height;

  var cx = left + width / 2;
  var cy = top + height / 2;

  // Left and top of canvas window
  var vleft = $("#" + Globals.canvasId).position().left;
  var vtop = $("#" + Globals.canvasId).position().top;

  var data = {
    'type': type,
    'x': cx-vleft,
    'y': cy-vtop
  };

  Globals.world.emit('addComponent', data);
}

Physics.integrator('my-integrator', function( parent ){

    return {

        integrateVelocities: function( bodies, dt ){
			for ( var i = 0, l = bodies.length; i < l; ++i ){

                var body = bodies[i];
                var state = body.state;	
				state.old = cloneState(body.state);
				state.vel.x += state.acc.x * dt;
				state.vel.y += state.acc.y * dt;
				state.angular.vel += state.angular.acc;
			}
            // update the velocities of all bodies according to timestep dt
            // store previous velocities in .state.old.vel
            // and .state.old.angular.vel
        },

        integratePositions: function( bodies, dt ){
			for ( var i = 0, l = bodies.length; i < l; ++i ){
                var body = bodies[ i ];
                var state = body.state;
				var temp = cloneState(body.state);
				state.pos.x += state.old.vel.x * dt + state.acc.x * 0.5 * dt*dt;
				state.pos.y += state.old.vel.y * dt + state.acc.y * 0.5 * dt*dt;
				state.angular.pos += state.angular.vel;
				state.old = temp;
				state.acc.zero();
				state.angular.acc = 0.0;
			}
            // update the positions of all bodies according to timestep dt
            // store the previous positions in .state.old.pos
            // and .state.old.angular.pos
            // also set the accelerations to zero
        }
    };
});

$(document).ready(function() {
  Kinematics1D.initModule();
  
  // Prepare event handling
  $('#properties-position-x').on("change", function(){ onPropertyChanged('posx', $('#properties-position-x').val()); }); 
  $('#properties-position-y').on("change", function(){ onPropertyChanged('posy', $('#properties-position-y').val()); }); 
  $('#properties-velocity-x').on("change", function(){ onPropertyChanged('velx', $('#properties-velocity-x').val()); }); 
  $('#properties-velocity-y').on("change", function(){ onPropertyChanged('vely', $('#properties-velocity-y').val()); }); 
  $('#properties-acceleration-x').on("change", function(){ onPropertyChanged('accx', $('#properties-acceleration-x').val()); }); 
  $('#properties-acceleration-y').on("change", function(){ onPropertyChanged('accy', $('#properties-acceleration-y').val()); }); 
  $('#properties-mass').on("change", function(){ onPropertyChanged('mass', $('#properties-mass').val()); }); 
  $('#properties-nickname').on("change", function(){ onPropertyChanged('nickname', $('#properties-nickname').val()); }); 

  $('#glob-xaccel').val(Globals.globAccel._acc.x);
  $('#glob-yaccel').val(Globals.globAccel._acc.y);
  
  $('#glob-xaccel').on("change", function(){ onPropertyChanged('glob-xaccel', $('#glob-xaccel').val()); }); 
  $('#glob-yaccel').on("change", function(){ onPropertyChanged('glob-yaccel', $('#glob-yaccel').val()); }); 
});
