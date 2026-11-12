/**
 * microsoft.com style page banner used at the top of every sub-page.
 *
 * <PageHero
 *   eyebrow="GeoKnow"
 *   title="Page title"
 *   text="One or two sentences."
 *   tone="gray" | "light" | "brand" | "dark"
 *   image={src} imageAlt=""
 *   actions={<Link className="ms-btn" to="/x">Go</Link>}
 * />
 */
export default function PageHero({
  eyebrow,
  title,
  text,
  tone = "gray",
  image,
  imageAlt = "",
  imagePosition,
  actions,
  titleId,
  children,
}) {
  const classes = ["ms-page-hero"];
  if (tone !== "gray") classes.push(`ms-page-hero--${tone}`);
  if (image) classes.push("ms-page-hero--media");

  return (
    <header className={classes.join(" ")}>
      <div className="ms-container ms-page-hero-inner">
        <div className="ms-page-hero-copy">
          {eyebrow && <p className="ms-eyebrow">{eyebrow}</p>}
          <h1 className="ms-page-hero-title" id={titleId}>{title}</h1>
          {text && <p className="ms-page-hero-text">{text}</p>}
          {actions && <div className="ms-page-hero-actions">{actions}</div>}
          {children}
        </div>
        {image && (
          <div className="ms-page-hero-media">
            <img src={image} alt={imageAlt} style={imagePosition ? { objectPosition: imagePosition } : undefined} />
          </div>
        )}
      </div>
    </header>
  );
}

