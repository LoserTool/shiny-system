var pathName = window.location.pathname;
if (pathName.indexOf('/login') >= 0 || pathName.indexOf('/register') >= 0 || pathName.indexOf('buy') >= 0) {
    if (top.location !== self.location) {
        top.location = self.location.href;
    }
}

var validationFeedback = function (form, data, buttonText) {
    for (var key in data.errors) {
        // Show error message next to field.
        var input = $('[name="' + key + '"]');
        if (input.length) {
            input.addClass('error');
            var target = input.attr('type') === 'checkbox' ? input.siblings('label') : input;
            var newKey = key.replace('.', '_');
            $('.error.' + newKey).remove();
            $('<div>').addClass('be error ' + newKey).text(data.errors[key]).insertAfter(target).show();
        } else {
            $('.' + key + 'Error').addClass('be error').text(data.errors[key]).show();
        }
    }

    if (buttonText) {
        // Restore "Save" button text.
        form.find('.button').html(buttonText ? buttonText : 'Save');
    }
};
var updateFieldValidation = function (e) {
    var input = $(this);
    var val = input.val();
    if (val && val.length) {
        if (input.hasClass('error')) {
            // Remove error message.
            input.removeClass('error');
            var form = input.parents('form');
            input.siblings('.error').remove();
            if (!form.find('input.error').length) {
                // No more errors, enable "Save" button.
                form.find('.button').enableElement();
            }
        }
    }
};
var highlightInvalid = function (element, errorClass, validClass) {
    var $element = $(element);
    $element.addClass(errorClass).removeClass(validClass);
    $element.parents('form').find('.button').disableElement();
    $element.siblings('label.error,span.error,div.error,p.error').show();
};
var unhighlightValid = function (element, errorClass, validClass) {
    var $element = $(element);
    $element.addClass(validClass).removeClass(errorClass);
    $element.siblings('label.error,span.error,div.error,p.error').empty().hide();
    var form = $element.parents('form');
    if (!form.find('input.error').length) {
        // No more errors, enable button.
        form.find('.button').enableElement();
    }
};
var highlightMigrationAndRemoveBackendErrors = function (element, errorClass, validClass) {
    $(element).siblings('.be.error').remove();
    highlightInvalid(element, errorClass, validClass);
};
var unhighlightMigrationValidAndRemoveBackendErrors = function (element, errorClass, validClass) {
    $(element).siblings('.be.error').remove();
    unhighlightValid(element, errorClass, validClass);
};
var specificValidationFeedback = function (elementName, form, response, target) {
    var $form = $(form);
    var $el = $form.find('input[name=' + elementName + ']');
    if (!target) {
        target = $el;
    }
    $('<label>', {generated: true}).html(response.error).attr('for', elementName).addClass('error specificFeedback').insertAfter(target).show();
    highlightInvalid($el, 'error', 'valid');
    $form.find('.button').show();
    $('#loader').remove();
};
var flashError = function (message, $target) {
    $('.error.flash').remove();
    var $div = $('<div>', {html: '<p><strong>Error!</strong> ' + message + '</p>'}).addClass('error').addClass('flash');
    var $intro = $target.find('.intro');
    if ($intro.length) {
        $div.insertAfter($intro);
    } else {
        $div.prependTo($target);
    }
    var button = $target.find('.button').show().enableElement();
    var originalText = button.data('originalText');
    if (originalText) {
        button.text(originalText);
    }
    $('#loader').remove();
};
var flashSuccess = function (message, $target) {
    $('.error.flash').remove();
    var $div = $('<div>', {html: '<p><strong>Success!</strong> ' + message + '</p>'}).addClass('success').addClass('flash');
    var $intro = $target.find('.intro');
    if ($intro.length) {
        $div.insertAfter($intro);
    } else {
        $div.prependTo($target);
    }
    $('#loader').remove();
};
var mailcheck = function (inputFieldSelector) {
    $(document).delegate('.replaceEmail', 'click', function (e) {
        $(inputFieldSelector).val($(this).attr('email-suggestion'));
        $('.emailSuggestion').remove();
        unhighlightValid(inputFieldSelector, 'error', 'valid');
        e.preventDefault();
        return false;
    });

    $(document).delegate('.hideReplaceEmail', 'click', function (e) {
        $('.emailSuggestion').remove();
        e.preventDefault();
        return false;
    });

    $(document).delegate(inputFieldSelector, 'blur', function () {
        $(this).mailcheck({
            domains: ['hotmail.com',
                'gmail.com',
                'yahoo.com',
                'web.de',
                'hotmail.fr',
                'hotmail.co.uk',
                'mail.ru',
                'aol.com',
                'live.com',
                'wp.pl',
                'gmx.de',
                'naver.com',
                'hotmail.de',
                'seznam.cz',
                'o2.pl',
                'googlemail.com',
                'comcast.net',
                'yahoo.de',
                'msn.com',
                'yandex.ru',
                'live.co.uk',
                'comcast.net',
                'hotmail.de',
                'yahoo.de',
                'ymail.com',
                'seznam.cz',
                'me.com',
                'mac.com',
                'yahoo.co.uk'],
            suggested: function (element, suggestion) {
                $('.emailSuggestion').remove();
                var $suggestion = $('<div>').addClass('emailSuggestion');
                $suggestion.append('Did you mean ');

                var $emailLink = $('<a>', {href: '#'}).addClass('replaceEmail').attr('email-suggestion', suggestion.full);
                $emailLink.append($('<span>', {text: suggestion.address + '@'}).addClass('address'));
                $emailLink.append($('<span>', {text: suggestion.domain}).addClass('domain'));

                $suggestion.append($emailLink);
                $suggestion.append('?');

                var $responses = $('<span>').addClass('responses');

                var $replaceLink = $('<a>', {href: '#', text: 'Yes'}).addClass('replaceEmail').attr('email-suggestion', suggestion.full);
                $responses.append($replaceLink);

                $responses.append(document.createTextNode(' / '));

                var $hideLink = $('<a>', {href: '#', text: 'No'}).addClass('hideReplaceEmail');
                $responses.append($hideLink);

                $suggestion.append($responses);

                $suggestion.insertAfter($(element));
            },
            empty: function (element) {
                $('.emailSuggestion').remove();
            }
        });
    });
};
var showError = function (container, message) {
    container.empty().append($('<p>').html(message).addClass('error'));
};
var positionModalWindow = function () {
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    var $mask = $('#mask');
    $mask.css({'width': maskWidth,
        'height': maskHeight,
        'top': 0,
        'left': 0
    });

    var winHeight = $(window).height();
    var winWidth = $(window).width();

    var $modal = $('#modal');
    $modal.css('top', winHeight / 2 - $modal.height() / 2);
    $modal.css('left', winWidth / 2 - $modal.width() / 2);
};

var createModalWindow = function (onCreated) {
    var $mask = $('<div>', {id: 'mask'}).appendTo($('body'));
    var $modal = $('<div>', {id: 'modal'}).appendTo($('body'));

    if (typeof onCreated === 'function') {
        onCreated($mask, $modal);
    }

    positionModalWindow();
    $(window).resize(positionModalWindow);

    $mask.fadeIn(500);
    $mask.fadeTo(1000, 0.7);
    $modal.fadeIn(500);
};

var hideModalWindow = function () {
    $(document).unbind('keydown.cancelConfirmation');
    $('#modal').remove();
    $('#mask').remove();
};

var modalWindowMessage = function (header, html) {
    createModalWindow(function ($mask, $modal) {
        $modal.addClass('confirm');

        if (!header) {
            header = '';
        }

        $('<h3>', {html: header}).appendTo($modal);

        if (html) {
            $('<p>', {html: html}).appendTo($modal);
        }

        var buttons = $('<div>').addClass('buttons').appendTo($modal);

        $('<a>', {href: '#', text: 'Close'}).click(function (e) {
            var link = $(this);
            if (!link.hasClass('clicked')) {
                link.addClass('clicked');
                hideModalWindow();
            }

            e.preventDefault();
            return false;
        }).appendTo(buttons);

        $(document).bind('keydown.cancelConfirmation', 'esc', hideModalWindow);
    });
};

var modalWindow = function (header, text, onConfirm, onCancel) {
    createModalWindow(function ($mask, $modal) {
        $modal.addClass('confirm');

        if (!header) {
            header = 'Are you sure?';
        }

        $('<h3>', {text: header}).appendTo($modal);

        if (text) {
            $('<p>', {text: text}).appendTo($modal);
        }

        var buttons = $('<div>').addClass('buttons').appendTo($modal);

        if (typeof onCancel !== 'function') {
            onCancel = hideModalWindow;
        }
        if (typeof onConfirm !== 'function') {
            onConfirm = hideModalWindow;
        }

        $(document).bind('keydown.cancelConfirmation', 'esc', onCancel);

        $('<a>', {href: '#', text: 'Yes'}).addClass('button huge').click(function (e) {
            var link = $(this);
            if (!link.hasClass('clicked')) {
                link.addClass('clicked');
                onConfirm();
            }

            e.preventDefault();
            return false;
        }).appendTo(buttons);

        $('<a>', {href: '#', text: 'Cancel'}).click(function (e) {
            var link = $(this);
            if (!link.hasClass('clicked')) {
                link.addClass('clicked');
                onCancel();
            }

            e.preventDefault();
            return false;
        }).appendTo(buttons);
    });
};

if (justLoggedIn) {
    _gaq.push(['_trackEvent', 'Account', 'Login-completed', 'Accounts']);
}
if (window.location.pathname === '/register/complete' || window.location.pathname === '/terms') {
    if (justRegistered) {
        _gaq.push(['_trackEvent', 'Account', 'Registration-completed', 'Accounts']);
    }
}

var setupSecretQuestionChoices = function () {
    var updateChoices = function (select) {
        var $select = $(select);
        var value = $select.val();
        var oldValue = $select.data('oldValue');
        $('.question select').each(function () {
            var $this = $(this);
            if ($select.attr('id') != $this.attr('id')) {
                // Readd previously selected option to other selects.
                if (oldValue) {
                    for (var i in questions) {
                        var question = questions[i];
                        if (question.id == oldValue) {
                            $this.append($('<option>', {text: question.question, value: question.id}))
                            break;
                        }
                    }
                }

                // Remove currently selected option from other selects.
                $this.find('option[value="' + value + '"]').remove();
            }
        });
    }

    $(document).delegate('.question select', 'change', function () {
        updateChoices(this);
    });

    $(document).delegate('.question select', 'focus', function () {
        $(this).data('oldValue', $(this).val());
    });

    $('.question select').each(function () {
        updateChoices(this);
    });
};

var updateProfileNameAvailability = function(inputSelector, $availabilityButton) {
    var nameInput = $(inputSelector);
    var name = nameInput.val();
    if (!nameInput.data(name)) {
        $availabilityButton.show();
        $('.availabilityFeedback').remove();

        if (name && name.length && !nameInput.hasClass('error')) {
            $availabilityButton.enableElement();
        } else {
            $availabilityButton.disableElement();
        }
    }
};

var profileNameAvailability = function(inputSelector, $availabilityButton, $chooseButton) {
    var updateAvailability = function(e) {
        updateProfileNameAvailability(inputSelector, $availabilityButton);
    };

    $(document).delegate(inputSelector, 'keydown', updateAvailability);
    $(document).delegate(inputSelector, 'change', updateAvailability);
    $(document).delegate(inputSelector, 'blur', updateAvailability);

    $(document).delegate('.availability a.button', 'click', function (e) {
        var $nameInput = $(inputSelector);

        if (!$(this).attr('disabled') && !$nameInput.hasClass('error')) {
            $(this).hide();

            var $availability = $('.availability');

            var loader = $('<span>', {id: 'loader', html: 'Checking&hellip;'});
            $availability.append(loader);

            var showError = function (message) {
                $availability.empty().append($('<span>', {text: message}).addClass('error'));
                $chooseButton.enableElement();
            };

            var name = $nameInput.val();
            $.get($(this).attr('href'), {profileName: name, agent: agent},function (response) {
                if (isDefined(response.error)) {
                    showError(response.error);
                } else if (isDefined(response.taken)) {
                    $('#loader').remove();

                    var showFeedback = function (message, status) {
                        $availability.append($('<label>', {text: message, generated: true}).attr('for', 'profileName').addClass(status + ' availabilityFeedback'));
                    };

                    if (response.taken == 'true') {
                        $nameInput.data(name, 'taken');
                        showFeedback('Profile name is taken.' + (agent != 'minecraft' ? ' If you already have this name in Minecraft you need to migrate your Minecraft profile to this Mojang account in order to claim the name here as well.' : ''), 'error');
                        $nameInput.addClass('error');
                    } else {
                        $nameInput.data(name, 'available');
                        showFeedback('Profile name is available.', 'success');
                        $chooseButton.enableElement();
                    }
                } else {
                    showError('Invalid response.');
                }
            }).error(function () {
                showError('An error occurred. Could not check if name was available.');
            });
        }

        e.preventDefault();
        return false;
    });

    updateProfileNameAvailability(inputSelector, $availabilityButton);
};

