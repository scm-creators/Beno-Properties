import React, { useEffect } from "react";

interface HelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

export default function Helmet({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  ogUrl,
  twitterCard = "summary_large_image",
  canonicalUrl,
}: HelmetProps) {
  // We use a robust useEffect fallback to ensure immediate update in standard document contexts, 
  // ensuring flawless indexing and search engine compatibility.
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    // Helper to find or create a meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // Helper to find or create a link tag
    const setLinkTag = (relValue: string, hrefValue: string) => {
      let element = document.querySelector(`link[rel="${relValue}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", relValue);
        document.head.appendChild(element);
      }
      element.setAttribute("href", hrefValue);
    };

    if (description) {
      setMetaTag("name", "description", description);
    }
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }

    // Open Graph Tags
    if (ogTitle || title) {
      setMetaTag("property", "og:title", ogTitle || title || "");
    }
    if (ogDescription || description) {
      setMetaTag("property", "og:description", ogDescription || description || "");
    }
    if (ogImage) {
      setMetaTag("property", "og:image", ogImage);
    }
    if (ogType) {
      setMetaTag("property", "og:type", ogType);
    }
    if (ogUrl) {
      setMetaTag("property", "og:url", ogUrl);
    }

    // Twitter Tags
    if (ogTitle || title) {
      setMetaTag("name", "twitter:title", ogTitle || title || "");
    }
    if (ogDescription || description) {
      setMetaTag("name", "twitter:description", ogDescription || description || "");
    }
    if (ogImage) {
      setMetaTag("name", "twitter:image", ogImage);
    }
    if (twitterCard) {
      setMetaTag("name", "twitter:card", twitterCard);
    }

    // Canonical link
    if (canonicalUrl) {
      setLinkTag("canonical", canonicalUrl);
    }
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    ogUrl,
    twitterCard,
    canonicalUrl,
  ]);

  // Render elements directly to leverage React 19's native document hoisting.
  // This provides elegant, declarative integration.
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      {(ogTitle || title) && <meta property="og:title" content={ogTitle || title} />}
      {(ogDescription || description) && (
        <meta property="og:description" content={ogDescription || description} />
      )}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      
      {/* Twitter Card */}
      {(ogTitle || title) && <meta name="twitter:title" content={ogTitle || title} />}
      {(ogDescription || description) && (
        <meta name="twitter:description" content={ogDescription || description} />
      )}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}

      {/* Canonical Link */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </>
  );
}
