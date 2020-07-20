if (typeof jQuery === 'undefined') {
    throw new Error('PassRequirements requires jQuery')
}

(function ($) {
    // Provide fake gettext for when it is not available
    if( typeof gettext !== 'function' ) {
        gettext = function(text) {
            return text;
        };
    }

    var PassRequirements = function ($ref, options) {
        var $self = this;
        this.$ref = $ref;
        this.defaults = {};

        if (!options ||                     //if no options are passed                                    /*
             options.defaults === true ||     //if default option is passed with defaults set to true      * Extend options with default ones
             options.defaults === undefined   //if options are passed but defaults is not passed           */
        ) {
            options = options || {};
            this.defaults.rules = $.extend(true, {
                minlength: {
                    text: gettext("be at least minLength characters long"),
                    minLength: 8,
                },
                containSpecialChars: {
                    text: gettext("Your input should contain at least minLength special character"),
                    minLength: 1,
                    regex: '([^!%&@#$^*?_~])',
                    regex_flags: 'g'
                },
                containLowercase: {
                    text: gettext("Your input should contain at least minLength lower case character"),
                    minLength: 1,
                    regex: new RegExp('[^a-z]', 'g')
                },
                containUppercase: {
                    text: gettext("Your input should contain at least minLength upper case character"),
                    minLength: 1,
                    regex: new RegExp('[^A-Z]', 'g')
                },
                containNumbers: {
                    text: gettext("Your input should contain at least minLength number"),
                    minLength: 1,
                    regex: new RegExp('[^0-9]', 'g')
                }
            }, options.rules);
        } else {
            this.defaults = options;     //if options are passed with defaults === false
        }

        if (!this.defaults.defaults && !this.defaults.rules) {
            console.error('You must pass in your rules if defaults is set to false. Skipping this input with id:[' + this.id + '] with class:[' + this.classList + ']');
            return false;
        }
        this.$ref.keyup(function () {
            $self.handle_strength_bar($(this));
        });

        var requirementList = "";
        $.each(this.defaults.rules, function (key, rules) {
            requirementList += (("<li id='" + key + "'>" + rules.text).replace("minLength", rules.minLength));
        });

        try {
            this.$ref.popover({
                title: gettext('Password Requirements'),
                trigger: options.trigger ? options.trigger : 'focus',
                html: true,
                placement: options.popoverPlacement ? options.popoverPlacement : 'auto bottom',
                content: gettext('Your password should:') + '<ul>' + requirementList + '</ul>'
            });
        } catch (e) {
            throw new Error('PassRequirements requires Bootstraps Popover plugin');
        }

        this.$ref.focus(function () {
            $(this).keyup();
        });

    };

    PassRequirements.prototype.handle_strength_bar = function($bar) {
        $.each(this.defaults.rules, function (key, rules) {
            if (typeof rules.regex == 'string') {
                rules.regex = new RegExp(rules.regex, rules.regex_flags ? rules.regex_flags: null);
            }
            if ($bar.val().replace(rules.regex, "").length > rules.minLength - 1) {
                $bar.next('.popover').find('#' + key).css('text-decoration', 'line-through');
            } else {
                $bar.next('.popover').find('#' + key).css('text-decoration', 'none');
            }
        });
    }

    $.fn.PassRequirements = function (options) {
        return this.each(function(index) {
            var $this = $(this), data = $this.data('pass_requirements');
            if (!data) {
                $this.data('pass-req-id', index);
                $this.data('pass_requirements', new PassRequirements($this, options));
            }
        });
    }
}(jQuery));
