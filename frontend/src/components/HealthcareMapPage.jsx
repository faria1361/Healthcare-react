import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Phone, Route, Star, X } from "lucide-react";
import api from "../services/api.js";

const DHAKA_LOCATION = [23.7808, 90.3791];

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

function FitRouteMap({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const bounds = L.latLngBounds([
      L.latLng(from[0], from[1]),
      L.latLng(to[0], to[1]),
    ]);

    map.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 15,
    });
  }, [from, to, map]);

  return null;
}

function createFacilityIcon(color) {
  return L.divIcon({
    html: `
      <div style="
        width:36px;
        height:36px;
        border-radius:50%;
        background:${color};
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid white;
        box-shadow:0 8px 18px rgba(15,23,42,.25);
        font-size:15px;
      ">
        <i class="fa-solid fa-location-dot"></i>
      </div>
    `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function createUserIcon() {
  return L.divIcon({
    html: `
      <div style="
        width:26px;
        height:26px;
        border-radius:50%;
        background:#2563eb;
        border:4px solid white;
        box-shadow:0 0 0 8px rgba(37,99,235,.18);
      "></div>
    `,
    className: "",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function createRouteStartIcon() {
  return L.divIcon({
    html: `
      <div style="
        width:36px;
        height:36px;
        border-radius:50%;
        background:#2563eb;
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid white;
        box-shadow:0 8px 20px rgba(37,99,235,.35);
      ">
        <i class="fa-solid fa-location-arrow"></i>
      </div>
    `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function createRouteEndIcon() {
  return L.divIcon({
    html: `
      <div style="
        width:40px;
        height:40px;
        border-radius:50%;
        background:#ef4444;
        color:white;
        display:flex;
        align-items:center;
        justify-content:center;
        border:3px solid white;
        box-shadow:0 8px 20px rgba(239,68,68,.35);
      ">
        <i class="fa-solid fa-location-dot"></i>
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function GoogleLikeRoute({
  from,
  to,
  destinationName,
  onRouteFound,
  onRouteError,
}) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to || !map) return;

    let routeLayerGroup = L.layerGroup().addTo(map);
    let cancelled = false;

    async function drawRoute() {
      try {
        const startLng = from[1];
        const startLat = from[0];
        const endLng = to[1];
        const endLat = to[0];

        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;

        const response = await fetch(url);
        const result = await response.json();

        if (cancelled) return;

        if (!result.routes || result.routes.length === 0) {
          onRouteError();
          return;
        }

        const route = result.routes[0];

        const coordinates = route.geometry.coordinates.map((point) => [
          point[1],
          point[0],
        ]);

        const distanceKm = (route.distance / 1000).toFixed(1);
        const minutes = Math.round(route.duration / 60);

        onRouteFound({
          destinationName,
          distanceKm,
          minutes,
        });

        const routeBounds = L.latLngBounds(coordinates);

        map.fitBounds(routeBounds, {
          padding: [70, 70],
          maxZoom: 16,
        });

        // White outer border like Google Maps route
        L.polyline(coordinates, {
          color: "#ffffff",
          weight: 13,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(routeLayerGroup);

        // Dark purple shadow/body
        L.polyline(coordinates, {
          color: "#312e81",
          weight: 9,
          opacity: 0.95,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(routeLayerGroup);

        // Bright blue main route
        L.polyline(coordinates, {
          color: "#2563eb",
          weight: 5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(routeLayerGroup);

        // Start marker
        L.marker(from, {
          icon: createRouteStartIcon(),
        })
          .addTo(routeLayerGroup)
          .bindPopup("Your Location");

        // Destination marker
        L.marker(to, {
          icon: createRouteEndIcon(),
        })
          .addTo(routeLayerGroup)
          .bindPopup(destinationName);

        // Small yellow direction dots along route, Google-like visual
        const dotCount = Math.min(14, Math.floor(coordinates.length / 10));

        if (dotCount > 0) {
          for (let i = 1; i <= dotCount; i++) {
            const index = Math.floor((coordinates.length / (dotCount + 1)) * i);
            const point = coordinates[index];

            if (!point) continue;

            const directionDot = L.divIcon({
              html: `
                <div style="
                  width:18px;
                  height:18px;
                  border-radius:50%;
                  background:#facc15;
                  color:#111827;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  border:2px solid #ffffff;
                  box-shadow:0 2px 6px rgba(15,23,42,.35);
                  font-size:9px;
                  font-weight:900;
                ">
                  <i class="fa-solid fa-arrow-right"></i>
                </div>
              `,
              className: "",
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });

            L.marker(point, {
              icon: directionDot,
              interactive: false,
            }).addTo(routeLayerGroup);
          }
        }
      } catch (error) {
        console.error("Route draw error:", error);
        onRouteError();
      }
    }

    drawRoute();

    return () => {
      cancelled = true;

      if (routeLayerGroup) {
        routeLayerGroup.clearLayers();
        map.removeLayer(routeLayerGroup);
      }
    };
  }, [map, from, to, destinationName, onRouteFound, onRouteError]);

  return null;
}

export default function HealthcareMapPage({
  type,
  title,
  description,
  buttonText,
  markerColor,
}) {
  const [center, setCenter] = useState(DHAKA_LOCATION);
  const [facilities, setFacilities] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationNote, setLocationNote] = useState("");
  const [error, setError] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const facilityIcon = useMemo(
    () => createFacilityIcon(markerColor),
    [markerColor]
  );

  const userIcon = useMemo(() => createUserIcon(), []);

  async function loadFacilities(coords, note) {
    setLoading(true);
    setError("");
    setHasSearched(true);
    setSelectedRoute(null);
    setRouteInfo(null);

    try {
      const response = await api.get("/healthcare/nearby", {
        params: {
          type,
          lat: coords[0],
          lng: coords[1],
          limit: 10,
        },
      });

      if (response.data.success) {
        setCenter(coords);
        setFacilities(response.data.data || []);
        setLocationNote(note);
      } else {
        setFacilities([]);
        setError(response.data.message || "Could not load data.");
      }
    } catch (error) {
      setFacilities([]);
      setError(
        error.response?.data?.message ||
          "Could not connect to backend healthcare API."
      );
    } finally {
      setLoading(false);
    }
  }

  function findNearby() {
    if (!navigator.geolocation) {
      loadFacilities(
        DHAKA_LOCATION,
        "Geolocation is not supported. Showing Dhaka results."
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];

        loadFacilities(coords, "Showing results near your current location.");
      },
      () => {
        loadFacilities(
          DHAKA_LOCATION,
          "Location permission denied. Showing Dhaka results."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  }

  function showDirectionOnPage(facility) {
    setSelectedRoute(null);
    setRouteInfo(null);

    setTimeout(() => {
      setSelectedRoute({
        id: facility.id,
        name: facility.name,
        destination: [facility.latitude, facility.longitude],
      });

      setRouteInfo({
        destinationName: facility.name,
        distanceKm: "...",
        minutes: "...",
      });
    }, 0);
  }

  function clearRoute() {
    setSelectedRoute(null);
    setRouteInfo(null);
    setError("");
  }

  const handleRouteFound = useCallback((info) => {
  setRouteInfo(info);
}, []);

const handleRouteError = useCallback(() => {
  setError("Could not calculate route on this page.");
}, []);

  return (
    <section className={hasSearched ? "map-layout" : "map-layout initial-map-layout"}>
      {!hasSearched && (
        <button className="floating-find-nearby-btn" onClick={findNearby}>
          <MapPin size={18} />
          <span>{loading ? "Finding..." : buttonText}</span>
        </button>
      )}

      {hasSearched && (
        <aside className="facility-panel">
          <div className="facility-panel-header">
            <button className="find-nearby-modern-btn" onClick={findNearby}>
              <MapPin size={18} />
              <span>{loading ? "Finding..." : buttonText}</span>
            </button>

            {locationNote && (
              <small className="location-note">{locationNote}</small>
            )}

            {routeInfo && (
              <div className="route-info-card google-route-card">
                <div className="route-title-row">
                  <Route size={18} />
                  <div>
                    <strong>Route to:</strong>
                    <span>{routeInfo.destinationName}</span>
                  </div>
                </div>

                <p>
                  Distance: {routeInfo.distanceKm} km · Time:{" "}
                  {routeInfo.minutes} min
                </p>

                <button type="button" onClick={clearRoute}>
                  <X size={14} />
                  Clear route
                </button>
              </div>
            )}

            {error && <div className="form-error">{error}</div>}
          </div>

          <div className="facility-list">
            {facilities.map((facility) => (
              <article className="facility-card" key={facility.id}>
                <div className="facility-card-top">
                  <h3>{facility.name}</h3>

                  {facility.rating && (
                    <span className="rating-badge">
                      <Star size={14} />
                      {facility.rating}
                    </span>
                  )}
                </div>

                <p>
                  <strong>District:</strong> {facility.district}
                </p>

                <p>
                  <strong>Area:</strong> {facility.area || "N/A"}
                </p>

                <p>
                  <strong>Distance:</strong> {facility.distance_km} km
                </p>

                {type === "hospital" && (
                  <p>
                    <strong>Available Beds:</strong> {facility.beds ?? "N/A"}
                  </p>
                )}

                <p>
                  <strong>Phone:</strong> {facility.phone || "N/A"}
                </p>

                {facility.services?.length > 0 && (
                  <div className="service-pills">
                    {facility.services.map((service) => (
                      <span key={service}>{service}</span>
                    ))}
                  </div>
                )}

                <button
                  className="small-action-button"
                  onClick={() => showDirectionOnPage(facility)}
                >
                  <Navigation size={15} />
                  Show Direction
                </button>
              </article>
            ))}

            {!loading && facilities.length === 0 && !error && (
              <div className="empty-box">No data found.</div>
            )}
          </div>
        </aside>
      )}

      <div className="map-box">
        <MapContainer center={center} zoom={13} className="leaflet-map">
          <RecenterMap center={center} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hasSearched && (
            <Marker position={center} icon={userIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          )}

          {hasSearched &&
            facilities.map((facility) => (
              <Marker
                key={facility.id}
                position={[facility.latitude, facility.longitude]}
                icon={facilityIcon}
              >
                <Popup>
                  <div className="map-popup">
                    <h3>{facility.name}</h3>
                    <p>{facility.address}</p>
                    <p>
                      <strong>Distance:</strong> {facility.distance_km} km
                    </p>

                    {facility.phone && (
                      <p>
                        <Phone size={13} /> {facility.phone}
                      </p>
                    )}

                    <button onClick={() => showDirectionOnPage(facility)}>
                      Show Direction
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

          {selectedRoute && (
  <GoogleLikeRoute
    key={`${selectedRoute.id}-${selectedRoute.destination.join(",")}`}
    from={center}
    to={selectedRoute.destination}
    destinationName={selectedRoute.name}
    onRouteFound={handleRouteFound}
    onRouteError={handleRouteError}
  />
)}
        </MapContainer>
      </div>
    </section>
  );
}