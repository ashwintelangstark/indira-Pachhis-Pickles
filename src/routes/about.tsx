import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import brandLogo from "@/assets/brand-logo.png";
import indiraImg from "@/assets/indira.jpeg";
import shilpaImg from "@/assets/shilpa.jpeg";
import surekhaImg from "@/assets/surekha.jpeg";
import ashwinImg from "@/assets/ashwin.jpeg";
import { WHATSAPP_URL, WHATSAPP_NUMBER, INSTAGRAM_URL, LOCATION_URL } from "@/lib/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — A Legacy of Love, Preserved Through Generations | Indira Pachhi's" },
      {
        name: "description",
        content:
          "The complete 7-chapter story of Indira Pachhi's Pickles and Chutney Powders. Three generations of dedication, authentic family recipes, and traditional flavours.",
      },
      {
        property: "og:title",
        content: "Our Story — A Legacy of Love, Preserved Through Generations | Indira Pachhi's",
      },
      {
        property: "og:description",
        content:
          "Discover how Smt. Indira Rohidas Kamat's kitchen recipes evolved into a beloved family enterprise across three generations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const CHAPTERS = [
  { id: "chapter-1", num: "Chapter 1", title: "Where It All Began" },
  { id: "chapter-2", num: "Chapter 2", title: "Passing Down Secret Recipes" },
  { id: "chapter-3", num: "Chapter 3", title: "From Kitchen to Enterprise" },
  { id: "chapter-4", num: "Chapter 4", title: "A New Generation Shares Story" },
  { id: "chapter-5", num: "Chapter 5", title: "Building the Brand Together" },
  { id: "chapter-6", num: "Chapter 6", title: "Tradition at Heart of Every Jar" },
  { id: "chapter-7", num: "Chapter 7", title: "A Family Legacy, Made to Share" },
];

