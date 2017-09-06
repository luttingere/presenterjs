/**
 * @author Eduardo Luttinger , Emisael Carrera
 *
 * @constructor
 */
function PresenterJS() {
}

PresenterJS.prototype.steps = null;
PresenterJS.prototype.defaultTemplate = "<div id=\"guide-bg\"><div id=\"guide-message\"><div id=\"message-container\"><span id=\"productName\" class=\"product-name\"></span><span id=\"message\"></span></div></div></div>";
PresenterJS.prototype.presenterDefaultTemplate = "<div id=\"guide-dialogue-box\"></div>";
PresenterJS.prototype.presenterDefaultBody = "<div id=\"dialogue-indicator\"></div>" +
    "<div class=\"dialogue-content\"><div class=\"dialogue-img\"><img src=\"https://image.flaticon.com/icons/svg/288/288082.svg\">" +
    "</div> <div class=\"dialogue-body\"><h4 id=\"presenter_title\" class=\"dialogue-heading\"></h4><p id=\"presenter_message\"></p>" +
    "<button id=\"dialogue-btn\" class=\"btn waves-effect waves-light show\" type=\"submit\" name=\"action\">Entendido</button></div></div>";


PresenterJS.prototype.getPresenterInstance = function () {
    console.log(this);
    var presenter = $('#guide-dialogue-box');
    if (presenter.html() == undefined) {
        $(this.presenterDefaultTemplate).appendTo($('body'));
        presenter = $('#guide-dialogue-box');
    }
    return presenter;
}


PresenterJS.prototype.getPresenterTemplate = function () {
    return this.presenterDefaultTemplate;
}

/**
 *
 * start the step
 *
 * @param step
 */
PresenterJS.prototype.show = function (step) {
    var stepElement = $('body').find('#' + step.id);
    var presenter = PresenterJS.prototype.getPresenterInstance();
    this.onStepStart(step, stepElement, presenter);
}

/**
 * End the presenter
 */
PresenterJS.prototype.endPresenter = function (endStep) {
    for (var step in PresenterJS.prototype.steps) {
        if (step.indexOf("step") >= 0){
            PresenterJS.prototype.deleteStepTraces(PresenterJS.prototype.steps[step]);
        }
    }
    $("#guide-bg").remove();
    $('#guide-dialogue-box').remove();
    if (endStep.callback) {
        console.log("Running Callback");
        endStep.callback();
    }
    console.log("Bye PresenterJS");
}


/**
 *
 * the
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
PresenterJS.prototype.onStepStart = function (step, stepElement, presenter) {
    //PresenterJS.prototype.registerToResizeEvent(step);
    PresenterJS.prototype.killAPreviousStep(step);
    PresenterJS.prototype.transformThePresenter(presenter, step, stepElement);
    var presenterPosition = PresenterJS.prototype.calculateNextPositionForThePresenter(step.position, step.align_horizontal, step.align_vertical, stepElement, presenter);
    //PresenterJS.prototype.adjustScreenScroll(stepElement);
    console.log("presenterPosition: ", presenterPosition);
    PresenterJS.prototype.relocateThePresenterOnTheScreen(stepElement, presenter, presenterPosition);
}

/**
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
PresenterJS.prototype.onStepEnd = function (step, stepElement, presenter) {
    PresenterJS.prototype.prepareThePresenterForTheNextStep(step, stepElement, presenter);
    PresenterJS.prototype.prepareTheElementForTheNextStep(stepElement, step);
    //fire callback if it is set
    try {
        eval(step.callback);
    } catch (e) {
        console.log(e);
    }
    //End of the step
}


/**
 *
 * @param stepElement
 * @param presenter
 * @param presenterPosition
 */
PresenterJS.prototype.adjustScreenScroll = function (element) {
    // $(window).scrollTo(0, element.offset().top);
}

/**
 *
 * @param stepElement
 * @param presenter
 * @param presenterPosition
 */
PresenterJS.prototype.registerToResizeEvent = function (step) {
    // $(window).off('resize');
    // $(window).on('resize', function () {
    //     var win = $(this); //this = window
    //     console.log("Resize", win);
    //     PresenterJS.prototype.show(step);
    // });
}


