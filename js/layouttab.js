/**
 * Creates the LayoutPanel and adds it to the PhpDebugBar provided panel
 *
 * Passes window resize and PhpDebugBar resize events to the LayoutPanel
 * Passes data supplied by the server to the LayoutPanel
 *
 * @author Bob Davison
 * @version 1.0
 */

// Not loaded via requirejs as the PhpDebugBar component
// will be needed before requirejs's aynch load
var layoutTab =
(function($, PhpDebugBar) {

     return PhpDebugBar.Widget.extend({

        render: function() {
            // Load everything else via requirejs
            require(['layoutpanel'], function(LayoutPanel) {
                this.panel = new LayoutPanel(this.$el);
                if(this.layout) {
                    this.panel.setLayout(this.layout);
                    this.resize();
                }
            }.bind(this));

            // PhpDebugBar bug - bottom padding does not work
            // so we add a <div> at the end and resize that
            $('<div />').addClass('magedebugbar-padding-bottom').appendTo('body');
            phpdebugbar.recomputeBottomOffset = function() {
                $('.magedebugbar-padding-bottom').height($('.phpdebugbar').height());
            };

            // Resize content when window resizes
            $(window).on('resize', this.resize.bind(this));

            // Resize contents when phpdebugbar splitter is moved 
            // Unfortunately we want to resize after phpdebugbar but
            // it doesn't fire any events and we have no way if knowing
            // if our mousemove listener will fire before or after its
            // So we have to make sure we put an event on the end of the queue
            $('.phpdebugbar-drag-capture').on('mousemove', function(e) {
                window.setTimeout(function() {
                    this.resize();
                }.bind(this), 0);
            }.bind(this));

            // PhpDebugBar has layout data for us from the server
            // But panel may not be created yet
            this.bindAttr('data', function(layout) {
                if(this.panel) {
                    this.panel.setLayout(layout);
                } else {
                    this.layout = layout;
                }
            }.bind(this));
        },

        resize: function() {
            if(this.panel) {
                this.panel.resize();
            }
        },

    });

}(jQuery, PhpDebugBar));


