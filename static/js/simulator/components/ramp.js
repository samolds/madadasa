/*
  ramp.js --
  This file defines functions related to 'ramp' physics components
*/

// Add a mass component to current world using the specified coordinates
function addRamp(data){
  var world = Globals.world;
  var bodyConstants = Globals.bodyConstants;
  var variableMap = Globals.variableMap;
  
  // Add the PhysicsJS body
  var component = Physics.body('convex-polygon', {
            restitution: 0.0,
            treatment: 'static',
            x: data.x,
            y: data.y,
            styles: {
              fillStyle: '#4d4d4d',
            },
            vertices: [
              { x: 0, y: 0 },
              { x: 100, y: 0 },
              { x: 0, y: -60 }
            ]
          });
          
  // Upon being added, a map of variables associated with this mass is added to the globals
  addToVariableMap({
      posx: data.x, 
      posy: data.y,
      velx: 0,
      vely: 0,
      accx: 0,
      accy: 0
    }
  );
                  
  // Assign constants
  bodyConstants[bodyConstants.length-1].width = 100;
  bodyConstants[bodyConstants.length-1].height = -60;
  bodyConstants[bodyConstants.length-1].angle = -31;
  
  // Add the component to the world and update all keyframes
  world.add(component);    
  updateKeyframes([component]);
  
  return component;
}
