/**
 * Shared page banner. Presentation follows the GeoKnow theme tokens.
 *
 * <PageHero
 *   eyebrow="GeoKnow"
 *   title="Page title"
 *   text="One or two sentences."
 *   tone="gray" | "light" | "brand" | "dark"
 *   backdrop="strata" | "outcrop" | "spiral" | "thinsection" | "network" | "survey" | "seismic" | "heritage"
 *   image={src} imageAlt="" imageFit="cover" | "contain" | "cutout"
 *   highlights={["Tag 1", "Tag 2"]}
 *   mediaTag="Caption"
 *   actions={<Link className="ms-btn" to="/x">Go</Link>}
 * />
 */
import HeroBackdrop from "./HeroBackdrop";

export default function PageHero({
  eyebrow,
  title,
  text,
  tone = "gray",
  backdrop = "strata",
  image,
  imageAlt = "",
  imagePosition,
  imageFit = "cover",
  mediaTag,
  highlights,
  actions,
  titleId,
  children,
}) {
  const classes = ["ms-page-hero"];
  if (tone !== "gray") classes.push(`ms-page-hero--${tone}`);
  if (image) classes.push("ms-page-hero--media");
  const showBackdrop = tone === "gray" || tone === "light";
  if (showBackdrop) classes.push("has-hero-backdrop");

  const mediaClasses = ["ms-page-hero-media"];
  if (imageFit === "contain") mediaClasses.push("ms-page-hero-media--contain");
  if (imageFit === "cutout") mediaClasses.push("ms-page-hero-media--cutout");

  return (
    <header className={classes.join(" ")}>
      {showBackdrop && <HeroBackdrop variant={backdrop} />}
      <div className="ms-container ms-page-hero-inner">
        <div className="ms-page-hero-copy">
          {eyebrow && (
            <p className="ms-eyebrow ms-page-hero-eyebrow">
              {eyebrow}
            </p>
          )}
          <h1 className="ms-page-hero-title" id={titleId}>{title}</h1>
          {text && <p className="ms-page-hero-text">{text}</p>}
          {Array.isArray(highlights) && highlights.length > 0 && (
            <ul className="ms-page-hero-highlights" aria-label={eyebrow || title}>
              {highlights.map((item) => (
                <li key={item} className="ms-page-hero-highlight">{item}</li>
              ))}
            </ul>
          )}
          {actions && <div className="ms-page-hero-actions">{actions}</div>}
          {children}
        </div>
        {image && (
          <figure className={mediaClasses.join(" ")}>
            <div className="ms-page-hero-media-frame">
              <img src={image} alt={imageAlt} style={imagePosition ? { objectPosition: imagePosition } : undefined} />
            </div>
            {mediaTag && <figcaption className="ms-page-hero-media-tag">{mediaTag}</figcaption>}
          </figure>
        )}
      </div>
    </header>
  );
}

