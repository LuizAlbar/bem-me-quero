import Link from 'next/link'

export function SectionHeading({
  eyebrow,
  title,
  text,
  href,
  linkLabel,
}: {
  eyebrow: string
  title: string
  text?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-3 max-w-2xl">{title}</h2>
        {text && <p className="mt-4 max-w-xl text-[15px] leading-6 text-muted">{text}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex min-h-11 w-fit items-center text-sm font-semibold text-brand underline decoration-[#a4af85] underline-offset-4"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
