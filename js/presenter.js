/**
 * Created by Eduardo Luttinger on 01/09/2017.
 */
$(document).ready(function () {

    var steps = {
        step1: {
            id: "step1",
            title: "Cuadrito 1",
            text: "Este es el cuadrado 1 alineado en la esquina superior izquierda, el no hace nada solo esta alli para enseñarte a usar esta mierda :)",
            position: "BOTTOM_RIGHT",
            indicatorPosition: "left-top",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step2"
        },
        step2: {
            id: "step2",
            title: "Cuadradito 2",
            text: "Este es el cuadrado 2 alineado en la esquina superior derecha, es mas cool que el cuadrado 1",
            position: "BOTTOM_LEFT",
            indicatorPosition: "right-top",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step3"
        },
        step3: {
            id: "step3",
            title: "Cuadradito 3",
            text: "Este es el cuadrado 3 alineado en la esquina inferior izquierda no hace un coño tampoco",
            position: "TOP_RIGHT",
            indicatorPosition: "left-bottom",
            drawOnTarget: "pintar",
            drawOnSelf: "",
            template: "",
            nextStep: "step4"
        },
        step4: {
            id: "step4",
            title: "Cuadradito 4",
            text: "Este es el cuadrado 4 alineado en la esquina inferior derecha es el ultimo, aqui termina la presentacion",
            position: "TOP_LEFT",
            indicatorPosition: "right-bottom",
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
        presenter.find('#presenter_title').html(step.title);
        presenter.find('#presenter_message').html(step.text);
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
        var paddingFix = presenter.css('padding');
        paddingFix = Number(paddingFix.replace('px', '')) * 2;
        var marginFix = 30;
        switch (position) {
            case "TOP_LEFT":
                topAndLeft.top = -((height + finalHeight + paddingFix) + fixedPoints) + marginFix;
                topAndLeft.left = -((width + finalWidth + paddingFix) + fixedPoints) - marginFix;
                break;
            case "TOP_RIGHT":
                topAndLeft.top = -((height + finalHeight + paddingFix) + fixedPoints) + marginFix;
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

    show(steps['step1']);

});