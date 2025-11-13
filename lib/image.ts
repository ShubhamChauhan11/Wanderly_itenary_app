export const fetchImages = async ({
  query,
  n,
}: {
  query: string;
  n: number;
}) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${n}&client_id=WvK7tGaW1TJBwFL3P1kXF-tKdSkCthMzgQvCj6LgCoI`
    );

    const data = await response.json();

    // Extract only the required image URLs
    const imageUrls = data.results.map((img: any) => img.urls.small);

    return imageUrls;
  } catch (err) {
    console.error("Image fetch failed", err);
    return [];
  }
};
async function validateImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

// ✅ Updates trip object with valid images
export async function refreshTripImages(trip: any): Promise<any> {
  const updatedTrip = structuredClone(trip); // deep clone

  // ---- HERO IMAGES ----
  if (Array.isArray(updatedTrip.heroImages)) {
    updatedTrip.heroImages = await Promise.all(
      updatedTrip.heroImages.map(async (img) => {
        if (!img || !(await validateImage(img))) {
          const newImg = await fetchImages({ query: updatedTrip.title, n: 1 });
          return newImg[0] || img;
        }
        return img;
      })
    );
  }

  // ---- ITINERARY ACTIVITIES IMAGES ----
  for (const day of updatedTrip.itinerary ?? []) {
    for (const activity of day.activities ?? []) {
      if (activity.image && !(await validateImage(activity.image))) {
        const newImg = await fetchImages({ query: activity.name, n: 1 });
        activity.image = newImg[0] || null;
      }
    }
  }

  // ---- NEARBY HOTELS IMAGES ----
  for (const hotel of updatedTrip.nearbyHotels ?? []) {
    if (hotel.image && !(await validateImage(hotel.image))) {
      const newImg = await fetchImages({ query: hotel.name, n: 1 });
      hotel.image = newImg[0] || hotel.image;
    }
  }
  for (const cafe of updatedTrip.nearbyCafes ?? []) {
    if (cafe.image && !(await validateImage(cafe.image))) {
      const newImg = await fetchImages({ query: cafe.name, n: 1 });
      cafe.image = newImg[0] || cafe.image;
    }
  }

  // ---- GET INSPIRED IMAGES ----
  for (const insp of updatedTrip.getInspired ?? []) {
    if (insp.thumbnail && !(await validateImage(insp.thumbnail))) {
      const newImg = await fetchImages({ query: insp.title, n: 1 });
      insp.thumbnail = newImg[0] || insp.thumbnail;
    }
  }

  return updatedTrip;
}
