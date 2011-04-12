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

            // jQuery's live() function does not work on window/document
            // in Firefox. Instead use the keydown() callback directly.
            if(this.get(0) == window ||
               this.get(0) == document ||
               this.get(0).nodeName.toLowerCase() == "body"
            ){
                $(document).keydown(function(e){
                    if(
                        e.target == $("html").get(0) || // Gecko
                        e.target == $("body").get(0)    // Webkit
                    ){
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

