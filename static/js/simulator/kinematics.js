function Kinematics1DModule() {
  var initWorld = function initWorld() {
    return Physics(function (world) {
      var canvasId = "viewport";
      var canvasEl = document.getElementById(canvasId);
      world.timestep(3); // TODO: should base timestep on dt

      // bounds of the window
      var viewportBounds = Physics.aabb(0, 0, canvasEl.clientWidth, canvasEl.clientHeight);
      var edgeBounce;
      var renderer;

      // create a renderer
      renderer = Physics.renderer('canvas', {el: canvasId});

      // add the renderer
      world.add(renderer);

      world.on('addComponent', function(data) {
        var component;
        var img = document.createElement("img");
        img.setAttribute("src", "/static/img/logo/logo.png");
        switch(data.type) {
          case "kinematics1D-spring":
            img.setAttribute("width", "70");
            img.setAttribute("height", "70");
            component = Physics.body('circle', {
              x: data.x,
              y: data.y,
              radius: 35,
              mass: 3,
              view: img,
              styles: {
                fillStyle: '#6c71c4',
                angleIndicator: '#3b3e6b'
              }
            });
            break;
          case "kinematics1D-mass":
            img.setAttribute("width", "40");
            img.setAttribute("height", "40");
            component = Physics.body('circle', {
              x: data.x,
              y: data.y,
              radius: 20,
              mass: 3,
              view: img,
              styles: {
                fillStyle: '#716cc4',
                angleIndicator: '#3b3e6b'
              }
            });
            break;
        }
        world.add(component);
        Globals.initStates.push(cloneState(component.state));

        // Resimulate using newly added component
        simulate();
        drawSimulator(0);
      });

      // constrain objects to these bounds
      edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds,
        restitution: 0.99,
        cof: 0.8
      });

      // resize events
      window.addEventListener('resize', function () {
        // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
        viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);

        // update the boundaries
        edgeBounce.setAABB(viewportBounds);
        drawSimulator(Globals.frame);
      }, true);

      // add things to the world
      world.add([
        Physics.behavior('interactive', {el: renderer.container}),
        Physics.behavior('constant-acceleration'),
        Physics.behavior('body-impulse-response'),
        Physics.behavior('body-collision-detection'),
        Physics.behavior('sweep-prune'),
        edgeBounce
      ]);
    });
  } // end initWorld

  var initModule = function initModule() {
    Globals.world = initWorld();
    simulate();
    drawSimulator(0);
  }

  return {
    initWorld,
    initModule
  };
}

var Kinematics1D = Kinematics1DModule();
