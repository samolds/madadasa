/*
  utility.js -- 
  This file contains utility functions for mathematics and physics operations
*/

// Gets the Euclidean distance between the specified points
function distance(x1,y1, x2,y2){
  var dx = x2-x1;
  var dy = y2-y1;
  with(Math){ return sqrt(pow(dx,2)+pow(dy,2)); }
}

// Returns a state of zero values
function defaultState(){
  var dstate = { 
    pos: new Physics.vector(),
    vel: new Physics.vector(),
    acc: new Physics.vector(),
    angular: { pos: 0.0, vel: 0.0, acc: 0.0}
  };
  return dstate;
}

// Returns a clone of the provided state's elements
function cloneState(state){
  var acc = state.acc.clone(); var vel = state.vel.clone(); var pos = state.pos.clone();
  var ang = {"acc": state.angular.acc, "vel": state.angular.vel, "pos": state.angular.pos};
  return {"acc": acc, "vel": vel, "pos": pos, "angular": ang};
}

//Returns the index of the specified body within the world
function bIndex(body){ return Globals.world.getBodies().indexOf(body); }

// Returns the constants associated with the specified body
function body2Constant(body){
  var index = bIndex(body);
  return Globals.bodyConstants[index];
}