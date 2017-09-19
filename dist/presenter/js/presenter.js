/**
 * @author Eduardo Luttinger , Emisael Carrera
 *
 * @constructor
 */
function PresenterJS() {
}
PresenterJS.prototype.currentStep = null;
PresenterJS.prototype.stepElement = null;
PresenterJS.prototype.presenterDialogueBox = null;
PresenterJS.prototype.steps = null;
PresenterJS.prototype.defaultTemplate = "<div id=\"guide-bg\"><div id=\"guide-message\"><div id=\"message-container\"><span id=\"message\"></span><span id=\"productName\" class=\"product-name\"></span></div></div></div>";
PresenterJS.prototype.presenterDefaultTemplate = "<div id=\"guide-dialogue-box\"></div>";
PresenterJS.prototype.presenterDefaultBody = "<div id=\"dialogue-indicator\"></div>" +
    "<div class=\"dialogue-content\"><div class=\"dialogue-img\"><img src=\"https://image.flaticon.com/icons/svg/288/288082.svg\">" +
    "</div> <div class=\"dialogue-body\"><h4 id=\"presenter_title\" class=\"dialogue-heading\"></h4><p id=\"presenter_message\"></p>" +
    "<button id=\"dialogue-btn\" class=\"btn waves-effect waves-light show\" type=\"submit\" name=\"action\">Entendido</button></div></div>";


