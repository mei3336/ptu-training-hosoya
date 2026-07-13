import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    containerRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }

      if (e.key === "Tab" && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      {/* 背景の黒幕 */}
      <div
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* モーダル本体（台座） */}
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        ref={containerRef}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
