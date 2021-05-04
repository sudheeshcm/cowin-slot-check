var x = document.getElementById("myAudio");

function playAudio() {
	x.play();
}

function pauseAudio() {
	x.pause();
}

function notifyMe() {
	console.log("🚀 ~ notifyMe ~ notifyMe");
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}

	// Let's check whether notification permissions have already been granted
	else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
		var notification = new Notification("Hi there!");
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== "denied") {
		Notification.requestPermission().then(function (permission) {
			// If the user accepts, let's create a notification
			if (permission === "granted") {
				var notification = new Notification("Hi there!");
			}
		});
	}

	// At last, if the user has denied notifications, and you
	// want to be respectful there is no need to bother them any more.
	const pincode = document.getElementById("pincode").value || "";
	const dateString = document.getElementById("date").value || "";
	const date = new Date(dateString);

	const formattedDate =
		date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();

	const display = document.getElementById("display");
	display.innerHTML = `<span>Fetching slots for <b>date:</b> ${formattedDate}, <b>pincode:</b> ${pincode}..</span>`;
	const loader = document.getElementById("hourglass");
	loader.setAttribute("class", "hourglass show");

	setInterval(() => checkForSlots(pincode, formattedDate), 3000);
}

function checkForSlots(pincode, date) {
	fetch(
		`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
	)
		.then((response) => response.json())
		.then((data) => {
			const outputDisplay = document.getElementById("output-display");
			const { sessions } = data;
			if (sessions && sessions.length) {
				outputDisplay.innerHTML = `<span>Slots available. <b>Pincode:</b> ${pincode}..</span>`;
				playAudio();
			} else {
				outputDisplay.innerHTML = `<span>Slots not available.`;
				pauseAudio();
			}

			const timestamp = document.getElementById("timestamp-display");
			timestamp.innerHTML = `<span>Last fetched at ${new Date().toTimeString()}</span>`;
		});
}
