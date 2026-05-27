"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-gold"
    >
      Print Document
    </button>
  );
}