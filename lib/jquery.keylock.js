// Keylock jQuery plugin
(function($){
    // jQuery helper for KeyLock.
    $.fn.keyLock = function(keyDefinition){
        if(keyDefinition){
            var keys = new KeyLock();
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

