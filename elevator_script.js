// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if(array === this)
        return true;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

var inOp = false;

function openElevator() {
    if (inOp) { return }
    document.getElementById("elevator").src = "Assets/Images/Elevator/elevator_open_inside.png"
}

function closeElevator() {
    document.getElementById("elevator").src = "Assets/Images/Elevator/elevator_closed.png"
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function arrGetKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].equals(value));
}

const eudist = (...args) => {
    let sqSum = args.reduce((psum, v) => psum + v**2)
    return Math.sqrt(sqSum)
}

$(window).bind("load", function() {
    const currDest = window.location.search.substring(13)
    document.getElementById("elevLink").href = currDest
    const destRef = {
        "elevator_interior.html": "This elevator???",
        "art_page.html": "Art Page",
        "index.html": "Home Page",
        "CSPage.html": "Computers Page",
        "music_page.html": "Music Page",
        "maths_page.html": "Math Page",
        "https://ultrio325.tumblr.com": "Tumblr Page"
    }
    const destCoord = {
        "This elevator???": [612, 612],
        "Art Page": [514, 841],
        "Home Page": [180, 125],
        "Computers Page": [718, 1326],
        "Music Page": [422, 719],
        "Math Page": [873, 1548],
        "Tumblr Page": [1337, 420]
    }
    var destName = (currDest.replace(/\/$/, "")) in destRef === true ? destRef[currDest.replace(/\/$/, "")] : "???"
    var currCoord = destCoord[destName] === undefined ? [0, 0] : destCoord[destName]
    console.log(currDest in destRef, destName, currDest, destRef)
    document.getElementById("destinationDisplay").innerHTML = `Current destination: ${destName}`
    const cmdHelp = {
        help: `
        help <command>
        Shows information about the given command.
        `,
        echo: `
        echo <string>
        Repeats the given string.
        `,
        fset: `
        fset <floorName>
        Sends the elevator to the given destination.
        `,
        fls: `
        fls
        Lists available destinations.
        `,
        coordGo: `
        coordGo
        Go to a given coordinate.
        `,
        ptable: `
        ptable
        Toggles the built-in terminal periodic table
        `
    }
    $(function() {
        $('#terminal').terminal({
            help: function(cmd = null) {
                if (cmd === null) {this.echo(`
                Do "help <command>" for help on a specific command.

                Available commands include:
                help - Displays this list
                echo - Repeats a string
                fset - Sends the elevator to a given destination
                fls - Lists available destinations
                coordGo - Go to a given coordinate
                ptable - Toggles the built-in terminal periodic table
                `)} else {
                    if (cmdHelp[cmd] === null) {this.echo("Unknown command, can't help'cha with this one chief.")} else
                    {this.echo(cmdHelp[cmd])}
                }
            },
            echo: function() {this.echo(Array.prototype.slice.call(arguments, 0).join(" "))},
            fset: function() {
                if (inOp) {this.echo(`Already in operation. Have some patience :P`); return}
                var floor = Array.prototype.slice.call(arguments, 0).join(" ");
                if (!Object.values(destRef).includes(floor)) {this.echo(`No destination ${floor} is known!`); return}
                inOp = true;
                document.getElementById("elevLink").href = "javascript:void(0)"
                this.echo(`Heading to destination ${floor}...`);
                document.getElementById("destinationDisplay").innerHTML = `Current destination: Nowhere`
                setTimeout(() => {
                    inOp = false
                    this.echo(`Destination ${floor} reached.`)
                    document.getElementById("elevLink").href = getKeyByValue(destRef, floor)
                    document.getElementById("destinationDisplay").innerHTML = `Current destination: ${
                        Object.values(destRef).includes(floor) ? floor : "???"
                    }`
                }, 5000)
            },
            fls: function() {
                this.echo("Here are the available destinations:")
                var str = ""
                for (let [_, e] of Object.entries(destRef)) {str += e + ` @ (${destCoord[e][0]}, ${destCoord[e][1]})` + "\n"}
                this.echo(str)
            },
            coordGo: function(x, y) {
                if (!(typeof x === "number" && typeof y === "number")) {this.echo("Please enter coordinates instead of names!")}
                var history = this.history();
                history.disable();
                this.push(function(command) {
                    if (command.match(/^(y|yes)$/i)) {
                        this.echo("Alright, hope you know what you're doing...");
                        document.getElementById("elevLink").href = "javascript:void(0)"
                        this.pop();
                        history.enable();
                        setTimeout(() => {
                            this.echo("We're here, stay safe.")
                            currCoord = [x, y]
                            var dest = arrGetKeyByValue(destCoord, currCoord)
                            var destLink = !(dest === undefined || dest === null) ? getKeyByValue(destRef, dest) : "void.html"
                            console.log(dest, destLink)
                            document.getElementById("elevLink").href = destLink
                            document.getElementById("destinationDisplay").innerHTML = `Current destination: ${dest === undefined || dest === null ? "???" : dest}`
                        }, eudist(currCoord[0]-x,currCoord[1]-y)*10)
                    } else if (command.match(/^(n|no)$/i)) {
                        this.echo("Understood. Command aborted.")
                        this.pop();
                        history.enable();
                    }
                }, {
                    prompt: "Are you sure you wish to go to this coordinate? Your actions can have dire consequences. (y/n)"
                });
            },
            ptable: function() {
                let pt = document.getElementById("ptable")
                console.log(pt, pt.style.display, (pt.style.display == "none") ? "auto" : "none", pt.style.display == "none")
                pt.style.display = (pt.style.display == "none") ? "block" : "none"
                console.log(pt, pt.style.display, (pt.style.display == "none") ? "auto" : "none", pt.style.display == "none")
            },
            bcmd: function() {
                this.push(function(byte) {
                    const byteRegex = /^0x([0-9a-fA-F]+)$/
                    let result = byte.match(byteRegex)
                    console.log(result)
                    if (result == null || byte == "exit") {
                        this.echo("UNBYTY EATEN, NOT TASTY")
                        this.pop()
                        return
                    }
                    result = result[0].toUpperCase()
                    const byteLoc = {
                        
                    }
                    if (!Object.keys(byteLoc).includes(result)) {
                        const randomKey = function (obj) {
                            var keys = Object.keys(obj);
                            return keys[ keys.length * Math.random() << 0];
                        };
                        this.echo("ELEVATOR UNSTABLE, EXIT UNPREDICTABLE")
                        const webs = {
                            "Nowhere": "void.html"
                        }
                        let choice = randomKey(webs)
                        document.getElementById("destinationDisplay").innerHTML = `Current destination: ${choice}`
                        document.getElementById("elevLink").href = webs[choice]
                        // document.getElementById("elevator").className = "shake"
                        this.pop()
                    } else {
                        this.echo("DOING THE BYTE COMMAND, JUST WAIT A BIT OKAY")
                        setTimeout(byteLoc[result], 1000)
                    }
                }, {
                    prompt: "QUERY: BYTE; FORMAT 0x"
                })
            },
        }, {
            checkArity: false,
            exit: false,
            greetings: (a) => {
                let date = new Date();
                return `
                Elevator Terminal version [Integer too long to fit on screen!]
                Good ${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()} (${Intl.DateTimeFormat(undefined, {timeZoneName: 'long'}).formatToParts(date).find((part) => part.type == 'timeZoneName').value}),
                where would you like to go?
                (In case you're new to this, type 'help' for a list of commands)
                (Press the elevator door to exit the elevator to your destination)
                `
            },
            prompt: "U >",
            outputLimit: 20
        });
    });
});

function panic() {
    document.getElementById("elevLink").href = "void.html"
    document.getElementById("destinationDisplay").innerHTML = `Current destination: Nowhere`
    $('#terminal').terminal().echo(`
    Elevator delocated. Do not worry: you are safe and have plenty of time to figure the terminal out.
    To see help for a command, type "help". To list the floors available, type "fls".
    To go to a floor, either type "fset <Floor NAME>" (e.g. "fset Math Page"), or "coordGo <x> <y>" (e.g. "coordGo 873 1548").
    Do NOT go to a coordinate not specified by fls, as you may fall into the middle of nowhere.
    `)
}
