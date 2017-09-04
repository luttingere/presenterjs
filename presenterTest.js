/**
 * Created by Eduardo Luttinger on 01/09/2017.
 */

$(document).ready(function () {

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
            position: "BOTTOM_LEFT",
            side: "IN",
            button: "GOT IT!",
            indicatorPosition: "top-left",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "elevate",
            drawOnSelf: "",
            template: "",
            delay: 1000,
            nextStep: "step2",
            kill: "step3",
            callback: function () {

            }
        },
        step2: {
            id: "step2",
            title: "Cuadradito 2",
            text: "Este es el cuadrado 2 alineado en la esquina superior derecha, es mas cool que el cuadrado 1",
            position: "BOTTOM_LEFT",
            side:"IN",
            indicatorPosition: "right-top",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step3",
            kill: "",
            callback: function () {
            }
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
            template: "",
            nextStep: "step4",
            kill: "",
            callback: function () {
            }
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
            template: "",
            nextStep: "step1",
            kill: "step1",
            callback: function () {
            }
        },
        end: {}
    };
    //initPresenter(steps);
    initPresenter(steps);
    //show(steps['step1']);
    runShowCase();
});