/**
 *
 * @param stepElement
 * @param step
 */
PresenterJS.prototype.relocateThePresenterOnTheScreen = function (stepElement, presenter, presenterPosition) {
    presenter.css({
        "position": "absolute",
        "left": stepElement.position().left + (presenterPosition.left),
        "top": stepElement.position().top + (presenterPosition.top)
    });

}


/**
 *
 * @param stepElement
 * @param step
 */
PresenterJS.prototype.prepareTheElementForTheNextStep = function (stepElement, step) {
    if (step.drawOnTargetAtEnd) {
        stepElement.addClass(step.drawOnTargetAtEnd);
    }
    //PresenterJS.prototype.transformElementViewGroup(step, "remove");
}
/**
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
PresenterJS.prototype.prepareThePresenterForTheNextStep = function (step, stepElement, presenter) {
    stepElement.removeClass(step.drawOnTargetAtStart);
    presenter.removeClass(step.drawOnSelf);
    presenter.find('#dialogue-indicator').removeClass(step.indicatorPosition);
    presenter.empty();
}

/**
 *
 * Apply all the changes over the element on focus, on the presenter and also over the group of view members of the step
 *
 * @param presenter
 * @param step
 */
PresenterJS.prototype.transformThePresenter = function (presenter, step, stepElement) {

    //draw on the element in focus
    stepElement.removeClass(step.drawOnTargetAtEnd);
    stepElement.addClass(step.drawOnTargetAtStart);

    //draw on the presenter
    presenter.addClass(step.drawOnSelf);

    //if the template is not null or empty the system will use the given template
    // to place it insede the presente
    if (step.template != null && step.template != "") {
        console.log("Se agrega el valor chimbo al step")
        $(step.template).css({}).appendTo(presenter);
    } else {
        //if no template is set, a default one does.
        console.log("Se agrega el valor al step")
        $(this.presenterDefaultBody).css({}).appendTo(presenter);
    }

    //this add the required style to the view group that belong to the step
    PresenterJS.prototype.transformElementViewGroup(step, "add");
    PresenterJS.prototype.transformElementViewGroup(step, "remove");

    // add the click functionality to the presenter
    PresenterJS.prototype.setClickFunctionalityToThePresenter(presenter, stepElement, step);

    //add the the step title
    presenter.find('#presenter_title').html(step.title);
    //add the step message
    presenter.find('#presenter_message').html(step.text);

    //set the corner indicator
    presenter.find('#dialogue-indicator').addClass(step.indicatorPosition);

    // show the presenter transformed
    presenter.addClass("show");
}

/**
 *
 * @param presenter
 * @param step
 */
PresenterJS.prototype.setClickFunctionalityToThePresenter = function (presenter, stepElement, step) {
    //sadd functionality to the button of the presenter
    var presenterBtn = presenter.find('#dialogue-btn')
    if (!step.button) {
        console.log("Agregandole la funcionalidad click al boton");
        presenterBtn.addClass("hide");
        if (step.auxButton && step.auxButton != "") {
            var auxButton = $('body').find("#" + step.auxButton);
            if (auxButton.html() != undefined) {
                auxButton.on("click", function () {
                    PresenterJS.prototype.onStepEnd(step, stepElement, presenter)
                    if (step.nextStep == 'end') {
                        PresenterJS.prototype.endPresenter(PresenterJS.prototype.steps[step.nextStep], step);
                    } else {
                        PresenterJS.prototype.show(PresenterJS.prototype.steps[step.nextStep]);
                    }
                });
            }
        }
    } else {
        presenterBtn.removeClass("hide");
        presenterBtn.html(step.button);
        presenterBtn.off("click");
        presenterBtn.on("click", function () {
            PresenterJS.prototype.onStepEnd(step, stepElement, presenter);
            if (step.nextStep == 'end') {
                PresenterJS.prototype.endPresenter(PresenterJS.prototype.steps[step.nextStep], step);
            } else {
                PresenterJS.prototype.show(PresenterJS.prototype.steps[step.nextStep]);
            }
        });
    }
}

