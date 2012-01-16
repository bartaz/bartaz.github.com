
$(function(){

    /* TRANSFORMS 2D 3D STEPS */

    // borrowed from impress.js ;)
    var pfx = (function () {
        var style = document.createElement('dummy').style,
            prefixes = 'Wecbkit Moz O ms Khtml'.split(' '),
            memory = {};
        return function ( prop ) {
            if ( typeof memory[ prop ] === "undefined" ) {
                var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
                memory[ prop ] = null;
                for ( var i in props ) {
                    if ( style[ props[i] ] !== undefined ) {
                        memory[ prop ] = props[i];
                        break;
                    }
                }
            }
            return memory[ prop ];
        }
    })();

    // pads given string from the left
    // used to justify slider values
    var lpad = function(str, length, padString) {
        while (str.length < length)
            str = (padString || " ") + str;
        return str;
    }

    var tid = null;

    function codeToTarget($input) {
        var code = $input.closest(".code").clone().find(".disabled,.ignore").remove().end();
        
        if (code.data("property")) {
            var text = code.text().trim().replace(/\n/ig," ");
            var target = $input.closest(".step").find( ".target " + (code.data("selector") || "") );

            target.css( pfx( code.data("property") ), text || "" )
        }
    }
    
    // updates target element styles property
    // when code is changed (by clicking or sliders)
    var updateTarget = function ($input) {
        clearTimeout(tid);
        tid = setTimeout(function(){
            codeToTarget($input)
        },50);
    }
    
    $(".switch").attr("title", "Double click to toggle");
    
    $(document)
        .on("dblclick", ".switch", function () {
            $(this).toggleClass("disabled");
            
            updateTarget( $(this) );
            return false;
        })
        .on("dblclick", ".flip", function (event) {
            // flip the "cube" code around
            if ($(event.target).is(".snippet")) {
                $(this).toggleClass("back");
            }
        })
        .on("dblclick", "#transforms3d-cube .cube-flat.switch", function () {
            // special treatment for cube class switch in code
            $("#transforms3d-cube .cube").toggleClass("flat");
        })

    $(".slider input[type=range]")
        .on("change", function(){
            var $slider = $(this);
            var val = $slider.val();
            var divider = $slider.data("divider") || 1;
            
            val /= divider;
            val = "" + val.toFixed(1);
            if (divider == 1) { val = parseInt(val); }
            $slider.closest("label").find(".val").text(val);
            
            updateTarget( $slider );
        });

    $("#transforms3d-cube .cube").css("-webkit-transform-style", "preserve-3d");

    /* PERSPECTIVE STEP */

    var $document = $(document),
        $scene = $("#perspective .scene"),
        $cross = $scene.find(".cross"),
        originOffset = { top: $cross.height() / 2, left: $cross.width() / 2 };
        
    $scene.css(pfx("perspective"), "1000px");
    
    $scene
        .on("mousedown", function (mouseDownEvent) {
            var offset = $cross.position();
            
            $document.on("mousemove.drag", function (moveEvent) {
                var left = offset.left + moveEvent.pageX - mouseDownEvent.pageX,
                    top = offset.top  + moveEvent.pageY - mouseDownEvent.pageY;
                
                $cross.css({ left: left, top: top });
                $scene.css(pfx("perspective-origin"), 
                           (left + originOffset.left) + "px " + 
                           (top + originOffset.top) + "px");
                
                $("code .origin .value")
                    .text(~~(left + originOffset.left) +"px "+ ~~(top + originOffset.top) +"px");
                return false;
            });
            
            return false;
        })

    $document.on("mouseup", function () {
        $document.off("mousemove.drag");
    });


    // init interactive code
    
    $(".step:has(.target) .code").each(function(){
        codeToTarget($(this).children().eq(0));
    })
});

