export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Услови на користење</h1>
      <p className="text-[#888] text-sm mb-10">Последно ажурирање: Мај 2025</p>

      <div className="flex flex-col gap-8 text-[#ccc] leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">1. Општо</h2>
          <p>
            Photonia е онлајн платформа за продажба на дигитални фотографии на македонски пазар.
            Со користење на платформата, се согласувате со овие услови.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">2. Лиценци за фотографии</h2>
          <p>Купените фотографии се достапни со три типови лиценца:</p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-2">
            <li>
              <strong className="text-[#f0f0f0]">Лична лиценца</strong> — За лична употреба, без комерцијална дистрибуција.
            </li>
            <li>
              <strong className="text-[#f0f0f0]">Комерцијална лиценца</strong> — За употреба во бизнис материјали, огласи, веб-страници.
            </li>
            <li>
              <strong className="text-[#f0f0f0]">Проширена лиценца</strong> — Неограничена употреба вклучувајќи препродажба на производи.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">3. Преземање</h2>
          <p>
            По купувањето, линковите за преземање важат 48 часа и дозволуваат максимум 3 преземања.
            Купувачите се одговорни за зачувување на фотографиите во тој период.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">4. За фотографи</h2>
          <p>
            Фотографите добиваат 80% од секоја продажба. Исплатите се вршат рачно на крај на секој месец.
            Фотографите задржуваат авторски права на своите фотографии и гарантираат дека поставените
            фотографии не нарушуваат права на трети страни.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">5. Поврат</h2>
          <p>
            Поради дигиталната природа на производите, поврат на средства не е можен откако ќе биде
            преземена фотографијата. За технички проблеми, контактирајте не.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#f0f0f0] mb-3">6. Контакт</h2>
          <p>
            За прашања:{" "}
            <a href="mailto:info@photonia.mk" className="text-[#e8c97e] hover:underline">
              info@photonia.mk
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
