import Script from 'next/script'

export default function GoogleAdsense() {
  return (
    <Script
      async
      strategy="lazyOnload"
      crossOrigin="anonymous"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1292337100623505"
    />
  )
}
