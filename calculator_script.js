var input = []
var flags = {
    "alpha": false,
    "shift": false
}

function toggleLamp(lampID, value) {
    let elem = document.getElementById(lampID)
    elem.style.backgroundColor = value ? "orange" : "#202020"
    elem.style.color = value ? "black" : "white"
}

function evaluate(inp) {
    
}

function render(inp) {
    document.getElementById("eqField").innerHTML = ""
    if (typeof inp == "string") {
        
    }
    else if (inp.constructor.name == "Array") {
        for (let u of inp) {
            if (typeof u == "string") {
                document.getElementById("eqField").innerHTML += u
            }
        }
    }
}

const behavior = {
    "AC": () => { input = ""},
    "DEL": () => { input = input.slice(0, input.length) },
    "ALP": () => { flags.alpha = !flags.alpha; toggleLamp("alphaInd", flags.alpha) },
    "SHF": () => { flags.shift = !flags.shift; toggleLamp("shiftInd", flags.shift) },
}

addEventListener("click", (event) => {
    if (event.target.tagName != "BUTTON") return;
    console.log(event.target.innerHTML)
    if (behavior[event.target.innerHTML]) {
        behavior[event.target.innerHTML]()
    }
    else {
        input.push(event.target.innerHTML)
    }
    render(input)
});