/**
 *
 * @param action
 * @param step
 */
PresenterJS.prototype.transformElementViewGroup = function (step, action) {
    if (step.classesActions != null && step.classesActions != "") {
        if (Array.isArray(step.classesActions)) {
            step.classesActions.forEach(function (element) {
                if (element.className) {
                    var elementHtml = $('body').find('.' + element.className);
                    if (elementHtml != undefined) {
                        switch (action) {
                            case "remove":
                                elementHtml.removeClass(element.classesToRemove);
                                break;
                            default:
                                elementHtml.addClass(element.classesToAdd);
                                break;
                        }
                    }
                }
            });
        }
    }
}

/**
 *
 * Delete all changes made by a step over the DOM
 *
 * @param action
 * @param step
 */
PresenterJS.prototype.deleteStepTraces = function (step) {
    console.log("Limpiando el desastre del step " + step.id);
    var elementView = $('body').find("#" + step.id);
    if (elementView.html() != undefined) {
        elementView.removeClass(step.drawOnTargetAtStart);
        elementView.removeClass(step.drawOnTargetAtEnd);
    }
    if (step.classesActions != null && step.classesActions != "") {
        if (Array.isArray(step.classesActions)) {
            step.classesActions.forEach(function (element) {
                if (element.className) {
                    var elementHtml = $('body').find('.' + element.className);
                    if (elementHtml != undefined) {
                        elementHtml.removeClass(element.classesToAdd);
                    }
                }
            });
        }
    }
}

/**
 * Kill an step still living if the step have the directive
 * @param step
 */
PresenterJS.prototype.killAPreviousStep = function (step) {
    if (step.kill != null && step.kill != "") {
        var stepToKill = null;
        if (Array.isArray(step.kill)) {
            step.kill.forEach(function (step) {
                stepToKill = PresenterJS.prototype.steps[step];
                PresenterJS.prototype.deleteStepTraces(stepToKill);
            });
        } else {
            stepToKill = PresenterJS.prototype.steps[step.kill];
            PresenterJS.prototype.deleteStepTraces(stepToKill);
        }
    }
}

/**
 *
 * @param position
 * @param element
 * @param presenter
 * @returns {{top: string, left: string}}
 */
PresenterJS.prototype.calculateNextPositionForThePresenter = function (position, alignHorizontal, alignVertical, element, presenter) {
    var presenterPosition = {
        "top": "",
        "left": ""
    }
    var fixedPoints = 1;
    var elementHeight = element.height();
    var elementWidth = element.width();
    var difference = PresenterJS.prototype.getDifferenceBetweenThePresenterAndTheElement(presenter, element);
    var presenterPadding = presenter.css('padding');
    presenterPadding = Number(presenterPadding.replace('px', '')) * 2;
    var initialTopPosition = element.offset().top - element.position().top;
    var initialLeftPosition = element.offset().left - element.position().left;

    var marginTopFix = 30;
    var marginLeftFix = 30;
    if (elementWidth <= marginLeftFix + 10) {
        marginLeftFix = 0;
    }
    if (elementHeight <= marginTopFix + 10) {
        marginTopFix = 0;
    }


    console.log("difference.height: " + difference.height + " difference.width: " + difference.width);
    console.log("elementHeight: " + elementHeight + " elementWidth: " + elementWidth);
    console.log("Presenter Height: " + presenter.height() + " Presenter Width: " + presenter.width());

    switch (position) {
        case "TOP_LEFT":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition);
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - (elementHeight + presenterPadding - marginTopFix));
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (marginTopFix));
                    break;
            }
            break;
        case "LEFT_TOP":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + (marginLeftFix));
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width + presenterPadding + marginLeftFix));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - elementHeight + presenterPadding);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition);
                    break;
            }
            break;
        case "TOP_RIGHT":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition);
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - (elementHeight + marginTopFix));
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (marginTopFix));
                    break;
            }
            break;
        case "RIGHT_TOP":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + elementWidth + marginLeftFix);
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width + presenterPadding + marginLeftFix));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - (elementHeight - presenterPadding));
                    break;
                default:
                    presenterPosition.top = (initialTopPosition);
                    break;
            }
            break;
        case "BOTTOM_LEFT":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition);
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + presenterPadding));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - marginTopFix);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (elementHeight + marginTopFix));
                    break;
            }
            break;
        case "LEFT_BOTTOM":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + marginLeftFix);
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width + presenterPadding + marginLeftFix));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (elementHeight - presenterPadding - marginTopFix - fixedPoints));
                    break;
            }
            break;
        case"BOTTOM_RIGHT":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + (elementWidth - marginLeftFix - presenterPadding + fixedPoints));
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (difference.width + presenterPadding ));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (elementHeight + marginTopFix));
                    break;
            }
            break;
        case"RIGHT_BOTTOM":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + (elementWidth + marginLeftFix));
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (difference.width + marginLeftFix + presenterPadding));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (elementHeight - marginTopFix));
                    break;
            }
            break;
    }
    return presenterPosition;
}
/**
 *
 * @param presenter
 * @param element
 * @returns {{height: number, width: number}}
 */