if (window.location.pathname.match(/\/me\/settings\/?/i)) {
    var restoreState = function (el) {
        $(el).removeClass('current');
        $(el).find('.settingsError').remove();
        $(el).find('.settings').show();
        $('.clicked').removeClass('clicked');
        $(el).find('.settingsForm').remove();
        $(document).unbind('keydown.cancelEdit');
    };

    var setError = function (el, message) {
        $(el).removeClass('current');
        $(el).find('.settings').hide();
        $('<div>').addClass('settingsError').text(message).appendTo($(el));
        window.setTimeout(restoreState, 2000, el);
    };

    var loadTwitchUsername = function () {
        var el = $('.settings.twitch');
        if (el.length > 0) {
            $.getJSON('/me/settings/twitch', function (data) {
                var username = data.username;
                el.children('.value').removeClass('loading');
                if (typeof username === 'undefined') {
                    var link = $('<a></a>').text('Connect to Twitch account').addClass('twitch-link').attr('href', twitchUri);
                    el.children('.value').removeClass('twitch-username').html('').append(link);
                    el.children('.link').html('&nbsp;');
                } else {
                    el.children('.value').addClass('twitch-username').text(username);
                    el.children('.link').text('Unbind');
                }
            });
        }
    };

    $(function () {
        var $settingsLink = $('a.settings');
        $settingsLink.ajaxStart(function () {
            $(this).attr('ajax', 'true');
        });

        loadTwitchUsername();

        var initialzeBraintreeHostedFields = function () {

            $.ajax(braintree_client_token).then(function (token, status, xhr) {
                braintree.setup(token, 'custom', {
                    id: 'billing-details-form',
                    hostedFields: {
                        number: {
                            selector: '#card-number'
                        },
                        cvv: {
                            selector: '#cvv'
                        },
                        expirationMonth: {
                            selector: '#expiration-month'
                        },
                        expirationYear: {
                            selector: '#expiration-year'
                        },
                        styles: {
                            // Style all elements
                            "input": {
                                "font-size": "14px",
                                "color": "#3A3A3A"
                            },

                            ".valid": {
                                "color": "green"
                            },
                            ".invalid": {
                                "color": "red"
                            }


                        }
                    },
                    onReady: onHostedFieldsReady,
                    onPaymentMethodReceived: onNonceRecieved,
                    onError: onNonceError
                });
            });

            BraintreeData.setup(braintree_merchant_id, 'billing-details-form', braintree_env);

            var $form = $('#billing-details-form');
            var clientFingerprint = $form.find('input[name="device_data"]').val();
            $('<input>').attr({
                type: 'hidden',
                name: 'purchase.deviceData',
                value: clientFingerprint
            }).appendTo($form);
            
        };

        var onHostedFieldsReady = function () {
            $('.braintree-hosted-field-loading').removeClass('braintree-hosted-field-loading');
        };

        var onNonceError = function (event) {
            reenableForm();
        };

        var onNonceRecieved = function (paymentMethod) {
            var $form = $('#billing-details-form');

            $form.find('#creditcard-nonce').val(paymentMethod.nonce);

            performCreditCardSave($form);

        };
        
        initialzeBraintreeHostedFields();

        var reenableForm = function () {
            var button = $('#billing-details-form button.primary');
            $('#loader').remove();
            button.show();
        };
        
        var performCreditCardSave = function (form) {

            form.ajaxSubmit({
                success: function (response) {
                    if (isDefined(response.errors)) {
                        validationFeedback(form, response);
                        reenableForm();
                    } else if (isDefined(response.error)) {
                        flashError(response.error, form);
                        reenableForm();
                    } else {
                        form.html(response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flashError('An error occurred. Please try again later.', form);
                }
            });
            
        };

        var toggleCreditCardForm = function(e) {
            $('#billing-details-form').toggle(0);
            $('.showCreditCardForm').parent().toggle(0);
            e.preventDefault();
        };

        $('.showCreditCardForm').click(toggleCreditCardForm);

        $('#billingDetails .cancel').click(toggleCreditCardForm);
        

        $('#billing-details-form button.primary').click(function (e) {
            var button = $(this).hide();
            $('<span>', {id: 'loader', html: 'Submitting&hellip;'}).insertAfter(button);
        });

        $settingsLink.ajaxStop(function () {
            $(this).removeAttr('ajax');
        });

        $(document).delegate('.settingsForm input', 'keydown', updateFieldValidation);
        $(document).delegate('.settingsForm input', 'change', updateFieldValidation);
        $(document).delegate('.settingsForm input', 'blur', updateFieldValidation);
        $(document).delegate('.settingsForm select', 'change', function (e) {
            $('.settingsForm .errorContainer').empty();
            $('.settingsForm .button').enableElement();
        });

        if (window.location.pathname.match(/\/me\/settings\/email\/?/i)) {
            mailcheck('#email');
        }

        if (typeof twitchUnbindBox !== 'undefined')
            $(document).delegate('#unbind-twitch', 'click', twitchUnbindBox);

        $(document).delegate('.settingsForm form', 'submit', function (e) {
            // When any settings form is submitted...
            var settingsForm = $(this);
            if (!settingsForm.hasClass('submitted')) {
                settingsForm.addClass('submitted');

                var button = settingsForm.find('.button').disableElement();
                button.data('originalText', button.text()).html('Saving&hellip;');

                $('.error').removeClass('error').remove();

                $.post(settingsForm.attr('action'), settingsForm.serialize(),function (data) {
                    if (data) {
                        var actionContainer = settingsForm.parent().siblings('a.settings').show();
                        var valueContainer = actionContainer.children('.value');
                        var editContainer = actionContainer.children('.link');

                        if (isDefined(data.errors)) {
                            actionContainer.hide();
                            validationFeedback(settingsForm, data);
                            $.scrollTo(settingsForm.parent());
                        } else if (isDefined(data.error)) {
                            flashError(data.error, settingsForm);
                            $.scrollTo(settingsForm.parent());
                        } else if (data.setting === 'password') {
                            if (data.status === 'ok') {
                                // Update password value element.
                                settingsForm.parent().siblings('a.settings').show().children('.value').text('Changed ' + data.passwordChanged);

                                // Restore state of original password container.
                                restoreState(settingsForm.parents('.settingsContainer'));
                            } else {
                                settingsForm.find('.button').removeClass('disabled').removeAttr('disabled').html('Save');

                                var errorContainer = $('<div>').addClass('error');
                                if (data.status === 'wrongpwd') {
                                    errorContainer.text('Wrong password');
                                    $('#currentPassword').addClass('error').after(errorContainer);
                                } else if (data.status === 'insecure') {
                                    errorContainer.html('Not strong enough! Must be at least 8 characters. Mix numbers, letters and symbols. <a href="http://help.mojang.com/customer/portal/articles/989614-choosing-a-good-password" target="_blank">Learn more</a>');
                                    $('#newPassword').addClass('error').after(errorContainer);
                                } else if (data.status === 'mismatch') {
                                    errorContainer.text('Confirmation does not match');
                                    $('#newPasswordAgain').addClass('error').after(errorContainer);
                                }
                            }
                        } else if (data.setting === 'email') {
                            if (data.status === 'ok') {
                                // Updated name value element.
                                settingsForm.parent().siblings('a.settings').show().children('.value').text(data.email);

                                // Restore state of original name container.
                                restoreState(settingsForm.parents('.settingsContainer'));
                            } else {
                                settingsForm.find('.button').removeClass('disabled').removeAttr('disabled').html('Save');

                                var errorContainer = $('<div></div>').addClass('error');
                                if (data.status === 'bad_token') {
                                    errorContainer.text('Invalid token, please reload page and try again.');
                                } else if (data.status === 'bad_email') {
                                    errorContainer.text('Bad e-mail address, make sure it is correct.');
                                } else if (data.status === 'mismatch') {
                                    errorContainer.text('Confirmation doesn\'t match, make sure the same e-mail is written twice.');
                                } else if (data.status === 'taken') {
                                    errorContainer.text('E-mail address already in use on another account.');
                                } else if (data.status === 'invalid_recipient') {
                                    errorContainer.html('Unexpected error, couldn\'t deliver verification e-mail. Please try again or <a href="https://help.mojang.com">contact customer support</a>.');
                                }
                                $('.emailError').append(errorContainer);
                            }
                        } else if (data.setting === 'name') {
                            // Updated name value element.
                            settingsForm.parent().siblings('a.settings').show().children('.value').text(data.firstname + ' ' + data.lastname);

                            // Restore state of original name container.
                            restoreState(settingsForm.parents('.settingsContainer'));
                        } else if (data.setting === 'birthdate') {
                            // Update birthdate value element.
                            settingsForm.parent().siblings('a.settings').show().children('.value').text(data.birthdate);

                            // Restore state of original birthdate container.
                            restoreState(settingsForm.parents('.settingsContainer'));
                        } else if (data.setting === 'secretQuestions') {
                            valueContainer.html(data.secured ? 'Your account is secure.' : '<span>Your account has not been secured!</span> Add security questions to secure your account.');
                            if (data.secured) {
                                valueContainer.removeClass('unsecured');
                                valueContainer.addClass('secured');
                            } else {
                                valueContainer.removeClass('secured');
                                valueContainer.addClass('unsecured');
                            }

                            // Restore state of original security questions container.
                            restoreState(settingsForm.parents('.settingsContainer'));
                        } else if (data.setting === 'emailSubscriptions') {
                            var subscriptionsInfo = 'Subscribing to ' + data.count + ' sendout';
                            if (data.count !== 1) {
                                subscriptionsInfo += 's';
                            }
                            subscriptionsInfo += '.';
                            valueContainer.html(subscriptionsInfo);
                            restoreState(settingsForm.parents('.settingsContainer'));
                        } else if (data.setting === 'unsubscribeAll') {
                            valueContainer.html('Not receiving any e-mails.');
                            editContainer.remove();
                            restoreState(settingsForm.parents('.settingsContainer'));
                        } else if (data.setting === 'resendSubscriptionConfirmation') {
                            valueContainer.html('Confirmation e-mail sent. Check your inbox, but please note that it may take a while for the e-mail to arrive.');
                            editContainer.remove();
                            actionContainer.attr('href', '#');
                            restoreState(settingsForm.parents('.settingsContainer'));
                        } else {
                            setError(settingsForm.parents('.settingsContainer'), 'Unknown setting (' + data.setting + ').');
                        }
                    } else {
                        setError(settingsForm.parents('.settingsContainer'), 'Invalid response.');
                    }
                    settingsForm.removeClass('submitted');
                }).error(function () {
                    settingsForm.removeClass('submitted');
                    setError(settingsForm.parents('.settingsContainer'), 'An error occurred.');
                });

            }

            e.preventDefault();
            return false;
        });

        var cancelEdit = function (e) {
            restoreState($('.settingsContainer.current'));
            e.preventDefault();
            return false;
        };

        $(document).delegate('a.cancel', 'click', cancelEdit);

        $settingsLink.click(function (e) {
            // When any "Edit" link is clicked...
            var editLink = $(e.currentTarget);
            var href = editLink.attr('href');
            if (href === '/me/settings/email' || href === '/me/settings/password' || href === '/me/settings/name' || href === '/me/settings/birthdate' || href === '/me/settings/secretQuestions' || href === '/me/settings/chooseSubscriptions' || href === '/me/settings/resendSubscriptionConfirmation' || href === '/me/settings/changeSecretQuestions' || href === '/me/settings/deleteCreditCard' || href === '/me/settings/billing_address') {
                if (editLink.attr('ajax') === undefined) {
                    if (!editLink.hasClass('clicked')) {
                        editLink.addClass('clicked');
                        // Reset currently displayed settings form.
                        var currentContainer = $('.settingsContainer.current');
                        if (currentContainer.length) {
                            currentContainer.children('.settings').show();
                            currentContainer.removeClass('current').children('.settingsForm').remove();
                        }

                        var link = editLink;
                        if (link.is('a') == false) {
                            link = editLink.children('.link');
                        }
                        link.attr('data-html', link.html());
                        link.addClass('loading').html('<img src="/images/ajax-loader.gif"/>');

                        $.get(href,function (data) {
                            $('.loading').html($('.loading').attr('data-html')).removeClass('loading');
                            $('.current').removeClass('current');

                            // Prepend header for certain setting views.
                            if (href === '/me/settings/name') {
                                data = '<h4>Change name</h4>' + data;
                            } else if (href === '/me/settings/birthdate') {
                                data = '<h4>Change birthdate</h4>' + data;
                            }

                            var form = $('<div>').addClass('settingsForm').html(data);

                            var settingsEl = editLink;
                            var depth = 0;
                            while (settingsEl.is('.settings') == false) {
                                depth += 1;
                                settingsEl = settingsEl.parent();
                                if (depth > 5 || settingsEl == $(document)) {
                                    log("Unable to find settings container to load form into");
                                    return;
                                }
                            }

                            var parent = settingsEl.parent();
                            depth = 0;
                            while (parent.is('.settingsContainer') == false) {
                                depth += 1;
                                parent = parent.parent();
                                if (depth > 5 || parent == $(document)) {
                                    log("Unable to find settings container to load form into");
                                    return;
                                }
                            }

                            parent.addClass('current').append(form);

                            if (href === '/me/settings/secretQuestions') {
                                setupSecretQuestionChoices();
                            }

                            $(document).bind('keydown.cancelEdit', 'esc', cancelEdit);

                            settingsEl.hide().removeClass('clicked');
                        }).error(function () {
                            setError(editLink.parent(), 'Couldn\'t load form. Refresh this page and try again.');
                            editLink.removeClass('clicked');
                        });
                    }
                }
            } else {
                return true;
            }

            e.preventDefault();
            return false;
        });

        var $deleteAccount = $('#deleteAccount');
        var $deletionRequestForm = $deleteAccount.find('form');

        var toggleDeleteAccount = function (e) {
            $deletionRequestForm.toggle();
            $deleteAccount.find('.learnHow').toggle();
            e.preventDefault();
            return false;
        };

        $deleteAccount.find('.show').click(toggleDeleteAccount);
        $deleteAccount.find('.cancel').click(toggleDeleteAccount);

        $deletionRequestForm.validate({
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    $form.find('.actions').hide();
                    var $loader = $('<p>').addClass('center').addClass('loading').append($('<img>', {src: '/images/ajax-loader.gif', css: {marginRight: '6px'}})).append($('<span>', {text: 'Sending instructions...'}));
                    $form.append($loader);
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.error)) {
                                flashError(response.error, $deleteAccount);
                            } else {
                                $('<p>', {text: 'Instructions sent. Go look in your inbox, but please note that it may take a while for the e-mail to arrive.'}).addClass('center').appendTo($form);
                            }
                            $loader.remove();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            flashError('An error occurred. Please try again later.', $form);
                            $loader.remove();
                        }
                    });
                }
            }
        });
    });
} else if (window.location.pathname.match(/\/buy/i)) {
    // iframe breakout.
    
    if (top.location != self.location) {
        top.location = self.location.href;
    } else {
        if (storeItem) {
            _gaq.push(['_trackEvent', 'Sales', 'Store-visited', storeItem]);
        }

        mailcheck('#purchase_shipTo');

        var prevSelectedPaymentMethod;

        var isCreditCard = function ($selectedPaymentMethod) {
            return $selectedPaymentMethod.val() === 'VSA' || $selectedPaymentMethod.val() === 'MSC' || $selectedPaymentMethod.val() === 'AMX';
        };

        var isCurrentCreditCard = function($selectedPaymentMethod){
            return $selectedPaymentMethod.is("#current-card");
        };

        var isNotGift = function ($shippingMethod) {
            return $shippingMethod && $shippingMethod.val() === 'self';
        };

        var updateCurrentCardOption = function ($shipAsInput) {
            if (isNotGift($shipAsInput)) {
                $('#payment-method-current-VSA,#payment-method-current-MSC,#payment-method-current-AMX').show();
            } else {
                var $selectedPaymentMethod = $('.payment-method input:checked');
                if ('current-card' === $selectedPaymentMethod.attr('id')) {
                    // Select VSA
                    $selectedPaymentMethod.prop('checked', false);
                    $('#VSA').prop('checked', true);
                }
                $('#payment-method-current-VSA,#payment-method-current-MSC,#payment-method-current-AMX').hide();
            }
        };

        var updateCreditCardStatus = function ($shipAsInput) {
            var $selectedPaymentMethod = $('.payment-method input:checked');
            if(isCurrentCreditCard($selectedPaymentMethod) && isNotGift($shipAsInput)){
                var cardId = $selectedPaymentMethod.attr('data-value');
                $('<input />', {value: cardId, name:'purchase.creditCardId', type:'hidden'}).appendTo($selectedPaymentMethod.parent());
                $('#checkoutPaymentDetails').hide();
                $('#purchase_useCurrentCardFailCheck').attr('disabled', 'true');
            }else if (isCreditCard($selectedPaymentMethod) && isNotGift($shipAsInput)) {
                $("input[name='purchase.creditCardId']").remove();
                $('#purchase_useCurrentCardFailCheck').removeAttr('disabled');
                $('#checkoutPaymentDetails').show();
            } else {
                $("input[name='purchase.creditCardId']").remove();
                $('#purchase_useCurrentCardFailCheck').removeAttr('disabled');
                $('#checkoutPaymentDetails').hide();
            }
        };

        var updateStoreCreditCard = function () {
            var $selectedPlan = $('#subscription-section .plans input:checked');
            if ($selectedPlan.hasClass('recurring')) {
                $('#storeCard').prop('checked', true).prop('disabled', true);
                $('.recurringPaymentInfoContainer').show();
                $('.recurringMethodsInfo').show();
                $('#checkoutPaymentDetails').append($('<input>', {type: 'hidden', name: 'purchase.storeCreditCard', id: 'storeCardHidden', value: '1'}));
            } else {
                $('.recurringPaymentInfoContainer').hide();
                $('.recurringMethodsInfo').hide();
                $('#storeCard').prop('checked', false).prop('disabled', false);
                $('#storeCardHidden').remove();
            }
        };

        var updateCheckoutButton = function () {
            var $selectedPaymentMethod = $('.payment-method input:checked');
            var $button = $('#payment-submit');
            $button.html(isCreditCard($selectedPaymentMethod) ? 'Purchase &raquo;' : 'Proceed to Payment Details &raquo;');
        };

        var showPaymentsForCountry = function (country, all) {

            var showAvailableForCountry = function (country, all) {
                $('.payment-method').hide();

                $('#payment-method-current-VSA').show();
                $('#payment-method-current-MSC').show();

                if (all) {
                    $('.payment-method-all').show();
                    $('.payment-method-' + country).show();
                } else {
                    $('.payment-method-all.visible').show();
                    $('.payment-method-' + country + '.visible').show();
                    $('.showMethods').show();
                }
            };

            if ($('#subscription-section').length) {
                var $selectedPlan = $('#subscription-section .plans input:checked');
                if ($selectedPlan.parents('.monthly').length) {
                    $('.payment-method').hide();
                    $('.showMethods').hide();
                    $('#payment-method-VSA,#payment-method-MSC,#payment-method-AMX').show();
                    $('#payment-method-current-VSA').show();
                    $('#payment-method-current-MSC').show();

                    var $selectedPaymentMethod = $('.payment-method input:checked');
                    if (!$selectedPaymentMethod.is(':visible')) {
                        $selectedPaymentMethod.prop('checked', false);
                        prevSelectedPaymentMethod = $selectedPaymentMethod.val();
                        $('#VSA').prop('checked', true);
                        $('#checkoutPaymentDetails').show();
                    }
                } else {
                    showAvailableForCountry(country, all);
                    if (isDefined(prevSelectedPaymentMethod)) {
                        var $previouslySelectedMethod = $('#' + prevSelectedPaymentMethod);
                        $previouslySelectedMethod.prop('checked', true);
                        $previouslySelectedMethod.parent().show();
                    }
                }

                updateStoreCreditCard();
            } else {
                $('.recurringPaymentInfoContainer').hide();
                showAvailableForCountry(country, all);
            }
        };

        var serializeElement = function (el) {
            var serialized = '';
            $(el).find('input,textarea,select').each(function () {
                var $this = $(this);
                var checkable = $this.attr('type') == 'checkbox' || $this.attr('type') == 'radio';
                if (!checkable || $this.prop('checked')) {
                    if (serialized.length) {
                        serialized += '&';
                    }
                    serialized += $this.attr('name') + '=' + $this.val();
                }
            });
            return serialized;
        };

        var updateSubscriptionTotal = function () {
            if ($('#subscription-section').length) {
                var $selectedPlan = $('#subscription-section .plans input:checked');
                if ($selectedPlan.length) {
                    if ($selectedPlan.parents('.monthly').length) {
                        $('#subscription-section .perMonthPrice').show();
                    } else {
                        $('#subscription-section .perMonthPrice').hide();
                    }

                    var selectedPlan = $selectedPlan.val();
                    var $totalPrice = $('#subscription-section .totalPrice');
                    var $payment = $('.payment-method input:checked');
                    var paypal = $payment.val() == 'paypal';
                    $totalPrice.text(paypal ? paypalPrices[selectedPlan] : originalPrices[selectedPlan]);
                }
            }
        };

        var showSubscriptionWarning = function(message) {
            hideSubscriptionWarning();
            var $warningMessage = $('<p>', {text: message}).addClass('subscriptionWarning');
            $warningMessage.insertBefore($('.plans .totalSum'));
        };

        var hideSubscriptionWarning = function() {
            $('.plans .subscriptionWarning').remove();
        };

        var initialzeBraintreeHostedFields = function () {

            $.ajax(braintree_client_token).then(function (token, status, xhr) {
                braintree.setup(token, 'custom', {
                    id: 'checkout-form',
                    hostedFields: {
                        number: {
                            selector: '#card-number'
                        },
                        cvv: {
                            selector: '#cvv'
                        },
                        expirationMonth: {
                            selector: '#expiration-month'
                        },
                        expirationYear: {
                            selector: '#expiration-year'
                        },
                        styles: {
                            // Style all elements
                            "input": {
                                "font-size": "14px",
                                "color": "#3A3A3A"
                            },
                        
                            ".valid": {
                                "color": "green"
                            },
                            ".invalid": {
                                "color": "red"
                            }

                           
                        }
                    },
                    onReady: onHostedFieldsReady,
                    onPaymentMethodReceived: onNonceRecieved,
                    onError: onNonceError
                });
            });

            BraintreeData.setup(braintree_merchant_id, 'checkout-form', braintree_env);

            var $form = $('#checkout-form');
            var clientFingerprint = $form.find('input[name="device_data"]').val();
            $('<input>').attr({
                type: 'hidden',
                name: 'purchase.deviceData',
                value: clientFingerprint
            }).appendTo($form);
            

        };
        
        var onHostedFieldsReady = function () {
          $('.braintree-hosted-field-loading').removeClass('braintree-hosted-field-loading');
        };
        
        var onNonceError = function (event) {
        };
        
        var onNonceRecieved = function (paymentMethod) {
          
            var $form = $('#checkout-form');
            
            $form.find('#creditcard-nonce').val(paymentMethod.nonce);
            
            performCheckout($form);
            
        };

        var performCheckout = function (form) {
            
            form.ajaxSubmit({
                success: function (response) {
                    var invalidResponse = function () {
                        flashError('Invalid response. Your purchase has been aborted.');
                        reenableForm();
                    };

                    if (isDefined(response.errors)) {
                        validationFeedback(form, response);
                        reenableForm();
                    } else if (isDefined(response.error)) {
                        flashError(response.error, form);
                        reenableForm();
                    } else if (isDefined(response.provider)) {
                        if (response.provider == 'paypal' && isDefined(response.paypalUrl)) {
                            $('#loader').html('Redirecting to PayPal&hellip;');
                            window.location.href = response.paypalUrl;
                        } else if (response.provider == 'moneybookers' && isDefined(response.mbForm)) {
                            $('#loader').html('Loading details form&hellip;');
                            var $newForm = $(response.mbForm);
                            var $frame = $('#mb-iframe').show();
                            form.parent().append($newForm);
                            $newForm.attr('target', $frame.attr('name')).hide();
                            $newForm.submit();
                            form.hide();
                        } else if (response.provider == 'braintree') {
                            window.location.href = '/checkout/receipt';
                        } else {
                            invalidResponse();
                        }
                    } else {
                        invalidResponse();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    flashError('An error occurred. Please try again later.', form);
                    reenableForm();
                }
            });
        };

        var reenableForm = function () {
            var showSysReqs = $('.showSysReqs');
            var button = $('#payment-submit');
            var $form = $('#checkout-form');
            $('#loader').remove();
            button.show();
            showSysReqs.show();
            $form.removeClass('submitted');
            $.scrollTo($('h1'), 200);
        };



        var updateSubscriptionWarningMessage = function() {
            if ($('#subscription-section').length) {
                // Show warning message when changing subscription types.
                var selectedPlan = $('#subscription-section .plans input:checked').val();
                var selectedRecurring = selectedPlan.indexOf('recurring') > -1;
                if (selectedRecurring && !currentRecurring && currentManual) {
                    showSubscriptionWarning('You\'re about to change the subscription type for your world from manual renewal to automatic. Any remaining days that you still have will be appended to your new subscription.');
                } else if (!selectedRecurring && currentRecurring && recurringActive) {
                    showSubscriptionWarning('You\'re about to change the subscription type for your world from automatic renewal to manual. This will cancel any future recurring payments for the world. Any remaining days that you still have will be appended to your new subscription.');
                } else {
                    hideSubscriptionWarning();
                }
            }
        };

        $(function () {
            if ($('#checkout-form').length) {

                var prevSelectedShipAs = $('.shipping-method:checked').val();
                prevSelectedPaymentMethod = $('.payment-method:checked').val();

                initialzeBraintreeHostedFields();
                
                updateSubscriptionTotal();

                showPaymentsForCountry(country);

                updateSubscriptionWarningMessage();

                var shipAsInput = $('input[name="purchase.shipAs"]:checked');
                if (!shipAsInput.length) {
                    shipAsInput = $('input[name="purchase.shipAs"][type="hidden"]');
                }
                updateCreditCardStatus(shipAsInput);
                updateCurrentCardOption(shipAsInput);

                updateCheckoutButton();

                $(document).delegate('.showSysReqs, .hideSysReqs, .sysReqs h3', 'click', function (e) {
                    $('.sysReqs, .showSysReqs').toggle();
                    e.preventDefault();
                    return false;
                });

                $(document).delegate('#world-section .existing-worlds input', 'click', function (e) {
                    var $checked = $('#world-section .existing-worlds input:checked');
                    var $header = $('.storeItemHead');
                    $header.text($checked.val() == -1 ? 'Buy Realms Subscription' : 'Extend Realms Subscription');
                });

                $('#shipas-gift').click(function (event) {
                    $('#shipTo').show();
                });

                $(document).delegate('#gift-section .gift .label', 'click', function () {
                    if (!$('#gift-section .paypal-error').length) {
                        var $checked = $('#gift-section input:checked');
                        var $code = $('#shipas-code');
                        if ($checked.val() == 'self' && $code.length) {
                            $checked.prop('checked', false);
                            $code.prop('checked', true);
                        }
                    }
                });

                $(document).delegate('#subscription-section .plans input', 'click', function (e) {
                    updateSubscriptionTotal();
                    showPaymentsForCountry(country);
                    updateSubscriptionWarningMessage();
                });

                $(document).delegate('#userCountry', 'change', function(e) {
                    country = $(this).val();
                    showPaymentsForCountry(country);
                });

                
                //TODO: remove setExpirationDate func and calls to this func
                function setExpirationDate() {
                    var month = $('#purchase_creditCardExpirationMonth').val();
                    var year = $('#purchase_creditCardExpirationYear').val();
                    var expiration = month + '/' + year;
                    $('#purchase_creditCardExpiration').val(expiration);
                }

                //TODO: remove purchase_creditCardExpirationMonth and purchase_creditCardExpirationYear code
                $('#purchase_creditCardExpirationMonth').change(function () {
                    setExpirationDate();
                });
                $('#purchase_creditCardExpirationYear').change(function () {
                    setExpirationDate();
                });

                $('.payment-method').each(function () {
                    var method = $(this)[0];
                    var methodName = method.id.replace('payment-method-', '');
                    if (methodName) {
                        $(method).css('background-image', 'url(/images/payment/' + methodName + '.png)');
                    }
                });

                $(document).delegate('.showMethods', 'click', function (e) {
                    showPaymentsForCountry(country, true);
                    $(this).hide();

                    e.preventDefault();
                    return false;
                });

                $('#shipas-code,#shipas-self').click(function () {
                    $('#shipTo').hide();
                });

                $(document).delegate('#accept-terms', 'change', function (e) {
                    $('.error.purchase_acceptTerms').remove();
                });

                // THIS IS THE FORM SUBMIT 
                var checkout = function ($form) {
                    
                    var highlightInvalidField = function (input, message, scrollTo) {
                        highlightInvalid(input, 'error', 'valid');
                        $('<label>', {generated: true, text: message}).attr('for', input.attr('id')).addClass('error').insertAfter(input);
                        if (scrollTo) {
                            $.scrollTo(scrollTo, 200);
                        }
                    };

                    if (!$form.hasClass('submitted')) {
                        $form.addClass('submitted');
                        var shipAs = $('input[name="purchase.shipAs"]:checked').val();
                        if (shipAs == 'gift') {
                            var input = $('#shipTo input');
                            if (!input.val()) {
                                highlightInvalidField(input, 'Required', '#gift-section');
                                $form.removeClass('submitted');
                                return false;
                            }
                        }

                        var $selectedPaymentMethod = $('.payment-method input:checked');
                        var creditCard = isCreditCard($selectedPaymentMethod);

                        if ($('#subscription-section').length) {
                            var $selectedPlan = $('#subscription-section .plans input:checked');
                            if ($selectedPlan.length && $selectedPlan.hasClass('recurring') && !creditCard) {
                                highlightInvalidField($selectedPaymentMethod, 'Not valid for recurring payments');
                                $form.removeClass('submitted');
                                return false;
                            }
                        }

                        var addValidationError = function(target, message){
                            target.addClass('error');
                            target.siblings('div.error').remove();
                            $('<div>').addClass('error').text(message).insertAfter(target).show();
                        };

                        var shipAsInput = $('input[name="purchase.shipAs"]:checked');
                        if (!shipAsInput.length) {
                            shipAsInput = $('input[name="purchase.shipAs"][type="hidden"]');
                        }

                        var showSysReqs = $('.showSysReqs').parent().hide();
                        $('.sysReqs').hide();

                        var button = $('#payment-submit').hide();
                        $('<span>', {id: 'loader', html: creditCard ? 'Processing&hellip;' : 'Submitting&hellip;'}).insertAfter(button);
                        
                        var isTermsAccepted = function() {
                            var termsAccepted = false;
                            if ($('#accept-terms').length && $('#accept-terms').is(':visible') && !$('#accept-terms').is(':checked')) {
                                addValidationError($('#accept-terms').parent(), 'You need to accept the ' + storeItem + ' terms');
                            } else {
                                termsAccepted = true;
                            }
                            return termsAccepted;
                        };
                        
                        var gift = !isNotGift(shipAsInput);
                        var termsAccepted = isTermsAccepted();

                        var newCreditCardWithDetails = $('#checkoutPaymentDetails').is(":visible");
                        
                        if(termsAccepted && !newCreditCardWithDetails){
                            performCheckout($form);
                        }else{
                            reenableForm();
                        }

                    }
                };

                $('#checkout-form').validate({
                    rules: {
                        'purchase.shipTo': {
                            email: true,
                            required: true
                        }
                    },
                    messages: {
                        'purchase.shipTo': {
                            email: 'Invalid e-mail address',
                            required: 'Required'
                        }
                    },
                    highlight: highlightInvalid,
                    unhighlight: unhighlightValid,
                    submitHandler: function (form) {
                        checkout($(form));
                    }
                });

                var cancelNameEdit = function (e) {
                    printName($('#name'));
                    e.preventDefault();
                    return false;
                };

                $(document).delegate('#name .cancel', 'click', cancelNameEdit);

                $(document).delegate('#name input', 'keydown', updateFieldValidation);
                $(document).delegate('#name input', 'change', updateFieldValidation);
                $(document).delegate('#name input', 'blur', updateFieldValidation);

                var submitName = function (button, onSuccess, onError) {
                    if (!button.hasClass('submitted')) {
                        button.addClass('submitted');
                        $('#name .settingsError,#name div.error').remove();
                        $('#name').find('.button').disableElement().html('Loading&hellip;');
                        $.post('/me/settings/name', serializeElement($('#name')),function (data) {
                            if (isDefined(data.errors)) {
                                validationFeedback($('#name'), data);
                                if (typeof onError === 'function') {
                                    onError();
                                }
                            } else {
                                name = escapeHtml(data.firstname + ' ' + data.lastname);
                                hasName = true;
                                printName($('#name'));
                                $(document).unbind('keydown.cancelNameEdit');
                                if (typeof onSuccess === 'function') {
                                    onSuccess();
                                }
                            }
                            $('#name').find('.button').removeClass('submitted');
                        }).error(function () {
                            $('<div>').addClass('settingsError').text('Unable to save name. Please try again.').appendTo($('#name'));
                            $('#name').find('.button').enableElement().html('Save').removeClass('submitted');
                            if (typeof onError === 'function') {
                                onError();
                            }
                        });
                    }
                };

                $(document).delegate('#name button[type=submit]', 'click', function (e) {
                    submitName($(this));
                    e.preventDefault();
                    return false;
                });

                $(document).delegate('#name-edit', 'click', function (e) {
                    $(document).bind('keydown.cancelNameEdit', 'esc', cancelNameEdit);

                    $.get('/me/settings/name',function (data) {
                        $('#name').html(data);
                    }).error(function () {
                        $('#name').html('<p class="error">An error occurred. Could not load form.</p>');
                    });

                    e.preventDefault();
                    return false;
                });

                var cancelBirthdateEdit = function (e) {
                    printBirthdate($('#birthdate'));
                    e.preventDefault();
                    return false;
                };

                $(document).delegate('#birthdate .cancel', 'click', cancelBirthdateEdit);

                $(document).delegate('#birthdate select', 'change', updateFieldValidation);

                var submitBirthdate = function (button, onSuccess, onError) {
                    if (!button.hasClass('submitted')) {
                        button.addClass('submitted');
                        $('#birthdate .settingsError,#birthdate div.error').remove();
                        $('#birthdate').find('.button').disableElement().html('Loading&hellip;');
                        $.post('/me/settings/birthdate', serializeElement($('#birthdate')),function (data) {
                            if (isDefined(data.errors)) {
                                validationFeedback($('#birthdate'), data);
                                if (typeof onError === 'function') {
                                    onError();
                                }
                            } else {
                                dateOfBirth = data.birthdate;
                                hasDateOfBirth = true;
                                printBirthdate($('#birthdate'));
                                $(document).unbind('keydown.cancelBirthdate');
                                if (typeof onSuccess === 'function') {
                                    onSuccess();
                                }
                            }
                            $('#birthdate').find('.button').removeClass('submitted');
                        }).error(function () {
                            $('<div>').addClass('settingsError').text('Unable to save date of birth. Please try again.').appendTo($('#birthdate'));
                            $('#birthdate').find('.button').enableElement().html('Save').removeClass('submitted');
                            if (typeof onError === 'function') {
                                onError();
                            }
                        });
                    }
                };

                $(document).delegate('#birthdate button[type=submit]', 'click', function (e) {
                    submitBirthdate($(this));
                    e.preventDefault();
                    return false;
                });

                $(document).delegate('#birthdate-edit', 'click', function (e) {
                    $(document).bind('keydown.cancelBirthdate', 'esc', cancelBirthdateEdit);

                    $.get('/me/settings/birthdate',function (data) {
                        $('#birthdate').html(data);
                    }).error(function () {
                        $('#birthdate').html('<p class="error">An error occurred. Could not load form.</p>');
                    });

                    e.preventDefault();
                    return false;
                });

                var updatePricesAndCurrency = function (currency, prices) {
                    for (var i in products) {
                        var product = products[i];
                        var $productContainer = $('.product-' + product);
                        if ($productContainer) {
                            $productContainer.find('.currency').text(currency);
                            $productContainer.find('.price').html(prices[product]);
                        }

                        var $head = $('h1.storeItemHead');
                        if ($head && !$('#subscription-section').length) {
                            $head.html(storeItem + ': ' + prices[product] + ' <span>(' + currency + ')</span>');
                        }
                    }

                    $('input[name="purchase.currency"]').val(currency);
                };

                var updatePayPalStatus = function (paymentMethodInput, shipAsInput) {
                    if (paymentMethodInput.val() == 'paypal') {
                        if (shipAsInput.val() != 'self') {
                            $('.paypal-error').remove();
                            $('input[name="purchase.shipAs"]').prop('checked', false).not('#shipas-self').parents('p').hide();
                            var error = $('<p>', {text: 'Sorry! It is currently not possible to purchase gift codes using PayPal. Please pick a different payment method.'}).addClass('error').addClass('paypal-error');
                            paymentMethodInput.parent().append(error);
                            $('#gift-section .gift').append(error.clone());
                            $('#payment-submit').hide();
                            $('#shipTo').hide();
                            shipAsInput.prop('checked', false);
                        } else {
                            $('#payment-method-paypal .paypal-error').remove();
                            $('#payment-submit').show();
                        }
                        updatePricesAndCurrency('EUR', paypalPrices);
                    } else {
                        if (isDefined(prevSelectedShipAs)) {
                            $('input[value="' + prevSelectedShipAs + '"]').prop('checked', true);
                            if (prevSelectedShipAs == 'gift') {
                                $('#shipTo').show();
                            }
                        } else {
                            var self = $('input[value="self"]');
                            if (self.length) {
                                self.prop('checked', true);
                            } else {
                                $('input[value="code"]').prop('checked', true);
                            }
                        }
                        $('input[name="purchase.shipAs"]').parents('p').show();
                        $('.paypal-error').remove();
                        $('#payment-submit').show();
                        updatePricesAndCurrency(currencyOriginal, originalPrices);
                    }

                    updateSubscriptionTotal();
                };

                var updateTerms = function (shipAsInput) {
                    if (!shipAsInput || shipAsInput.val() == 'self') {
                        $('.termsContainer').show();
                    } else {
                        $('.termsContainer').hide();
                    }
                };

                $(document).delegate('.shipping-method', 'click', function (e) {
                    prevSelectedShipAs = $(this).val();
                    updatePayPalStatus($('input[name="purchase.paymentMethod"]:checked'));
                    updateCreditCardStatus($(this));
                    updateCurrentCardOption($(this));
                    updateTerms($(this));
                });

                $(document).delegate('.payment-method input', 'click', function (e) {
                    var shipAsInput = $('input[name="purchase.shipAs"]:checked');
                    if (!shipAsInput.length) {
                        shipAsInput = $('input[name="purchase.shipAs"][type="hidden"]');
                    }
                    updatePayPalStatus($(this), shipAsInput);
                    updateCreditCardStatus(shipAsInput);
                });

                updateTerms($('.shipping-method'));
            }
        });
    }
} else if (window.location.pathname.match(/\/checkout\/legacy\/receipt/)) {
    if (storeItem && storeItemPrice) {
        _gaq.push(['_trackEvent', 'Sales', 'Purchase-completed', storeItem, storeItemPrice]);
    }
} else if (window.location.pathname.match(/\/terms$/i)) {
    $(function () {
        $('#terms-form').submit(function (e) {
            if (!$('#accept-terms').is(':checked')) {
                alert(i18n('terms.haveToAgree'));
                e.preventDefault();
            }
        });

        var toggleDocument = function (anchor) {
            if (anchor && $(anchor)) {
                var $tab = $('.' + anchor.substring(1));
                if ($tab && !$tab.hasClass('selected')) {
                    $('.document').hide();
                    $('.tabs .selected').removeClass('selected');
                    $(anchor).show();
                    $tab.addClass('selected');
                }
            }
        };

        var toggleFull = function (e) {
            var toggleTerms = function () {
                if ($('#terms-full').is(':visible')) {
                    $('#toggle-terms').text(i18n('terms.hideFull'));
                    $.scrollTo('#terms-full', 600);
                    toggleDocument(window.location.hash);
                } else {
                    $('#toggle-terms').html(i18n('terms.showFull') + ' &raquo;');
                }
            };

            if (e && e.target.id == 'show-terms') {
                $('#terms-full').show(toggleTerms);
            } else {
                $('#terms-full').toggle(0, toggleTerms);
            }
        };

        if (window.location.hash) {
            toggleFull();
        }

        $('.toggle-terms').click(function (e) {
            toggleFull(e);
            e.preventDefault();
        });

        $('#terms-menu a, #terms-text a').click(function (e) {
            var anchor = $(this).attr('href');
            if (anchor.indexOf('#') == 0) {
                toggleDocument(anchor);
                e.preventDefault();
            }
        });
    });
} else if (window.location.pathname.match(/\/migrate\/import$/i)) {
    $(function () {
        $('.button').enableElement();

        $('#importForm').validate({
            rules: {
                'importRequest.mcusername': 'required',
                'importRequest.password': 'required',
                'importRequest.acceptsTerms': 'required'
            },
            messages: {
                'importRequest.mcusername': 'Required',
                'importRequest.password': 'Required',
                'importRequest.acceptsTerms': 'You must accept the Terms and Conditions and the EULA'
            },
            highlight: highlightMigrationAndRemoveBackendErrors,
            unhighlight: unhighlightMigrationValidAndRemoveBackendErrors,
            errorPlacement: function (error, element) {
                element.siblings('div.error').remove();
                if (element.attr('type') === 'checkbox') {
                    var label = element.siblings('label');
                    error.insertAfter(label);
                } else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
                var $buttonContainer = $('#migrate .buttonContainer');
                $buttonContainer.find('.flash.error').remove();

                var $form = $(form);

                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    $form.find('.button').hide();
                    $form.append($('<span>', {id: 'loader', text: 'Checking account status'}));
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.errors)) {
                                validationFeedback($form, response);
                                $('#loader').remove();
                                $('.button').show();
                                $form.removeClass('submitted');
                            } else if (isDefined(response.error)) {
                                flashError(response.error, $buttonContainer);
                                $form.removeClass('submitted');
                            } else {
                                var $migrate = $('#migrate').empty();
                                flashSuccess('You have now imported your old Minecraft account.<br />From now on you need to use your Mojang account e-mail address and password to log in to Minecraft and minecraft.net.', $migrate);
                                $migrate.append($('<p>').append($('<a>', {href: '/me', text: 'Go to account overview'})));
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            flashError('An error occurred. Please try again later.', $buttonContainer);
                            $form.removeClass('submitted');
                        }
                    });
                }
            }
        });
    });
} else if (window.location.pathname.match(/\/migrate$/i)) {
    $(function () {
        $('.button').enableElement();

        mailcheck('#migrationRequest_email');

        $('#migrationForm').validate({
            rules: {
                'migrationRequest.mcusername': 'required',
                'migrationRequest.password': 'required',
                'migrationRequest.email': {
                    required: true,
                    email: true
                },
                'migrationRequest.emailAgain': {
                    required: true,
                    email: true,
                    equalTo: '#migrationRequest_email'
                },
                'migrationRequest.acceptsTerms': 'required',
                'migrationRequest.yearOfBirth' : {
                    required:true,
                    min:1
                },
                'migrationRequest.monthOfBirth' : {
                    required:true,
                    min:1
                },
                'migrationRequest.dayOfBirth' : {
                    required:true,
                    min:1
                }
            },
            messages: {
                'migrationRequest.mcusername': 'Required',
                'migrationRequest.password': 'Required',
                'migrationRequest.email': {
                    required: 'Required',
                    email: 'Must be a valid e-mail address'
                },
                'migrationRequest.emailAgain': {
                    required: 'Required',
                    email: 'Must be a valid e-mail address',
                    equalTo: 'E-mail addresses must match'
                },
                'migrationRequest.acceptsTerms': 'You must accept the Terms and Conditions and the EULA',
                'migrationRequest.yearOfBirth': {
                    required: 'Required',
                    min: 'Required'
                },
                'migrationRequest.monthOfBirth' : {
                    required:'Required',
                    min:'Required'
                },
                'migrationRequest.dayOfBirth' : {
                    required:'Required',
                    min:'Required'
                }
            },
            highlight: highlightMigrationAndRemoveBackendErrors,
            unhighlight: unhighlightMigrationValidAndRemoveBackendErrors,
            errorPlacement: function (error, element) {
                element.siblings('div.error').remove();
                if (element.attr('type') === 'checkbox') {
                    var label = element.siblings('label');
                    error.insertAfter(label);
                } else if(element.hasClass('dateOfBirth')){
                    $('#dateOfBirthError').replaceWith(error);
                } else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
                var $buttonContainer = $('#migrate .buttonContainer');
                $buttonContainer.find('.flash.error').remove();

                var $form = $(form);

                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    $form.find('.button').hide();
                    $form.append($('<span>', {id: 'loader', text: 'Checking account status'}));
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.errors)) {
                                validationFeedback($form, response);
                                $('#loader').remove();
                                $('.button').show();
                                $form.removeClass('submitted');
                            } else if (isDefined(response.error)) {
                                flashError(response.error, $buttonContainer);
                                $form.removeClass('submitted');
                            } else {
                                var verifiedString = isDefined(response.verified) && response.verified === 'false' ? ' We\'ve sent you a verification e-mail to ensure that your e-mail address is valid.' : '';
                                var $migrate = $('#migrate').empty();
                                flashSuccess('You have now migrated your old Minecraft account.' + verifiedString + '<br />From now on you need to use your Mojang account e-mail address instead of your Minecraft username to log in to Minecraft and minecraft.net.', $migrate);
                                $migrate.append($('<p>').append($('<a>', {href: '/login', text: 'Log in to your new account'})));
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            flashError('An error occurred. Please try again later.', $buttonContainer);
                            $form.removeClass('submitted');
                        }
                    });
                }
            }
        });
    });
} else if (window.location.pathname.match(/\/redeem\/verifyEmail/i)) {
    $(function () {
        var $redeem = $('#redeem');
        $.post('/redeem/verifyEmail', {changeEmailToken: token, authenticityToken: authenticityToken},function (response) {
            if (isDefined(response.error)) {
                showError($redeem, response.error);
            } else {
                $redeem.empty().html(response);
            }
        }).error(function () {
            showError($redeem, 'An error occurred. Please try again later.');
        });
    });
} else if (window.location.pathname.match(/^\/demo/i)) {
    $(function() {
        $.validator.addMethod('regexp', function (value, element, param) {
            return this.optional(element) || value.match(param);
        }, 'This value doesn\'t match the acceptable pattern.');

        $('#createProfileForm').validate({
            rules: {
                profileName: {
                    required: true,
                    minlength: 3,
                    maxlength: 16,
                    regexp: /^\w+$/i
                },
                acceptTerms: 'required'
            },
            messages: {
                profileName: {
                    required: 'You need to enter a profile name.',
                    minlength: 'Please choose a name that is longer than 2 characters.',
                    maxlength: 'Please choose a name that is shorter than 16 characters.',
                    regexp: 'Please stick to letters, numbers and _.'
                },
                acceptTerms: 'You must accept the ' + game + ' EULA.'
            },
            highlight: function (element, errorClass, validClass) {
                updateProfileNameAvailability('#profileName', $('.availability .button'));
                $('.specificFeedback').remove();
                highlightInvalid(element, errorClass, validClass);
            },
            unhighlight: unhighlightValid,
            errorPlacement: function (error, element) {
                if (element.attr('type') === 'checkbox') {
                    error.appendTo($('#acceptTermsField')).css('clear', 'both');
                } else {
                    error.appendTo($('#profileNameField')).css('clear', 'both');
                }
            },
            submitHandler: function (form) {
                var $form = $(form);
                var name = $form.find('input[name="profileName"]').val();
                modalWindow('Are you sure that you want "' + name + '" to be your profile name for ' + game + '?', 'This name will be displayed to other players in the game.', function () {
                    hideModalWindow();
                    if (!$form.hasClass('submitted')) {
                        $form.addClass('submitted');
                        var $redeem = $('#redeem');

                        $form.find('.button').hide();
                        $('<span>', {id: 'loader', html: 'Checking profile name&hellip;'}).appendTo($form);
                        $form.ajaxSubmit({
                            success: function (response) {
                                if (isDefined(response.errors)) {
                                    validationFeedback(form, response);
                                    $form.find('.button').show();
                                    $('#loader').remove();
                                } else if (isDefined(response.error)) {
                                    specificValidationFeedback('profileName', form, response, $('.availability'));
                                } else {
                                    $('.flash').remove();
                                    $('#demo').empty().html(response);
                                }
                                $form.removeClass('submitted');
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                flashError('An error occurred. Please try again later.', $redeem);
                                $form.removeClass('submitted');
                            }
                        });
                    }
                }, function () {
                    hideModalWindow();
                });
            }
        });

        profileNameAvailability('#profileName', $('.availability .button'), $('#chooseButton'));

        $(document).delegate('.accept-terms', 'change', function (e) {
            $('.error.acceptTerms').remove();
        });
    });
} else if (window.location.pathname.match(/\/redeem/i)) {
    $(function () {
        $('.button').enableElement();
        var isPrepaidCode = function (code) {
            code = code.trim();
            return code.match(/^[\d|\s]+$/);
        };

        var isGiftCode = function (code) {
            code = code.trim().replace(/\s+/g, ' ');
            return code.match(/^([A-z0-9]{4}-){2}[A-z0-9]{4}$/) || code.match(/^([A-z0-9]{5}-){4}[A-z0-9]{5}$/);
        };

        var isRealmsCode = function (code) {
            code = code.trim().replace(/\s+/g, ' ');
            var realms = "realms";
            return code.toLowerCase().substring(0, realms.length) == realms || code.match(/^[S|R]-([A-z0-9]{4}-){2}[A-z0-9]{4}$/) || code.match(/^[S|R]-([A-z0-9]{5}-){4}[A-z0-9]{5}$/);
        };

        $.validator.addMethod('validCode', function (value, element) {
            return isPrepaidCode(value) || isGiftCode(value) || isRealmsCode(value);
        }, 'Not a valid code.');

        var $redeem = $('#redeem');

        $('#redeemCodeForm').validate({
            rules: {
                code: {
                    required: true,
                    validCode: true
                }
            },
            messages: {
                code: {
                    required: 'You need to enter your gift code.'
                }
            },
            highlight: function (element, errorClass, validClass) {
                $('.specificFeedback').remove();
                highlightInvalid(element, errorClass, validClass);
            },
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var code = $('#code').val();
                if (isPrepaidCode(code)) {
                    var showUnavailable = function () {
                        $('#redeem').empty().append($('<p>', {text: 'We are currently unable to redeem any prepaid cards. We are doing our very best to resolve this issue as soon as possible.'}).addClass('error'));
                    };

                    var $form = $(form);
                    if (!$form.hasClass('submitted')) {
                        $form.addClass('submitted');
                        var button = $form.find('.button').hide();
                        $('<span>', {id: 'loader', html: 'Validating card status&hellip;'}).insertAfter(button);

                        var showError = function () {
                            flashError('An error occurred. Please try again later.', $redeem);
                            $form.removeClass('submitted');
                        };

                        $.get('/prepaid/healthCheck',function (response) {
                            if (isDefined(response.error)) {
                                showUnavailable();
                            } else {
                                $('#loader').html('Redeeming card&hellip;');
                                $.post('/prepaid/status', { authenticityToken: authenticityToken, pin: code },function (response) {
                                    if (isDefined(response.error)) {
                                        specificValidationFeedback('code', form, response);
                                        $form.removeClass('submitted');
                                    } else {
                                        $.post('/prepaid/redeem', { authenticityToken: authenticityToken, pin: code },function (response) {
                                            if (isDefined(response.error)) {
                                                specificValidationFeedback('code', form, response);
                                            } else if (isDefined(response.code)) {
                                                window.location.href = ('subscription' === response.type ? '/subscription/' : '/redeem/') + encodeURIComponent(response.code);
                                            } else {
                                                flashError('Invalid response. Please try again later.', $redeem);
                                            }
                                            $form.removeClass('submitted');
                                        }).error(showError);
                                    }
                                }).error(showError);
                            }
                        }).error(showUnavailable);
                    }
                } else {
                    var $form = $(form);
                    if (!$form.hasClass('submitted')) {
                        $form.addClass('submitted');

                        var button = $form.find('.button').hide();
                        $('<span>', {id: 'loader', html: 'Validating gift code&hellip;'}).insertAfter(button);
                        $form.ajaxSubmit({
                            success: function (response) {
                                if (isDefined(response.error)) {
                                    specificValidationFeedback('code', form, response);
                                } else if (isDefined(response.code)) {
                                    window.location.href = ('subscription' === response.type ? '/subscription/' : '/redeem/') + encodeURIComponent(response.code);
                                } else {
                                    flashError('Invalid response. Please try again later.', $redeem);
                                }
                                $form.removeClass('submitted');
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                flashError('An error occurred. Please try again later.', $redeem);
                                $form.removeClass('submitted');
                            }
                        });
                    }
                }
            }
        });

        $.validator.addMethod('regexp', function (value, element, param) {
            return this.optional(element) || value.match(param);
        }, 'This value doesn\'t match the acceptable pattern.');

        $('#createProfileForm').validate({
            rules: {
                profileName: {
                    required: true,
                    minlength: 3,
                    maxlength: 16,
                    regexp: /^\w+$/i
                }
            },
            messages: {
                profileName: {
                    required: 'You need to enter a profile name.',
                    minlength: 'Please choose a name that is longer than 2 characters.',
                    maxlength: 'Please choose a name that is shorter than 16 characters.',
                    regexp: 'Please stick to letters, numbers and _.'
                }
            },
            highlight: function (element, errorClass, validClass) {
                updateProfileNameAvailability('#profileName', $('.availability .button'));
                $('.specificFeedback').remove();
                highlightInvalid(element, errorClass, validClass);
            },
            unhighlight: unhighlightValid,
            errorPlacement: function (error, element) {
                error.appendTo($('#profileNameField')).css('clear', 'both');
            },
            submitHandler: function (form) {
                var $form = $(form);
                var name = $form.find('input[name="profileName"]').val();
                modalWindow('Are you sure that you want "' + name + '" to be your profile name for ' + game + '?', 'This name will be displayed to other players in the game.', function () {
                    hideModalWindow();

                    if (!$form.hasClass('submitted')) {
                        $form.addClass('submitted');
                        var $redeem = $('#redeem');
                        $form.find('.button').hide();
                        $('<span>', {id: 'loader', html: 'Checking profile name&hellip;'}).appendTo($form);
                        $form.ajaxSubmit({
                            success: function (response) {
                                if (isDefined(response.errors)) {
                                    validationFeedback(form, response);
                                    $form.find('.button').show();
                                    $('#loader').remove();
                                } else if (isDefined(response.error)) {
                                    specificValidationFeedback('profileName', form, response, $('.availability'));
                                } else {
                                    window.location.href = '/me/';
                                }
                                $form.removeClass('submitted');
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                flashError('An error occurred. Please try again later.', $redeem);
                                $form.removeClass('submitted');
                            }
                        });
                    }
                }, function () {
                    hideModalWindow();
                });
            }
        });

        $('#upgradeProfileForm').validate({
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    var $redeem = $('#redeem');

                    $form.find('.button').hide();
                    $('<span>', {id: 'loader', html: 'Upgrading profile&hellip;'}).appendTo($form);
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.errors)) {
                                validationFeedback(form, response);
                                $form.find('.button').show();
                                $('#loader').remove();
                            } else if (isDefined(response.error)) {
                                flashError(response.error, $redeem);
                            } else {
                                window.location.href = '/me/';
                            }
                            $form.removeClass('submitted');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            flashError('An error occurred. Please try again later.', $redeem);
                            $form.removeClass('submitted');
                        }
                    });
                }
            }
        });

        var availabilityButton = $('.availability a.button');
        if (availabilityButton.length) {
            profileNameAvailability('#profileName', availabilityButton, $('#chooseButton').disableElement());
        }

        $(document).delegate('.accept-terms', 'change', function (e) {
            $('.error.acceptTerms').remove();
        });
    });
} else if (window.location.pathname.match(/\/register\/complete/i)) {
    $(function () {
        $(document).delegate('.wrongEmail a', 'click', function (e) {
            $('#correctEmailForm').show();
            $('.wrongEmail').hide();

            e.preventDefault();
            return false;
        });

        $(document).delegate('#correctEmailForm a.cancelLink', 'click', function (e) {
            $('#correctEmailForm').hide();
            $('.wrongEmail').show();

            e.preventDefault();
            return false;
        });

        mailcheck('#email');

        $('#correctEmailForm').validate({
            rules: {
                email: {
                    required: true,
                    email: true
                },
                emailAgain: {
                    required: true,
                    email: true,
                    equalTo: '#email'
                },
                password: 'required'
            },
            messages: {
                email: {
                    required: 'Required',
                    email: 'Must be a valid e-mail address'
                },
                emailAgain: {
                    required: 'Required',
                    email: 'Must be a valid e-mail address',
                    equalTo: 'E-mail addresses must match'
                },
                password: 'Required'
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    var $assistance = $('.assistance');
                    var button = $form.find('.button').hide();
                    var cancelLink = button.siblings('a.cancelLink').hide();
                    $('<span>', {id: 'loader', html: 'Setting new e-mail address&hellip;'}).appendTo($form);
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.errors)) {
                                validationFeedback($form, response, 'Change e-mail');
                                $('#loader').remove();
                                button.show();
                                cancelLink.show();
                            } else if (isDefined(response.error)) {
                                flashError(response.error, $assistance);
                                cancelLink.show();
                            } else if (response.email) {
                                $form.remove();
                                $('.wrongEmail').remove();
                                $('.registeredEmail p.email').text(response.email);
                                $('.flash').remove();
                                flashSuccess('The e-mail associated with your account has been changed.', $('.registeredEmail'));
                                var confirm = $('.confirm').empty();
                                if (isDefined(response.emailProviderLoginUrl)) {
                                    confirm.append($('<p>', {text: 'Confirm your e-mail address.'}));
                                    confirm.append($('<p>').append($('<a>', {href: response.emailProviderLoginUrl, target: '_blank', text: 'Check your inbox'}).addClass('huge button')));
                                } else {
                                    confirm.append($('<p>', {text: 'Confirm your e-mail address. Go check your inbox!'}));
                                }
                            } else {
                                flashError('Invalid response.');
                                cancelLink.show();
                            }
                            $form.removeClass('submitted');
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            flashError('An error occurred. Please try again later.', $assistance);
                            $form.removeClass('submitted');
                            cancelLink.show();
                        }
                    });
                }
            }
        });
    });
} else if (window.location.pathname.match(/\/register/i)) {
    $(function () {
        mailcheck('#registration_email');

        $.validator.addMethod('regexp', function (value, element, param) {
            return this.optional(element) || value.match(param);
        }, 'This value doesn\'t match the acceptable pattern.');

        var rules = {
            'registration.email': {
                required: true,
                email: true
            },
            'registration.password': {
                required: true,
                minlength: 6,
                passwordStrength: '#registration_email'
            },
            'registration.passwordAgain': {
                required: true,
                equalTo: '#registration_password'
            },
            'registration.acceptsTerms': 'required',
            'registration.yearOfBirth' : {
                required:true,
                min:1
            },
            'registration.monthOfBirth' : {
                required:true,
                min:1
            },
            'registration.dayOfBirth' : {
                required:true,
                min:1
            }
        };

        var messages = {
            'registration.email': {
                required: 'Required',
                email: 'Must be a valid e-mail address'
            },
            'registration.password': {
                required: 'Required',
                minlength: 'Enter at least {0} characters'
            },
            'registration.passwordAgain': {
                required: 'Required',
                equalTo: 'Passwords must match'
            },
            'registration.firstname': 'Required',
            'registration.lastname': 'Required',
            'registration.acceptsTerms': 'You must accept the Terms and Conditions',
            'registration.yearOfBirth': {
                required: 'Required',
                min: 'Required'
            },
            'registration.monthOfBirth' : {
                required:'Required',
                min:'Required'
            },
            'registration.dayOfBirth' : {
                required:'Required',
                min:'Required'
            }
        };

        if ($('#registrationForm input[name="registration.profileName"]').length) {
            rules['registration.profileName'] = {
                required: true,
                minlength: 3,
                maxlength: 16,
                regexp: /^\w+$/i
            };

            messages['registration.profileName'] = {
                required: 'Required',
                minlength: 'Too short',
                maxlength: 'Too long (max 16 chars)',
                regexp: 'Only letters, numbers, and _'
            };
        }

        $('#registrationForm').validate({
            rules: rules,
            messages: messages,
            errorPlacement: function (error, element) {
                element.siblings('div.error').remove();
                if (element.attr('type') === 'checkbox') {
                    var label = element.siblings('label');
                    error.insertAfter(label);
                } else if(element.hasClass('dateOfBirth')){
                    $('#dateOfBirthError').replaceWith(error);
                }
                else {
                    error.insertAfter(element);
                }
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    var $register = $('#register');
                    var button = $form.find('.button').hide();
                    var cancel = button.siblings('a').hide();
                    $('<span>', {id: 'loader', html: 'Registering account&hellip;'}).insertAfter(button);
                    $('div.error').remove();
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.errors)) {
                                validationFeedback($form, response, 'Register');
                                $form.removeClass('submitted');
                                cancel.show();
                                button.show();
                                $('#loader').remove();
                                $('#registration_password').val('');
                                $('#registration_passwordAgain').val('');
                                $.scrollTo('.error', 200);
                            } else if (isDefined(response.error)) {
                                flashError(response.error, $register);
                                $form.removeClass('submitted');
                                cancel.show();
                            } else {
                                window.location.href = '/register/complete';
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            flashError('An error occurred. Please try again later.', $register);
                            $form.removeClass('submitted');
                            cancel.show();
                        }
                    });
                }
            }
        });

        var resetAvailabilityLink = function() {
            var $link = $('#registrationForm .checkAvailability a').show();
            $link.siblings().hide();
        };

        $(document).delegate('#registrationForm input[name="registration.profileName"]', 'keydown', resetAvailabilityLink);

        $(document).delegate('#registrationForm .checkAvailability a', 'click', function(e) {
            $(this).hide();
            var $loader = $(this).siblings('.loader').show();
            var $feedback = $(this).siblings('.feedback');

            var $input = $('#registrationForm input[name="registration.profileName"]');

            var showFeedback = function(text) {
                var formattedText = text.toLowerCase();
                $feedback.show();
                $feedback.removeClass('error available taken');
                $feedback.text(formattedText.charAt(0).toUpperCase() + formattedText.slice(1));
                $feedback.addClass(formattedText !== 'too many requests' ? formattedText : '');
                $loader.hide();
            };

            $.get('/available/scrolls/' + $input.val(), function(response) {
                showFeedback(response);
            });
            e.preventDefault();
        });
    });
} else if (window.location.pathname.match(/\/me\/settings\/changeEmail/i)) {
    $(function () {
        mailcheck('#email');
    });
} else if (window.location.pathname.match(/\/me\/challenge/i)) {
    $(function () {
        var container = $('#confirm');

        $('#challengeForm').validate({
            rules: {
                answer: {
                    required: true
                }
            },
            messages: {
                answer: {
                    required: 'You need to answer the question.'
                }
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    $form.find('.button').hide();
                    $('<span>', {id: 'loader', text: 'Confirming identity'}).appendTo($form);
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.error)) {
                                showError(container, response.error);
                            } else {
                                if (typeof redirectUrl !== 'undefined') {
                                    window.location.href = redirectUrl;
                                } else {
                                    container.empty().append($('<p>', {text: 'Good! Your identity has been confirmed. You are now free to log in to your Mojang games from this computer. Have fun!'}).addClass('flash').addClass('success'));
                                    container.append($('<p>').append($('<a>', {href: '/me', text: 'Continue'}).addClass('huge button')));
                                }
                            }
                            $form.removeClass('submitted');
                        },
                        error: function () {
                            flashError('An error occurred. Please try again later.', container);
                            $form.removeClass('submitted');
                        }
                    });
                }
            }
        });
    });
} else if (window.location.pathname.match(/\/me\/secure/i)) {
    $(function () {
        var container = $('#secure');

        $.get('/me/settings/secretQuestions',function (response) {
            if (isDefined(response.error)) {
                showError(container, response.error);
            } else {
                container.empty().html(response);

                setupSecretQuestionChoices();

                // Remove cancel link.
                $('a.cancel').remove();

                $('.editSecretQuestions').validate({
                    rules: {
                        answer0: 'required',
                        answer1: 'required',
                        answer2: 'required',
                        password: 'required'
                    },
                    messages: {
                        answer0: 'You need to give an answer to the question.',
                        answer1: 'You need to give an answer to the question.',
                        answer2: 'You need to give an answer to the question.',
                        password: 'You need to enter your password.'
                    },
                    highlight: highlightInvalid,
                    unhighlight: unhighlightValid,
                    submitHandler: function (form) {
                        var $form = $(form);
                        if (!$form.hasClass('submitted')) {
                            $form.addClass('submitted');
                            var button = $form.find('.button').disableElement();
                            button.data('originalText', button.text()).html('Saving&hellip;');

                            $('.error').removeClass('error').remove();

                            $form.ajaxSubmit({
                                success: function (response) {
                                    if (isDefined(response.errors)) {
                                        validationFeedback($form, response);
                                    } else if (isDefined(response.error)) {
                                        flashError(response.error, $form);
                                    } else {
                                        if (typeof redirectUrl !== 'undefined') {
                                            window.location.href = redirectUrl;
                                        } else {
                                            window.location.href = '/me/';
                                        }
                                    }
                                    $form.removeClass('submitted');
                                },
                                error: function () {
                                    flashError('An error occurred. Please try again later.', $form);
                                    $form.removeClass('submitted');
                                }
                            });
                        }
                    }
                });
            }
        }).error(function () {
            showError(container, 'Could not load security question settings.');
        });
    });
} else if (window.location.pathname.match(/\/resetpassword\/request/i)) {
    $(function () {
        mailcheck('#email');
    });
} else if (window.location.pathname.match(/\/changeemail\/request/i)) {
    $(function () {
        mailcheck('#originalEmail');
        mailcheck('#newEmail');

        $.validator.addMethod('notEqualTo', function (value, element, param) {
            return this.optional(element) || value !== $(param).val();
        }, 'This value can\'t match the value above.');

        $('#requestChangeEmailForm').validate({
            rules: {
                originalEmail: {
                    required: true,
                    email: true
                },
                newEmail: {
                    required: true,
                    email: true,
                    notEqualTo: '#originalEmail'
                }
            },
            messages: {
                originalEmail: {
                    required: 'Required.',
                    email: 'Must be a valid e-mail address.'
                },
                newEmail: {
                    required: 'Required.',
                    email: 'Must be a valid e-mail address.',
                    notEqualTo: 'Must be a different e-mail address from the original one.'
                }
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    var button = $form.find('.button').disableElement();
                    button.data('originalText', button.text()).html('Sending request&hellip;');

                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.error)) {
                                flashError(response.error, $form);
                            } else {
                                var container = $('#requestChangeEmail').empty();
                                flashSuccess('Instructions for how to change your e-mail address have been sent' + (isDefined(response.email) ? (' to ' + response.email) : '' + '.') + ' Please note that it may take a while for the e-mail to arrive.', container);
                            }
                            $form.removeClass('submitted');
                        },
                        error: function () {
                            flashError('An error occurred. Please try again later.', $form);
                            $form.removeClass('submitted');
                        }
                    });
                }
            }
        });
    });
} else if (window.location.pathname.match(/\/changeemail/i)) {
    $(function () {
        var container = $('#changeEmail');
        $.get('/changeemail/challenge/' + token,function (response) {
            if (isDefined(response.error)) {
                showError(container, response.error);
            } else {
                $('#changeEmail').html(response);

                $('#changeEmailForm').validate({
                    rules: {
                        originalEmail: {
                            required: true,
                            email: true
                        },
                        newEmail: {
                            required: true,
                            email: true
                        },
                        answer0: 'required',
                        answer1: 'required',
                        answer2: 'required'
                    },
                    messages: {
                        originalEmail: {
                            required: 'Required',
                            email: 'Not a valid e-mail address'
                        },
                        newEmail: {
                            required: 'Required',
                            email: 'Not a valid e-mail address'
                        },
                        answer0: 'You need to give an answer to the question.',
                        answer1: 'You need to give an answer to the question.',
                        answer2: 'You need to give an answer to the question.'
                    },
                    highlight: highlightInvalid,
                    unhighlight: unhighlightValid,
                    submitHandler: function (form) {
                        var $form = $(form);
                        if (!$form.hasClass('submitted')) {
                            $form.addClass('submitted');
                            var button = $form.find('.button').disableElement();
                            button.data('originalText', button.text()).html('Submitting challenge&hellip;');

                            $form.ajaxSubmit({
                                success: function (response) {
                                    var container = $('#changeEmail').empty();
                                    if (isDefined(response.error)) {
                                        flashError(response.error, container);
                                    } else {
                                        flashSuccess('Challenge passed. Your e-mail address has been changed.', container);
                                        container.append($('<p>', {text: 'Please note that a notification of this change has been sent out to the e-mail address originally tied to the account.'}));
                                    }
                                    $form.removeClass('submitted');
                                },
                                error: function () {
                                    flashError('An error occurred. Please try again later.', $form);
                                    $form.removeClass('submitted');
                                }
                            });
                        }
                    }
                });
            }
        }).error(function () {
            showError(container, 'An error occurred. Please try again later.');
        });
    });
} else if (window.location.pathname.match(/\/dispute\/emailchange/i)) {
    $(function () {
        var container = $('#changeEmail');
        $.get('/dispute/emailchange/load/' + token,function (response) {
            if (isDefined(response.error)) {
                showError(container, response.error);
            } else {
                container.html(response);

                $('#revokeEmailChangeForm').ajaxForm({
                    beforeSubmit: function (arr, $form, options) {
                        var button = $form.find('.button').disableElement();
                        button.data('originalText', button.text()).html('Disputing change&hellip;');
                    },
                    success: function (response) {
                        container.empty();
                        if (isDefined(response.error)) {
                            showError(container, response.error);
                        } else {
                            container.empty();
                            flashSuccess('Your account has had its original e-mail restored.', container);
                            container.append($('<p>', {html: 'To prevent your account from being compromised again it is recommended that you <a href="/me/secure">set new security questions</a> for your account and that you <a href="/me/settings">set a new account password</a>.'}));
                        }
                    },
                    error: function () {
                        showError(container, 'An error occurred. Please try again later.');
                    }
                });
            }
        }).error(function () {
            showError(container, 'An error occurred. Please try again later.');
        });
    });
} else if (window.location.pathname.match(/\/subscription/i)) {
    $(function() {
        var container = $('#subscription');

        var showLoader = function(text) {
            container.empty().append($('<div>', {id : 'loader', text : text}));
        };

        if (isDefined(code)) {
            var renderResponse = function(response, handler, formSelector, before) {
                if (!before) {
                    before = function(arr, $form, options) {};
                }
                container.html(response);
                $(formSelector).ajaxForm({
                    beforeSubmit: before,
                    success: handler,
                    error: function () {
                        showError(container, 'An error occurred. Please try again later.');
                    }
                });
            };

            var handleRedeemResponse = function (response) {
                if (isDefined(response.error)) {
                    showError(container, response.error);
                } else {
                    container.html(response);
                }
            };

            var handleWorldResponse = function (response) {
                if (isDefined(response.error)) {
                    showError(container, response.error);
                } else if (isDefined(response.worldCount)) {
                    showLoader('Loading subscription selection');
                    $.get('/subscription/chooseWorld/' + code, function(response) {
                        renderResponse(response, handleWorldResponse, '#chooseWorldForm');
                    }).error(function () {
                        showError(container, 'Could not load world selection.');
                    });
                } else {
                    showLoader('Redeeming subscription');
                    $.post('/subscription/' + code, {authenticityToken : authenticityToken}, handleRedeemResponse).error(function () {
                        showError(container, 'Could not redeem subscription.');
                    });
                }
            };

            var handleProfileResponse = function (response) {
                if (isDefined(response.error)) {
                    showError(container, response.error);
                } else if (isDefined(response.profileCount)) {
                    showLoader('Loading profile selection');
                    $.get('/subscription/assign/' + code, function(response) {
                        renderResponse(response, handleProfileResponse, '#assignSubscriptionForm');
                    }).error(function () {
                        showError(container, 'Could not load profile selection.');
                    });
                } else {
                    showLoader('Verifying subscription');
                    $.get('/subscription/check/world/' + code, handleWorldResponse).error(function () {
                        showError(container, 'Could not verify subscription.');
                    });
                }
            };

            var handleTermsResponse = function (response) {
                if (isDefined(response.error)) {
                    showError(container, response.error);
                } else if (isDefined(response.terms)) {
                    showLoader('Loading terms');
                    $.get('/subscription/terms/' + code, function(response) {
                        $(document).delegate('#accept-terms', 'click', function() {
                            $('.termsFeedback').remove();
                        });
                        renderResponse(response, handleTermsResponse, '#acceptRealmsTermsForm', function(arr, $form, options) {
                            var $accept = $('#accept-terms');
                            if (!$accept.is(':checked')) {
                                $('<p>', {text : 'You need to accept the Minecraft Realms Terms to continue.'}).addClass('error termsFeedback').insertAfter($accept.parent());
                                return false;
                            }
                        });
                    }).error(function () {
                        showError(container, 'Could not load terms.');
                    });
                } else {
                    showLoader('Verifying profile');
                    $.get('/subscription/check/profile/' + code, handleProfileResponse).error(function () {
                        showError(container, 'Could not verify profile.');
                    });
                }
            };

            $.get('/subscription/check/terms/' + code, handleTermsResponse).error(function () {
                showError(container, 'Could not verify terms.');
            });
        } else {
            showError(container, 'Could not verify code.');
        }
    });
} else if (window.location.pathname.match(/\/delete/i)) {
    $(function () {
        var container = $('#deleteAccount');
        if (container.length) {
            $.get('/delete/' + token + '/confirm/load',function (response) {
                if (isDefined(response.error)) {
                    showError(container, response.error);
                } else {
                    container.html(response);

                    $('#deleteAccountForm').validate({
                        rules: {
                            answer0: 'required',
                            answer1: 'required',
                            answer2: 'required',
                            password: 'required'
                        },
                        messages: {
                            answer0: 'You need to give an answer to the question.',
                            answer1: 'You need to give an answer to the question.',
                            answer2: 'You need to give an answer to the question.',
                            password: 'You need to enter your password.'
                        },
                        highlight: highlightInvalid,
                        unhighlight: unhighlightValid,
                        submitHandler: function (form) {
                            var $form = $(form);
                            if (!$form.hasClass('submitted')) {
                                $form.addClass('submitted');
                                var button = $form.find('.button').disableElement();
                                button.data('originalText', button.text()).html('Deleting account&hellip;');

                                $form.ajaxSubmit({
                                    success: function (response) {
                                        container.empty();
                                        if (isDefined(response.error)) {
                                            flashError(response.error, container);
                                            $form.removeClass('submitted');
                                        } else {
                                            flashSuccess('Your account has been deleted.', container);
                                        }
                                    },
                                    error: function () {
                                        flashError('An error occurred. Please try again later.', $form);
                                        $form.removeClass('submitted');
                                    }
                                });
                            }
                        }
                    });
                }
            }).error(function () {
                showError(container, 'An error occurred. Please try again later.');
            });
        }
    });
} else if (window.location.pathname.match(/\/account\/requestConsent/) || window.location.pathname.match(/\/me\/requestConsent/)) {
    mailcheck('#email');

    var rules = {
        'email': {
            required: true,
            email: true
        },
        'emailAgain': {
            required: true,
            equalTo: '#email'
        }
    };

    var messages = {
        'email': {
            required: 'Required',
            email: 'Must be a valid e-mail address.'
        },
        'emailAgain': {
            required: 'Required',
            email: 'Must be a valid e-mail address.',
            equalTo: 'E-mails must match.'
        }
    };

    $(function () {
        $('#requestConsentForm').validate({
            rules: rules,
            messages: messages,
            errorPlacement: function (error, element) {
                element.siblings('div.error').remove();
                error.insertAfter(element);
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    var button = $form.find('.button').hide();
                    var cancel = button.siblings('a').hide();
                    $('<span>', {id: 'loader', html: 'Sending parental consent request&hellip;'}).insertAfter(button);
                    $('div.error').remove();
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.errors)) {
                                validationFeedback($form, response, 'Send parental consent request');
                                $form.removeClass('submitted');
                                cancel.show();
                                button.show();
                                $('#loader').remove();
                                $.scrollTo('.error', 200);
                            } else if (isDefined(response.error)) {
                                flashError(response.error, $form);
                                $form.removeClass('submitted');
                                cancel.show();
                            } else {
                                flashSuccess("A request for parental consent has been sent to the provided e-mail address.", $form.parent());
                                $form.remove();
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            flashError('An error occurred. Please try again later.', $form);
                            $form.removeClass('submitted');
                            cancel.show();
                        }
                    });
                }
            }
        });
    });
}else if (window.location.pathname.match(/\/account\/provideConsent/)){
    

    var reenableForm = function ($form) {
        $('#loader').remove();
        $form.show();
    };

    var checkIfProfileNameIsAvailable = function (profilename) {
        var available = false;
        $.ajax({
            url:'/available/minecraft' +'/' + profilename,
            async:false,
            success: function(data){
                available =  "AVAILABLE" == data;
            }
        });
        return available;
    };

    $(function (){

        var initialzeBraintreeHostedFields = function () {

            $.ajax(braintree_client_token).then(function (token, status, xhr) {
                braintree.setup(token, 'custom', {
                    id: 'provideConsentForm',
                    hostedFields: {
                        number: {
                            selector: '#card-number'
                        },
                        cvv: {
                            selector: '#cvv'
                        },
                        expirationMonth: {
                            selector: '#expiration-month'
                        },
                        expirationYear: {
                            selector: '#expiration-year'
                        },
                        styles: {
                            // Style all elements
                            "input": {
                                "font-size": "14px",
                                "color": "#3A3A3A"
                            },

                            ".valid": {
                                "color": "green"
                            },
                            ".invalid": {
                                "color": "red"
                            }


                        }
                    },
                    onReady: onHostedFieldsReady,
                    onPaymentMethodReceived: onNonceRecieved,
                    onError: onNonceError
                });
            });
            
            BraintreeData.setup(braintree_merchant_id, 'provideConsentForm', braintree_env);
            
            var $form = $('#provideConsentForm');
            var clientFingerprint = $form.find('input[name="device_data"]').val();
            $('<input>').attr({
                type: 'hidden',
                name: 'consent.deviceData',
                value: clientFingerprint
            }).appendTo($form);

        };

        var onHostedFieldsReady = function () {
            $('.braintree-hosted-field-loading').removeClass('braintree-hosted-field-loading');
        };

        var onNonceError = function (event) {
            
        };

        var onNonceRecieved = function (paymentMethod) {
            var $form = $('#provideConsentForm');
            $form.find('#creditcard-nonce').val(paymentMethod.nonce);

            performSubmitConsent($form);

        };
        
        initialzeBraintreeHostedFields();
        
        $.validator.addMethod('profileName', function(value, element){
            return this.optional(element) || checkIfProfileNameIsAvailable(value);}, 'Profile name not available');

        $('#consent_profileName').blur(function(){
            $input = $('#consent_profileName');
            $input.removeClass('error');
            $input.siblings('.error').remove();
            if(!$input.val()){
                $input.addClass('error');
                $input.after('<label class="error">Profile name not available</label>');
            }else {
                var available = checkIfProfileNameIsAvailable($input.val());
                if (!available) {
                    $input.addClass('error');
                    $input.after('<label class="error">Profile name not available</label>');
                }
            }
        });


        $('#provideConsentForm').validate({
            rules: {
                'consent.parentEmail': {
                    email: true,
                    required: true
                },
                'consent.childEmail': {
                    email: true,
                    required: true
                },
                'consent.zipCode': {
                    required: true,
                    minlength: 5,
                    maxlength: 7
                },
                'consent.profileName': {
                    required: true
                }
            },
            messages: {
                'consent.parentEmail': {
                    email: 'Invalid e-mail address',
                    required: 'Required'
                },
                'consent.childEmail': {
                    email: 'Invalid e-mail address',
                    required: 'Required'
                },
                'consent.zipCode': {
                    required: 'Required',
                    minlength: 'Invalid postal code.',
                    maxlength: 'Invalid postal code.'
                },
                messages: {
                    'consent.profileName': {
                        required: 'Required'
                    }
                }
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var $form = $(form);
                var button = $form.hide();
                $('<span>', {id: 'loader', html: 'Verifying information&hellip;'}).insertAfter(button);
            }
        });
    });
    
    var performSubmitConsent = function (form) {
        var orderUuidField = form.find('#consent_orderUuid');
        form.ajaxSubmit({
            success: function (response) {
                if (isDefined(response.errors)) {
                    validationFeedback(form, response);
                    reenableForm(form);
                } else if (isDefined(response.error)) {
                    flashError(response.error, form);
                    orderUuidField.val(response.orderUuid);
                    reenableForm(form);
                } else {
                    var $provideConsentContainer = $('#provideConsentContainer');
                    $provideConsentContainer.empty();
                    flashSuccess("You have given your child permission to continue playing Mojang games and using Mojang services. Please let your child know that you have consented.", $provideConsentContainer);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                flashError('An error occurred. Please try again later.', form);
                reenableForm(form);
            }
        });
    };
    
    
} else if (window.location.pathname.match(/\/me\/reenterEmail\/?/i)) {
    $(function() {
        $('#reenterEmailForm').validate({rules: {
            'email': {
                email: true,
                required: true
            }
        },
        messages: {
            email: {
                email: 'Invalid e-mail address',
                required: 'Required'
            }
        },
        highlight: highlightInvalid,
        unhighlight: unhighlightValid,
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        },
        submitHandler: function (form) {
            var $form = $(form).hide();

            var showError = function(message) {
                $('<p>', {text: message}).addClass('error').insertBefore($form.find('.buttonContainer'));
                $form.show();
                $('#loader').remove();
            };

            $('<span>', {id: 'loader', html: 'Verifying e-mail address&hellip;'}).insertAfter($form);
            if (!$form.hasClass('submitted')) {
                $form.find('.error').remove();
                $form.addClass('submitted');
                $form.ajaxSubmit({
                    success: function (response) {
                        if (isDefined(response.error)) {
                            showError(response.error, $form);
                            $form.removeClass('submitted');
                        } else {
                            window.location.href = '/me';
                        }
                    },
                    error: function () {
                        showError('An error occurred. Please try again later.', $form);
                        $form.removeClass('submitted');
                    }
                });
            }
        }});
    });
} else if (window.location.pathname.match(/\/me\/resendVerifyEmail\/?/i)) {
    $(function() {
        $('#resendVerifyEmailForm').validate({
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                email: {
                    required: 'Required',
                    email: 'Not a valid e-mail address'
                }
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            errorPlacement: function(error, element) {
                error.insertAfter(element);
            },
            submitHandler: function (form) {
                var $form = $(form).hide();

                var showError = function(message) {
                    $('<p>', {text: message}).addClass('error').insertBefore($form.find('button'));
                    $form.show();
                    $('#loader').remove();
                };

                $('<span>', {id: 'loader', html: 'Verifying e-mail address&hellip;'}).addClass('standard').insertAfter($form);
                if (!$form.hasClass('submitted')) {
                    $form.find('.error').remove();
                    $form.addClass('submitted');
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.error)) {
                                showError(response.error, $form);
                                $form.removeClass('submitted');
                            } else {
                                flashSuccess('We\'ve dispatched a new verification e-mail to your inbox.', $('#resendVerifyEmail'));
                                $form.remove();
                            }
                        },
                        error: function () {
                            showError('An error occurred. Please try again later.', $form);
                            $form.removeClass('submitted');
                        }
                    });
                }
            }
        });
    });
}else if (window.location.pathname.match(/\/me\/enterBirthdate/i)) {
    $(function(){

        var rules = {
            'date.year' : {
                required:true,
                min:1
            },
            'date.month' : {
                required:true,
                min:1
            },
            'date.day' : {
                required:true,
                min:1
            }
        };

        var messages = {
            'date.year': {
                required: 'Please specify year',
                min: 'Please specify year'
            },
            'date.month' : {
                required:'Please specify month',
                min:'Please specify month'
            },
            'date.day' : {
                required:'Please specify day',
                min:'Please specify day'
            }
        };

        $('#dateForm').validate({
            rules: rules,
            messages: messages,
            errorPlacement: function (error, element) {
                $('#feedback').after(error);
            },
            highlight: highlightInvalid,
            unhighlight: unhighlightValid,
            submitHandler: function (form) {
                var $form = $(form);
                if (!$form.hasClass('submitted')) {
                    $form.addClass('submitted');
                    var button = $form.find('.button').hide();
                    $('<span>', {id: 'loader', html: 'Submitting&hellip;'}).insertAfter(button);
                    $('label.error').remove();
                    $form.ajaxSubmit({
                        success: function (response) {
                            if (isDefined(response.errors)) {
                                for(var key in response.errors){
                                    $('#feedback').after('<label class="error">' + response.errors[key] + '</label>');
                                }
                                $form.removeClass('submitted');
                                button.show();
                                $('#loader').remove();
                            } else if (isDefined(response.error)) {
                                flashError(response.error, $('#feedback'));
                                $form.removeClass('submitted');
                            } else {
                                flashSuccess('Thank you for helping out! Now go back and play!', $('#feedback'));
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            $('#feedback').after('<label class="error">' + 'An error occurred. Please try again later.' + '</label>');
                            $('#loader').remove();
                            $form.removeClass('submitted');
                        }
                    });
                }
            }
        });
    });
} else if (window.location.pathname.match(/^\/me\/renameProfile/i)) {
    $(function() {
        $.validator.addMethod('regexp', function (value, element, param) {
            return this.optional(element) || value.match(param);
        }, 'This value doesn\'t match the acceptable pattern.');

        $('#renameProfileForm').validate({
            rules: {
                newName: {
                    required: true,
                    minlength: 3,
                    maxlength: 16,
                    regexp: /^\w+$/i
                },
                password: {
                    required: true
                }
            },
            messages: {
                newName: {
                    required: 'You need to enter a profile name.',
                    minlength: 'Please choose a name that is longer than 2 characters.',
                    maxlength: 'Please choose a name that is shorter than 16 characters.',
                    regexp: 'Please stick to letters, numbers and _.'
                },
                password: {
                    required: 'You need to enter your password.'
                }
            },
            highlight: function (element, errorClass, validClass) {
                updateProfileNameAvailability('#newName', $('.availability .button'));
                $('.specificFeedback').remove();
                highlightInvalid(element, errorClass, validClass);
            },
            unhighlight: unhighlightValid,
            errorPlacement: function (error, element) {
                element.siblings('div.error').remove();
                if ($(element).attr('id') == 'newName') {
                    error.appendTo($('#newNameField')).css('clear', 'both');
                } else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function (form) {
                var $form = $(form);
                var name = $form.find('input[name="newName"]').val();
                modalWindow('Are you sure that you want "' + name + '" to be your new profile name for ' + game + '?', 'This name will be displayed to other players in the game. You will have to wait 30 days before you can change your name again.', function () {
                    hideModalWindow();
                    if (!$form.hasClass('submitted')) {
                        $form.addClass('submitted');
                        var $renameProfile = $('#renameProfile');

                        $form.find('.button').hide();
                        $form.find('.error.general').remove();
                        $form.find('.availabilityFeedback').remove();
                        $('<span>', {id: 'loader', html: 'Checking profile name and password&hellip;'}).addClass('standard').appendTo($form);
                        $form.ajaxSubmit({
                            success: function (response) {
                                if (isDefined(response.errors)) {
                                    if (response.errors.newName) {
                                        $('#newName').addClass('error');
                                        $('<label>', {text: response.errors.newName, generated: true}).attr('for', 'newName').addClass('error').appendTo($('#newNameField')).css('clear', 'both');
                                        delete response.errors['newName'];
                                    }
                                    validationFeedback(form, response);
                                    $form.find('.button').show();
                                    $('#loader').remove();
                                } else if (isDefined(response.error)) {
                                    $form.find('.button').show();
                                    $('<p>', {text:response.error}).addClass('general error').insertBefore($('#changeButton'));
                                    $('#loader').remove();
                                } else {
                                    $renameProfile.empty();
                                    flashSuccess('Your ' + game + ' name has been changed. Make sure to fully log out of ' + game + ' and log back in again in order to see the change.', $renameProfile);
                                    $renameProfile.append($('<p>').append($('<a>', {href: '/me', text: 'Go to account overview'})));
                                }
                                $form.removeClass('submitted');
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                flashError('An error occurred. Please try again later.', $renameProfile);
                                $form.removeClass('submitted');
                            }
                        });
                    }
                }, function () {
                    hideModalWindow();
                });
            }
        });

        profileNameAvailability('#newName', $('.availability .button'), $('#changeButton'));
    });
} else if (window.location.pathname.match(/\/me\/?/i)) {
    $(function () {
        var container = $('#giftCodes');

        $(document).delegate('.formRow a.cancel', 'click', function (e) {
            $('.codeRow.' + $(this).attr('rel')).show();
            $(this).parents('tr').hide();
            e.preventDefault();
        });

        $(document).delegate('.codeRow a.send', 'click', function (e) {
            $('.formRow.' + $(this).attr('rel')).show();
            $(this).parents('tr').hide();
            e.preventDefault();
        });

        $.get('/me/loadGiftCodes', function (response) {
            var showError = function (message, $form) {
                $form.find('.cancel').show();
                var button = $form.find('button').enableElement();
                button.html(button.data('originalText'));

                $form.append($('<label>', {text: message}).addClass('error'));
            };

            if (isDefined(response.error)) {
                showError(container, response.error);
            } else {
                container.empty().html(response);
                $('.sendGiftForm').each(function () {
                    $(this).validate({
                        rules: {
                            email: {
                                required: true,
                                email: true
                            }
                        },
                        messages: {
                            email: {
                                required: 'Required',
                                email: 'Not a valid e-mail address'
                            }
                        },
                        highlight: highlightInvalid,
                        unhighlight: unhighlightValid,
                        errorPlacement: function (error, element) {
                            error.appendTo(element.parents('form'));
                        },
                        submitHandler: function (form) {
                            var $form = $(form);
                            if (!$form.hasClass('submitted')) {
                                $form.addClass('submitted');
                                $form.find('.cancel').hide();
                                $form.find('.error').remove();

                                var button = $form.find('button').disableElement();
                                button.data('originalText', button.text()).html('Sending code&hellip;');

                                $form.ajaxSubmit({
                                    success: function (response) {
                                        if (isDefined(response.error)) {
                                            showError(response.error, $form);
                                            $form.removeClass('submitted');
                                        } else {
                                            var email = $form.find('input[name="email"]').val();
                                            $form.parents('td').empty().append($('<span>', {text: 'Gift code sent to ' + email + '!'}));
                                        }
                                    },
                                    error: function () {
                                        showError('An error occurred. Please try again later.', $form);
                                        $form.removeClass('submitted');
                                    }
                                });
                            }
                        }
                    });
                });
            }
        }).error(function () {
            showError(container, 'Could not load your gift codes.');
        });

        var $subscriptions = $('#subscriptions');
        var $errors = $subscriptions.find('.subscriptionErrors');
        var $realmsContainer = $('#activeSubscriptions');
        var $realmsTable = $realmsContainer.find('table');

        if ($subscriptions.find('.buy').length) {
            $subscriptions.show();
        }

        if (typeof minecraftProfiles !== 'undefined') {
            for (var i in minecraftProfiles) {
                var profileUuid = minecraftProfiles[i];
                $.get('/me/loadSubscriptions/' + profileUuid, function (response) {
                    if (isDefined(response.error)) {
                        $subscriptions.show();
                        showError($errors, response.error);
                    } else if (response) {
                        $subscriptions.show();
                        $realmsContainer.show();
                        $realmsTable.append(response);
                    }
                }).error(function () {
                    $subscriptions.show();
                    showError($errors, 'An error occurred while loading Minecraft Realms subscriptions.');
                });
            }
        }

        $.loadRecurring();

    });
}

$(function () {
    var setCookie = function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    $(document).delegate('#info-bar a.close', 'click', function (e) {0
        var q = $(this).parent().hide();
        $('#info-bar').remove();
        setCookie('hideInfoBar', true, 30);
        e.preventDefault();
        return false;
    });

    $(document).delegate('.learnMore .question a', 'click', function (e) {
        var q = $(this).parent().hide();
        q.siblings('.explanation').show();
        e.preventDefault();
        return false;
    });
    $(document).delegate('.learnMore .explanation .hide,.learnMore .explanation h4', 'click', function (e) {
        var expl = $(this).parent().hide();
        expl.siblings('.question').show();
        e.preventDefault();
        return false;
    });

    if ($('#unredeemedGames').length) {
        $.get('/me/loadUnredeemedGames',function (response) {
            if (isDefined(response.error)) {
                log(response.error);
            } else {
                if (response && response.length) {
                    $('.redeemContainer').css({'background-image': 'none', 'padding': '0'});
                    $('.redeemIntro').remove();
                    $('.redeemButton').removeClass('button');

                    var container = $('#unredeemedGames');
                    for (var i in response) {
                        var token = response[i];
                        var ownsDemo = token.ownsDemo == "true";
                        var item = $('<div>').addClass('unredeemedGame');
                        $('<h3>', {text: 'You have an unredeemed copy of ' + token.game}).appendTo(item);
                        if (ownsDemo) {
                            $('<p>', {text: 'To redeem your copy just upgrade your current ' + token.game + ' demo profile.'}).appendTo(item);
                        } else {
                            $('<p>', {text: 'To redeem your copy and start playing ' + token.game + ' you first need to create a profile for the game.'}).appendTo(item);
                        }

                        $('<a>', {href: token.redeemLink, text: (ownsDemo ? 'Upgrade ' : 'Create ') + token.game + ' profile'}).addClass('button').appendTo(item);
                        item.appendTo(container);
                    }
                }
            }
        }).error(function () {
            log('Could not load unredeemed games.');
        });
    }
});

(function ($) {
    $.recurringConfirm = function (params) {
        if ($('.confirm-panel').length) {
            return false;
        }

        var buttonHTML = '';
        $.each(params.buttons, function (name, obj) {
            buttonHTML += '<a href="#" class="button confirm-panel-button ' + obj['class'] + '">' + name + '</a>';
            if (!obj.action) {
                obj.action = function () {
                };
            }
        });


        var markup = ['<div class="confirm-panel" style="display: none">',
            '<p>',
            '<strong style="color:#dd4f3b">Really?</strong>',
            buttonHTML,
            '</p>',
            '</div>'].join('');

        $(markup).hide().appendTo(params.parent).show();
        var buttons = params.parent.find('.confirm-panel-button');
        var i = 0;

        $.each(params.buttons, function (name, obj) {
            buttons.eq(i++).click(function (e) {
                obj.action();
                $.recurringConfirm.hide();
                return false;
            });
        });
    }

    $.recurringConfirm.hide = function () {
        $('.confirm-panel').hide(0, function () {
            $(this).remove();
        });
    }
})(jQuery);

(function ($) {
    $.loadRecurring = function () {
        var $recurring = $('#recurring');
        var $recurringTable = $recurring.find('table:first tbody');
        var $errors = $('#subscriptions').find('.subscriptionErrors');

        if (typeof me !== 'undefined') {
            $.get('/me/loadRecurring/' + me.userUuid,function (response) {
                if (isDefined(response.error)) {
                    showError($errors, response.error);
                } else if (response && response.length) {
                    $recurringTable.empty();
                    $recurring.show();
                    $.each(response, function (index, value) {
                        var $cancelButton = $('<a href="#" class="button">Cancel</a>');
                        var $reactivateButton = $('<a href="#" class="button">Reactivate</a>');
                        if(!me.hasCreditCard){
                            $reactivateButton.hide();
                        }

                        var $row = $("<tr></tr>");
                        $row.append('<td>' + value.worldName + '</td>');
                        $row.append('<td>' + value.lastPayment + '</td>');
                        $row.append('<td>' + (value.active ? value.nextPayment : 'Canceled') + '</td>');

                        if (value.active) {
                            $cancelButton.click(function (e) {
                                e.preventDefault();
                                $cancelButton.hide();
                                $.recurringConfirm({
                                    'parent': $row,
                                    'message': 'Really?',
                                    'buttons': {
                                        'Yes, cancel': {
                                            'action': function () {
                                                $.get('/me/loadRecurring/cancel/' + value.recurringPaymentId, function (response) {
                                                    if (response.error) {
                                                        showError($errors, response.error);
                                                    } else {
                                                        $.loadRecurring();
                                                    }
                                                });
                                            }
                                        },
                                        'No': {
                                            'action': function () {
                                                $cancelButton.show();
                                            }
                                        }
                                    }
                                });
                            });

                            $row.append($cancelButton);
                        } else {
                            $reactivateButton.click(function (e) {
                                e.preventDefault();
                                $reactivateButton.hide();
                                $.recurringConfirm({
                                    'parent': $row,
                                    'message': 'Really?',
                                    'buttons': {
                                        'Yes, reactivate': {
                                            'action': function () {
                                                $.get('/me/loadRecurring/reactivate/' + value.recurringPaymentId, function (response) {
                                                    if (response.error) {
                                                        showError($errors, response.error);
                                                    } else {
                                                        $.loadRecurring();
                                                    }
                                                });
                                            }
                                        },
                                        'No': {
                                            'action': function () {
                                                $reactivateButton.show();
                                            }
                                        }
                                    }
                                });
                            });
                            $row.append($reactivateButton);
                        }
                        $recurringTable.append($row);
                    });
                } else {
                    $('.editBillingDetails').hide();
                }
            }).error(function () {
                showError($errors, 'An error occurred while loading recurring payments.');
            });
        }
    }
})(jQuery);
