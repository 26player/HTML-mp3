var audio;

//Hide Pause Initially
$('#pause').hide();

//Initializer - Play First Song
initAudio($('#playlist li:first-child'));

function initAudio(element) {
	var song = element.attr('song');
	var title = element.text();
	var cover = element.attr('cover');
	var artist = element.attr('artist');

	//Create a New Audio Object
	audio = new Audio('media/' + song);

	if (!audio.currentTime) {
		$('#duration').html('0.00');
	}

	$('#audio-player .title').text(title);
	//$('#audio-player .artist').text(artist);

	//Insert Cover Image
	$('img.cover').attr('src', 'images/covers/' + cover);

	$('#playlist li').removeClass('active');
	element.addClass('active');
}

//Play Button
$('#play').click(function () {
	audio.play();
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});

//Pause Button
$('#pause').click(function () {
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});

//Stop Button
$('#stop').click(function () {
	audio.pause();
	audio.currentTime = 0;
	$('#pause').hide();
	$('#play').show();
	$('#duration').fadeOut(400);
});

function nextSong() {
	audio.pause();
	var next = $('#playlist li.active').next();
	if (next.length == 0) {
		next = $('#playlist li:first-child');
	}
	initAudio(next);
	audio.play();
	showDuration();
}

//Next Button
$('#next').click(function () {
	audio.pause();
	var next = $('#playlist li.active').next();
	if (next.length == 0) {
	 	next = $('#playlist li:last-child');
	}
	initAudio(next);
	audio.play();
	showDuration();
});

//Prev Button
$('#prev').click(function () {
	audio.pause();
	var prev = $('#playlist li.active').prev();
	if (prev.length == 0) {
		prev = $('#playlist li:last-child');
	}
	initAudio(prev);
	audio.play();
	showDuration();
});

//Playlist Song Click
$('#playlist li').click(function () {
	audio.pause();
	initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	audio.play();
	showDuration();
});


//Volume Control
$('#volume').change(function () {
	audio.volume = parseFloat(this.value / 10);
});


//seek bar functionality
$('#seekBar').on('click', function (e) {
	var x = e.pageX - this.offsetLeft,
		y = e.pageY - this.offsetTop,
		clickedValue = x * this.max / this.offsetWidth;

	audio.currentTime = (clickedValue / 100 * audio.duration);
});


//Time Duration
function showDuration() {
	$(audio).bind('timeupdate', function () {
		//Get hours and minutes
		var s = parseInt(audio.currentTime % 60);
		var m = parseInt((audio.currentTime / 60) % 60);
		//Add 0 if seconds less than 10
		if (s < 10) {
			s = '0' + s;
		}
		$('#duration').html(m + '.' + s);
		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		document.querySelector('#seekBar').value = value;

		if (audio.duration === audio.currentTime) {
			nextSong();
		}
	});
}

//Search Tool FUNCTION !!!!!!!
var songs = [];
$("#playlist li").toArray().forEach(function (element, index) {
	songs.push(element.innerHTML);
});
function autocomplete(inp, arr) {

	/*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function (e) {
		var a, b, i, val = this.value;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) { return false; }
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function (e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.innerText;
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function (e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
		  /*If the arrow DOWN key is pressed,
		  increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
		  /*If the arrow UP key is pressed,
		  decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
				console.log(x);
				/*and simulate a click on the "active" item:*/
				if (x) {
					var searchText = x[0].outerText;
					$('#playlist li').toArray().forEach(function (el, index) {
						console.log(el.innerHTML);
						if (el.innerHTML === searchText) {
							el.click();
						}
					})
					x[currentFocus].click();
				}
			}
		}
	});
	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
	  /*close all autocomplete lists in the document,
	  except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}
autocomplete(document.getElementById("mySearch"), songs);