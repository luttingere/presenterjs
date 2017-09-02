var presenterDefaultTemplate = "<div id=\"guide-dialogue-box\"></div>";
var presenterDefaultBody = "<div id=\"dialogue-indicator\"></div>" +
    "<div class=\"dialogue-content\"><div class=\"dialogue-img\"><img src=\"https://image.flaticon.com/icons/svg/288/288082.svg\">" +
    "</div> <div class=\"dialogue-body\"><h4 id=\"presenter_title\" class=\"dialogue-heading\"></h4><p id=\"presenter_message\"></p>" +
    "<button id=\"dialogue-btn\" class=\"btn waves-effect waves-light hide\" type=\"submit\" name=\"action\">Entendido</button></div></div>";
var steps = null;
function getPresenterInstance(step) {
    var presenter = $('#guide-dialogue-box');
    if (presenter.html() == undefined) {
        $(presenterDefaultTemplate).appendTo($('body'));
        presenter = $('#guide-dialogue-box');
    }
    return presenter;
}

/**
 *
 * @param step
 */
function show(step) {
    //var stepElement = $('.'+step.id);
    var stepElement = $('body').find('.' + step.id);
    var presenter = getPresenterInstance(step);
    var topAndLeft = findPosition(step.position, stepElement, presenter);
    presenter.off("click");
    presenter.on("click", function () {
        onStepEnd(step, stepElement, presenter)
        show(steps[step.nextStep]);
    }).css({
        "position": "absolute",
        "left": stepElement.position().left + (topAndLeft.left),
        "top": stepElement.position().top + (topAndLeft.top)
    });
    onStepStart(step, stepElement, presenter);
}


/**
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
function onStepStart(step, stepElement, presenter) {
    if (step.kill) {
        var lastStepAlive = $('body').find('.' + steps[step.kill].id);
        lastStepAlive.removeClass(steps[step.kill].drawOnTargetAtEnd);
    }
    stepElement.removeClass(step.drawOnTargetAtEnd);
    stepElement.addClass(step.drawOnTargetAtStart);
    presenter.addClass(step.drawOnSelf);
    transform(presenter, step);
    presenter.find('#dialogue-indicator').addClass(step.indicatorPosition);
}

/**
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
function onStepEnd(step, stepElement, presenter) {
    stepElement.removeClass(step.drawOnTargetAtStart);
    if (step.drawOnTargetAtEnd) {
        stepElement.addClass(step.drawOnTargetAtEnd);
    }
    if (step.callback) {
        step.callback();
    }
    presenter.removeClass(step.drawOnSelf);
    presenter.find('#dialogue-indicator').removeClass(step.indicatorPosition);
    presenter.empty();

}

/**
 *
 *
 * @param presenter
 * @param step
 */
function transform(presenter, step) {
    if (step.template != null && step.template != "") {
        $(step.template).css({}).appendTo(presenter);
    } else {
        $(presenterDefaultBody).css({}).appendTo(presenter);
    }
    if (!step.button) {
        presenter.find('#dialogue-btn').addClass("hide");
    } else {
        presenter.find('#dialogue-btn').removeClass("hide");
        presenter.find('#dialogue-btn').html(step.button);
    }
    presenter.find('#presenter_title').html(step.title);
    presenter.find('#presenter_message').html(step.text);
    presenter.addClass("show");
}

/**
 *
 * @param position
 * @param element
 * @param presenter
 * @returns {{top: string, left: string}}
 */
function findPosition(position, element, presenter) {
    var topAndLeft = {
        "top": "",
        "left": ""
    }
    console.log(element.position());
    console.log(element.height());
    console.log(element.width());
    var height = element.height();
    var width = element.width();
    var fixedPoints = 1;
    var finalHeight = presenter.height() - element.height();
    var finalWidth = presenter.width() - element.width();
    if (finalHeight < 0) {
        finalHeight = finalHeight * -1;
    }
    if (finalWidth < 0) {
        finalWidth = finalWidth * -1;
    }
    var paddingFix = presenter.css('padding');
    paddingFix = Number(paddingFix.replace('px', '')) * 2;
    var marginFix = 30;
    switch (position) {
        case "TOP_LEFT":
            topAndLeft.top = -(((finalWidth - paddingFix) + fixedPoints) - marginFix);
            topAndLeft.left = -(((width + finalWidth + paddingFix) + fixedPoints) + marginFix);
            break;
        case "TOP_RIGHT":
            topAndLeft.top = -(finalWidth - paddingFix - 12);
            topAndLeft.left = (width + fixedPoints) + marginFix;
            break;
        case "BOTTOM_LEFT":
            topAndLeft.top = (height + fixedPoints) - marginFix;
            topAndLeft.left = -((width + finalWidth + paddingFix) + fixedPoints) - marginFix;
            break;
        case "BOTTOM_RIGHT":
            topAndLeft.top = (height + fixedPoints) - marginFix;
            topAndLeft.left = (width + fixedPoints) + marginFix;
            break;
    }
    return topAndLeft;
}

function initPresenter(stepsArray) {
    steps = stepsArray;
}

function runShowCase() {
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
                show(steps['step1']);

            }, steps['step1'].delay);


        }, 1000);

    }, 100);
}