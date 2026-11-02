// ─── حساب‌یار ─── نشان برند: سکهٔ برنز با ترازوی دخل و خرج ───

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="نشان حساب‌یار"
    >
      <defs>
        <linearGradient id="hy-bronze-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0b06a" />
          <stop offset="0.55" stopColor="#c08a3e" />
          <stop offset="1" stopColor="#8a5720" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#hy-bronze-g)" />
      <circle
        cx="24"
        cy="24"
        r="21"
        fill="none"
        stroke="rgba(255,248,236,0.35)"
        strokeWidth="1.4"
      />
      <circle cx="24" cy="24" r="16.5" fill="none" stroke="rgba(26,18,7,0.18)" strokeWidth="1" />
      {/* ترازو */}
      <g stroke="#1a1207" strokeLinecap="round" fill="none">
        <circle cx="24" cy="12.2" r="1.7" fill="#1a1207" stroke="none" />
        <path d="M12.5 17h23" strokeWidth="2.2" />
        <path d="M24 13.9v18.6" strokeWidth="2.2" />
        <path d="M17.5 34.5h13" strokeWidth="2.2" />
        <path d="M12.5 17l-3.3 7.2M12.5 17l3.3 7.2" strokeWidth="1.5" />
        <path d="M35.5 17l-3.3 7.2M35.5 17l3.3 7.2" strokeWidth="1.5" />
      </g>
      <path d="M7.4 24.6a5.1 5.1 0 0 0 10.2 0Z" fill="#1a1207" />
      <path d="M30.4 24.6a5.1 5.1 0 0 0 10.2 0Z" fill="#1a1207" />
    </svg>
  );
}
