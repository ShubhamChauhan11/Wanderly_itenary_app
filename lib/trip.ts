export function generateTripHTML(trip: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${trip.title}</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      color: #333;
      line-height: 1.6;
    }
    h1 { font-size: 28px; margin-bottom: 4px; }
    h2 { margin-top: 32px; font-size: 22px; }
    h3 { margin-top: 24px; font-size: 18px; color: #0286ff; }
    .section { margin-bottom: 20px; }
    .day-block { margin-bottom: 20px; padding: 12px; border-radius: 8px; background: #f7f7f7; }
    ul { margin-top: 6px; }
    li { margin-bottom: 4px; }
    img { width: 100%; border-radius: 8px; margin: 14px 0; }
    .small-img { width: 260px; height: auto; border-radius: 8px; margin: 8px 0; }
  </style>
</head>

<body>
  <h1>${trip.title}</h1>
  <p><strong>Region:</strong> ${trip.region ?? "N/A"} • <strong>Country:</strong> ${trip.country ?? "N/A"}</p>
  <p><strong>Duration:</strong> ${trip.duration}</p>
  <p><strong>Cost:</strong> ${trip.cost ?? "N/A"}</p>

  ${trip.heroImages?.length ? `<img src="${trip.heroImages[0]}" />` : ""}

  <div class="section">
    <h2>Overview</h2>
    <p>${trip.description ?? ""}</p>
  </div>

  <div class="section">
    <h2>Itinerary</h2>
    ${trip.itinerary
      .map(
        (day: any) => `
      <div class="day-block">
        <h3>Day ${day.day}: ${day.title}</h3>
        <ul>
          ${day.activities
            .map(
              (activity: any) => `
          <li>
            <strong>${activity.name}</strong>
            ${activity.duration ? ` — ${activity.duration}` : ""}
            ${activity.description ? `<br/><em>${activity.description}</em>` : ""}
            ${
              activity.image
                ? `<br/><img class="small-img" src="${activity.image}" />`
                : ""
            }
          </li>`
            )
            .join("")}
        </ul>
      </div>
    `
      )
      .join("")}
  </div>

  <div class="section">
    <h2>How to Reach</h2>
    <p>${trip.howToReach?.description ?? ""}</p>
    ${
      trip.howToReach?.nearestAirport
        ? `<p><strong>Nearest Airport:</strong> ${trip.howToReach.nearestAirport.name}</p>`
        : ""
    }
  </div>

  ${
    trip.nearbyHotels?.length
      ? `
  <div class="section">
    <h2>Nearby Hotels</h2>
    <ul>
    ${trip.nearbyHotels
      .map(
        (hotel: any) => `
      <li>
        <strong>${hotel.name}</strong>
        — Rating: ${hotel.rating ?? "N/A"} (${hotel.priceCategory ?? ""})
      </li>`
      )
      .join("")}
    </ul>
  </div>
  `
      : ""
  }

</body>
</html>
`;
}
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

async function exportTripAsPDF(trip) {
  const html = generateTripHTML(trip);

  // Generate the PDF (Expo handles file location automatically)

  const fileName = `${trip.title || "trip"}`.replace(/\s+/g, "_");
  const { uri } = await Print.printToFileAsync({
    html,
    fileName: `${fileName}.pdf`,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  } else {
    alert("Sharing is not available on this device");
  }
}

export { exportTripAsPDF };
