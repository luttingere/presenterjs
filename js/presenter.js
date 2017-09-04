function PresenterJS() {}

PresenterJS.prototype.steps = null;
PresenterJS.prototype.presenterDefaultTemplate = "<div id=\"guide-dialogue-box\"></div>";
PresenterJS.prototype.presenterDefaultBody = "<div id=\"dialogue-indicator\"></div>" +
    "<div class=\"dialogue-content\"><div class=\"dialogue-img\"><img src=\"https://image.flaticon.com/icons/svg/288/288082.svg\">" +
    "</div> <div class=\"dialogue-body\"><h4 id=\"presenter_title\" class=\"dialogue-heading\"></h4><p id=\"presenter_message\"></p>" +
    "<button id=\"dialogue-btn\" class=\"btn waves-effect waves-light show\" type=\"submit\" name=\"action\">Entendido</button></div></div>";


PresenterJS.prototype.getPresenterInstance = function() {
    console.log(this);
    var presenter = $('#guide-dialogue-box');
    if (presenter.html() == undefined) {
        console.log(this.presenterDefaultTemplate);
        $(this.presenterDefaultTemplate).appendTo($('body'));
        presenter = $('#guide-dialogue-box');
    }
    return presenter;
}


PresenterJS.prototype.getPresenterTemplate = function() {
    return this.presenterDefaultTemplate;
}

/**
 *
 * @param step
 */
PresenterJS.prototype.show = function(step) {
    var stepElement = $('body').find('.' + step.id);
    var presenter = this.getPresenterInstance();
    var topAndLeft = this.findPosition(step.position, stepElement, presenter);
    presenter.css({
        "position": "absolute",
        "left": stepElement.position().left + (topAndLeft.left),
        "top": stepElement.position().top + (topAndLeft.top)
    });
    this.onStepStart(step, stepElement, presenter);
}


/**
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
PresenterJS.prototype.onStepStart = function(step, stepElement, presenter) {
    if (step.kill) {
        var lastStepAlive = $('body').find('.' + steps[step.kill].id);
        lastStepAlive.removeClass(steps[step.kill].drawOnTargetAtEnd);
    }
    $('body').find("#guide-bg").css("background",step.bg_color);
    stepElement.removeClass(step.drawOnTargetAtEnd);
    stepElement.addClass(step.drawOnTargetAtStart);
    presenter.addClass(step.drawOnSelf);
    this.transform(presenter, step,stepElement);
    presenter.find('#dialogue-indicator').addClass(step.indicatorPosition);
}

/**
 *
 * @param step
 * @param stepElement
 * @param presenter
 */
PresenterJS.prototype.onStepEnd = function(step, stepElement, presenter) {
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
PresenterJS.prototype.transform = function(presenter, step,stepElement) {
    if (step.template != null && step.template != "") {
        $(step.template).css({}).appendTo(presenter);
    } else {
        $(this.presenterDefaultBody).css({}).appendTo(presenter);
    }
    var presenterBtn =  presenter.find('#dialogue-btn')
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
PresenterJS.prototype.findPosition = function(position, element, presenter) {
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

PresenterJS.prototype.initPresenter = function(stepsArray) {
    steps = stepsArray;
}

PresenterJS.prototype.runShowCase = function(){
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

                setTimeout(function(){
                    PresenterJS.prototype.show(steps['step1']);
                },steps['step1'].delay);

            }, 3000);

        }, 1000);

    }, 100);
}