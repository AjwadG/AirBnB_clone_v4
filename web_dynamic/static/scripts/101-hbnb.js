$(document).ready(function () {
    const BASE_URL = "http://127.0.0.1:5001";
    const features = {};
    const locations = {};
    const regions = {};

    $('ul li input[type="checkbox"]').bind("change", (e) => {
        const checkbox = e.target;
        let selectedItems;
        switch (checkbox.id) {
            case "state_filter":
                selectedItems = regions;
                break;
            case "city_filter":
                selectedItems = locations;
                break;
            case "amenity_filter":
                selectedItems = features;
                break;
        }
        if (checkbox.checked) {
            selectedItems[checkbox.dataset.name] = checkbox.dataset.id;
        } else {
            delete selectedItems[checkbox.dataset.name];
        }
        if (checkbox.id === "amenity_filter") {
            $(".amenities h4").text(Object.keys(features).sort().join(", "));
        } else {
            $(".locations h4").text(
                Object.keys(Object.assign({}, regions, locations)).sort().join(", ")
            );
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
