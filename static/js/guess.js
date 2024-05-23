const colors = new Map([['p', "gray"], ['g', "green"], ['y', "yellow"]]);

const paint = (output, index) => {
	for (let i = index; i < index + 5; ++i) {	
		document.querySelector(`[tabindex="${i}"]`).className += ` ${colors.get(output.output[(i - 1) % 5])} used`;
	}

	if (output.output === "ggggg" || index === 21) {
		setTimeout(() => {
			document.querySelector(".result_title").innerHTML = output.output === "ggggg" ? "win" : "lose";

			for (let i = 0; i <= parseInt(index / 5); ++i) {
				document.querySelector(".result_field").innerHTML += `<li>${output.history[i]}</li>`;
			}

			document.querySelector(".result_word").innerHTML += ` ${output.word}`;
			document.querySelector("body").className += "result";
			document.querySelector(".field").className = "field";
			document.querySelector(".result_form").className += " show";
		}, 2000)
	}
}

const skip = (e, index) => {
	index = parseInt(index);

	let value;
	let isLetter = (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122);

	try {
		value = document.querySelector(`[tabindex="${index}"]`).value.toUpperCase();
	} catch {
		value = "";
	}

	if (e.code === "Backspace" && index % 5 != 1 && !value) {
		--index;
		document.querySelector(`[tabindex="${index}"]`).focus();
	} else if (isLetter && `Key${value}` !== e.code) {
		++index;
		try {
			document.querySelector(`[tabindex="${index}"]`).value = e.code.slice(-1);
			skip(e, `${index}`);
		} catch {
			console.log("The field is already filled in.");
		}
	} else if (isLetter) {
		++index;

		if ((index - 1) % 5 === 0) {
			let riddle = "";
			for (let i = index - 5; i < index; ++i) {
				document.querySelector(`[tabindex="${i}"]`).disabled = true;
				riddle += document.querySelector(`[tabindex="${i}"]`).value;
			}

			fetch(`/check?riddle=${riddle}`)
				.then(response => response.json())
				.then(output => paint(output, (index - 5)))
		}

		try {
			document.querySelector(`[tabindex="${index}"]`).focus();
		} catch {
			console.log("The field is already filled in.");
		}
	}
}
