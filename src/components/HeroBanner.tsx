import { getImageProps } from 'next/image'
import Link from 'next/link'
import type { BannerView } from '@/lib/store-data'

export function HeroBanner({ banner }: { banner?: BannerView }) {
  const desktop = typeof banner?.desktopImage === 'object' ? banner.desktopImage : null
  const mobile = typeof banner?.mobileImage === 'object' ? banner.mobileImage : null
  const desktopUrl = desktop?.url || '/assets/hero-banner.png'
  const mobileUrl = mobile?.url || desktopUrl
  const title = banner?.title || 'Realce o que faz você ser você'
  const common = { alt: desktop?.alt || title, quality: 90, fill: true }
  const coverSizes = '(min-aspect-ratio: 16/9) 100vw, 180vh'
  // Art direction: https://nextjs.org/docs/app/api-reference/components/image#art-direction
  const { props: desktopProps } = getImageProps({ ...common, src: desktopUrl, sizes: coverSizes })
  const { props: mobileProps } = getImageProps({
    ...common,
    src: mobileUrl,
    sizes: mobileUrl === desktopUrl ? coverSizes : '100vw',
  })

  return (
    <section
      className="hero-banner relative isolate h-svh w-full bg-[#e8b1a6]"
      aria-labelledby="hero-title"
    >
      <picture className="absolute inset-x-0 bottom-0 top-[var(--announcement-height)] -z-10">
        <source
          media="(min-width: 768px)"
          srcSet={desktopProps.srcSet}
          sizes={desktopProps.sizes}
        />
        <img
          {...mobileProps}
          alt={mobile?.alt || common.alt}
          fetchPriority="high"
          loading="eager"
          className="object-cover object-[78%_center] md:object-center"
        />
      </picture>
      <div className="mx-auto flex h-full max-w-[1320px] items-end px-5 pb-8 pt-36 md:items-center md:px-8 lg:px-10">
        <div className="w-full md:max-w-[46%]">
          <p className="eyebrow hidden md:block">
            {banner?.eyebrow || 'Beleza para seu dia a dia'}
          </p>
          <h1
            id="hero-title"
            className="sr-only md:not-sr-only md:mt-4 md:font-editorial md:text-5xl md:leading-[.96] md:tracking-[-.045em] lg:text-[68px]"
          >
            {title}
          </h1>
          <p className="mt-5 hidden max-w-sm text-[15px] leading-7 text-[#3a3c36] md:block">
            {banner?.description || 'Seus favoritos de maquiagem, escolhidos com carinho.'}
          </p>
          <div className="flex justify-center md:mt-8 md:justify-start">
            <Link href={banner?.link || '/produtos'} className="button-primary shadow-sm">
              {banner?.buttonLabel || 'Explorar produtos'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
