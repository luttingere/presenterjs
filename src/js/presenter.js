/**
 * @author Eduardo Luttinger , Emisael Carrera
 *
 * @constructor
 */
function PresenterJS() {
}

PresenterJS.prototype.steps = null;
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
 *
 * the
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
PresenterJS.prototype.onStepStart = function (step, stepElement, presenter) {
    PresenterJS.prototype.killAPreviousStep(step);
    PresenterJS.prototype.transformThePresenter(presenter, step, stepElement);
    var presenterPosition = PresenterJS.prototype.calculateNextPositionForThePresenter(step.position, step.align_horizontal, step.align_vertical, stepElement, presenter);
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
    if (step.callback) {
        step.callback();
    }
    //End of the step
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
    if (step.group != null && step.group != null) {
        var stepViewGroup = $('body').find('.' + step.group);
        console.log(stepViewGroup);
        if (stepViewGroup.html() != undefined) {
            stepViewGroup.addClass(step.groupClass);
        }
    }

    //sadd functionality to the button of the presenter
    var presenterBtn = presenter.find('#dialogue-btn')
    if (!step.button) {
        presenterBtn.addClass("hide");
    } else {
        presenterBtn.removeClass("hide");
        presenterBtn.html(step.button);
        presenterBtn.off("click");
        presenterBtn.on("click", function () {
            PresenterJS.prototype.onStepEnd(step, stepElement, presenter)
            PresenterJS.prototype.show(steps[step.nextStep]);
        });
    }
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
 * @param step
 */
PresenterJS.prototype.killAPreviousStep = function (step) {
    // Kill an step still living if the step have the directive
    if (step.kill != null && step.kill != "") {
        var stepToKill = steps[step.kill];
        if (stepToKill != null) {
            var lastStepAlive = $('body').find('#' + stepToKill.id);
            if (lastStepAlive.html() != undefined) {
                lastStepAlive.removeClass(steps[step.kill].drawOnTargetAtEnd);
                if (stepToKill.group != null && stepToKill.group != "") {
                    var stepViewGroup = $('body').find('.' + stepToKill.group);
                    stepViewGroup.removeClass(stepToKill.groupClass);
                }
            }
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
    var marginFix = 30;

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
                    presenterPosition.top = (initialTopPosition - (elementHeight + presenterPadding - marginFix));
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (marginFix));
                    break;
            }
            break;
        case "LEFT_TOP":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + (marginFix));
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width + presenterPadding + marginFix));
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
                    presenterPosition.top = (initialTopPosition - (elementHeight + marginFix));
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (marginFix));
                    break;
            }
            break;
        case "RIGHT_TOP":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + (elementWidth + marginFix));
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (difference.width + presenterPadding + marginFix));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - (elementHeight - presenterPadding - marginFix + fixedPoints));
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
                    presenterPosition.top = (initialTopPosition - marginFix);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (elementHeight + marginFix));
                    break;
            }
            break;
        case "LEFT_BOTTOM":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + marginFix);
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width + presenterPadding + marginFix));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (elementHeight - presenterPadding - marginFix - fixedPoints));
                    break;
            }
            break;
        case"BOTTOM_RIGHT":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition + (elementWidth - marginFix - presenterPadding + fixedPoints));
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (difference.width  + presenterPadding ));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition + (elementHeight + marginFix));
                    break;
            }
            break;
        case"RIGHT_BOTTOM":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition);
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition);
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition);
                    break;
                default:
                    presenterPosition.top = (initialTopPosition);
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
    steps = stepsArray;
}

/**
 *
 */
PresenterJS.prototype.runShowCase = function () {
    var template = steps['prepare'].template;
    $('body').append(template)
    $('body').css({
        "overflow": "hidden",
    });
    setTimeout(function () {
        $('body').find("#guide-bg").addClass("show");
        setTimeout(function () {
            $('body').find("#guide-message").addClass("show");
            $('body').find("#guide-bg").find("#productName").html(steps['prepare'].productName);
            $('body').find("#guide-bg").find("#message").html(steps['prepare'].message);

            setTimeout(function () {

                $('body').find("#guide-message").addClass("hide");

                setTimeout(function () {
                    PresenterJS.prototype.show(steps['step1']);
                }, steps['step1'].delay);

            }, 1000);

        }, 1000);

    }, 100);
}