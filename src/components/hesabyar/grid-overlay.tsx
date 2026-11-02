// ─── حساب‌یار ─── گرید ادیتوریال پس‌زمینه ───
// خط‌های عمودی مویی + نقطه‌های شناور آرام، برای حس صفحه‌آراییِ چاپی.

const DRIFT_DURATIONS = [22, 30, 26, 34, 28, 24, 32, 27, 36, 29];
const DRIFT_DELAYS = [-4, -13, -8, -19, -2, -16, -6, -21, -10, -14];

export function GridOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      {/* خط افقی زیر هدر */}
      <div
        className="absolute inset-x-6 top-16 h-px sm:inset-x-10"
        style={{ background: "var(--grid-line)" }}
      />
      {/* پنج خط عمودی */}
      <div className="absolute inset-x-6 inset-y-0 flex justify-between sm:inset-x-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="grid-hairline relative h-full"
            style={
              i === 2
                ? { marginTop: 64, height: "calc(100% - 64px)" }
                : undefined
            }
          >
            <span
              className="grid-drift-dot"
              style={{
                animationDuration: `${DRIFT_DURATIONS[i * 2]}s`,
                animationDelay: `${DRIFT_DELAYS[i * 2]}s`,
              }}
            />
            <span
              className="grid-drift-dot"
              style={{
                animationDuration: `${DRIFT_DURATIONS[i * 2 + 1]}s`,
                animationDelay: `${DRIFT_DELAYS[i * 2 + 1]}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
