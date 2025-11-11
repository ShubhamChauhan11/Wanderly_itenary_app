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
    console.log("imageurls", imageUrls, data);

    return imageUrls;
  } catch (err) {
    console.error("Image fetch failed", err);
    return [];
  }
};
