import type { IconName } from "@/lib/site";

interface IconProps {
  name: IconName;
  className?: string;
}

/**
 * Self-contained line-icon set (no external icon dependency). All icons share a
 * 24×24 viewBox and inherit `currentColor`, so size/color come from Tailwind classes.
 */
const PATHS: Record<IconName, React.ReactNode> = {
  saw: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17M3.5 12h17" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  drill: (
    <>
      <path d="M4 7h9v5H4z" />
      <path d="M13 8.2h4l3-1.2v4l-3-1.2h-4" />
      <path d="M8 12v4M6.5 20h3l-.5-4h-2z" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  wire: (
    <>
      <path d="M3 6c3 0 3 12 6 12s3-12 6-12 3 12 6 12" />
      <circle cx="3" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="21" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  demolition: (
    <>
      <path d="M13.5 3.5 17 7l-3 3-3.5-3.5a2.1 2.1 0 0 1 3-3Z" />
      <path d="m11 9-7 7v4h4l7-7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  diamond: (
    <>
      <path d="M6 4h12l3 5-9 11L3 9l3-5Z" />
      <path d="M3 9h18M9 4 6 9l6 11M15 4l3 5-6 11" />
    </>
  ),
  phone: (
    <>
      <path d="M6.5 3.5 9 4l1 4-2 1.5c.8 2 2.5 3.7 4.5 4.5L14 16l4 1 .5 2.5c.1.7-.4 1.4-1.1 1.4C9.5 21 3 14.5 3 6.6c0-.7.6-1.2 1.3-1.1Z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.6-4A8 8 0 1 1 20 11.5Z" />
      <path d="M9 8.5c.2 3 2.4 5.2 5.4 5.4.6 0 1.1-.6.9-1.2l-.3-.9-1.8.6c-1-.5-1.8-1.3-2.3-2.3l.6-1.8-.9-.3c-.6-.2-1.2.3-1.3.9Z" fill="currentColor" stroke="none" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  mapPin: (
    <>
      <path d="M12 21c4-4.5 6.5-7.6 6.5-11A6.5 6.5 0 0 0 5.5 10c0 3.4 2.5 6.5 6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M14 6l-6 6 6 6" />,
};

export default function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
