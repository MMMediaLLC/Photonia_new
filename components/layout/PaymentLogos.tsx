/**
 * Trust signals — accepted payment methods.
 * Monochrome, dark-friendly SVG marks. Brand-recognisable but not brand-aggressive,
 * so they sit cleanly in any context (footer, checkout, etc.).
 */
export default function PaymentLogos({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  // Each card uses the same height; widths follow the actual aspect ratio.
  const h = size;
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="Прифатени начини на плаќање">
      <VisaMark height={h} />
      <MastercardMark height={h} />
      <AmexMark height={h} />
      <PaypalMark height={h} />
    </div>
  );
}

function CardBox({
  children,
  width,
  height,
  viewBox,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
  viewBox: string;
}) {
  return (
    <div
      style={{ width, height }}
      className="flex items-center justify-center rounded-md bg-white/[0.04] border border-white/[0.08] px-2"
    >
      <svg
        viewBox={viewBox}
        width="100%"
        height="60%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {children}
      </svg>
    </div>
  );
}

function VisaMark({ height }: { height: number }) {
  const w = (height * 50) / 28;
  return (
    <CardBox width={w} height={height} viewBox="0 0 64 22">
      <text
        x="32"
        y="17"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="18"
        fontStyle="italic"
        fill="#f0f0f0"
        letterSpacing="1"
      >
        VISA
      </text>
    </CardBox>
  );
}

function MastercardMark({ height }: { height: number }) {
  const w = (height * 50) / 28;
  return (
    <CardBox width={w} height={height} viewBox="0 0 44 28">
      <circle cx="17" cy="14" r="10" fill="#f0f0f0" opacity="0.85" />
      <circle cx="27" cy="14" r="10" fill="#888" opacity="0.6" />
    </CardBox>
  );
}

function AmexMark({ height }: { height: number }) {
  const w = (height * 50) / 28;
  return (
    <CardBox width={w} height={height} viewBox="0 0 64 22">
      <text
        x="32"
        y="16"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="12"
        fill="#f0f0f0"
        letterSpacing="0.5"
      >
        AMEX
      </text>
    </CardBox>
  );
}

function PaypalMark({ height }: { height: number }) {
  const w = (height * 58) / 28;
  return (
    <CardBox width={w} height={height} viewBox="0 0 72 22">
      <text
        x="36"
        y="17"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="14"
        fontStyle="italic"
        fill="#f0f0f0"
        letterSpacing="-0.2"
      >
        PayPal
      </text>
    </CardBox>
  );
}
