# Pre-Launch Checklist — Photonia.mk

## Правни документи

- [ ] /legal/terms — Услови за користење се достапни и читливи
- [ ] /legal/license — Договор за лиценца со do/don't табели
- [ ] /legal/privacy — Политика за приватност со сите sub-processors
- [ ] /legal/cookies — Политика за колачиња со табела
- [ ] /legal/editorial-notice — Editorial напомена со забранети контексти
- [ ] /legal/takedown — Процедура за бришење со рокови
- [ ] /legal/refund — Политика за поврат со EU CRD член 16(м)
- [ ] /legal/dmca — DMCA процедура со 6 задолжителни елементи
- [ ] Сите footer линкови водат до вистинските рути
- [ ] Нема употреба на цртата (—) во user-facing текстови

## Checkout и купување

- [ ] Refund waiver checkbox е задолжителен пред плаќање
- [ ] Editorial disclaimer checkbox е задолжителен пред плаќање
- [ ] Копчето "Плати" е неактивно додека не се прифатат двата checkbox
- [ ] Линковите кон /legal/terms и /legal/privacy во RegisterForm работат
- [ ] LemonSqueezy checkout работи end-to-end (тест нарачка)
- [ ] Download линк се генерира по успешно плаќање (webhook)
- [ ] Download линк важи 365 дена (проверка во код)
- [ ] Лимитот од 3 преземања работи правилно

## Cloudinary и слики

- [ ] Preview слики имаат видлив watermark (PHOTONIA diagonal)
- [ ] Preview слики се ограничени на 1200px и quality 60
- [ ] Оригиналите се достапни само преку signed URLs
- [ ] Signed URL expiry за download е поставен (1 час во download route)
- [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME е скриено (не е изложено во HTML)
- [ ] Преземен оригинал навистина нема watermark

## Security

- [ ] robots.txt блокира GPTBot, Claude-Web, CCBot, anthropic-ai, Google-Extended
- [ ] Security headers се поставени (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- [ ] X-Powered-By header е отстранет
- [ ] Admin рутите (/admin/*) се заштитени со middleware
- [ ] Dashboard рутите (/dashboard/*) се заштитени
- [ ] /api/* рути не враќаат stack traces во production
- [ ] Сите environment variables се во Vercel, не во .env commit-ирани

## Email инфраструктура

- [ ] SPF record за photonia.mk е поставен
- [ ] DKIM record за Resend/Postmark е поставен
- [ ] DMARC record е поставен (p=quarantine или p=reject)
- [ ] info@photonia.mk inbox работи
- [ ] privacy@photonia.mk inbox работи
- [ ] support@photonia.mk inbox работи
- [ ] legal@photonia.mk inbox работи
- [ ] Magic link е-пошта пристигнува (тест)
- [ ] Order confirmation е-пошта пристигнува (тест)

## Аналитика и мониторинг

- [ ] Plausible Analytics е интегриран (cookieless режим)
- [ ] UptimeRobot или Better Uptime е поставен за photonia.mk
- [ ] Cookie banner се прикажува за нови посетители
- [ ] Cookie banner не се прикажува по прифаќање

## SEO и мета

- [ ] Open Graph meta tags се поставени на homepage
- [ ] Сите страни имаат уникатен title и description
- [ ] sitemap.xml постои на /sitemap.xml
- [ ] canonical URLs се поставени

## Функционалност

- [ ] Magic link login работи end-to-end
- [ ] Gallery list страница прикажува галерии
- [ ] Поединечна галерија прикажува фотографии со watermark
- [ ] Кошничка (CartDrawer) работи
- [ ] Checkout flow работи за нов корисник
- [ ] Checkout flow работи за постоечки корисник
- [ ] /account/downloads прикажува купените слики
- [ ] 404 страница прикажува брендирана порака
- [ ] Error страница прикажува брендирана порака

## DNS записи (за проверка)

- [ ] A/CNAME за photonia.mk → Vercel
- [ ] MX записи за photonia.mk (е-пошта)
- [ ] TXT запис за SPF
- [ ] TXT запис за DKIM (Resend/Postmark)
- [ ] TXT запис за DMARC

## Пост-лансирање (прва недела)

- [ ] Тест купување со вистинска картичка
- [ ] Тест за takedown барање (испрати на privacy@photonia.mk)
- [ ] Проверка на Plausible dashboard
- [ ] Проверка на Supabase dashboard (нарачки, корисници)
- [ ] Backup на Supabase database (мануелно или автоматски)