PresenterJS.prototype.getDifferenceBetweenThePresenterAndTheElement = function (presenter, element) {
    var heightDiff = presenter.height() - element.height();
    if (heightDiff < 0) {
        heightDiff = heightDiff * -1;
    }
    var widthDiff = presenter.width() - element.width();
    if (widthDiff < 0) {
        widthDiff * -1;
    }
    var difference = {height: heightDiff, width: widthDiff}
    return difference;
}
/**
 *
 * @param stepsArray
 */
PresenterJS.prototype.initPresenter = function (stepsArray) {
    PresenterJS.prototype.steps = stepsArray;
}

/**
 *
 */
PresenterJS.prototype.runShowCase = function () {
    $('body').append(PresenterJS.prototype.defaultTemplate);
    $('body').css({"overflow": "hidden"});

    var guideBg = $('body').find("#guide-bg");
    guideBg.addClass(PresenterJS.prototype.steps['prepare'].class);

    var guideBgDuration = css_time_to_milliseconds(guideBg.css('transition-duration'));
    if (!guideBgDuration) {
        guideBgDuration = 1000;
    }

    var guideMsg = $('body').find("#guide-message");
    var guideMsgDuration = css_time_to_milliseconds(guideMsg.css('transition-duration'));
    if (!guideMsgDuration) {
        guideMsgDuration = 3000;
    }

    setTimeout(function () {
        guideBg.addClass("show");
        setTimeout(function () {
            guideMsg.addClass("show");

            var productName = guideBg.find("#productName");

            if (!PresenterJS.prototype.steps['prepare'].productName) {
                productName.css("display", "none");
            } else {
                productName.html(PresenterJS.prototype.steps['prepare'].productName);
            }

            var initMessage = guideBg.find("#message");

            if (!PresenterJS.prototype.steps['prepare'].message) {
                initMessage.css("display", "none");
            } else {
                initMessage.html(PresenterJS.prototype.steps['prepare'].message);
            }

            setTimeout(function () {
                guideMsg.css({
                    "-webkit-transition-duration": ".5s",
                    "-moz-transition-duration": ".5s",
                    "-ms-transition-duration": ".5s",
                    "-o-transition-duration": ".5s",
                    "transition-duration": ".5s"
                });
                guideMsg.addClass("hide");
                guideBg.removeClass('show');

                setTimeout(function () {
                    PresenterJS.prototype.show(PresenterJS.prototype.steps['step1']);
                }, PresenterJS.prototype.steps['step1'].delay);

            }, guideMsgDuration);

        }, guideBgDuration);

    }, 100);
}

function css_time_to_milliseconds(time_string) {
    var num = parseFloat(time_string, 10);
    var unit = time_string.match(/m?s/);
    var milliseconds;

    if (unit) {
        unit = unit[0];
    }

    switch (unit) {
        case "s": // seconds
            milliseconds = num * 1000;
            break;
        case "ms": // milliseconds
            milliseconds = num;
            break;
        default:
            milliseconds = 0;
            break;
    }

    return milliseconds;
}


