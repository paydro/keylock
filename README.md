Keylock
=======

Keylock is a javascript library used to map browser keyboard events to
javascript functions using a Vi-esque binding scheme.


Installation
------------

Copy the <code>keylock.js</code> into your javascript directory and include the
file in your html.

Done!

If you're using jQuery, there is also a <code>jquery.keylock.js</code> file
that is helpful.

Examples
--------

These examples assume you're using the jQuery plugin. Keylock does not require
jQuery and it's as simple as binding an event on the <code>keydown</code>
example.

Basic bindings.

    $(document).keylock({
      a: function(){ alert("You just pressed the 'a' key!"); },
      b: function(){ alert("You just pressed the 'b' key!"); },
      0: function(){ alert("Numbers work too!"); },
      "*": function(){ alert("Even the asterik!"); },
      "A": function(){ alert("And capital letters"); },
    });

Binding with the CTRL key. The CTRL key is represented as the capital "C"
character. The whole key combination is wrapped in angle brackets. If you're
familiar with Vi bindings then this is no different.

    // Bind the char combination CTRL + a
    $(document).keylock({
      "<C-a>": function() { alert('You pressed CTRL+a'); }
    });

Binding with the ALT key. The ALT key is represented as the capital "M"
character. Note the ordering of ALT and CTRL - ordering is important. More on
this later.

    // Bind the char combination CTRL + ALT + a
    // NOTE: The "M" must come before the "C". Ordering is important
    $(document).keylock({
      "<M-C-a>": function() { alert('You pressed CTRL+a'); }
    });

Binding with the SHIFT key. Unlike Vi, where there exists a representation for
pressing the SHIFT key, with Keylock, we just use the corresponding character
that results in SHIFT + key. For instance, the example below is using the
capital letter "A".

    // Bind the char combination CTRL + ALT + SHIFT + a
    $(document).keylock({
      "<M-C-A>": function() { alert('You pressed CTRL + ALT + A'); }
    });

Finally, the COMMAND key for Mac users. Again, like Vi, this is represented as
the capital "D".

    // For mac users - bind COMMAND + a
    $(document).keylock({
      "<D-a>": function() { alert('You pressed COMMAND + a'); }
    });

You can also define key sequences just like Vi. GMail and Twitter use similar
sequences.

    // Imitating GMail's goto inbox key sequence ("g" and then "i")
    $(document).keylock({
        g: {
            i: function() { /* Goto inbox */ },
        }
    });

You can create any length of key sequences you want. For instance, if you're
into the Konami code, here's how you would do it with Keylock:

    $(document).keylock({
        "<A-UP>": {
            "<A-UP>": {
                "<A-DOWN>": {
                    "<A-DOWN>": {
                        "<A-LEFT>": {
                            "<A-RIGHT>": {
                                "<A-LEFT>": {
                                    "<A-RIGHT>": {
                                        b: {
                                            a: function(){
                                                // 30 free lives!
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });


Callback function
-----------------

The function that you can define for a binding takes one argument - the event.
In the scenario where you need to stop the "keydown" event from bubling up
(say, hitting enter on a form), you should return false from the function to
stop the propagation.

    $(document).keylock({

      "<CR>": function(event){
        console.log(event);

        return false; // Stop the "keydown" event from propagating
      }
    });

jQuery Plugin
-------------

The jQuery plugin has some extra features for Keylock. With the plugin, you can
bind different bindings for different dom elements. For instance, say you had
an autocomplete search field that requires the use of the UP/DOWN arrow keys to
select the item to auto complete with. At the same time, you have a global
binding for UP/DOWN for other items on the page. The plugin allows you to bind
directly to the search field and the body/document/window elements. This allows both UP/DOWN arrow
keys to behave differently depending on where they're bound.

    $(document).define({
      "<A-UP>": function()
      "<A-DOWN>": function() ...
    });

    $("form #search"){ /* ... search bindings ... */ });

Usage without jQuery Plugin
---------------------------

If you don't use jQuery, then here's how you would use it.

First, define your bindings:

    var keylock = new Keylock();
    keylock.define({
        a: function() { alert('You pressed the "a" key!'); }
        g: {
            i: function() { /* go to inbox! */ }
        }
    })

Next, create an event handler for the <code>keydown</code> event that calls <code>trigger</code> on
the keylock object. Note, it *must* be the <code>keydown</code> event, and not <code>keypress</code>! [Keydown vs. keypress][1]

    var body = document.getElementByTagNames("body")[0];
    body.addEventListener("keydown", function(event){
      keylock.trigger(event);
    });

That's it!


Special Keys
------------

Some keys, to simulate Vi-like bindings, have special representations in
binding definitions.

* spacebar: <code>&lt;Space&gt;</code>
* return/enter: <code>&lt;CR&gt;</code>
* Esc: <code>&lt;Esc&gt;</code>
* Up/Down/Left/Right Arrow keys: <code>&lt;A-UP&gt;/&lt;A-DOWN&gt;/&lt;A-LEFT&gt;/&lt;A-RIGHT&gt;</code>


Caveat: Modifier Key Ordering
-----------------------------

Ordering of the modifier keys is important when defining bindings. The ordering of the meta keys are:

1. Alt (M)
2. Control (C)
3. Command (D)

Some examples to illustrate:

    ALT + CTRL + a:
    <M-C-a> # GOOD

    CTRL + COMMAND + a
    <C-D-a> # GOOD

    ALT + CTRL + Z
    <C-M-Z> # BAD

What about CTRL + COMMAND?
--------------------------
You cannot have the combination of CTRL + COMMAND. Browsers trigger both CTRL
and COMMAND when you press the CTRL key. Sad, I know. But, when you press
COMMAND, it only triggers the COMMAND key. Therefore, you can combine this with
SHIFT and ALT if you wish.


Bugs
====

Submit bug tickets to the [github repo][4].

Contributing
============

* Use 80 character columns (yes, 80 - I code on my laptop and I use Vi split
screens)
* Write some tests for your functionality. I use [QUnit][2].
* 4 spaces for tabs.
* Follow examples used in the code.



Thanks!
[Peter Bui][3]

[1]: http://ejohn.org/blog/keypress-in-safari-31/
[2]: http://docs.jquery.com/Qunit
[3]: http://paydrotalks.com
[4]: https://github.com/paydro/keylock/issues
