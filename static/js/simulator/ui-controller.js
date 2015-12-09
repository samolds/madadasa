/*
  ui-controller.js --
  This file contains functions and event handlers for interacting with UI elements.
*/

// Defines drag event for draggable-classed components
$(".draggable").draggable({
	  cursor: 'move',
	  containment: $(Globals.canvasId),
	  scroll: false,
	  stop: handleDragStop,
	  helper: 'clone',
    appendTo: 'body'
});

// Event fired when user is done dragging component from toolbox
function handleDragStop(event, ui){
  if(!Globals.canAdd()) return;
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

  var data = { 'type': type, 'x': cx-vleft, 'y': cy-vtop};

  Globals.world.emit('addComponent', data);
}

// Scrubs to selected frame
function onRangeUpdate(){
  // Prevent use of timeline until simulation is complete
  if(!Globals.timelineReady){
    $("#simulatorFrameRange").val(0)
    return;
  }
  
  // Set new frame and draw it
  Globals.frame = parseInt($("#simulatorFrameRange").val());
  // Update keyframe variable if the selected frame is also a keyframe
  if(Globals.useKeyframes)
    Globals.keyframe = ($.inArray(parseInt(Globals.frame), Globals.keyframes) != -1)? Globals.frame: false;   
  
  // Highlight mini canvas
  if(Globals.keyframe === 0 || Globals.keyframe)
  {
    var frame = Globals.keyframe > 0? 1: 0; //TODO map frame to appropriate index
    $("#" + "keyframe-" + frame).attr("style","border:4px solid #0000cc");
  }
  else
  {
    $("#" + "keyframe-0").attr("style","");
    $("#" + "keyframe-1").attr("style","");
  }
  
  drawMaster();  
}

// Toggles the state of the simulator between running and paused
function toggleSimulator(){
  if(!Globals.timelineReady) return;
  var span = $("#playpause").children()[0];
  Globals.running = !Globals.running;
  
  // Set frame delay based on total number of delays.
  // TODO: Consider having the user specify this via global options
  if(Globals.totalFrames <= 20) Globals.delay = 25;
  else if(Globals.totalFrames <= 50) Globals.delay = 25;
  else if(Globals.totalFrames <= 1000) Globals.delay = 25;
  else Globals.delay = 25;
  
  if (Globals.running) {
    Globals.anim = setInterval(function() { drawLoop() }, Globals.delay);
    document.getElementById("play-pause-icon").innerHTML ="pause";   
    Globals.selectedKeyframe = false;
  } 
  else {
    clearInterval(Globals.anim);
    document.getElementById("play-pause-icon").innerHTML ="play_arrow";
    if(Globals.frame == 0){
      $("#keyframe-0").attr("style","border:4px solid #0000cc");
    }
    if(Globals.frame == Globals.totalFrames){
      $("#keyframe-1").attr("style","border:4px solid #0000cc");
    }
  }
}

// Handler for clicking a mini canvas and setting state to that keyframe
function selectKeyframe(event){
	var frame = event.target.id.split("-")[1];
	Globals.keyframe = parseInt(frame);
  
  // Do highlight
  $("#" + "keyframe-0").attr("style","");
  $("#" + "keyframe-1").attr("style","");
  $("#" + event.target.id).attr("style","border:4px solid #0000cc");
  
  // Draw master will set state appropriately and display it
	drawMaster();
}

// TODO: Not being called anymore?
function toggleGlobalProp(){
  var propWin = $("#global-properties")[0].classList;
  if (propWin.contains("hide")) {
    propWin.remove("hide");    
  } else {
    propWin.add("hide");
  }
}

// Wrapper for updating properties followed by immediate resimulate and redraw
function updatePropertyRedraw(property, value){
  onPropertyChanged(property, value, true);
  drawMaster();
}