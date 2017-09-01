/**
 * Created by Eduardo Luttinger on 01/09/2017.
 */
$(document).ready(function() {



    var steps = {
        step1: {
            id: "step1",
            position: "BOTTOM_RIGHT",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step2"
        },
        step2: {
            id: "step2",
            position: "BOTTOM_LEFT",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step3"
        },
        step3: {
            id: "step3",
            position: "TOP_RIGHT",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step4"
        },
        step4: {
            id: "step4",
            position: "TOP_LEFT",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step1"
        }
    };

    function show(step) {
        //var stepElement = $('.'+step.id);
        var stepElement = $('#presentation').find('.' + step.id);
        var presenter = $('#guide-dialogue-box');
        var topAndLeft = findPosition(step.position, stepElement,presenter);
        presenter.off("click");
        presenter.on("click", function() {
            onStepEnd(step, stepElement, presenter)
            show(steps[step.nextStep]);
        }).css({
            "position": "relative",
            "left": stepElement.position().left + (topAndLeft.left),
            "top": stepElement.position().top + (topAndLeft.top)
        });
        onStepStart(step, stepElement, presenter);
    }


    function onStepStart(step, stepElement, presenter) {
        stepElement.addClass(step.drawOnTarget);
        presenter.addClass(step.drawOnSelf);
        transform(presenter, step);
    }

    function onStepEnd(step, stepElement, presenter) {
        stepElement.removeClass(step.drawOnTarget);
        presenter.removeClass(step.drawOnSelf);
        if(step.template != null && step.template != ""){
            presenter.empty();
        }
    }

    function transform(presenter, step) {
        if(step.template != null && step.template != ""){
            $(step.template).css({

            }).appendTo(presenter);
        }
    }

    function findPosition(position, element, presenter) {
        var topAndLeft = {
            "top": "",
            "left": ""
        }
        var fixedPoints = 1;
        var finalHeight = presenter.height() - element.height();
        var finalWidth = presenter.width() - element.width();
        switch (position) {
            case "TOP_LEFT":
                topAndLeft.top = -((element.height()+finalHeight) + fixedPoints);
                topAndLeft.left = -((element.width() + finalWidth) + fixedPoints);
                break;
            case "TOP_RIGHT":
                topAndLeft.top = -((element.height() + finalHeight) + fixedPoints);
                topAndLeft.left = (element.width() + fixedPoints);
                break;
            case "BOTTOM_LEFT":
                topAndLeft.top = (element.height() + fixedPoints);
                topAndLeft.left = -((element.width() + finalWidth) + fixedPoints);
                break;
            case "BOTTOM_RIGHT":
                topAndLeft.top = (element.height() + fixedPoints);
                topAndLeft.left = (element.width() + fixedPoints);
                break;
        }
        return topAndLeft;
    }

    show(steps['step1']);

});