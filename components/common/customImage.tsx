import { fetchImages } from "@/lib/image";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native"; // or your UI lib

type FallbackImageProps = {
  query: string;
  size?: number;
  className?:string; // optional square size in px
};

export const FallbackImage: React.FC<FallbackImageProps> = ({ query, size = 96, className }) => {
  const [url, setUrl] = useState<string | null>(null);
  console.log("customurl", url)

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const urls = await fetchImages({ query, n: 1 });
        if (!mounted) return;
        if (urls && urls.length > 0) setUrl(urls[0]);
        else setUrl(null);
      } catch (err) {
        console.error("Image fetch failed", err);
        if (mounted) setUrl(null);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [query]);

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        className={className}
        // style={{
        //   width: size,
        //   height: size,
        //   borderRadius: 8,
        //   backgroundColor: "#f3f4f6",
        // }}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#6b7280", fontSize: 12 }}>No Image</Text>
    </View>
  );
};

type CustomImageProps = {
  image?: string | null;
  name?: string; // used as fallback query if image missing
  shouldShowFallback?: boolean; // force fallback
  size?: number;
  className?:string;
};

export const CustomImage: React.FC<CustomImageProps> = ({
  image,
  name = "nature",
  shouldShowFallback = false,
  className,
  size = 96,
}) => {
  const [imageError, setImageError] = useState(false);

  // If we have an image and it hasn't errored and fallback is not forced => show image
  const showPrimary = Boolean(image) && !imageError && !shouldShowFallback;

  return showPrimary ? (
    <Image
      source={{ uri: image as string }}
      className={className}
      resizeMode="cover"
      onError={() => {
        console.warn("Primary image failed to load, falling back");
        setImageError(true);
      }}
    />
  ) : (
    <FallbackImage query={name} size={size} className={className} />
  );
};
