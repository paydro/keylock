// Keylock jQuery plugin
//
// Keylock is a javascript library used to map browser keyboard events to
// javascript functions using a Vi-esque binding scheme.
//
// Examples:
//   $("body").keylock({
//       a: function(){ alert("You just pressed the 'a' key!"); },
//       b: function(){ alert("You just pressed the 'b' key!"); },
//       0: function(){ alert("Numbers work too!"); },
//       "*": function(){ alert("Even the asterik!"); },
//       "A": function(){ alert("And capital letters"); },
//
//       // Key sequence "g" and then "i"
//       g: {
//           i: function(event){ console.log(event); return false }
//       }
//   });
//
// More usage at https://github.com/paydro/keylock
(function($){
    // jQuery helper for KeyLock.
    $.fn.keylock = function(keyDefinition){
        if(keyDefinition){
            var keys = new Keylock();
            keys.define(keyDefinition);
            this.data("keyLock", keys);

            // If we're dealing with the body element, bind a custom
            // keydown handler that only fires off key events if the
            // event's target is the body. This allows for key bindings
            // on the same key for form elements and the body element.
            // TODO: Rewrite this comment. This is horrible.
            if(this.get(0).nodeName.toLowerCase() === "body"){
                this.live("keydown", function(e){
                    if(e.target.nodeName.toLowerCase() === "body"){
                        return keys.trigger(e);
                    }
                });
            }
            else {
                this.live("keydown", function(e){
                    return keys.trigger(e);
                });
            }

            return this;
        }
        else { // Return the KeyLock instance
            return this.data("keyLock");
        }
    };
})(jQuery);

