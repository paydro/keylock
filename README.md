Keylock
-------

Keylock is a javascript library used to map browser keyboard events to
javascript functions using a Vi-esque binding scheme.


Installation
============

Copy the "keylock.js" into your javascript directory and include the file in
your html. Done!

If you're using jQuery, there is also a "jquery.keylock.js" file that is
helpful.

Examples
========

These examples assume you're using the jQuery plugin. Keylock does not require
jQuery and it's as simple as binding an event on the "keydown" example.

Basic bindings.

    $("body").keylock({
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
    $("body").keylock({
      "<C-a>": function() { alert('You pressed CTRL+a'); }
    });

Binding with the ALT key. The ALT key is represented as the capital "M"
character. Note the ordering of ALT and CTRL - ordering is important. More on
this later.

    // Bind the char combination CTRL + ALT + a
    // NOTE: The "M" must come before the "C". Ordering is important
    $("body").keylock({
      "<M-C-a>": function() { alert('You pressed CTRL+a'); }
    });

Binding with the SHIFT key. Unlike Vi, where there exists a representation for
pressing the SHIFT key, with Keylock, we just use the corresponding character
that results in SHIFT + key. For instance, the example below is using the
capital letter "A".

    // Bind the char combination CTRL + ALT + SHIFT + a
    $("body").keylock({
      "<M-C-A>": function() { alert('You pressed CTRL + ALT + A'); }
    });

Finally, the COMMAND key for Mac users. Again, like Vi, this is represented as
the capital "D".

    // For mac users - bind COMMAND + a
    $("body").keylock({
      "<D-a>": function() { alert('You pressed COMMAND + a'); }
    });

You can also define key sequences just like Vi. GMail and Twitter use similar
sequences.

    // Imitating GMail's goto inbox key sequence ("g" and then "i")
    $("body").keylock({
        g: {
            i: function() { /* Goto inbox */ },

        }
    });

You can create any length of key sequences you want. For instance, if you're
into the Konami code, here's how you would do it with Keylock:

    $("body").keylock({
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

jQuery Plugin
=============

The jQuery plugin has some extra features for Keylock. With the plugin, you can bind different bindings for different dom elements. For instance, say you needed a binding when the user is focused on an input field (like a search box), and when the user is focused on the whole web page. The plugin makes this easier to do.

    $jquery

Usage without jQuery Plugin
===========================

If you don't use jQuery, then here's how you would use it.

First, define your bindings:

    var keylock = new Keylock();
    keylock.define({
        a: function() { alert('You pressed the "a" key!'); }
        g: {
            i: function() { /* go to inbox! */ }
        }
    })

Next, create an event handler for the "keydown" event that calls "trigger" on
the keylock object.

    window.bind("keydown", function(event){
        keylock.trigger(event);
    });

That's it!


Special Keys
============

Some keys, to simulate Vi-like bindings, have special representations in
binding definitions.

* spacebar: <Space>
* return/enter: <CR>
* Esc: <Esc>
* Up/Down/Left/Right Arrow keys: <A-UP>/<A-DOWN>/<A-LEFT>/<A-RIGHT>


Caveat: Modifier Key Ordering
=============================

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
==========================
You cannot have the combination of CTRL + COMMAND. Browsers trigger both CTRL
and COMMAND when you press the CTRL key. Sad, I know. When you press COMMAND,
it only triggers the COMMAND key, so you can combine this with SHIFT and ALT if
you wish.


