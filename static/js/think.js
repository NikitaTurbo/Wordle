const type = new Map([["Digit1", 'p'], ["Digit3", 'g'], ["Digit2", 'y']]);
const colors = new Map([['p', "gray"], ['g', "green"], ['y', "yellow"]]);

const paste = (word, index) => {
	if (word.output === "ggggg" || index === 31) {
		setTimeout(() => {
			document.querySelector(".result_title").innerHTML = word.output === "ggggg" ? "lose" : "win";

			for (let i = 0; i < word.history.length; ++i) {
				document.querySelector(".result_field").innerHTML += `<li>${word.history[i]}</li>`;
			}

			document.querySelector(".result_word").innerHTML += ` ${word.output === "ggggg" ? word.word : "unknow"}`;
			document.querySelector("body").className += "result";
			document.querySelector(".field").className = "field";
			document.querySelector(".result_form").className += " show";
		}, 2000)
	}

	for (let i = index; i < index + 5; ++i) {
		document.querySelector(`[tabindex="${i}"]`).value = word.word[(i - 1) % 5];
	}
}

let index = 1, cnt = 0, output = "";

document.addEventListener("keypress", (e) => {
	switch(e.code) {
		case "Digit1":
			document.querySelector(`[tabindex="${index}"]`).className += ` ${colors.get('p')} used`;
		case "Digit2":
			document.querySelector(`[tabindex="${index}"]`).className += ` ${colors.get('y')} used`;
		case "Digit3":
			document.querySelector(`[tabindex="${index}"]`).className += ` ${colors.get('g')} used`;
	}

	output += type.get(e.code);

	if (cnt % 5 === 4) {
    fetch(`/answer?output=${output}`)
			.then(response => response.json())
			.then(word => paste(word, index))
			.catch(() => console.log("Word not found"))

		output = "";
	}

	++cnt;
	++index;
});
