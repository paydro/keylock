// Creates a fake event object that is read by Keylock. It will default
// attributes required by Keylock.
//
// Simulate pressing the "a" key example:
//
//   var event = fakeEvent({keyCode: 65});
//   event.keyCode; // 65
//   event.altKey; // false
//   event.ctrlKey; // false
//
var fakeEvent = function(options){
    var e = $.Event("keydown");
    var attrs = {
        keyCode: null,
        metaKey: false,
        ctrlKey: false,
        altKey: false,
        shiftKey: false
    };
    return $.extend(e, options);
};

$(function(){

    module("Keylock");

    test("lowercase letter binding", function(){
        keylock = new Keylock();
        keylock.define({
            a: function(){ return "a"; }
        });

        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), "a");
    });

    test("uppercase letter binding", function(){
        keylock = new Keylock();
        keylock.define({
            A: function(){ return "A"; }
        });

        equals(keylock.trigger(fakeEvent({
            keyCode: 65,
            shiftKey: true
        })), "A");
    });

    test("ctrl + command + letter binding does not work", function(){
        ok("<C-D-a> does not work due to the way browsers set both" +
           "the ctrlKey and metaKey flags to true when CTRL is pressed");
    });

    test("ctrl key + letter binding", function(){
        keylock = new Keylock();
        keylock.define({
            "<C-a>": function() { return "CTRL + a"; }
        });


        // NOTE: Hitting CTRL in the browser for keydown events will
        // enable both CTRL and META flags in the event.
        equals(
            keylock.trigger(fakeEvent({
            keyCode: 65,
            ctrlKey: true,
            metaKey: true
        })),
        "CTRL + a"
        );
    });

    test("meta key + letter binding", function(){
        keylock = new Keylock();
        keylock.define({
            "<D-a>": function() { return "COMMAND + a"; }
        });

        equals(
            keylock.trigger(fakeEvent({
            keyCode: 65,
            metaKey: true
        })),
        "COMMAND + a"
        );
    });

    test("alt key + letter binding", function(){
        keylock = new Keylock();
        keylock.define({
            "<M-a>": function() { return "ALT + a"; }
        });

        equals(
            keylock.trigger(fakeEvent({
            keyCode: 65,
            altKey: true
        })),
        "ALT + a"
        );
    });

    test("alt + ctrl + letter binding", function(){
        keylock = new Keylock();
        keylock.define({
            "<M-C-a>": function() { return "ALT + CTRL + a"; }
        });

        equals(
            keylock.trigger(fakeEvent({
            keyCode: 65,
            altKey: true,
            ctrlKey: true,
            metaKey: true
        })),
        "ALT + CTRL + a"
        );
    });

    test("alt + command + letter binding", function(){
        keylock = new Keylock();
        keylock.define({
            "<M-D-a>": function() { return "ALT + COMMAND + a"; }
        });

        equals(
            keylock.trigger(fakeEvent({
            keyCode: 65,
            altKey: true,
            metaKey: true
        })),
        "ALT + COMMAND + a"
        );
    });

    test("digits key binding", function(){
        var cbFunc = function(returnVal){
            return( function(e){ return(returnVal); } );
        };
        keylock = new Keylock();
        var def = {}
        for(var i = 0; i < 10; i++){
            def[i + ""] = cbFunc(i);
        }
        keylock.define(def);
        keylock.trigger(fakeEvent({keyCode: 48}));
        for(i = 0; i < 10; i++){
            equals(keylock.trigger(fakeEvent({keyCode: 48 + i})), i);
        }
    });

    test("shift + digits key binding", function(){
        var cbFunc = function(returnVal){
            return( function(e){ return(returnVal); } );
        };
        keylock = new Keylock();
        var capDigits = [ ")", "!", "@", "#", "$", "%", "^", "&", "*", "(" ];
        var def = {}
        for(var i = 0; i < 10; i++){
            def[capDigits[i]] = cbFunc(capDigits[i]);
        }
        keylock.define(def);
        keylock.trigger(fakeEvent({keyCode: 48}));
        for(i = 0; i < 10; i++){
            equals(keylock.trigger(fakeEvent({keyCode: 48 + i, shiftKey: true})), capDigits[i]);
        }
    });


    module("Scoped keys");

    test("one level deep", function(){
        keylock = new Keylock();
        keylock.define({
            a: {
                a: function(){ return "aa"; }
            }
        });

        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), false);
        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), "aa");
    });


    test("two levels deep", function(){
        keylock = new Keylock();
        keylock.define({
            a: {
                a: {
                    a: function(){ return "aaa"; }
                }
            }
        });

        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), false);
        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), false);
        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), "aaa");
    });

    test("enabling scope returns false", function(){
        keylock = new Keylock();
        keylock.define({
            a: {
                a: function(){ return "I'm defined"; }
            }
        });

        // Enable scope
        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), false);
    });

    test("undefined keys in a scope resets scope and returns true", function(){
        keylock = new Keylock();
        keylock.define({
            a: {
                a: function(){ return "I'm defined"; }
            }
        });

        // Enable scope
        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), false);
        // Hit wrong key
        equals(keylock.trigger( fakeEvent({keyCode: 66}) ), true);

        // Scope reset, so retrigger scope
        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), false);
        // Hit right key
        equals(keylock.trigger( fakeEvent({keyCode: 65}) ), "I'm defined");
    });

    test("CTRL + ENTER should work", function(){
        keylock = new Keylock();
        keylock.define({
            "<C-CR>": function() { return "works"; },
        });

        equals(keylock.trigger( fakeEvent({keyCode:13, ctrlKey:true})), "works");
    });

    module("Keylock.Translator");

    // Convenience assignment
    var t = Keylock.Translator.translate;

    test("translate lowercase letter", function(){
        equals(t(fakeEvent({keyCode: 65})), "a");
    });

    test("translate uppercase letter", function(){
        equals( t(fakeEvent({keyCode: 65, shiftKey: true})), "A");
    });

    test("translate enter key", function(){
        equals( t(fakeEvent({keyCode: 13})), "<CR>");
    });

    test("translate enter key with CTRL", function(){
        equals( t(fakeEvent({keyCode: 13, ctrlKey: true})), "<C-CR>");
    });

    test("translate escape key", function(){
        equals( t(fakeEvent({keyCode: 27})), "<Esc>");
    });

    test("translate space key", function(){
        equals( t(fakeEvent({keyCode: 32})), "<Space>");
    });

    test("translate arrow keys", function(){
        equals( t(fakeEvent({ keyCode: 38 })), "<A-UP>");
        equals( t(fakeEvent({ keyCode: 40 })), "<A-DOWN>");
        equals( t(fakeEvent({ keyCode: 37 })), "<A-LEFT>");
        equals( t(fakeEvent({ keyCode: 39 })), "<A-RIGHT>");
    });

    test("translate alt + ctrl + letter", function(){
        equals(t(fakeEvent({keyCode: 65, ctrlKey: true, metaKey: true, altKey: true})), "<M-C-a>");
    });

    test("translate alt + command + letter", function(){
        equals(t(fakeEvent({keyCode: 65, metaKey: true, altKey: true})), "<M-D-a>");
    });

    test("translate alt + letter", function(){
        equals(t(fakeEvent({keyCode: 65, altKey: true})), "<M-a>");
    });

    test("translate ctrl + letter", function(){
        equals(t(fakeEvent({keyCode: 65, ctrlKey: true, metaKey: true})), "<C-a>");
    });

    test("translate command + letter", function(){
        equals(t(fakeEvent({keyCode: 65, metaKey: true})), "<D-a>");
    });

    test("translate period (.) character", function(){
        equals(t(fakeEvent({keyCode: 190})), ".");
    });

    test("translate comma (,) character", function(){
        equals(t(fakeEvent({keyCode: 190, shiftKey: true})), ",");
    });

});
