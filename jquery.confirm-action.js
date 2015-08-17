/*!
 * jQuery Confirm Action
 * https://github.com/sdelements/jquery-confirm-action
 *
 * Copyright 2015, Houssam Haidar
 * Released under the MIT license
 */

'use strict';

(function($) {

    //
    // Modal
    //

    var ConfirmActionModal = function(options) {

        this.options = options;

        this.init();

    };

    ConfirmActionModal.prototype = {

        constructor: ConfirmActionModal,

        styles: {
            overlay: {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 1000,
                backgroundColor: '#000000'
            },
            base: {
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 1001,
                overflow: 'auto'
            },
            dialog: {
                backgroundColor: '#ffffff',
                width: '100%',
                maxWidth: '600px',
                margin: '40px auto',
                textAlign: 'center',
                fontSize: '14px',
                borderRadius: '3px',
                position: 'relative',
                zIndex: 1001
            },
            header: {
                padding: '30px'
            },
            title: {
                fontWeight: '300',
                fontSize: '20px',
                color: '#555555',
                lineHeight: '40px',
                marginBottom: '0'
            },
            close: {
                position: 'absolute',
                top: '-25px',
                right: '-25px',
                fontSize: '30px',
                color: '#f2f2f2',
                cursor: 'pointer'
            },
            content: {
                padding: '10px 40px 60px 40px',
                color: '#888888',
                fontSize: '16px',
                lineHeight: '20px'
            },
            actions: {
                backgroundColor: '#f5f5f5',
                padding: '30px',
                borderRadius: '0 0 3px 3px'
            },
            button: {
                background: 'none',
                fontSize: '14px',
                color: '#aaaaaa',
                padding: '10px 40px',
                margin: '3px 6px',
                border: '1px #cccccc solid',
                borderRadius: '4px'
            },
            titles: {
                danger: {
                    color: '#e56657'
                },
                warning: {
                    color: '#ffb347'
                },
                success: {
                    color: '#77dd77'
                }
            },
            buttons: {
                danger: {
                    backgroundColor: '#e56657',
                    borderColor: '#e56657',
                    color: '#ffffff'
                },
                warning: {
                    backgroundColor: '#ffb347',
                    borderColor: '#ffb347',
                    color: '#ffffff'
                },
                success: {
                    backgroundColor: '#77dd77',
                    borderColor: '#77dd77',
                    color: '#ffffff'
                }
            }
        },

        html: {
            overlay: '<div class="confirm-action-overlay" />',
            base: '<div class="confirm-action-modal" />',
            dialog: '<div class="confirm-action-modal-dialog" />',
            header: '<div class="confirm-action-modal-header" />',
            title: '<h2 class="confirm-action-modal-title">Confirm</h2>',
            close: '<span class="confirm-action-modal-close" data-confirm-action-close>&times;</span>',
            content: '<div class="confirm-action-modal-content" />',
            actions: '<div class="confirm-action-modal-actions" />',
            button: '<button class="confirm-action-modal-button">Action</button>'
        },

        init: function() {

            this.components = {};

            $.each(this.html, $.proxy(function(key, html) {

                this.components['$' + key] = $(html).css(this.styles[key] || {});

            }, this));

            this.$overlay = this.components.$overlay.fadeTo(0, 0.5);

            this.components.$title
                .css(this.styles.titles[this.options.title.style || 'danger']);

            this.options.title.html
                && this.components.$title.html(this.options.title.html);

            this.options.title.text
                && this.components.$title.text(this.options.title.text);

            this.options.message.html
                && this.components.$content.html(this.options.message.html);

            this.options.message.text
                && this.components.$content.text(this.options.message.text);

            var $buttons = [
                this.components.$button.clone()
                    .text('Cancel')
                    .attr('data-confirm-action-close', true)
            ];

            $.each(this.options.actions, $.proxy(function(key, action) {

                $buttons.push(
                    this.components.$button.clone()
                        .attr('data-confirm-action-id', key)
                        .text(action.text)
                        .css(this.styles.buttons[action.style || 'danger'])
                );

            }, this));

            this.$element = this.components.$base.append([
                this.$overlay,
                this.components.$dialog.append([
                    this.components.$header.append([
                        this.components.$title,
                        this.components.$close
                    ]),
                    this.components.$content,
                    this.components.$actions.append($buttons)
                ])
            ]);

        },

        listen: function(sourceEvent) {

            var that = this;

            this.$element.delegate('[data-confirm-action-close]', 'click', $.proxy(this.close, this));

            this.$overlay.on('click', $.proxy(this.close, this));

            var confirm = function() {

                $(sourceEvent.target).trigger('click', true);

                that.close();

            };

            this.$element.find('[data-confirm-action-id]').each(function() {

                $(this).on('click.confirm.action', function(e) {

                    e.preventDefault();

                    that.options.actions[$(this).data('confirm-action-id')].callback(confirm, $.proxy(that.close, that));

                });

            });

        },

        show: function(sourceEvent) {

            this.$element.appendTo('body');

            this.listen(sourceEvent || $.Event('click'));

        },

        close: function() {

            this.$element.remove();

        }

    };

    //
    // Core
    //

    var ConfirmAction = function(element, options) {

        this.init(element, options);

    };

    ConfirmAction.prototype = {

        constructor: ConfirmAction,

        init: function(element, options) {

            this.options = options;

            this.$element = $(element);

            this.$element.on('click.confirm', $.proxy(this.intercept, this));

            this.modal = new ConfirmActionModal(this.options);

        },

        intercept: function(e, confirmed) {

            var that = this;

            var execute = function(run) {

                if (!run) {
                    return;
                }

                that.modal.show(e);

                if (confirmed !== true) {

                    e.preventDefault();
                    e.stopImmediatePropagation();

                }

            };

            if (typeof this.options.conditional === 'function') {

                this.options.conditional(execute);

                return;

            }

            execute(true);

        }

    };

    //
    // jQuery Plugin
    //

    $.fn.confirmAction = function(options) {

        return this.each(function() {

            var message;

            if (typeof options === 'string') {

                message = options;

            }

            options = $.extend({}, $.fn.confirmAction.defaults, typeof options === 'object' && options);

            if (message) {

                options.message.text = message;

            }

            new ConfirmAction(this, options);

        });

    };

    $.fn.confirmAction.defaults = {
        title: {
            text: 'Warning',
            style: 'danger'
        },
        message: {
            text: 'Are you sure?'
        },
        actions: {
            confirm: {
                text: 'Confirm',
                style: 'danger',
                callback: function(confirm) {
                    confirm();
                }
            }
        }
    };

})(jQuery);
