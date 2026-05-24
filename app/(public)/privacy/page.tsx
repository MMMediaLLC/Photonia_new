export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Политика на приватност</h1>
      <p className="text-[#888] text-sm mb-10">Последно ажурирање: Мај 2025</p>

      <div className="prose prose-invert max-w-none flex flex-col gap-8 text-[#ccc] leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">1. Собирање на податоци</h2>
          <p>
            Photonia собира минимални лични податоци потребни за функционирање на платформата: е-маил адреса,
            ime и информации за нарачките. Не собираме податоци надвор од она што е неопходно.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">2. Употреба на податоци</h2>
          <p>Вашите податоци ги користиме за:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1.5">
            <li>Процесирање на нарачки и плаќања</li>
            <li>Испраќање на потврди за нарачки и линкови за преземање</li>
            <li>Комуникација со фотографи за нивните исплати</li>
            <li>Подобрување на услугата</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">3. Трети страни</h2>
          <p>
            Користиме доверливи партнери: <strong>Supabase</strong> за база на податоци,
            <strong> Cloudinary</strong> за складирање на фотографии,
            <strong> LemonSqueezy</strong> за обработка на плаќања, и
            <strong> Resend</strong> за е-маил комуникација.
            Секој од нив има своја политика на приватност.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">4. Безбедност</h2>
          <p>
            Сите плаќања се обработуваат преку LemonSqueezy (merchant of record).
            Ние не складираме детали за платежни картички. Линковите за преземање истекуваат
            по 48 часа.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">5. Контакт</h2>
          <p>
            За прашања во врска со приватноста, контактирајте не на{" "}
            <a href="mailto:info@photonia.mk" className="text-[#e8c97e] hover:underline">
              info@photonia.mk
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
