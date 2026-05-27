# Environment Variables — Photonia.mk

Сите variables се поставуваат во Vercel Dashboard > Project > Settings > Environment Variables.
Никогаш не се commit-ираат во git.

## Supabase

| Variable | Опис | Пример |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Project URL | https://xxxx.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Anon (public) key | eyJhbGci... |
| SUPABASE_SERVICE_ROLE_KEY | Service role key (само server-side) | eyJhbGci... |

## Cloudinary

| Variable | Опис | Напомена |
|---|---|---|
| CLOUDINARY_CLOUD_NAME | Cloud name (server-side) | Скриен, не NEXT_PUBLIC_ |
| CLOUDINARY_API_KEY | API key | |
| CLOUDINARY_API_SECRET | API secret | |

**Важно:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` постои во постарата верзија на кодот.
Треба да се замени со `CLOUDINARY_CLOUD_NAME` (server-only) и signed URLs на сите места.

## LemonSqueezy

| Variable | Опис |
|---|---|
| LEMONSQUEEZY_API_KEY | API key за checkout |
| LEMONSQUEEZY_STORE_ID | Store ID |
| LEMONSQUEEZY_WEBHOOK_SECRET | За верификација на webhooks |

## Resend (е-пошта)

| Variable | Опис |
|---|---|
| RESEND_API_KEY | API key за испраќање на е-пошти |

## DNS записи (photonia.mk)

### SPF
```
TXT @ "v=spf1 include:_spf.resend.com ~all"
```

### DKIM (Resend)
```
TXT resend._domainkey "v=DKIM1; k=rsa; p=..."
```

### DMARC
```
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:legal@photonia.mk"
```

## Rotation policy

Сите API клучеви се ротираат на секои 6 месеци.
При ротација: ажурирај во Vercel, тестирај, избриши старите.
