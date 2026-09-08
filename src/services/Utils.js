export function generatePropertySchema(property) {
  const { title, description, location, rating_avg, host, pictures, equipments, price_per_night } = property;

  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": title,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
    },
    "image": pictures,
    "amenityFeature": equipments.map((equipment) => ({
      "@type": "LocationFeatureSpecification",
      "name": equipment,
      "value": true,
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating_avg,
      "bestRating": "5",
    },
    "provider": {
      "@type": "Person",
      "name": host.name,
      "image": host.picture,
    },
    "offers": {
      "@type": "Offer",
      "price": price_per_night,
      "priceCurrency": "EUR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": price_per_night,
        "priceCurrency": "EUR",
        "unitText": "NIGHT",
      },
    },
  };
}