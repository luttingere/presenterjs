/**
 * Created by Eduardo Luttinger on 01/09/2017.
 */

$(document).ready(function () {

    var steps = {
        prepare: {
            template: "<div id=\"guide-bg\"><div id=\"guide-message\"><div id=\"message-container\"><span id=\"productName\" class=\"product-name\"></span><span id=\"message\"></span></div></div></div>",
            productName: "PresenterJS",
            message: "A cool tool to explain ur apps step by step"
        },
        step1: {
            id: "step1",
            groupClass:"elevate",
            title: "1",
            text: "Ubicacion: TOP_LEFT, alineacion: LEFT",
            position: "LEFT_TOP",
            align_horizontal: "LEFT",
            align_vertical: "TOP",
            button: "GOT IT!",
            indicatorPosition: "bottom-right",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "elevate",
            drawOnSelf: "",
            template: "",
            delay: 300,
            nextStep: "step2",
            kill: "",
            callback: function () {
            }
        },
        step2: {
            id: "step1",
            title: "2",
            text: "Ubicacion: TOP_LEFT, alineacion: LEFT",
            position: "TOP_LEFT",
            align_horizontal: "RIGHT",
            align_vertical: "TOP",
            button: "GOT IT!",
            indicatorPosition: "top-left",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step1",
            kill: "",
            callback: function () {
            }
        },
        step3: {
            id: "step1",
            title: "3",
            text: "Ubicacion: LEFT_BOTTOM, alineacion: LEFT",
            position: "LEFT_BOTTOM",
            button: "GOT IT!",
            align: "LEFT",
            indicatorPosition: "right-top",
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
            id: "step1",
            title: "4",
            text: "Ubicacion: LEFT_BOTTOM, alineacion: RIGHT",
            position: "LEFT_BOTTOM",
            align: "RIGHT",
            button: "GOT IT!",
            indicatorPosition: "left-top",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step5",
            kill: "step1",
            callback: function () {
            }
        },
        step5: {
            id: "step1",
            title: "5",
            text: "Ubicacion: BOTTOM_RIGHT, alineacion: RIGHT",
            position: "BOTTOM_RIGHT",
            align: "RIGHT",
            button: "GOT IT!",
            indicatorPosition: "top-left",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step6",
            kill: "",
            callback: function () {
            }
        },
        step6: {
            id: "step1",
            title: "6",
            text: "Ubicacion: BOTTOM_RIGHT, alineacion: LEFT",
            position: "BOTTOM_RIGHT",
            align: "LEFT",
            button: "GOT IT!",
            indicatorPosition: "top-right",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step7",
            kill: "",
            callback: function () {
            }
        },
        step7: {
            id: "step1",
            title: "7",
            text: "Ubicacion: RIGHT_BOTTOM, alineacion: RIGHT",
            position: "RIGHT_BOTTOM",
            align: "RIGHT",
            button: "GOT IT!",
            indicatorPosition: "left-top",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step8",
            kill: "",
            callback: function () {
            }
        },
        step8: {
            id: "step1",
            title: "8",
            text: "Ubicacion: RIGHT_BOTTOM, alineacion: LEFT",
            position: "RIGHT_BOTTOM",
            align: "LEFT",
            button: "GOT IT!",
            indicatorPosition: "right-top",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step9",
            kill: "",
            callback: function () {
            }
        },
        step9: {
            id: "step1",
            title: "9",
            text: "Ubicacion: TOP_RIGHT, alineacion: RIGHT",
            position: "TOP_RIGHT",
            align: "RIGHT",
            button: "GOT IT!",
            indicatorPosition: "bottom-left",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step10",
            kill: "",
            callback: function () {
            }
        },
        step10: {
            id: "step1",
            title: "10",
            text: "Ubicacion: TOP_RIGHT, alineacion: LEFT",
            position: "TOP_RIGHT",
            align: "LEFT",
            button: "GOT IT!",
            indicatorPosition: "bottom-right",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step11",
            kill: "",
            callback: function () {
            }
        },
        step11: {
            id: "step1",
            title: "11",
            text: "Ubicacion: RIGHT_TOP, alineacion: RIGHT",
            position: "RIGHT_TOP",
            align: "RIGHT",
            button: "GOT IT!",
            indicatorPosition: "left-bottom",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step12",
            kill: "",
            callback: function () {
            }
        },
        step12: {
            id: "step1",
            title: "12",
            text: "Ubicacion: RIGHT_TOP, alineacion: LEFT",
            position: "RIGHT_TOP",
            align: "LEFT",
            button: "GOT IT!",
            indicatorPosition: "right-bottom",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step13",
            kill: "",
            callback: function () {
            }
        },
        step13: {
            id: "step1",
            title: "13",
            text: "Ubicacion: TOP_LEFT, alineacion: RIGHT",
            position: "TOP_LEFT",
            align: "RIGHT",
            button: "GOT IT!",
            indicatorPosition: "bottom-left",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step14",
            kill: "",
            callback: function () {
            }
        },
        step14: {
            id: "step1",
            title: "14",
            text: "Ubicacion: TOP_LEFT, alineacion: LEFT",
            position: "TOP_LEFT",
            align: "LEFT",
            button: "GOT IT!",
            indicatorPosition: "bottom-right",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step15",
            kill: "",
            callback: function () {
            }
        },
        step15: {
            id: "step1",
            title: "15",
            text: "Ubicacion: LEFT_TOP, alineacion: RIGHT",
            position: "LEFT_TOP",
            align: "RIGHT",
            button: "GOT IT!",
            indicatorPosition: "left-bottom",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step16",
            kill: "",
            callback: function () {
            }
        },
        step16: {
            id: "step1",
            title: "16",
            text: "Ubicacion: LEFT_TOP, alineacion: LEFT",
            position: "LEFT_TOP",
            align: "LEFT",
            button: "GOT IT!",
            indicatorPosition: "right-bottom",
            drawOnTargetAtStart: "elevate",
            drawOnTargetAtEnd: "",
            drawOnSelf: "",
            template: "",
            nextStep: "step1",
            kill: "",
            callback: function () {
            }
        },
        end: {}
    };

    var presenterJs = new PresenterJS();
    presenterJs.initPresenter(steps);
    //presenterJs.show(steps['step14']);
    presenterJs.runShowCase();
});

