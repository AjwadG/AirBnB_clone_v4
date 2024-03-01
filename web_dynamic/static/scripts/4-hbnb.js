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
});

$.getJSON("http://0.0.0.0:5001/api/v1/status/", (data) => {
  if (data.status === "OK") {
    $("div#api_status").addClass("available");
  } else {
    $("div#api_status").removeClass("available");
  }
});
