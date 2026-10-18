"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMotionStore } from "@/lib/store";
import { navItems } from "@/content/site";
import { person } from "@/content/profile";
import { ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import styles from "./MenuOverlay.module.scss";

export function MenuOverlay() {
  const menuOpen = useMotionStore((s) => s.menuOpen);
  const setMenuOpen = useMotionStore((s) => s.setMenuOpen);
  const lenis = useMotionStore((s) => s.lenis);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMenuOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (lenis) lenis.start();
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen, lenis, setMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
          window.history.pushState(null, "", href);
        }, 300);
      }
    }
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className={styles.overlay}
          initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
          animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          data-lenis-prevent
        >
          <div className={styles.inner}>
            <div className={styles.header}>
              <span className={styles.monoLabel}>00 / SYSTEM DIRECTORY</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ESC [CLOSE]
              </button>
            </div>

            <div className={styles.contentGrid}>
              <nav className={styles.menuList} aria-label="Overlay navigation">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.04, duration: 0.4 }}
                  >
                    <a
                      href={item.href}
                      className={styles.linkItem}
                      onClick={(e) => handleLinkClick(e, item.href)}
                    >
                      <span className={styles.linkNum}>{item.numeral}</span>
                      <span className={styles.linkText}>{item.label}</span>
                      <span className={styles.linkArrow}>↗</span>
                    </a>
                  </motion.div>
                ))}
              </nav>

              <div className={styles.metaSidebar}>
                <div className={styles.metaBlock}>
                  <h4 className={styles.metaHeading}>BUILDER PROFILE</h4>
                  <p className={styles.metaText}>{person.name}</p>
                  <p className={styles.metaSubtext}>{person.institution}</p>
                  <p className={styles.metaSubtext}>{person.years}</p>
                </div>

                <div className={styles.metaBlock}>
                  <h4 className={styles.metaHeading}>VERIFIED LINKS</h4>
                  <div className={styles.socialLinks}>
                    <a
                      href={person.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <GithubIcon size={16} /> GitHub <ExternalLink size={12} />
                    </a>
                    <a
                      href={person.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <LinkedinIcon size={16} /> LinkedIn <ExternalLink size={12} />
                    </a>
                    <a
                      href={person.links.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      LeetCode <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className={styles.metaBlock}>
                  <h4 className={styles.metaHeading}>ARCHITECTURE SIGNAL</h4>
                  <p className={styles.signalQuote}>
                    &ldquo;The AI proposes. Software verifies. A human approves.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
