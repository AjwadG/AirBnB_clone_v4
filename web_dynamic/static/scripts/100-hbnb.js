const checkedAmenities = {};
const checkedStates = {};
const checkedCities = {};
$(document).ready(function () {
  function updateLocationsDisplay() {
    const locations = 
    Object.keys(checkedStates).join(", ") +
    Object.keys(checkedCities).join(", ");
    if (locations)
    $("div.locations h4").text(locations);
  else
  $("div.locations h4").html('&nbsp;')
}
	$('div.amenities input[type="checkbox"]').on("change", function () {
		const id = $(this).data("id");
		const name = $(this).data("name");
		const isChecked = $(this).is(":checked");
		if (isChecked) {
			checkedAmenities[name] = id;
		} else {
			delete checkedAmenities[name];
		}
	});
	$('div.locations input[type="checkbox"]').on("change", function () {
		const id = $(this).data("id");
		const name = $(this).data("name");
		const isChecked = $(this).is(":checked");
		if ($(this).parent().prop("tagName") === "LI") {
			if (isChecked) {
				checkedCities[name] = id;
			} else {
				delete checkedCities[name];
			}
		} else {
			if (isChecked) {
				checkedStates[name] = id;
			} else {
				delete checkedStates[name];
			}
		}
		updateLocationsDisplay();
	});

	let url = "http://localhost:5001/api/v1/status/";
	$.ajax({ url }).done(function (data) {
		if (data.status === "OK") {
			$("div#api_status").addClass("available");
			get_by();
			$("button").on("click", get_by);
		}
	});
});

function get_by() {
	const amenities = Object.values(checkedAmenities);
	const states = Object.values(checkedStates);
	const cities = Object.values(checkedCities);
	$.ajax({
		url: "http://localhost:5001/api/v1/places_search",
		type: "POST",
		data: JSON.stringify({ amenities, states, cities }),
		contentType: "application/json; charset=utf-8",
	}).done(function (places) {
		$(".places-list").empty();
		$.each(places, function (i, place) {
			$(".places-list").append(build(place));
		});
	});
}

function build(place) {
  return `
  <article>
  <h2>${place.name}</h2>
  <div class="price_by_night">$${place.price_by_night}</div>
  <div class="information">
  <div class="max_guest">${place.max_guest} Guests</div>
  <div class="number_rooms">${place.number_rooms} Bedroom</div>
  <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
  </div>
  <div class="user">
  <p><span>Owner:</span> ${place.owner}</p>
  </div>
  <div class="description">
  <p>${place.description}</p>
  </div>
  </article>`;
}
