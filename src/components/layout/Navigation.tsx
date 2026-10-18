"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMotionStore } from "@/lib/store";
import { navItems } from "@/content/site";
import { MotionToggle } from "./MotionToggle";
import { ArrowUpRight } from "lucide-react";
import styles from "./Navigation.module.scss";

export function Navigation() {
  const lenis = useMotionStore((s) => s.lenis);
  const menuOpen = useMotionStore((s) => s.menuOpen);
  const setMenuOpen = useMotionStore((s) => s.setMenuOpen);
  const setCommandDeckOpen = useMotionStore((s) => s.setCommandDeckOpen);
  const activeSection = useMotionStore((s) => s.activeSection);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <header className={`${styles.navWrap} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navBar}>
        <Link
          href="#intro"
          className={styles.wordmark}
          onClick={(e) => handleNavClick(e, "#intro")}
          aria-label="VG Viven Gorantla - Home"
        >
          <span className={styles.markBadge}>VG</span>
          <span className={styles.markText}>
            <span className="live-dot" />
            VIVEN GORANTLA
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navItems.slice(1, 7).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                activeSection === item.href.replace("#", "") ? styles.active : ""
              }`}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              <span className={styles.numeral}>{item.numeral}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.deckHint}
            onClick={() => setCommandDeckOpen(true)}
            aria-label="Open command deck (press slash)"
            title="Press / to open command deck"
          >
            <span className={styles.deckIcon}>⌘</span>
            <span className={styles.deckLabel}>INDEX</span>
            <kbd className={styles.kbd}>/</kbd>
          </button>

          <a
            href="#contact"
            className={styles.contactBtn}
            onClick={(e) => handleNavClick(e, "#contact")}
          >
            <span>Let&apos;s talk</span>
            <ArrowUpRight size={14} className={styles.contactArrow} />
          </a>

          <MotionToggle />

          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={styles.menuIcon}>
              <span className={menuOpen ? styles.barOpen1 : styles.bar} />
              <span className={menuOpen ? styles.barOpen2 : styles.bar} />
            </span>
            <span className={styles.menuText}>{menuOpen ? "CLOSE" : "MENU"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
