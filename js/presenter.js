/**
 * Created by Eduardo Luttinger on 01/09/2017.
 */
$(document).ready(function () {

    var steps = {
        step1: {
            id: "step1",
            position: "BOTTOM_RIGHT",
            indicatorPosition:"left-top",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step2"
        },
        step2: {
            id: "step2",
            position: "BOTTOM_LEFT",
            indicatorPosition:"right-top",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step3"
        },
        step3: {
            id: "step3",
            position: "TOP_RIGHT",
            indicatorPosition:"left-bottom",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step4"
        },
        step4: {
            id: "step4",
            position: "TOP_LEFT",
            indicatorPosition:"right-bottom",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step1"
        }
    };

    /**
     *
     * @param step
     */
    function show(step) {
        //var stepElement = $('.'+step.id);
        var stepElement = $('#presentation').find('.' + step.id);
        var presenter = $('#guide-dialogue-box');
        var topAndLeft = findPosition(step.position, stepElement, presenter);
        presenter.off("click");
        presenter.on("click", function () {
            onStepEnd(step, stepElement, presenter)
            show(steps[step.nextStep]);
        }).css({
            "position": "relative",
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
        stepElement.addClass(step.drawOnTarget);
        presenter.addClass(step.drawOnSelf);
        presenter.find('#dialogue-indicator').addClass(step.indicatorPosition);
        console.log(presenter.find('#dialogue-indicator'));
        transform(presenter, step);
    }

    /**
     *
     * @param step
     * @param stepElement
     * @param presenter
     */
    function onStepEnd(step, stepElement, presenter) {
        stepElement.removeClass(step.drawOnTarget);
        presenter.removeClass(step.drawOnSelf);
        presenter.find('#dialogue-indicator').removeClass(step.indicatorPosition);
        if (step.template != null && step.template != "") {
            presenter.empty();
        }
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
        }
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
        var height = element.height();
        var width = element.width();
        var fixedPoints = 1;
        var finalHeight = presenter.height() - element.height();
        var finalWidth = presenter.width() - element.width();
        var padding = presenter.css('padding');
        padding = Number(padding.replace('px', '')) * 2;
        switch (position) {
            case "TOP_LEFT":
                topAndLeft.top = -((height + finalHeight + padding) + fixedPoints);
                topAndLeft.left = -((width + finalWidth + padding) + fixedPoints);
                break;
            case "TOP_RIGHT":
                topAndLeft.top = -((height + finalHeight + padding) + fixedPoints);
                topAndLeft.left = (width + fixedPoints);
                break;
            case "BOTTOM_LEFT":
                topAndLeft.top = (height + fixedPoints);
                topAndLeft.left = -((width + finalWidth + padding) + fixedPoints);
                break;
            case "BOTTOM_RIGHT":
                topAndLeft.top = (height + fixedPoints);
                topAndLeft.left = (width + fixedPoints);
                break;
        }
        return topAndLeft;
    }

    show(steps['step1']);

});