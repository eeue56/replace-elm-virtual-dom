// make is a function that takes an instance of the
// elm runtime
// returns an object where:
//      keys are names to be accessed in pure Elm
//      values are either functions or values
var make = function make(elm) {
    // If Native isn't already bound on elm, bind it!
    elm.Native = elm.Native || {};
    // then the same for our module
    elm.Native.FakeVirtualDom = elm.Native.FakeVirtualDom || {};

    // `values` is where the object returned by make ends up internally
    // return if it's already set, since you only want one definition of
    // values for speed reasons
    //if (elm.Native.FakeVirtualDom.values) return elm.Native.FakeVirtualDom.values;


    var createNode = function(name){
        return document.createElement(name);
    };

    var render = function(model){
        console.log(model);
        document.body.appendChild(model);

        return model;
    };

    var update = function(node, curr, next){
        return node;
    };

    var toHtml = function(node){
        return node;
    };

    function initGraphics(main)
        {

            var signalGraph = main;

            // make sure the signal graph is actually a signal & extract the visual model
            if (!('notify' in signalGraph))
            {
                signalGraph = Elm.Signal.make(elm).constant(signalGraph);
            }
            var initialScene = signalGraph.value;

            // Figure out what the render functions should be
            var render;
            var update;
            if (initialScene.ctor === 'Element_elm_builtin')
            {
                var Element = Elm.Native.Graphics.Element.make(elm);
                render = Element.render;
                update = Element.updateAndReplace;
            }
            else
            {
                var VirtualDom = Elm.Native.VirtualDom.make(elm);
                render = VirtualDom.render;
                update = VirtualDom.updateAndReplace;
            }

            // Add the initialScene to the DOM
            var container = elm.node;
            var node = render(initialScene);
            while (container.firstChild)
            {
                container.removeChild(container.firstChild);
            }
            container.appendChild(node);

            var _requestAnimationFrame =
                typeof requestAnimationFrame !== 'undefined'
                    ? requestAnimationFrame
                    : function(cb) { setTimeout(cb, 1000 / 60); }
                    ;

            // domUpdate is called whenever the main Signal changes.
            //
            // domUpdate and drawCallback implement a small state machine in order
            // to schedule only 1 draw per animation frame. This enforces that
            // once draw has been called, it will not be called again until the
            // next frame.
            //
            // drawCallback is scheduled whenever
            // 1. The state transitions from PENDING_REQUEST to EXTRA_REQUEST, or
            // 2. The state transitions from NO_REQUEST to PENDING_REQUEST
            //
            // Invariants:
            // 1. In the NO_REQUEST state, there is never a scheduled drawCallback.
            // 2. In the PENDING_REQUEST and EXTRA_REQUEST states, there is always exactly 1
            //    scheduled drawCallback.
            var NO_REQUEST = 0;
            var PENDING_REQUEST = 1;
            var EXTRA_REQUEST = 2;
            var state = NO_REQUEST;
            var savedScene = initialScene;
            var scheduledScene = initialScene;

            function domUpdate(newScene)
            {
                scheduledScene = newScene;

                switch (state)
                {
                    case NO_REQUEST:
                        _requestAnimationFrame(drawCallback);
                        state = PENDING_REQUEST;
                        return;
                    case PENDING_REQUEST:
                        state = PENDING_REQUEST;
                        return;
                    case EXTRA_REQUEST:
                        state = PENDING_REQUEST;
                        return;
                }
            }

            function drawCallback()
            {
                switch (state)
                {
                    case NO_REQUEST:
                        // This state should not be possible. How can there be no
                        // request, yet somehow we are actively fulfilling a
                        // request?
                        throw new Error(
                            'Unexpected draw callback.\n' +
                            'Please report this to <https://github.com/elm-lang/core/issues>.'
                        );

                    case PENDING_REQUEST:
                        // At this point, we do not *know* that another frame is
                        // needed, but we make an extra request to rAF just in
                        // case. It's possible to drop a frame if rAF is called
                        // too late, so we just do it preemptively.
                        _requestAnimationFrame(drawCallback);
                        state = EXTRA_REQUEST;

                        // There's also stuff we definitely need to draw.
                        draw();
                        return;

                    case EXTRA_REQUEST:
                        // Turns out the extra request was not needed, so we will
                        // stop calling rAF. No reason to call it all the time if
                        // no one needs it.
                        state = NO_REQUEST;
                        return;
                }
            }

            function draw()
            {
                update(elm.node.firstChild, savedScene, scheduledScene);
                if (elm.Native.Window)
                {
                    elm.Native.Window.values.resizeIfNeeded();
                }
                savedScene = scheduledScene;
            }

            var renderer = Elm.Native.Signal.make(elm).output('main', domUpdate, signalGraph);

            // must check for resize after 'renderer' is created so
            // that changes show up.
            if (elm.Native.Window)
            {
                elm.Native.Window.values.resizeIfNeeded();
            }

            return renderer;
        }

    // return the object of your module's stuff!
    return {
        createNode: createNode,
        render: render,
        update: update,
        toHtml: toHtml,
        initGraphics : initGraphics
    };
};

// setup code for FakeVirtualDom
// Elm.Native.FakeVirtualDom should be an object with
// a property `make` which is specified above
Elm.Native.FakeVirtualDom = {};
Elm.Native.FakeVirtualDom.make = make;
