"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMotionStore } from "@/lib/store";
import { Terminal, CornerDownLeft } from "lucide-react";
import styles from "./CommandDeck.module.scss";

interface CommandItem {
  id: string;
  name: string;
  category: "Navigation" | "Projects" | "System";
  action: () => void;
  shortcut?: string;
  description?: string;
}

export function CommandDeck() {
  const isOpen = useMotionStore((s) => s.commandDeckOpen);
  const setOpen = useMotionStore((s) => s.setCommandDeckOpen);
  const lenis = useMotionStore((s) => s.lenis);
  const motionOn = useMotionStore((s) => s.motionOn);
  const setMotionOn = useMotionStore((s) => s.setMotionOn);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (hash: string) => {
    setOpen(false);
    setTimeout(() => {
      const target = document.querySelector(hash);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
        window.history.pushState(null, "", hash);
      }
    }, 150);
  };

  const commands: CommandItem[] = [
    { id: "home", name: "Jump to Intro / Hero", category: "Navigation", action: () => scrollTo("#intro") },
    { id: "about", name: "Jump to About Thesis", category: "Navigation", action: () => scrollTo("#about") },
    { id: "systems", name: "Jump to Interactive System Map", category: "Navigation", action: () => scrollTo("#systems") },
    { id: "work", name: "Jump to Selected Work Portals", category: "Navigation", action: () => scrollTo("#work") },
    { id: "builds", name: "Jump to More Builds (Microservices)", category: "Navigation", action: () => scrollTo("#builds") },
    { id: "proof", name: "Jump to Proof & Award Gallery", category: "Navigation", action: () => scrollTo("#proof") },
    { id: "coding", name: "Jump to Coding Practice & Hive Stats", category: "Navigation", action: () => scrollTo("#coding") },
    { id: "stack", name: "Jump to Technology Constellation", category: "Navigation", action: () => scrollTo("#stack") },
    { id: "journey", name: "Jump to Journey Timeline", category: "Navigation", action: () => scrollTo("#journey") },
    { id: "principles", name: "Jump to Builder Principles", category: "Navigation", action: () => scrollTo("#principles") },
    { id: "contact", name: "Jump to Contact & Links", category: "Navigation", action: () => scrollTo("#contact") },
    { id: "patchline", name: "Open PatchLine Case Study", category: "Projects", action: () => { setOpen(false); window.location.href = "/work/patchline"; } },
    { id: "crisis", name: "Open Crisis Commander Case Study", category: "Projects", action: () => { setOpen(false); window.location.href = "/work/crisis-commander"; } },
    { id: "blackbox", name: "Open BLACKBOX AI Case Study", category: "Projects", action: () => { setOpen(false); window.location.href = "/work/blackbox-ai"; } },
    { id: "motion-toggle", name: `Toggle Motion (${motionOn ? "currently ON" : "currently OFF"})`, category: "System", action: () => setMotionOn(!motionOn) },
    { id: "github", name: "Open GitHub Profile", category: "System", action: () => { window.open("https://github.com/VivenG-2007", "_blank"); setOpen(false); } },
    { id: "linkedin", name: "Open LinkedIn Profile", category: "System", action: () => { window.open("https://www.linkedin.com/in/viven-gorantla", "_blank"); setOpen(false); } },
  ];

  const filtered = commands.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.id.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea";

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (isOpen) {
      if (lenis) lenis.stop();
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      if (lenis) lenis.start();
    }
  }, [isOpen, lenis]);

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.backdrop} onClick={() => setOpen(false)}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command Deck Palette"
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            data-lenis-prevent
          >
            <div className={styles.inputBar}>
              <Terminal size={18} className={styles.termIcon} />
              <input
                ref={inputRef}
                id="command-search-input"
                type="text"
                aria-label="Search system commands and sections"
                placeholder="Type a command or section... (e.g. work, systems, motion)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownInInput}
                className={styles.input}
              />
              <kbd className={styles.escKey}>ESC</kbd>
            </div>

            <div className={styles.resultsList}>
              {filtered.length === 0 ? (
                <div className={styles.emptyState}>No matching system commands found.</div>
              ) : (
                filtered.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.item} ${idx === selectedIndex ? styles.selected : ""}`}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className={styles.categoryBadge}>{item.category}</span>
                    <span className={styles.itemName}>{item.name}</span>
                    <CornerDownLeft size={14} className={styles.enterIcon} />
                  </button>
                ))
              )}
            </div>

            <div className={styles.footerHint}>
              <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
              <span><kbd>↵</kbd> to execute</span>
              <span><kbd>ESC</kbd> to dismiss</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
