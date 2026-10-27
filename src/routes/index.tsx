import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Jar3D } from "@/components/jar-3d";
import { Collection3DStage } from "@/components/collection-3d-stage";
import {
  products,
  heroProduct,
  WHATSAPP_URL,
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  LOCATION_URL,
} from "@/lib/products";
import brandLogo from "@/assets/brand-logo.png";
import indiraImg from "@/assets/indira.jpeg";
import shilpaImg from "@/assets/shilpa.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Indira Pachhi's | Pickles & Chutney Powders" },
      {
        name: "description",
        content:
          "Indira Pachhi's Pickles and Chutney Powders — authentic, handcrafted flavours inspired by a 100-year-old family recipe tradition.",
      },
      { property: "og:title", content: "Indira Pachhi's | Pickles & Chutney Powders" },
      {
        property: "og:description",
        content:
          "Authentic, handcrafted pickles and chutney powders inspired by a 100-year-old family recipe tradition.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useReveal();

  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    if (selected !== null) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const closeMenu = () => setMenuOpen(false);
  const activeProduct = selected !== null ? products[selected] : null;

  return (
    <main>
      <div className="topline" />
      <nav>
        <a href="#home" className="brand-mini">
          <img src={brandLogo} alt="Indira Pachhi's brand label" width={52} height={52} />
          <span>
            INDIRA PACHHI'S
            <br />
            <small style={{ font: "10px 'DM Sans'", letterSpacing: "1.6px" }}>
              PICKLES & CHUTNEY POWDERS
            </small>
          </span>
        </a>
        <button
          className="menu-btn"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
        <div className={menuOpen ? "navlinks open" : "navlinks"}>
          <a href="#collection" onClick={closeMenu}>
            Our Flavours
          </a>
          <a href="#heritage" onClick={closeMenu}>
            Our Heritage
          </a>
          <a href="#about" onClick={closeMenu}>
            About Us
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="mandala" />
        <div className="hero-copy">
          <div className="eyebrow">A taste passed through generations</div>
          <h1>
            Tradition,
            <br />
            <em>sealed in</em>
            <br />
            every jar.
          </h1>
          <p>
            Discover the bold, nostalgic flavours of Indira Pachhi's Pickles and Chutney Powders —
            inspired by a 100-year-old family recipe tradition and made with care.
          </p>
          <div className="actions">
            <a href="#heritage" className="btn primary">
              Our story <span>↓</span>
            </a>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-stamp">
            ROOTED IN
            <br />
            TRADITION
            <br />✦ SINCE GENERATIONS
          </div>
          <Jar3D
            product={heroProduct}
            speed={0.004}
            id="hero3d"
            ariaLabel="Interactive 3D pickle jars. Drag to rotate."
          />
          <div className="hero-note">Handcrafted. Heritage-inspired. Full of flavour.</div>
        </div>
      </section>

      <div className="marquee">
        <span>
          AUTHENTIC FAMILY RECIPES <b>✦</b> NO ADDED PRESERVATIVES <b>✦</b> A CENTURY OF FLAVOUR{" "}
          <b>✦</b> MADE WITH CARE <b>✦</b> AUTHENTIC FAMILY RECIPES <b>✦</b> NO ADDED PRESERVATIVES{" "}
          <b>✦</b> A CENTURY OF FLAVOUR <b>✦</b> MADE WITH CARE <b>✦</b>
        </span>
      </div>

      <section className="section" id="collection">
        <div className="section-head reveal">
          <div className="eyebrow">From our kitchen to yours</div>
          <h2>Explore the collection</h2>
          <p>
            Every jar has its own character — tangy, fiery, mellow or deeply savoury. Experience
            each flavour in interactive 3D with authentic Indira Pachhi's heritage bottling.
          </p>
        </div>

        {/* Interactive 3D Showcase Stage (matching animation style) */}
        <Collection3DStage products={products} onSelectProduct={(idx) => setSelected(idx)} />
      </section>

      <section className="heritage" id="heritage">
        <div className="heritage-art reveal">
          <img
            src={brandLogo}
            alt="Original Indira Pachhi's Pickles and Chutney Powders label"
            loading="lazy"
            width={1024}
            height={1024}
          />
        </div>
        <div className="heritage-copy reveal">
          <div className="eyebrow">More than a recipe</div>
          <h2>
            A hundred years
            <br />
            of flavour & feeling.
          </h2>
          <p>
            Some recipes are more than instructions — they are memories, family rituals and a little
            piece of home. Indira Pachhi's celebrates that heritage with a collection inspired by a
            century-old authentic, handmade recipe tradition.
          </p>
          <p>
            From the lively bite of mango pickle to the comforting punch of garlic chutney powder,
            each variety is presented with respect for the flavours that bring generations together.
          </p>
          <div className="values">
            <div className="value">
              <strong>100 years</strong>
              <span>Recipe heritage</span>
            </div>
            <div className="value">
              <strong>13 varieties</strong>
              <span>Distinctive flavours</span>
            </div>
            <div className="value">
              <strong>No added</strong>
              <span>Preservatives claim</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section founders" id="about">
        <div className="section-head reveal">
          <div className="eyebrow">The people behind the flavour</div>
          <h2>About Us</h2>
          <p>
            A 100-year family tradition carried forward with care, purpose and a love for authentic
            taste.
          </p>
        </div>

        <div className="section-subhead reveal">
          <span className="subhead-pill">Leadership & Legacy</span>
          <h3>Messages from our leaders</h3>
        </div>

        {/* 2 Full Landscape Leader Messages */}
        <div className="leaders-landscape-container">
          {/* 1st: Message from Founder */}
          <article className="leader-landscape-card reveal">
            <div className="leader-landscape-photo-wrap">
              <img
                src={indiraImg}
                alt="Smt. Indira Rohidas Kamat, Founder"
                className="leader-landscape-img"
                loading="lazy"
              />
              <div className="leader-landscape-badge">Message from Founder</div>
            </div>
            <div className="leader-landscape-info">
              <div className="leader-meta-row">
                <span className="leader-role-pill">Founder & Inspiration Behind the Legacy</span>
                <span className="leader-origin-tag">Origin of the Recipes</span>
              </div>
              <h3 className="leader-name">Smt. Indira Rohidas Kamat</h3>
              <blockquote className="leader-quote">
                “Every great tradition begins at home. Ours began in the kitchen, bringing family
                together around the dining table with honest, lovingly perfected flavours.”
              </blockquote>
              <div className="leader-signature">
                <span className="sig-symbol">✦</span>
                <span>With warmth & gratitude — Smt. Indira Rohidas Kamat, Founder</span>
              </div>
            </div>
          </article>

          {/* 2nd: Message from CEO */}
          <article className="leader-landscape-card reveal">
            <div className="leader-landscape-photo-wrap">
              <img
                src={shilpaImg}
                alt="Smt. Shilpa Kamat, CEO"
                className="leader-landscape-img"
                loading="lazy"
              />
              <div className="leader-landscape-badge">Message from CEO</div>
            </div>
            <div className="leader-landscape-info">
              <div className="leader-meta-row">
                <span className="leader-role-pill">CEO & Recipe Custodian</span>
                <span className="leader-origin-tag">Operations Lead</span>
              </div>
              <h3 className="leader-name">Smt. Shilpa Kamat</h3>
              <blockquote className="leader-quote">
                “Every jar carries the memory of my grandmother. We honour her legacy by preparing
                every batch with the exact patience, care, and traditional methods she taught us.”
              </blockquote>
              <div className="leader-signature">
                <span className="sig-symbol">✦</span>
                <span>With sincere dedication — Smt. Shilpa Kamat, CEO</span>
              </div>
            </div>
          </article>
        </div>

        {/* Our Story Button Section Below Messages */}
        <div className="our-story-cta-section reveal">
          <div className="our-story-cta-card">
            <div className="our-story-cta-glow" />
            <div className="our-story-cta-content">
              <div className="our-story-cta-badge">✦ A 100-Year Heritage of Culinary Passion ✦</div>
              <h3 className="our-story-cta-title">
                Our Story — A Legacy of Love, Preserved Through Generations
              </h3>
              <p className="our-story-cta-desc">
                Step inside our complete 7-chapter story — exploring our origin, the secret recipes,
                all family members, and the traditional methods behind every jar.
              </p>
              <div className="our-story-btn-wrap">
                <Link to="/about" className="our-story-primary-btn">
                  <span>Our Story</span>
                  <span className="story-btn-arrow">📖 →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="section-head reveal">
          <div className="eyebrow">Let's stay connected</div>
          <h2>A little taste of home</h2>
          <p>
            Questions about a flavour, a family favourite or placing an order? We would love to hear
            from you.
          </p>
        </div>
        <div className="contact-cards reveal">
          <a className="contact-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            <small>Follow our journey</small>
            <strong>Instagram ↗</strong>
          </a>
          <a className="contact-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <small>Ask or enquire · {WHATSAPP_NUMBER}</small>
            <strong>WhatsApp ↗</strong>
          </a>
          <a className="contact-link" href={LOCATION_URL} target="_blank" rel="noreferrer">
            <small>Find us</small>
            <strong>Our location ↗</strong>
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img src={brandLogo} alt="" loading="lazy" width={38} height={38} />
          INDIRA PACHHI'S · PICKLES & CHUTNEY POWDERS
        </div>
        <div>Made with tradition. Shared with love. © {new Date().getFullYear()}</div>
      </footer>

      <div
        className={selected !== null ? "modal open" : "modal"}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        {activeProduct && (
          <div className="modal-panel">
            <button
              ref={closeRef}
              className="modal-close"
              aria-label="Close details"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <div className="modal-visual">
              <Jar3D product={activeProduct} className="jar-canvas" speed={0.008} />
            </div>
            <div className="modal-content">
              <div className="eyebrow">
                {activeProduct.type === "pickle" ? "Traditional pickle" : "Chutney powder"}
              </div>
              <h2 id="modalTitle">{activeProduct.name}</h2>
              <p>{activeProduct.description}</p>
              <div className="detail-pills">
                <span className="pill">No added preservatives</span>
                <span className="pill">Heritage recipe</span>
              </div>
              <h3 style={{ fontSize: 25, margin: "20px 0 8px" }}>Flavour notes</h3>
              <p>
                {activeProduct.flavour} — {activeProduct.notes}
              </p>
              <h3 style={{ fontSize: 25, margin: "18px 0 8px" }}>Ingredients</h3>
              <ul className="detail-list">
                {activeProduct.ingredients.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="modal-note">
                Recipe heritage: inspired by a 100-year-old family tradition. Ingredient details
                should be verified against the final product label before publication.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
