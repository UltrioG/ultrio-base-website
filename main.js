var navBarOn = false

function lerp(a, b, t) {
    return (b-a)*t+a
}

function toggleSidebar() {
    navBarOn = !navBarOn
    updateSidebar()
};

function updateSidebar() {
    document.getElementById("navBar").style.left = navBarOn? "0" : "-20%"
    document.getElementById("navBarToggleButton").innerText = navBarOn? "<" : ">"
    console.log(sideBar.style.left)
}

function openElevator() {
    document.getElementById("elevator").src = "Assets/Images/Elevator/elevator_open.png"
}

function closeElevator() {
    document.getElementById("elevator").src = "Assets/Images/Elevator/elevator_closed.png"
}