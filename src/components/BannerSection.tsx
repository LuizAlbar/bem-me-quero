import Image from 'next/image'
import Link from 'next/link'
import type { BannerView, SettingsView } from '@/lib/store-data'
import { resolveStoreLink } from '@/lib/contact-links'
import campaignPhoto from '../../assets/sessions/banner-2.png'
import institutionalPhoto from '../../assets/sessions/banner-3.png'
import { Reveal } from '@/components/Reveal'

export function BannerSection({
  banner,
  variant,
  settings,
}: {
  banner?: BannerView
  variant: 'campaign' | 'institutional'
  settings: SettingsView
}) {
  if (!banner) return null
  const href = banner.link ? resolveStoreLink(banner.link, settings) : null
  const isCampaign = variant === 'campaign'
  const Frame = isCampaign ? Reveal : 'div'

  return (
    <section className="editorial-spacing mx-auto max-w-[1320px] px-5 md:px-8 lg:px-10">
      <Frame
        className={`editorial-panel grid overflow-hidden ${
          variant === 'campaign'
            ? 'bg-blush lg:grid-cols-[1.1fr_.9fr]'
            : 'bg-[#dce1cf] md:grid-cols-[.9fr_1.1fr]'
        }`}
      >
        <div
          className={`relative ${isCampaign ? 'aspect-[920/705] lg:aspect-auto lg:min-h-[500px]' : 'min-h-[340px] md:min-h-[500px]'} ${
            variant === 'institutional' ? 'md:order-2' : ''
          }`}
        >
          <Image
            src={isCampaign ? campaignPhoto : institutionalPhoto}
            alt={
              isCampaign
                ? 'Seleção de maquiagem com batom, máscara de cílios, blush e gloss sobre fundo rosa'
                : 'Composição de cosméticos em tons rosados, com batom vermelho sobre fundo claro'
            }
            fill
            className={`object-cover ${isCampaign ? 'object-center' : 'object-right'}`}
            sizes={
              isCampaign
                ? '(max-width: 1023px) calc(100vw - 40px), (max-width: 1319px) 55vw, 680px'
                : '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(55vw - 35px), (max-width: 1319px) calc(55vw - 44px), 682px'
            }
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-12 lg:px-12">
          {banner.eyebrow && <p className="eyebrow">{banner.eyebrow}</p>}
          <h2 className="section-title mt-4 max-w-lg">{banner.title}</h2>
          {banner.description && (
            <p className="mt-5 max-w-md text-[15px] leading-7 text-ink/85">{banner.description}</p>
          )}
          {banner.buttonLabel && href && (
            <Link
              href={href}
              className={variant === 'campaign' ? 'button-primary mt-8' : 'button-secondary mt-8'}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {banner.buttonLabel}
            </Link>
          )}
        </div>
      </Frame>
    </section>
  )
}
