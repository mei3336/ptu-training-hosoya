import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      {/* 背景の黒幕 */}
      <div
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* モーダル本体（台座） */}
      <div className="modal-container">
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
