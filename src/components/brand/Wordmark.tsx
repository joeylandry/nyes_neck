type WordmarkProps = {
  tone?: "light" | "dark";
  className?: string;
};

export function Wordmark({ tone = "dark", className = "" }: WordmarkProps) {
  return (
    <span
      className={`font-heading inline-block whitespace-nowrap font-bold uppercase leading-none tracking-[0.2em] ${
        tone === "light" ? "text-white" : "text-[#161616]"
      } ${className}`}
    >
      NYES NECK
    </span>
  );
}