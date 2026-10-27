import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Jar3D } from "@/components/jar-3d";
import { products, heroProduct, WHATSAPP_URL, INSTAGRAM_URL, LOCATION_URL } from "@/lib/products";
import brandLogo from "@/assets/brand-logo.png";

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

type Filter = "all" | "pickle" | "powder";

function useReveal(deps: unknown[]) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function Index() {
  const [filter, setFilter] = useState<Filter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useReveal([filter]);

  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    if (selected !== null) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const visible = products.map((p, i) => ({ p, i })).filter(({ p }) => filter === "all" || p.type === filter);
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
            <small style={{ font: "10px 'DM Sans'", letterSpacing: "1.6px" }}>PICKLES & CHUTNEY POWDERS</small>
          </span>
        </a>
        <button className="menu-btn" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
          ☰
        </button>
        <div className={menuOpen ? "navlinks open" : "navlinks"}>
          <a href="#collection" onClick={closeMenu}>
            Our Flavours
          </a>
          <a href="#heritage" onClick={closeMenu}>
            Our Heritage
          </a>
          <a href="#founders" onClick={closeMenu}>
            The Founders
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <a className="nav-cta" href="#collection" onClick={closeMenu}>
            Explore the jars ↗
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
            Discover the bold, nostalgic flavours of Indira Pachhi's Pickles and Chutney Powders — inspired by a
            100-year-old family recipe tradition and made with care.
          </p>
          <div className="actions">
            <a href="#collection" className="btn primary">
              Explore our flavours <span>↗</span>
            </a>
            <a href="#heritage" className="btn secondary">
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
          <Jar3D product={heroProduct} speed={0.004} id="hero3d" ariaLabel="Interactive 3D pickle jars. Drag to rotate." />
          <div className="hero-note">Handcrafted. Heritage-inspired. Full of flavour.</div>
        </div>
      </section>

      <div className="marquee">
        <span>
          AUTHENTIC FAMILY RECIPES <b>✦</b> NO ADDED PRESERVATIVES <b>✦</b> A CENTURY OF FLAVOUR <b>✦</b> MADE WITH
          CARE <b>✦</b> AUTHENTIC FAMILY RECIPES <b>✦</b> NO ADDED PRESERVATIVES <b>✦</b> A CENTURY OF FLAVOUR <b>✦</b>{" "}
          MADE WITH CARE <b>✦</b>
        </span>
      </div>

      <section className="section" id="collection">
        <div className="section-head reveal">
          <div className="eyebrow">From our kitchen to yours</div>
          <h2>Explore the collection</h2>
          <p>
            Every jar has its own character — tangy, fiery, mellow or deeply savoury. Select a bottle to discover its
            flavour story.
          </p>
        </div>
        <div className="tabs reveal">
          <button className={filter === "all" ? "tab active" : "tab"} onClick={() => setFilter("all")}>
            All varieties
          </button>
          <button className={filter === "pickle" ? "tab active" : "tab"} onClick={() => setFilter("pickle")}>
            Pickles
          </button>
          <button className={filter === "powder" ? "tab active" : "tab"} onClick={() => setFilter("powder")}>
            Chutney powders
          </button>
        </div>
        <div className="products" id="products">
          {visible.map(({ p, i }) => (
            <article
              key={p.name}
              className="product-card reveal"
              tabIndex={0}
              role="button"
              aria-label={`View details for ${p.name}`}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(i);
                }
              }}
            >
              <span className="number">{String(i + 1).padStart(2, "0")}</span>
              <div className="product-visual">
                <Jar3D product={p} className="jar-canvas" speed={0.007} phase={i * 0.7} />
              </div>
              <div className="product-category">{p.type === "pickle" ? "Traditional pickle" : "Chutney powder"}</div>
              <h3>{p.name}</h3>
              <span className="view-detail">Discover flavour ↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="heritage" id="heritage">
        <div className="heritage-art reveal">
          <img src={brandLogo} alt="Original Indira Pachhi's Pickles and Chutney Powders label" loading="lazy" width={1024} height={1024} />
        </div>
        <div className="heritage-copy reveal">
          <div className="eyebrow">More than a recipe</div>
          <h2>
            A hundred years
            <br />
            of flavour & feeling.
          </h2>
          <p>
            Some recipes are more than instructions — they are memories, family rituals and a little piece of home.
            Indira Pachhi's celebrates that heritage with a collection inspired by a century-old authentic, handmade
            recipe tradition.
          </p>
          <p>
            From the lively bite of mango pickle to the comforting punch of garlic chutney powder, each variety is
            presented with respect for the flavours that bring generations together.
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

      <section className="section founders" id="founders">
        <div className="section-head reveal">
          <div className="eyebrow">The people behind the flavour</div>
          <h2>Messages from our leaders</h2>
          <p>A family tradition carried forward with care, purpose and a love for authentic taste.</p>
        </div>
        <div className="founder-grid">
          <article className="founder-card reveal">
            <div className="founder-role">Message from the Founder</div>
            <h3>A legacy from our kitchen</h3>
            <p>
              “Every recipe holds a memory. Our aim is to bring the warmth of traditional homemade flavours to your
              table, while honouring the care and craft passed down through generations.”
            </p>
            <div className="signature">With warmth & gratitude</div>
          </article>
          <article className="founder-card reveal">
            <div className="founder-role">Message from the CEO</div>
            <h3>Tradition, for today</h3>
            <p>
              “We want every jar to feel familiar, honest and full of character. As we grow, our commitment remains the
              same: celebrate our heritage, respect our customers and share flavours worth remembering.”
            </p>
            <div className="signature">With sincere thanks</div>
          </article>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#8b6b4b", marginTop: 20 }}>
          Founder and CEO messages are illustrative placeholders. Replace with approved names and statements before
          publishing.
        </p>
      </section>

      <section className="section contact" id="contact">
        <div className="section-head reveal">
          <div className="eyebrow">Let's stay connected</div>
          <h2>A little taste of home</h2>
          <p>
            Questions about a flavour, a family favourite or placing an order? We would love to hear from you.
          </p>
        </div>
        <div className="contact-cards reveal">
          <a className="contact-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            <small>Follow our journey</small>
            <strong>Instagram ↗</strong>
          </a>
          <a className="contact-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <small>Ask or enquire · +91 77603 97902</small>
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
            <button ref={closeRef} className="modal-close" aria-label="Close details" onClick={() => setSelected(null)}>
              ×
            </button>
            <div className="modal-visual">
              <Jar3D product={activeProduct} className="jar-canvas" speed={0.008} />
            </div>
            <div className="modal-content">
              <div className="eyebrow">{activeProduct.type === "pickle" ? "Traditional pickle" : "Chutney powder"}</div>
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
                Recipe heritage: inspired by a 100-year-old family tradition. Ingredient details should be verified
                against the final product label before publication.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
