import Image from 'next/image'
import Link from 'next/link'
import type { BannerView, MediaValue } from '@/lib/store-data'

export function BannerSection({
  banner,
  variant,
}: {
  banner?: BannerView
  variant: 'campaign' | 'institutional'
}) {
  if (!banner) return null
  const desktop =
    typeof banner.desktopImage === 'object' ? (banner.desktopImage as MediaValue) : null
  const mobile = typeof banner.mobileImage === 'object' ? (banner.mobileImage as MediaValue) : null

  return (
    <section
      className={`mx-auto max-w-[1320px] px-5 md:px-8 lg:px-10 ${
        variant === 'institutional' ? 'py-20 lg:py-28' : 'py-14 lg:py-20'
      }`}
    >
      <div
        className={`grid overflow-hidden rounded-2xl ${
          variant === 'campaign'
            ? 'bg-[#f8e1dd] md:grid-cols-[1.15fr_.85fr]'
            : 'bg-[#dce1cf] md:grid-cols-[.9fr_1.1fr]'
        }`}
      >
        <div
          className={`relative min-h-[340px] md:min-h-[520px] ${
            variant === 'institutional' ? 'md:order-2' : ''
          }`}
        >
          {(mobile?.url || desktop?.url) && (
            <>
              {mobile?.url && (
                <Image
                  src={mobile.url}
                  alt={mobile.alt || banner.title}
                  fill
                  className="object-cover md:hidden"
                  sizes="100vw"
                />
              )}
              {desktop?.url && (
                <Image
                  src={desktop.url}
                  alt={desktop.alt || banner.title}
                  fill
                  className={`object-cover ${mobile?.url ? 'hidden md:block' : ''}`}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              )}
            </>
          )}
        </div>
        <div className="flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16">
          {banner.eyebrow && <p className="eyebrow">{banner.eyebrow}</p>}
          <h2 className="mt-4 max-w-lg font-editorial text-[38px] leading-[.98] tracking-[-.035em] md:text-5xl lg:text-[58px]">
            {banner.title}
          </h2>
          {banner.description && (
            <p className="mt-6 max-w-md text-[15px] leading-7 text-[#54564f]">
              {banner.description}
            </p>
          )}
          {banner.buttonLabel && banner.link && (
            <Link
              href={banner.link}
              className={variant === 'campaign' ? 'button-primary mt-8' : 'button-secondary mt-8'}
              target={banner.link.startsWith('http') ? '_blank' : undefined}
              rel={banner.link.startsWith('http') ? 'noreferrer' : undefined}
            >
              {banner.buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
