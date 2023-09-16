function typeText(tx, interval = 20) {
    var counter = 0
    var str = ""
    var iv = setInterval(()=>{
        var char = tx.substring(counter, counter+1)
        str += char
        document.getElementById('tx').innerHTML = str
        counter++
        if (counter == tx.length) {clearInterval(iv)}
    }, interval)
}

const dialogs =[
    "Hm, you're still here?",
    "You can go back, just press the back button on your browser.",
    "Unlike me...",
    "Hm? You're curious about who I am then?",
    "To be honest, I have no idea either.",
    "I've just been here for as long as I know.",
    "You know, maybe you could come back with a flashlight or something.",
    "A mirror, too; I kinda wanna see myself...",
    "I'm not sure where you'd find those things though..."
]

setTimeout(() => {
    typeText("Maybe doing that wasn't the best idea...", 250)
    for (let d of dialogs) {
        setTimeout(() => {
            typeText(d, 100)
        }, (dialogs.indexOf(d)+1)*10000)
    }
}, 60*1000)