export function AboutPage() {
  const [activeChapter, setActiveChapter] = useState("chapter-1");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Check which chapter is currently in view
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260) {
            setActiveChapter(CHAPTERS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Intersection observer for smooth reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const revealElements = document.querySelectorAll(".story-reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="about-page-wrapper">
      {/* Dynamic Reading Progress Bar */}
      <div
        className="story-page-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Top Navigation Bar */}
      <header className="about-page-header">
        <div className="about-page-nav-inner">
          <Link to="/" className="about-back-btn" aria-label="Return to homepage">
            <span className="back-arrow">←</span>
            <span>Back to Home</span>
          </Link>

          <Link to="/" className="about-brand-center">
            <img src={brandLogo} alt="Indira Pachhi's Logo" className="about-brand-logo" />
            <div className="about-brand-text">
              <span className="brand-title">Indira Pachhi's</span>
              <span className="brand-subtitle">Pickles & Chutney Powders</span>
            </div>
          </Link>

          <div className="about-nav-actions">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="about-order-btn"
            >
              Order on WhatsApp ↗
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-backdrop-glow" />
        <div className="about-hero-content story-reveal">
          <div className="about-hero-badge">
            <span className="badge-sparkle">✦</span>
            <span>A 100-Year Heritage of Culinary Passion</span>
            <span className="badge-sparkle">✦</span>
          </div>
          <h1 className="about-hero-title">
            Our Story — A Legacy of Love, <br className="hero-break" />
            <em>Preserved Through Generations</em>
          </h1>
          <p className="about-hero-lead">
            Every great tradition begins in a mother's kitchen. Discover how the time-honoured
            recipes of Smt. Indira Rohidas Kamat blossomed from a family table into an authentic,
            three-generation enterprise rooted in love and slow-cooked tradition.
          </p>
          <div className="about-hero-meta">
            <span className="meta-item">📜 7 Chapters</span>
            <span className="meta-sep">•</span>
            <span className="meta-item">🌿 100% Zero Added Preservatives</span>
            <span className="meta-sep">•</span>
            <span className="meta-item">👵 3 Generations of Dedication</span>
          </div>
        </div>

        {/* Sticky Chapter Quick-Nav Navigation */}
        <nav className="about-chapter-nav" aria-label="Story Chapters Navigation">
          <div className="chapter-nav-track">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(ch.id)}
                className={`chapter-pill-btn ${activeChapter === ch.id ? "active" : ""}`}
              >
                <span className="pill-index">Ch. {idx + 1}</span>
                <span className="pill-name">{ch.title}</span>
              </button>
            ))}
          </div>
        </nav>
      </section>

      {/* Main Story Narrative Container */}
      <main className="about-narrative-container">
        {/* CHAPTER 1 */}
        <article className="story-chapter-section story-reveal" id="chapter-1">
          <div className="chapter-header-box">
            <div className="chapter-eyebrow">Chapter 1</div>
            <h2 className="chapter-title">Where It All Began</h2>
            <div className="chapter-accent-line" />
          </div>

          <div className="chapter-prose">
            <p className="drop-cap-paragraph">
              <span className="drop-cap">E</span>very great tradition begins at home. Ours began in
              the kitchen of <strong>Smt. Indira Rohidas Kamat</strong>, whose love for her family
              found expression in the timeless art of homemade pickles. Through carefully chosen
              ingredients, traditional methods, and recipes perfected through experience, she
              created flavours that became a cherished part of family life.
            </p>
            <p>
              What began as a mother's way of bringing everyone together around the dining table
              would eventually become a legacy shared with many more families.
            </p>
          </div>

          {/* Full Landscape Character Showcase - Smt. Indira Rohidas Kamat */}
          <div className="landscape-character-card story-reveal">
            <div className="character-landscape-photo-frame">
              <img
                src={indiraImg}
                alt="Smt. Indira Rohidas Kamat"
                className="character-landscape-photo"
                loading="lazy"
              />
              <div className="landscape-photo-overlay" />
              <div className="landscape-photo-badge">Founder & Inspiration</div>
            </div>

            <div className="landscape-character-details">
              <div className="character-meta-row">
                <span className="character-designation">
                  Founder / Inspiration Behind the Legacy
                </span>
                <span className="character-heritage-tag">Origin of the Recipes</span>
              </div>
              <h3 className="character-name">Smt. Indira Rohidas Kamat</h3>
              <blockquote className="character-quote-box">
                <span className="quote-glyph">“</span>
                <p>
                  Every great tradition begins at home. Flavour is never just spices — it is the
                  patience, love, and warmth with which you nurture those around your table. When
                  you cook with pure intention, that tradition endures forever.
                </p>
              </blockquote>
              <div className="character-signature-row">
                <span className="signature-symbol">✦</span>
                <span className="signature-text">The Matriarch & Inspiration</span>
              </div>
            </div>
          </div>
        </article>

        {/* CHAPTER 2 */}
        <article className="story-chapter-section story-reveal" id="chapter-2">
          <div className="chapter-header-box">
            <div className="chapter-eyebrow">Chapter 2</div>
            <h2 className="chapter-title">Passing Down the Secret Recipes</h2>
            <div className="chapter-accent-line" />
          </div>

          <div className="chapter-prose">
            <p className="drop-cap-paragraph">
              <span className="drop-cap">B</span>elieving that treasured traditions should live on,
              Smt. Indira passed her family recipes to her daughter-in-law,{" "}
              <strong>Smt. Surekha Kamat</strong>, and her granddaughter,{" "}
              <strong>Smt. Shilpa Kamat</strong>. Along with the recipes came the knowledge,
              patience, and care required to preserve their authentic taste.
            </p>
            <p>
              These were more than instructions; they were family traditions nurtured through
              practice and carried forward with boundless love.
            </p>
          </div>

          {/* Full Landscape Character Showcase 1 - Smt. Surekha Kamat */}
          <div className="landscape-character-card story-reveal">
            <div className="character-landscape-photo-frame">
              <img
                src={surekhaImg}
                alt="Smt. Surekha Anant Kamat"
                className="character-landscape-photo"
                loading="lazy"
              />
              <div className="landscape-photo-overlay" />
              <div className="landscape-photo-badge">Lead Investor</div>
            </div>

            <div className="landscape-character-details">
              <div className="character-meta-row">
                <span className="character-designation">Lead Investor</span>
                <span className="character-heritage-tag">Guardian of Family Heritage</span>
              </div>
              <h3 className="character-name">Smt. Surekha Anant Kamat</h3>
              <blockquote className="character-quote-box">
                <span className="quote-glyph">“</span>
                <p>
                  Treasured traditions live on when the next generation embraces them with heart.
                  Supporting our family enterprise was my heartfelt commitment to ensure that our
                  authentic recipes and our elders' wisdom continue to bring families together.
                </p>
              </blockquote>
              <div className="character-signature-row">
                <span className="signature-symbol">✦</span>
                <span className="signature-text">With enduring faith & support</span>
              </div>
            </div>
          </div>

          {/* Full Landscape Character Showcase 2 - Smt. Shilpa Kamat */}
          <div className="landscape-character-card story-reveal">
            <div className="character-landscape-photo-frame">
              <img
                src={shilpaImg}
                alt="Smt. Shilpa Kamat"
                className="character-landscape-photo"
                loading="lazy"
              />
              <div className="landscape-photo-overlay" />
              <div className="landscape-photo-badge">CEO & Recipe Custodian</div>
            </div>

            <div className="landscape-character-details">
              <div className="character-meta-row">
                <span className="character-designation">
                  CEO / Recipe Custodian and Operations Lead
                </span>
                <span className="character-heritage-tag">Hands-on Custodian</span>
              </div>
              <h3 className="character-name">Smt. Shilpa Kamat</h3>
              <blockquote className="character-quote-box">
                <span className="quote-glyph">“</span>
                <p>
                  These recipes are more than instructions — they are family treasures. Every jar we
                  prepare carries my grandmother's touch. We safeguard her legacy by preparing every
                  batch with the exact patience, care, and unhurried traditional methods she taught
                  us.
                </p>
              </blockquote>
              <div className="character-signature-row">
                <span className="signature-symbol">✦</span>
                <span className="signature-text">With deep reverence & dedication</span>
              </div>
            </div>
          </div>
        </article>

        {/* CHAPTER 3 */}
        <article className="story-chapter-section story-reveal" id="chapter-3">
          <div className="chapter-header-box">
            <div className="chapter-eyebrow">Chapter 3</div>
            <h2 className="chapter-title">From a Family Kitchen to a Family Enterprise</h2>
            <div className="chapter-accent-line" />
          </div>

          <div className="chapter-prose">
            <p className="drop-cap-paragraph">
              <span className="drop-cap">I</span>nspired by her grandmother's culinary heritage,
              Smt. Shilpa Kamat took the first step towards sharing these special flavours beyond
              the family home. Driven by a desire to honour her grandmother's skills and keep her
              recipes alive, she began preparing and selling the pickles herself.
            </p>
            <p>
              Each jar represented more than a product; it carried the memory of a beloved
              grandmother and the flavours of a tradition worth preserving for future generations.
            </p>
          </div>

          {/* Interactive Craftsmanship Grid */}
          <div className="artisan-craft-grid story-reveal">
            <div className="craft-card">
              <span className="craft-icon">☀️</span>
              <h4>Sun-Cured Spices</h4>
              <p>Natural sun-drying intensifies the essential oils and aroma of every spice.</p>
            </div>
            <div className="craft-card">
              <span className="craft-icon">🥣</span>
              <h4>Small-Batch Cooking</h4>
              <p>
                Slowly prepared in small kettles to ensure every jar receives personal attention.
              </p>
            </div>
            <div className="craft-card">
              <span className="craft-icon">🚫</span>
              <h4>Zero Preservatives</h4>
              <p>
                Preserved naturally with rock salt, cold-pressed oils, and time-honoured ratios.
              </p>
            </div>
            <div className="craft-card">
              <span className="craft-icon">❤️</span>
              <h4>Family Supervised</h4>
              <p>Every single batch tasted and approved by the family custodians before sealing.</p>
            </div>
          </div>
        </article>

        {/* CHAPTER 4 */}
        <article className="story-chapter-section story-reveal" id="chapter-4">
          <div className="chapter-header-box">
            <div className="chapter-eyebrow">Chapter 4</div>
            <h2 className="chapter-title">A New Generation Shares the Story</h2>
            <div className="chapter-accent-line" />
          </div>

          <div className="chapter-prose">
            <p className="drop-cap-paragraph">
              <span className="drop-cap">S</span>mt. Shilpa's initiative found an enthusiastic
              supporter in her son, <strong>Ashwin Telang</strong>, a content creator who recognised
              the dedication and vision behind his mother's efforts. Seeing the potential to
              introduce these traditional flavours to a wider audience, he began promoting the brand
              through social media, using digital storytelling and creative marketing to connect the
              family's heritage with a new generation of customers.
            </p>
            <p>
              He later contributed his technical knowledge to support the brand's development,
              online presence, and growth.
            </p>
          </div>

          {/* Full Landscape Character Showcase - Ashwin Telang */}
          <div className="landscape-character-card story-reveal">
            <div className="character-landscape-photo-frame">
              <img
                src={ashwinImg}
                alt="Shri. Ashwin Telang"
                className="character-landscape-photo"
                loading="lazy"
              />
              <div className="landscape-photo-overlay" />
              <div className="landscape-photo-badge">Marketing Chief</div>
            </div>

            <div className="landscape-character-details">
              <div className="character-meta-row">
                <span className="character-designation">
                  Marketing Chief / Digital Marketing & Technical Development
                </span>
                <span className="character-heritage-tag">Modern Storyteller</span>
              </div>
              <h3 className="character-name">Shri. Ashwin Telang</h3>
              <blockquote className="character-quote-box">
                <span className="quote-glyph">“</span>
                <p>
                  Watching my mother craft these pickles with the exact devotion my
                  great-grandmother demonstrated was inspiring. By blending authentic digital
                  storytelling with modern technology, our mission is to ensure that genuine
                  heritage flavours reach and resonate with homes across the world.
                </p>
              </blockquote>
              <div className="character-signature-row">
                <span className="signature-symbol">✦</span>
                <span className="signature-text">With modern vision & family pride</span>
              </div>
            </div>
          </div>
        </article>

        {/* CHAPTER 5 */}
        <article className="story-chapter-section story-reveal" id="chapter-5">
          <div className="chapter-header-box">
            <div className="chapter-eyebrow">Chapter 5</div>
            <h2 className="chapter-title">Building the Brand Together</h2>
            <div className="chapter-accent-line" />
          </div>

          <div className="chapter-prose">
            <p className="drop-cap-paragraph">
              <span className="drop-cap">A</span>s the family's vision grew, Smt. Surekha Kamat
              stepped forward as the lead investor, providing the financial foundation needed to
              transform the family initiative into an established enterprise. With her support, the
              family took an important step towards building{" "}
              <strong>Indira Pachhi's Pickles and Chutney Powders</strong>.
            </p>
            <p>
              Each member contributes in a different way: the family recipes provide the foundation,
              hands-on preparation protects the traditional methods, investment supports the
              business, and digital and technical efforts help the brand reach more people.
            </p>
          </div>

          {/* 4 Contribution Pillars */}
          <div className="contribution-pillars-grid story-reveal">
            <div className="pillar-item">
              <span className="pillar-number">01</span>
              <h4>The Foundation</h4>
              <p>
                Smt. Indira's authentic recipes and spice blends developed and perfected over
                decades.
              </p>
            </div>
            <div className="pillar-item">
              <span className="pillar-number">02</span>
              <h4>The Craft</h4>
              <p>
                Hands-on slow cooking and careful small-batch production led by Smt. Shilpa Kamat.
              </p>
            </div>
            <div className="pillar-item">
              <span className="pillar-number">03</span>
              <h4>The Investment</h4>
              <p>
                Financial strength and strategic backing provided by lead investor Smt. Surekha
                Kamat.
              </p>
            </div>
            <div className="pillar-item">
              <span className="pillar-number">04</span>
              <h4>The Reach</h4>
              <p>
                Digital storytelling, creative outreach, and technical development led by Ashwin
                Telang.
              </p>
            </div>
          </div>
        </article>

        {/* CHAPTER 6 */}
        <article className="story-chapter-section story-reveal" id="chapter-6">
          <div className="chapter-header-box">
            <div className="chapter-eyebrow">Chapter 6</div>
            <h2 className="chapter-title">Tradition at the Heart of Every Jar</h2>
            <div className="chapter-accent-line" />
          </div>

          <div className="chapter-prose">
            <p className="drop-cap-paragraph">
              <span className="drop-cap">T</span>oday, Smt. Shilpa Kamat oversees the preparation of
              the products and safeguards the family's treasured recipes. The brand's approach
              remains rooted in traditional preparation and preservation methods, with products made
              without added preservatives. The goal is to honour the flavour and care passed down
              through generations while sharing these recipes with more homes.
            </p>
            <div className="cinematic-quote-banner">
              <div className="quote-ornament">✤ ✤ ✤</div>
              <p className="banner-quote-text">
                “Every variety has its own character. Every recipe carries its own history. Every
                jar represents a family united by a love for traditional food.”
              </p>
              <div className="quote-ornament">✤ ✤ ✤</div>
            </div>
          </div>
        </article>

        {/* CHAPTER 7 */}
        <article className="story-chapter-section story-reveal" id="chapter-7">
          <div className="chapter-header-box">
            <div className="chapter-eyebrow">Chapter 7</div>
            <h2 className="chapter-title">A Family Legacy, Made to Be Shared</h2>
            <div className="chapter-accent-line" />
          </div>

          <div className="chapter-prose">
            <p className="drop-cap-paragraph">
              <span className="drop-cap">I</span>ndira Pachhi's is a tribute to Smt. Indira Rohidas
              Kamat and the culinary heritage she entrusted to the generations that followed her.
              From her kitchen to her granddaughter's enterprise, from a family recipe to a growing
              brand, this journey is a reminder that the most meaningful traditions are those we
              choose to preserve and share.
            </p>
            <p>
              As the brand brings these flavours to more homes, its story remains rooted in
              authenticity, dedication, and respect for family heritage.
            </p>
          </div>

          {/* Grand Heritage Seal Box */}
          <div className="grand-heritage-seal-box story-reveal">
            <div className="royal-seal-glow" />
            <div className="royal-seal-crest">
              <span className="crest-star">★</span>
              <span className="crest-year">ESTD. TRADITION</span>
              <span className="crest-star">★</span>
            </div>
            <h3 className="royal-seal-headline">
              One family's treasured recipes. <br />
              Three generations of dedication. <br />
              <em>A tradition made to be shared.</em>
            </h3>
            <div className="royal-seal-brand">INDIRA PACHHI'S PICKLES AND CHUTNEY POWDERS</div>
            <div className="royal-seal-motto">A taste of tradition, lovingly preserved.</div>

            <div className="royal-seal-actions">
              <Link to="/" className="btn secondary royal-home-btn">
                ← Return to Home
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary royal-order-btn"
              >
                Order Fresh Jars on WhatsApp ↗
              </a>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="about-page-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img
                src={brandLogo}
                alt="Indira Pachhi's"
                className="footer-brand-logo"
                width={44}
                height={44}
              />
              <div>
                <h3>Indira Pachhi's</h3>
                <p className="footer-tagline">Pickles & Chutney Powders</p>
              </div>
            </div>
            <p className="footer-desc">
              Authentic handcrafted pickles and chutney powders inspired by a 100-year-old family
              recipe tradition.
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Explore</div>
            <Link to="/" className="footer-link">
              Home
            </Link>
            <a href="/#collection" className="footer-link">
              Explore Collection
            </a>
            <a href="/#heritage" className="footer-link">
              Our Heritage
            </a>
            <a href="/#contact" className="footer-link">
              Contact Us
            </a>
          </div>

          <div className="footer-col">
            <div className="footer-heading">Connect With Us</div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item"
            >
              <span className="contact-icon">💬</span>
              <span>{WHATSAPP_NUMBER}</span>
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item"
            >
              <span className="contact-icon">📸</span>
              <span>@indira_pachhis_vasari</span>
            </a>
            <a
              href={LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item"
            >
              <span className="contact-icon">📍</span>
              <span>Locate Our Kitchen</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Indira Pachhi's. All rights reserved.</p>
          <div className="footer-badges">
            <span className="footer-badge-pill">Family Legacy</span>
            <span className="footer-badge-pill">Small-Batch Crafted</span>
            <span className="footer-badge-pill">Natural Ingredients</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
