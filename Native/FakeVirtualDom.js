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

    // return the object of your module's stuff!
    return {
        createNode: createNode,
        render: render,
        update: update,
        toHtml: toHtml
    };
};

// setup code for FakeVirtualDom
// Elm.Native.FakeVirtualDom should be an object with
// a property `make` which is specified above
Elm.Native.FakeVirtualDom = {};
Elm.Native.FakeVirtualDom.make = make;
