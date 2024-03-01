const ids = {};
$(document).ready(function () {
  $('input[type="checkbox"]').on('click', function () {
    const data = $(this);
    const id = data.attr('data-id');
    const name = data.attr('data-name');
    if (!Object.keys(ids).includes(id)) {
      ids[id] = name;
    } else {
      delete ids[id];
    }
    const h4 = $('div.amenities h4');
    if (Object.keys(ids).length === 0) {
      h4.html('&nbsp');
    } else {
      h4.text(Object.values(ids).join(', '));
    }
  });

  let url = 'http://localhost:5001/api/v1/status/';
  $.ajax({ url }).done(function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');

      url = 'http://localhost:5001/api/v1/places_search';
      $.ajax({
        url,
        type: 'POST',
        data: JSON.stringify({}),
        contentType: 'application/json; charset=utf-8'
      }).done(function (places) {
        $.each(places, function (i, place) {
          $('.places-list').append(build(place));
        });
      });
    }
  });
});

function build (place) {
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
