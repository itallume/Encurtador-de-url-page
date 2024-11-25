let activeDuration = "1";
const durationElements = {
    "1": document.getElementById("one"),
    "2": document.getElementById("two"),
    "5": document.getElementById("five"),
    "10": document.getElementById("ten")
};

function changeDuration(duration) {

    durationElements[activeDuration].classList.remove("selected");
    durationElements[activeDuration].classList.add("unselected");

    activeDuration = duration;
    durationElements[duration].classList.remove("unselected");
    durationElements[duration].classList.add("selected");
}