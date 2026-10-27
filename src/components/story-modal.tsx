import { useEffect, useRef, useState } from "react";
import indiraImg from "@/assets/indira.jpeg";
import shilpaImg from "@/assets/shilpa.jpeg";
import surekhaImg from "@/assets/surekha.jpeg";
import ashwinImg from "@/assets/ashwin.jpeg";
import brandLogo from "@/assets/brand-logo.png";

type StoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const chapters = [
  { id: "ch1", num: "Chapter 1", title: "Where It All Began" },
  { id: "ch2", num: "Chapter 2", title: "Passing Down the Secret Recipes" },
  { id: "ch3", num: "Chapter 3", title: "From a Family Kitchen to an Enterprise" },
  { id: "ch4", num: "Chapter 4", title: "A New Generation Shares the Story" },
  { id: "ch5", num: "Chapter 5", title: "Building the Brand Together" },
  { id: "ch6", num: "Chapter 6", title: "Tradition at the Heart of Every Jar" },
  { id: "ch7", num: "Chapter 7", title: "A Family Legacy, Made to Be Shared" },
];

export function StoryModal({ isOpen, onClose }: StoryModalProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Track scroll progress and active chapter
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const totalScroll = el.scrollHeight - el.clientHeight;
    if (totalScroll > 0) {
      setScrollProgress((el.scrollTop / totalScroll) * 100);
    }

    // Determine active chapter based on scroll position
    const chapterEls = chapters.map((c) => document.getElementById(c.id));
    const containerTop = el.scrollTop + 140;

    for (let i = chapterEls.length - 1; i >= 0; i--) {
      const chEl = chapterEls[i];
      if (chEl && chEl.offsetTop <= containerTop) {
        setActiveChapter(i);
        break;
      }
    }
  };

  const scrollToChapter = (id: string, index: number) => {
    setActiveChapter(index);
    const target = document.getElementById(id);
    if (target && scrollContainerRef.current) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="story-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="story-modal-container">
        {/* Progress Bar */}
        <div
          className="story-progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        {/* Modal Top Header */}
        <header className="story-modal-header">
          <div className="story-header-brand">
            <img src={brandLogo} alt="Indira Pachhi's" width={38} height={38} />
            <div>
              <span className="story-header-eyebrow">A Legacy of Love</span>
              <h2 id="story-modal-title">Our Story — Preserved Through Generations</h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            className="story-modal-close"
            onClick={onClose}
            aria-label="Close story"
          >
            ✕
          </button>
        </header>

        {/* Chapter Quick-Jump Navigation Tabs */}
        <nav className="story-chapter-nav" aria-label="Chapters">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              className={`chapter-nav-btn ${activeChapter === idx ? "active" : ""}`}
              onClick={() => scrollToChapter(ch.id, idx)}
            >
              <span className="ch-num">{ch.num}</span>
              <span className="ch-title">{ch.title}</span>
            </button>
          ))}
        </nav>

        {/* Scrollable Story Narrative Body */}
        <div ref={scrollContainerRef} className="story-modal-body" onScroll={handleScroll}>
          {/* Hero Banner inside the Story */}
          <div className="story-banner">
            <div className="story-banner-mandala" aria-hidden="true" />
            <div className="story-banner-content">
              <span className="story-stamp">HERITAGE ✦ CRAFT ✦ FAMILY</span>
              <h1>A Legacy of Love, Preserved Through Generations</h1>
              <p>
                The authentic journey of Indira Pachhi's Pickles and Chutney Powders — from one
                cherished family kitchen to dinner tables across the world.
              </p>
            </div>
          </div>

          <div className="story-content-flow">
            {/* CHAPTER 1 */}
            <article className="story-chapter" id="ch1">
              <div className="chapter-eyebrow">Chapter 1</div>
              <h3>Where It All Began</h3>
              <p className="chapter-lead">
                <span className="drop-cap">E</span>very great tradition begins at home. Ours began
                in the kitchen of <strong>Smt. Indira Rohidas Kamat</strong>, whose love for her
                family found expression in the timeless art of homemade pickles.
              </p>
              <p>
                Through carefully chosen ingredients, traditional methods, and recipes perfected
                through experience, she created flavours that became a cherished part of family
                life. What began as a mother's way of bringing everyone together around the dining
                table would eventually become a legacy shared with many more families.
              </p>

              {/* Character Spotlight: Smt. Indira Rohidas Kamat */}
              <div className="story-character-card founder-spotlight">
                <div className="character-photo-frame">
                  <img src={indiraImg} alt="Smt. Indira Rohidas Kamat, Founder" loading="lazy" />
                  <div className="photo-ornament" />
                </div>
                <div className="character-details">
                  <div className="character-role-tag">Founder & Legacy Inspiration</div>
                  <h4>Smt. Indira Rohidas Kamat</h4>
                  <div className="character-quote">
                    “Every recipe holds a memory of family warmth. What began around our humble
                    dining table was never just food—it was love, patience, and care sealed into
                    every jar for the ones we cherish most.”
                  </div>
                  <div className="character-foot">The origin of all Indira Pachhi's recipes</div>
                </div>
              </div>
            </article>

            {/* CHAPTER 2 */}
            <article className="story-chapter" id="ch2">
              <div className="chapter-eyebrow">Chapter 2</div>
              <h3>Passing Down the Secret Recipes</h3>
              <p>
                Believing that treasured traditions should live on, Smt. Indira passed her family
                recipes to her daughter-in-law, <strong>Smt. Surekha Kamat</strong>, and her
                granddaughter, <strong>Smt. Shilpa Kamat</strong>.
              </p>
              <p>
                Along with the recipes came the knowledge, patience, and care required to preserve
                their authentic taste. These were more than instructions; they were family
                traditions nurtured through practice and carried forward with love.
              </p>

              {/* Dual Character Spotlights: Smt. Surekha Kamat & Smt. Shilpa Kamat */}
              <div className="story-characters-grid">
                <div className="story-character-card">
                  <div className="character-photo-frame">
                    <img
                      src={surekhaImg}
                      alt="Smt. Surekha Anant Kamat, Lead Investor"
                      loading="lazy"
                    />
                    <div className="photo-ornament" />
                  </div>
                  <div className="character-details">
                    <div className="character-role-tag">Lead Investor</div>
                    <h4>Smt. Surekha Anant Kamat</h4>
                    <div className="character-quote">
                      “Supporting this family heritage is my greatest joy. Preserving the purity of
                      our grandmother's recipes while creating a lasting enterprise ensures our
                      family's love reaches tables everywhere.”
                    </div>
                  </div>
                </div>

                <div className="story-character-card">
                  <div className="character-photo-frame">
                    <img
                      src={shilpaImg}
                      alt="Smt. Shilpa Kamat, CEO & Recipe Custodian"
                      loading="lazy"
                    />
                    <div className="photo-ornament" />
                  </div>
                  <div className="character-details">
                    <div className="character-role-tag">CEO & Recipe Custodian</div>
                    <h4>Smt. Shilpa Kamat</h4>
                    <div className="character-quote">
                      “Every morning in our kitchen, I carry forward the exact methods my
                      grandmother taught me. We never cut corners and use no artificial
                      preservatives—just honest tradition, crafted with reverence.”
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* CHAPTER 3 */}
            <article className="story-chapter" id="ch3">
              <div className="chapter-eyebrow">Chapter 3</div>
              <h3>From a Family Kitchen to a Family Enterprise</h3>
              <p>
                Inspired by her grandmother's culinary heritage, Smt. Shilpa Kamat took the first
                step towards sharing these special flavours beyond the family home.
              </p>
              <p>
                Driven by a desire to honour her grandmother's skills and keep her recipes alive,
                she began preparing and selling the pickles herself. Each jar represented more than
                a product; it carried the memory of a beloved grandmother and the flavours of a
                tradition worth preserving.
              </p>
              <div className="story-callout-pill">
                ✦ Every batch handcrafted in small artisanal lots to honour the authentic 100-year
                tradition.
              </div>
            </article>

            {/* CHAPTER 4 */}
            <article className="story-chapter" id="ch4">
              <div className="chapter-eyebrow">Chapter 4</div>
              <h3>A New Generation Shares the Story</h3>
              <p>
                Smt. Shilpa's initiative found an enthusiastic supporter in her son,{" "}
                <strong>Shri. Ashwin Telang</strong>, a content creator who recognised the
                dedication and vision behind his mother's efforts.
              </p>
              <p>
                Seeing the potential to introduce these traditional flavours to a wider audience, he
                began promoting the brand through social media, using digital storytelling and
                creative marketing to connect the family's heritage with a new generation of
                customers. He later contributed his technical knowledge to support the brand's
                development and growth.
              </p>

              {/* Character Spotlight: Shri. Ashwin Telang */}
              <div className="story-character-card marketing-spotlight">
                <div className="character-photo-frame">
                  <img src={ashwinImg} alt="Shri. Ashwin Telang, Marketing Chief" loading="lazy" />
                  <div className="photo-ornament" />
                </div>
                <div className="character-details">
                  <div className="character-role-tag">Marketing Chief & Technical Development</div>
                  <h4>Shri. Ashwin Telang</h4>
                  <div className="character-quote">
                    “Seeing my mother and grandmother dedicate their souls to these flavours
                    inspired me to share our heritage with the modern world. Through storytelling,
                    digital craft, and technology, we are bridging generations.”
                  </div>
                  <div className="character-foot">
                    Connecting heritage recipes with modern food lovers
                  </div>
                </div>
              </div>
            </article>

            {/* CHAPTER 5 */}
            <article className="story-chapter" id="ch5">
              <div className="chapter-eyebrow">Chapter 5</div>
              <h3>Building the Brand Together</h3>
              <p>
                As the family's vision grew, <strong>Smt. Surekha Kamat</strong> stepped forward as
                the lead investor, providing the financial foundation needed to transform the family
                initiative into an established enterprise.
              </p>
              <p>
                With her support, the family took an important step towards building Indira Pachhi's
                Pickles and Chutney Powders.
              </p>
              <div className="story-contribution-cards">
                <div className="contribution-item">
                  <strong>The Recipes</strong>
                  <span>Smt. Indira's time-tested culinary foundation</span>
                </div>
                <div className="contribution-item">
                  <strong>The Hands</strong>
                  <span>Smt. Shilpa's meticulous preparation & craft</span>
                </div>
                <div className="contribution-item">
                  <strong>The Foundation</strong>
                  <span>Smt. Surekha's vital investment & belief</span>
                </div>
                <div className="contribution-item">
                  <strong>The Voice</strong>
                  <span>Shri. Ashwin's storytelling & digital reach</span>
                </div>
              </div>
            </article>

            {/* CHAPTER 6 */}
            <article className="story-chapter" id="ch6">
              <div className="chapter-eyebrow">Chapter 6</div>
              <h3>Tradition at the Heart of Every Jar</h3>
              <p>
                Today, Smt. Shilpa Kamat oversees the preparation of the products and safeguards the
                family's treasured recipes. The brand's approach remains rooted in traditional
                preparation and preservation methods, with products made{" "}
                <strong>without added chemical preservatives</strong>.
              </p>
              <p>
                The goal is to honour the flavour and care passed down through generations while
                sharing these recipes with more homes.
              </p>
              <div className="story-values-banner">
                <div className="story-val-box">
                  <span className="val-icon">🏺</span>
                  <strong>13 Unique Flavours</strong>
                  <span>Authentic pickles and aromatic chutney powders</span>
                </div>
                <div className="story-val-box">
                  <span className="val-icon">🌿</span>
                  <strong>No Added Preservatives</strong>
                  <span>Sun-ripened spices, authentic cold-pressed oils</span>
                </div>
                <div className="story-val-box">
                  <span className="val-icon">⏳</span>
                  <strong>Century-Old Recipes</strong>
                  <span>Recipes perfected through decades of family care</span>
                </div>
              </div>
            </article>

            {/* CHAPTER 7 */}
            <article className="story-chapter final-chapter" id="ch7">
              <div className="chapter-eyebrow">Chapter 7</div>
              <h3>A Family Legacy, Made to Be Shared</h3>
              <p>
                Indira Pachhi's is a tribute to <strong>Smt. Indira Rohidas Kamat</strong> and the
                culinary heritage she entrusted to the generations that followed her.
              </p>
              <p>
                From her kitchen to her granddaughter's enterprise, from a family recipe to a
                growing brand, this journey is a reminder that the most meaningful traditions are
                those we choose to preserve and share.
              </p>
              <div className="story-tribute-seal">
                <div className="seal-emblem">✦ ✦ ✦</div>
                <blockquote>
                  “One family's treasured recipes. Three generations of dedication. A tradition made
                  to be shared.”
                </blockquote>
                <div className="seal-tagline">
                  INDIRA PACHHI'S PICKLES AND CHUTNEY POWDERS
                  <br />
                  <small>A taste of tradition, lovingly preserved.</small>
                </div>
              </div>
            </article>
          </div>

          {/* Footer inside story modal */}
          <footer className="story-modal-footer">
            <button className="btn primary" onClick={onClose}>
              Back to Website <span>↑</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
