const checkedAmenities = {};
const checkedStates = {};
const checkedCities = {};
const icons = { 'Wireless Internet': 'wifi_icon', TV: 'tv_icon', 'Pets allowed': 'pet_icon' };
$(document).ready(function () {
  function updateLocationsDisplay () {
    const locations =
    Object.keys(checkedStates).join(', ') +
    Object.keys(checkedCities).join(', ');
    if (locations) {
      $('div.locations h4').text(locations);
    } else {
      $('div.locations h4').html('&nbsp;');
    }
  }
  $('div.amenities input[type="checkbox"]').on('change', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      checkedAmenities[name] = id;
    } else {
      delete checkedAmenities[name];
    }
    const h4 = $('div.amenities h4');
    if (Object.values(checkedAmenities).length === 0) {
      h4.html('&nbsp');
    } else {
      h4.text(Object.keys(checkedAmenities).join(', '));
    }
  });
  $('div.locations input[type="checkbox"]').on('change', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const isChecked = $(this).is(':checked');
    if ($(this).parent().prop('tagName') === 'LI') {
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

  const url = 'http://localhost:5001/api/v1/status/';
  $.ajax({ url }).done(function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
      getby();
      $('button').on('click', getby);
    }
  });
});

function getby () {
  const amenities = Object.values(checkedAmenities);
  const states = Object.values(checkedStates);
  const cities = Object.values(checkedCities);
  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search',
    type: 'POST',
    data: JSON.stringify({ amenities, states, cities }),
    contentType: 'application/json; charset=utf-8'
  }).done(function (places) {
    $('.places-list').empty();
    $.each(places, async function (i, place) {
      $('.places-list').append(await build(place));
    });
  });
}

async function getIcons (placeId) {
  try {
    const amenities = await $.ajax({ url: `http://localhost:5001//api/v1/places/${placeId}/amenities` });
    let list = '';
    for (let i = 0; i < amenities.length; i++) {
      if (Object.keys(icons).includes(amenities[i].name)) {
        list += `<li><div class="${icons[amenities[i].name]}"></div>${amenities[i].name}</li>`;
      }
    }
    return list;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return '';
  }
}

async function getReviews (placeId) {
  try {
    const reviews = await $.ajax({ url: `http://localhost:5001//api/v1/places/${placeId}/reviews` });
    return reviews.map(review => `<li><h3>Created at ${new Date(review.created_at.slice(0, 10)).toDateString()}</h3><p>${review.text}</p></li>`).join('');
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return '';
  }
}

async function build (place) {
  return `
  <article>
          <div class="headline">
            <h2 class="article_title">${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">
              <div class="guest_icon"></div>
              <p>${place.max_guest} Guests</p>
            </div>
            <div class="number_rooms">
              <div class="bed_icon"></div>
              <p>${place.number_rooms} Bedroom</p>
            </div>
             <div class="number_bathrooms">
              <div class="bath_icon"></div>
              <p>${place.number_bathrooms} Bathroom</p>
            </div>
          </div>
          <div class="user"><b>Owner</b>: ${place.owner}</div>
          <div class="description">
              ${place.description}
              </div>
          <div class="amenities">
            <h2 class="article_subtitle">Amenities</h2>
            <ul>
            ${await getIcons(place.id)}
            </ul>
          </div>
          <div class="reviews">
            <h2 class="article_subtitle">Reviews</h2>
            <ul>
              ${await getReviews(place.id)}
            </ul>
          </div>
  </article>`;
}