PresenterJS.prototype.getPresenterInstance = function () {
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

PresenterJS.prototype.getCurrentStep = function () {
    return this.currentStep;
}


/**
 *
 * start the step
 *
 * @param step
 */
PresenterJS.prototype.show = function (step) {

    PresenterJS.prototype.currentStep = step;

    var stepElement;

    if(step.id){
        stepElement = $('body').find('#' + step.id);
    }

    if(stepElement && (!stepElement.length || stepElement.css('display')=='none')) {
        PresenterJS.prototype.show(PresenterJS.prototype.steps[step.nextStep]);
    }else {
        PresenterJS.prototype.stepElement = stepElement;
        var presenter = PresenterJS.prototype.getPresenterInstance();
        this.onStepStart(step, stepElement, presenter);
    }
}

/**
 *
 * invoke the next step
 *
 */
PresenterJS.prototype.loadNextStep = function () {

    PresenterJS.prototype.onStepEnd(this.currentStep, this.stepElement, PresenterJS.prototype.getPresenterInstance());

    if(PresenterJS.prototype.currentStep){
        console.log("Loading next step: " + PresenterJS.prototype.currentStep.nextStep);
        if(PresenterJS.prototype.currentStep.nextStep == "end"){
            PresenterJS.prototype.endPresenter(PresenterJS.prototype.steps[PresenterJS.prototype.currentStep.nextStep]);
        }else {
            PresenterJS.prototype.show(PresenterJS.prototype.steps[PresenterJS.prototype.currentStep.nextStep]);
        }
    }else {
        console.log("There is no a step loaded");
    }
}

/**
 * Ends the presenter
 */
PresenterJS.prototype.endingCall = false;
PresenterJS.prototype.endPresenter = function (endStep) {

    if(!this.endingCall){
        this.endingCall = true;

        var guideBG = $('#guide-bg');
        var guideDialogue = $('#guide-dialogue-box');
        var guideBgDuration = 0;

        guideDialogue.addClass('hide transparent-simple');

        guideBG.css({
            "-webkit-transition-duration": "all 3s linear",
            "-moz-transition-duration": "all 3s linear",
            "-ms-transition-duration": "all 3s linear",
            "-o-transition-duration": "all 3s linear",
            "transition-duration": "all 3s linear"
        });
        guideDialogue.css({
            "-webkit-transition-duration": "all 1.5s linear",
            "-moz-transition-duration": "all 1.5s linear",
            "-ms-transition-duration": "all 1.5s linear",
            "-o-transition-duration": "all 1.5s linear",
            "transition-duration": "all 1.5s linear"
        });

        if(guideBG.hasClass('hide')){
            guideBgDuration = 3000;
        }

        for (var step in PresenterJS.prototype.steps) {
            if (step.indexOf("step") >= 0){
                PresenterJS.prototype.deleteStepTraces(PresenterJS.prototype.steps[step]);
            }
        }

        setTimeout(function(){
            PresenterJS.prototype.destroyPresenterElements();
            if (endStep.callback) {
                console.log("Running Callback");
                endStep.callback();
            }
            console.log("Bye PresenterJS");
        },guideBgDuration);

    }
}

/**
 *
 * Destroy all elements apended to the body by the Presenter
 *
 */
PresenterJS.prototype.destroyPresenterElements = function () {
    $('#guide-bg').remove();
    $('#guide-dialogue-box').remove();
}


/**
 *
 * @param stepElement
 * @param presenter
 * @param presenterPosition
 */
PresenterJS.prototype.setBodyScroll = function (step, focusElement) {
    if(step.scroll!=null && step.scroll==false){
        $('body').css({"overflow": "hidden"});
    }else {
        $('body').css({"overflow": "initial"});
    }

    var body = $("html, body");

    if(step.autoScroll){
        var scrollPos = this.stepElement.offset().top - $(window).height()/2 + this.stepElement.height()/2;
        body.stop().animate({scrollTop:scrollPos}, 1000, 'swing');
    }
}


/**
 *
 * Event on 'Step' start
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
PresenterJS.prototype.onStepStart = function (step, stepElement, presenter) {
    //PresenterJS.prototype.registerToResizeEvent(step);
    PresenterJS.prototype.killAPreviousStep(step);
    PresenterJS.prototype.setBodyScroll(step, stepElement);
    PresenterJS.prototype.transformThePresenter(presenter, step, stepElement);
    setTimeout(function(){
        var presenterPosition = PresenterJS.prototype.calculateNextPositionForThePresenter(step.position, step.align_horizontal, step.align_vertical, stepElement, presenter);
        PresenterJS.prototype.relocateThePresenterOnTheScreen(stepElement, presenter, presenterPosition);
    },25);
}

/**
 *
 * Event on 'Step' start
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
        step.callback();
    } catch (e) {
        console.log(e);
    }
    //End of the step

    $('body').css({"overflow": "initial"});
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
    if(stepElement){
        presenter.css({
            "position": "absolute",
            "left": stepElement.position().left + (presenterPosition.left),
            "top": stepElement.position().top + (presenterPosition.top)
        });
    }
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
    if(stepElement){
        stepElement.removeClass(step.drawOnTargetAtStart);
        presenter.removeClass(step.drawOnSelf);
    }
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
    if(stepElement){
        stepElement.removeClass(step.drawOnTargetAtEnd);
        stepElement.addClass(step.drawOnTargetAtStart);
    }

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

    //focus step input field
    if(step.focusElement){
        $("body").find("#"+step.focusElement).focus();
    }
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
                    console.log("aux button click");
                    PresenterJS.prototype.loadNextStep();
                });
            }
        }
    } else {
        presenterBtn.removeClass("hide");
        presenterBtn.html(step.button);
        presenterBtn.off("click");
        presenterBtn.on("click", function () {
            PresenterJS.prototype.loadNextStep();
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
                        elementHtml.removeClass(element.classesToRemove);
                        elementHtml.addClass(element.classesToAdd);
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

    if(!element){
        return presenterPosition;
    }

    var fixedPoints = 1;
    var elementHeight = element.outerHeight();
    var elementWidth = element.outerWidth();
    var difference = PresenterJS.prototype.getDifferenceBetweenThePresenterAndTheElement(presenter, element);
    var presenterPadding = presenter.css('padding');
    presenterPadding = Number(presenterPadding.replace('px', '')) * 2;
    var initialTopPosition = element.offset().top - element.position().top;
    var initialLeftPosition = element.offset().left - element.position().left;

    var marginTopFix = 19;
    var marginLeftFix = 19;
    var indicatorMargin = 29;

    switch (position) {
        case "TOP_LEFT":
            switch (alignHorizontal) {
                case "RIGHT":
                    presenterPosition.left = (initialLeftPosition);
                    break;
                default:
                    presenterPosition.left = initialLeftPosition - presenter.width() + marginLeftFix;
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - (presenter.height() + presenterPadding + marginTopFix));
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
                    presenterPosition.left = initialLeftPosition + element.outerWidth() - indicatorMargin * 2;
                    break;
                default:
                    presenterPosition.left = (initialLeftPosition - (elementWidth + difference.width));
                    break;
            }
            switch (alignVertical) {
                case "TOP":
                    presenterPosition.top = (initialTopPosition - (presenter.height() + elementHeight + marginTopFix));
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
        case "RIGHT_MIDDLE":
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
                    presenterPosition.top = initialTopPosition - presenter.height() + indicatorMargin - elementHeight/2;
                    break;
                default:
                    presenterPosition.top = initialTopPosition - indicatorMargin + elementHeight/2;
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
                    presenterPosition.top = (initialTopPosition + elementHeight + marginTopFix);
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
        case "LEFT_MIDDLE":
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
                    presenterPosition.top = initialTopPosition - presenter.height() + indicatorMargin - elementHeight/2;
                    break;
                default:
                    presenterPosition.top = initialTopPosition - indicatorMargin + elementHeight/2;
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
        case "MIDDLE":
            presenterPosition.left = element.outerWidth()/2 - presenter.outerWidth() / 2;
            presenterPosition.top = element.outerHeight()/2 - presenter.outerHeight() / 2;
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
    PresenterJS.prototype.destroyPresenterElements();
    PresenterJS.prototype.endingCall = false;
    PresenterJS.prototype.steps = stepsArray;
}

/**
 *
 */
PresenterJS.prototype.runShowCase = function () {
    $('body').append(PresenterJS.prototype.defaultTemplate);
    $('body').css("overflow","hidden");
    window.scrollTo(0,0);

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
                    window.scrollTo(0,0);
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