$(document).ready(function () {
  const features = {};
  const locations = {};
  const regions = {};

  $('ul li input[type="checkbox"]').bind('change', (e) => {
    const checkbox = e.target;
    let selectedItems;
    switch (checkbox.id) {
      case 'state_filter':
        selectedItems = regions;
        break;
      case 'city_filter':
        selectedItems = locations;
        break;
      case 'amenity_filter':
        selectedItems = features;
        break;
    }
    if (checkbox.checked) {
      selectedItems[checkbox.dataset.name] = checkbox.dataset.id;
    } else {
      delete selectedItems[checkbox.dataset.name];
    }
    if (checkbox.id === 'amenity_filter') {
      $('.amenities h4').text(Object.keys(features).sort().join(', '));
    } else {
      $('.locations h4').text(
        Object.keys(Object.assign({}, regions, locations)).sort().join(', ')
      );
    }
  });

  const url = 'http://localhost:5001/api/v1/status/';
  $.ajax({ url }).done(function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    }
  });
});
