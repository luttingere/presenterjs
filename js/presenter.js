/**
 * Created by Eduardo Luttinger on 01/09/2017.
 */
$(document).ready(function () {


    var presenterDefaultTemplate = "<div id=\"guide-dialogue-box\"></div>";
    var presenterDefaultBody = "<div id=\"dialogue-indicator\"></div>" +
        "<div class=\"dialogue-content\"><div class=\"dialogue-img\"><img src=\"https://image.flaticon.com/icons/svg/288/288082.svg\">" +
        "</div> <div class=\"dialogue-body\"><h4 id=\"presenter_title\" class=\"dialogue-heading\"></h4><p id=\"presenter_message\"></p>" +
        "<button id=\"dialogue-btn\" class=\"btn waves-effect waves-light hide\" type=\"submit\" name=\"action\">Entendido</button></div></div>";

    var steps = {
        prepare: {
            template: "<div id=\"guide-bg\"><div id=\"guide-message\"><div id=\"message-container\"><span id=\"productName\" class=\"product-name\"></span><span id=\"message\"></span></div></div></div>",
            productName: "The Presenter",
            message: "cualquier vaina =D"
        },
        step1: {
            id: "step1",
            title: "Cuadrito 1",
            text: "Este es el cuadrado 1 alineado en la esquina superior izquierda, el no hace nada solo esta alli para enseñarte a usar esta mierda :)",
            position: "BOTTOM_RIGHT",
            button: "GOT IT!",
            indicatorPosition: "left-top",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "elevate",
            drawOnSelf: "",
            template: presenterDefaultBody,
            delay: 1000,
            nextStep: "step2",
            kill:"step3"
        },
        step2: {
            id: "step2",
            title: "Cuadradito 2",
            text: "Este es el cuadrado 2 alineado en la esquina superior derecha, es mas cool que el cuadrado 1",
            position: "BOTTOM_LEFT",
            indicatorPosition: "right-top",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: presenterDefaultBody,
            nextStep: "step3",
            kill:""
        },
        step3: {
            id: "step3",
            title: "Cuadradito 3",
            text: "Este es el cuadrado 3 alineado en la esquina inferior izquierda no hace un coño tampoco",
            position: "TOP_RIGHT",
            button: "GOT IT!",
            indicatorPosition: "left-bottom",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "elevate",
            drawOnSelf: "",
            template: presenterDefaultBody,
            nextStep: "step4",
            kill:""
        },
        step4: {
            id: "step4",
            title: "Cuadradito 4",
            text: "Este es el cuadrado 4 alineado en la esquina inferior derecha es el ultimo, aqui termina la presentacion",
            position: "TOP_LEFT",
            button: "",
            indicatorPosition: "right-bottom",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: presenterDefaultBody,
            nextStep: "step1",
            kill:"step1"
        },
        end: {}
    };

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
        if(step.kill){
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
        if(step.drawOnTargetAtEnd){
            stepElement.addClass(step.drawOnTargetAtEnd);
        }
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



    function runShowCase(steps) {
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

        }, 3000);
    }

    runShowCase(steps);
    //show(steps['step2']);
});