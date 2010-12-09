var Keylock = function(){
    var keyMap = {};
    var scope = [];

    // == Private functions ==
    var inScope = function(){ return scope.length; };
    var addScope = function(s){ scope.push(s); };
    var resetScope = function(){ scope = []; };
    var findScopeDefs = function(){
        if(!inScope()){
            return keyMap;
        }

        var currentDefs = keyMap;
        for(i = 0; i < scope.length; i++){
            currentDefs = currentDefs[scope[i]];
        }

        return currentDefs;
    };

    // Find function to call for a given key
    // Returns a function mapped to the given key. If the key is mapped
    // to an object literal, the function returned adds the key to the
    // current scope listing.
    var find = function(eventKey){
        var defs = findScopeDefs();
        fnOrObj = defs[eventKey];

        if(typeof fnOrObj === "object"){
            return setScopeFunc(eventKey);
        }
        else {
            resetScope();
            return fnOrObj;
        }
    };

    // Used to build a closure that sets scope
    var setScopeFunc = function(k){
        return (function(){ addScope(k); return false; });
    };


    // == DEBUG functions ==
    this.debug = function(){
        console.log("Key Mappings: ");
        console.log(keyMap);
        console.log("Scope: ");
        console.log(scope);
    };

    // == PUBLIC functions ==
    this.findFunc = function(event){
        console.log(event.keyCode);
        var eventKey = Keylock.Translator.translate(event);
        if(typeof eventKey !== "undefined"){
            var fn = find(eventKey);
            return fn;
        }
        return undefined;
    };

    // Return the value of the function. This allows stopping the bubbling
    // of an event if the event handler returns this value as well.
    this.trigger = function(event){
        var fn = this.findFunc(event);
        if(fn){ return fn(event); }
        return true;
    };

    // Define key(s) to actions.
    this.define = function(definition){
        for(key in definition){
            keyMap[key] = definition[key];
        }
    };

    // Reset the scope listing.
    this.resetScope = function(){
        resetScope();
    };
};

// Key Translator
Keylock.Translator = {
    alphaKeys: [
        "a", "b", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    ],
    digits: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    capDigits: [ ")", "!", "@", "#", "$", "%", "^", "&", "*", "(" ],

    // Keycode to character lookup object
    chars: {
        13: "CR",
        27: "Esc",
        32: "Space",
        37: "A-LEFT",
        38: "A-UP",
        39: "A-RIGHT",
        40: "A-DOWN",
        191: "/",
    },
    translate: function(e){
        var key;

        // Lookup table for keys that should be surrounded by angle brackets
        var bracketKeys = [
            13, // Return/Enter key
            27, // Esc key
            32, // Spacebar
            37, 38, 39, 40, // Arrow Keys
        ]
        var isSpecialKey = function(e){
            return(e.metaKey || e.ctrlKey || e.altKey ||
                bracketKeys.indexOf(e.keyCode) >= 0
            );
        };


        var codeToKey = function(code, shift){
            var t = Keylock.Translator;
            if(code >= 65 && code <= 90){
                var key = t.alphaKeys[code - 65];
                return shift ? key.toUpperCase() : key;
            }
            else if(code >= 48 && code <= 57){
                var offset = code - 48;
                return shift ? t.capDigits[offset] : t.digits[offset];
            }
            else {
                return t.chars[code];
            }
        };

        // Return an array of modifier keys
        // M = alt key
        // C = ctrl key
        // D = command (apple) key
        var modifierKeys = function(e){
            var modifiers = [];
            // Ordering of modifiers is important
            if(e.altKey){
                modifiers.push("M");
            }
            if(e.ctrlKey){
                modifiers.push("C");
            }
            if(e.metaKey && !e.ctrlKey){
                modifiers.push("D");
            }
            return modifiers;
        };

        key = codeToKey(e.keyCode, e.shiftKey);
        if(isSpecialKey(e)){
           var modifiers = modifierKeys(e);
           modifiers.push(key);
           key = "<" + modifiers.join("-") + ">";
        }

        return key;
    },
};

