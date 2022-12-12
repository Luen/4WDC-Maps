function createLeafletMap(fileurl) {
    // if map element exisits
    if (!document.getElementById("map")) {
        return;
    }
    // Initialise map using id 'map'
	const map = L.map('map').setView([-19.22517, 146.70953], 11);

    // Set basemap tilelayer
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

    // Define custom icons
	const Icon = L.Icon.extend({
		options: {
			shadowUrl: 'icon-shadow.png',
			iconSize:     [30, 46], // native 121 × 184
			shadowSize:   [30, 23], // native 121 x 92
			iconAnchor:   [15, 46],
			shadowAnchor: [2, 0],
			popupAnchor:  [0, 0]
		}
	});
	const blackIcon = new Icon({iconUrl: 'icon-black.png'});
    const whiteIcon = new Icon({iconUrl: 'icon-white.png'});
    const blueCircleIcon = {
        radius: 6,
        fillColor: "#4287f5",
        color: "#FFF",
        weight: .75,
        opacity: 1,
        fillOpacity: 0.8
      };

    // Create a layer
    const layerGroup = L.featureGroup();
    layerGroup.addTo(map);

    // Clientside fetch to geojson file
    fetch(fileurl)
        .then(response => response.json())
        .then(data => {
            // Add geojson data to layer
            L.geoJSON(data, {
                style: {
                    color: `DodgerBlue`,
                    weight: 3,
                    opacity: 0.85,
                },
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, {icon: whiteIcon});
                },
                onEachFeature(feature, layer) {
                    const name = feature.properties.name || '';
                    const desc = feature.properties.desc || '';

                    // ToolTip shows on mouse hover
                    layer.bindTooltip(name); 

                    // Popup display when marker is clicked
                    layer.bindPopup(`<p style="font-weight:bold;">${name}</p>
                    <p>${desc}</p>`);
                },
            }).addTo(layerGroup);

            // Recenter map over the data
            map.fitBounds(layerGroup.getBounds());
        })
        .catch(err => {
            // Handle any errors
            console.error('An error occured when fetching geojson data');
        });

}