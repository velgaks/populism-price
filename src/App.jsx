import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================================
// DATA — усі дані додатку. Щоб додати нову програму:
// 1. Додайте об'єкт у масив programs (id, name, description,
//    annualCostUAH, year, sourceLabel, sourceUrl, notes)
// 2. Оновіть context.totalProgramsCostUAH
// 3. Оновіть meta.lastUpdated
// ============================================================
const DATA = {
  programs: [
    {
      id: "doplata-1500",
      name: "Доплата 1500 грн пенсіонерам",
      description: "Одноразова доплата для ~13 млн пенсіонерів та отримувачів соцдопомоги (квітень 2026)",
      annualCostUAH: 19500000000,
      year: "2026",
      sourceLabel: "Постанова КМУ №341 від 18.03.2026; ~13 млн отримувачів × 1500 грн",
      sourceUrl: "https://zakon.rada.gov.ua/laws/show/341-2026-%D0%BF",
      notes: "Разова виплата. Фінансується з перерозподілу існуючих бюджетних програм. Сума розрахункова (~13 млн × 1500 грн)."
    },
    {
      id: "uz-dotatsia",
      name: "Дотація Укрзалізниці",
      description: "Компенсація різниці між собівартістю та ціною пасажирських квитків",
      annualCostUAH: 16000000000,
      year: "2026",
      sourceLabel: "Розпорядження КМУ №196-р від 02.03.2026; 16 млрд з резервного фонду",
      sourceUrl: "https://www.kmu.gov.ua/npas/pro-vydilennia-koshtiv-z-rezervnoho-fondu-derzhavnoho-biudzhetu-196-020326",
      notes: "Компенсація різниці між собівартістю та ціною пасажирських квитків. Виділено з резервного фонду."
    },
    {
      id: "epidtrymka",
      name: "єПідтримка «Зимова тисяча»",
      description: "Виплата 1000 грн усім + 6500 грн вразливим категоріям (зима 2025-2026)",
      annualCostUAH: 14400000000,
      year: "2026",
      sourceLabel: "Держбюджет-2026: 14.4 млрд грн; КМУ, 13.11.2025",
      sourceUrl: "https://www.kmu.gov.ua/news/kozhen-ukrainets-zmozhe-otrymaty-tysiachu-hryven-u-mezhakh-zymovoi-pidtrymky-rishennia-uriadu",
      notes: "Бюджетна сума 14.4 млрд (10 млрд на тисячу + 4.4 млрд на 6500)."
    },
    {
      id: "shkilne-harchuvannya",
      name: "Безкоштовне харчування для ВСІХ школярів",
      description: "Розширення на всіх учнів 1-11 класів з 2026 року",
      annualCostUAH: 14400000000,
      year: "2026",
      sourceLabel: "Держбюджет-2026: 14.4 млрд грн; КМУ, грудень 2025",
      sourceUrl: "https://www.kmu.gov.ua/news/reforma-shkilnoho-kharchuvannia-2-mln-ditei-uzhe-otrymuiut-bezoplatni-hariachi-obidy-derzhava-hotuietsia-do-masshtabuvannia-prohramy",
      notes: "Частина — прифронтові області (виправдано). Дискусійно: безкоштовно для ВСІХ."
    },
    {
      id: "nats-checkup",
      name: "Національний чекап",
      description: "Програма безкоштовних медоглядів для населення",
      annualCostUAH: 10000000000,
      year: "2025-2026",
      sourceLabel: "Держбюджет-2026: 10 млрд грн у складі ПМГ (НСЗУ); МОЗ",
      sourceUrl: "https://moz.gov.ua/uk/derzhavnij-byudzhet-na-2026-rik-prijnyato-parlamentom-na-sferu-ohoroni-zdorov-ya-peredbacheno-258-6-mlrd",
      notes: "10 млрд у складі Програми медичних гарантій (191.6 млрд). Для громадян від 40 років."
    },
    {
      id: "nats-keshbek",
      name: "Національний кешбек",
      description: "Повернення 10% вартості українських товарів на спеціальну картку",
      annualCostUAH: 5600000000,
      year: "2026",
      sourceLabel: "КМУ: понад 5.6 млрд грн на підтримку виробників у 2026; резервний фонд",
      sourceUrl: "https://www.kmu.gov.ua/news/uriad-spriamuvav-ponad-56-mlrd-hrn-na-pidtrymku-ukrainskykh-vyrobnykiv-u-2026-rotsi",
      notes: "Фінансується з резервного фонду. 7.5 млн учасників. Програма завершується у травні 2026."
    },
    {
      id: "keshbek-palne",
      name: "Кешбек на пальне",
      description: "Повернення 5-15% вартості заправки. Діє 20.03 — 01.05.2026",
      annualCostUAH: 4000000000,
      year: "2026",
      sourceLabel: "Постанова КМУ №342 від 18.03.2026; ~4 млрд з резервного фонду (оцінка)",
      sourceUrl: "https://epravda.com.ua/power/keshbek-na-palne-yaki-umovi-programi-ta-zvidki-groshi-819377/",
      notes: "Не закладений у бюджет — фінансується з резервного фонду. Підтверджено виділення 2.14 млрд, очікується ще ~2 млрд."
    }
  ],
  equipment: [
    { id: "fpv-drone", name: "FPV-дрон камікадзе", unitCostUSD: 500, emoji: "💥", description: "Ударний FPV-дрон з боєприпасом ($400-600)", sourceLabel: "DronTech.com.ua; Forbes Ukraine", sourceUrl: "https://drontech.com.ua/kvadrokptery/dron-kamikadze" },
    { id: "mavic-recon", name: "DJI Mavic (розвідка)", unitCostUSD: 2000, emoji: "📡", description: "Розвідувальний дрон для коригування вогню", sourceLabel: "Ринкова ціна DJI Mavic 3, ~$2000", sourceUrl: "https://www.dji.com/mavic-3" },
    { id: "155mm-shell", name: "155-мм снаряд", unitCostUSD: 3000, emoji: "🎯", description: "Артилерійський снаряд NATO-калібру ($2000-8000)", sourceLabel: "CSIS, NATO — стандартна оцінка ~$3000", sourceUrl: "https://www.csis.org/analysis/ammunition-production" },
    { id: "mortar-120mm", name: "120-мм міна", unitCostUSD: 800, emoji: "🧨", description: "Мінометний боєприпас (~$800)", sourceLabel: "Відкриті джерела, волонтерські фонди", sourceUrl: "" },
    { id: "starlink", name: "Термінал Starlink", unitCostUSD: 600, emoji: "📶", description: "Супутниковий інтернет-термінал для підрозділу", sourceLabel: "Starlink.com — Standard Kit ~$599", sourceUrl: "https://www.starlink.com/" },
    { id: "pickup-truck", name: "Пікап для евакуації", unitCostUSD: 15000, emoji: "🚗", description: "Вживаний пікап 4×4 для фронтових потреб", sourceLabel: "Волонтерські фонди (Повернись живим)", sourceUrl: "https://savelife.in.ua/" },
  ],
  exchangeRate: { usdToUah: 43.8, date: "2026-03-24", source: "НБУ офіційний курс: 43.8288 грн/$ (24.03.2026)" },
  context: {
    defenseGapUAH: 400000000000,
    defenseGapLabel: "~400 млрд грн — діра по військових видатках",
    defenseGapSourceUrl: "https://lb.ua/economics/2026/03/12/726861_zastupnik_golovi_podatkovogo.html",
    totalProgramsCostUAH: 83900000000,
    totalProgramsCostLabel: "~83.9 млрд грн — сума всіх програм у цьому калькуляторі"
  },
  meta: {
    lastUpdated: "2026-03-25",
    author: "Валентин Гацко",
    affiliation: "KSE Center for Sociological Research",
    repoUrl: "https://github.com/velgaks/populism-price",
    methodology: "Вартість програм — бюджетні або офіційно виділені кошти на 2026 рік з держбюджету та резервного фонду. Джерела: КМУ, Мінфін, Економічна правда, РБК-Україна, Слово і Діло, УНІАН. Вартість озброєння — середні оцінки з відкритих джерел (Forbes Ukraine, DronTech, CSIS, волонтерські фонди). Курс — офіційний НБУ на 24.03.2026.",
    disclaimer: "Дані є наближеними оцінками для ілюстративних цілей. Реальна вартість може відрізнятися. Деякі програми мають соціальні ефекти — калькулятор показує лише вартісний еквівалент у військовому забезпеченні."
  }
}

// ============================================================
// Helpers
// ============================================================
function formatNumber(n) {
  return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009')
}

function formatBillions(n) {
  const b = n / 1e9
  return b % 1 === 0 ? `${b} млрд` : `${b.toFixed(1)} млрд`
}

function calcQuantity(costUAH, unitCostUSD) {
  return Math.floor(costUAH / DATA.exchangeRate.usdToUah / unitCostUSD)
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

// ============================================================
// useCountUp hook — animates a number from 0 to target
// ============================================================
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const prevTarget = useRef(target)

  useEffect(() => {
    const startVal = prevTarget.current === target ? 0 : 0
    prevTarget.current = target
    if (target === 0) { setValue(0); return }

    const startTime = performance.now()
    let raf
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.floor(easeOutExpo(progress) * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

// ============================================================
// LiveCounter — ticking UAH spent since page load
// ============================================================
function LiveCounter({ costPerYear, programName }) {
  const [spent, setSpent] = useState(0)
  const startTimeRef = useRef(Date.now())
  const costPerMs = costPerYear / (365 * 24 * 60 * 60 * 1000)

  useEffect(() => {
    startTimeRef.current = Date.now()
    setSpent(0)
    const interval = setInterval(() => {
      setSpent((Date.now() - startTimeRef.current) * costPerMs)
    }, 80)
    return () => clearInterval(interval)
  }, [costPerYear, costPerMs])

  const dronesEquiv = spent / DATA.exchangeRate.usdToUah / 500

  return (
    <div className="text-center py-8">
      <div className="text-sm uppercase tracking-[0.2em] text-gray-400 font-body mb-3">
        Витрачено, поки ви на цій сторінці
      </div>
      <div className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-gold-400 tabular-nums tracking-tight">
        ₴{formatNumber(spent)}
      </div>
      <div className="mt-3 text-base text-gray-400 font-body">
        це ще <span className="text-gold-500 font-semibold">{dronesEquiv.toFixed(1)}</span> FPV-дронів
      </div>
      <div className="mt-1 text-xs text-gray-600">
        {programName}
      </div>
    </div>
  )
}

// ============================================================
// ProgramSelector
// ============================================================
function ProgramSelector({ selected, onSelect }) {
  const isTotal = selected === 'total'

  return (
    <section className="px-4 sm:px-6 max-w-4xl mx-auto">
      <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-5 tracking-tight">
        Оберіть програму
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DATA.programs.map(p => {
          const active = selected === p.id
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`group relative text-left px-5 py-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                active
                  ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_24px_rgba(212,160,23,0.15)]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`font-body font-semibold text-sm leading-snug ${active ? 'text-gold-400' : 'text-white'}`}>
                {p.name}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`font-display text-base font-bold ${active ? 'text-gold-400' : 'text-gray-300'}`}>
                  ₴{formatBillions(p.annualCostUAH)}
                </span>
                {p.sourceUrl && (
                  <a
                    href={p.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[10px] text-gray-500 hover:text-gold-500 underline decoration-dotted underline-offset-2 transition-colors"
                  >
                    джерело
                  </a>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1 leading-relaxed">{p.description}</div>
              {active && (
                <div className="absolute -left-px top-3 bottom-3 w-[3px] rounded-full bg-gold-500" />
              )}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => onSelect('total')}
        className={`mt-3 w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 cursor-pointer ${
          isTotal
            ? 'border-gold-500 bg-gold-500/15 shadow-[0_0_32px_rgba(212,160,23,0.2)]'
            : 'border-gold-500/20 bg-gold-500/[0.03] hover:border-gold-500/40 hover:bg-gold-500/[0.06]'
        }`}
      >
        <div className={`font-display text-sm font-bold ${isTotal ? 'text-gold-400' : 'text-gold-500/70'}`}>
          УСЬОГО: ₴{formatBillions(DATA.context.totalProgramsCostUAH)}
        </div>
        <div className="text-xs text-gray-500 mt-1">Сума всіх {DATA.programs.length} програм у цьому калькуляторі</div>
      </button>
    </section>
  )
}

// ============================================================
// EquipmentCard
// ============================================================
function EquipmentCard({ item, quantity }) {
  const animated = useCountUp(quantity)
  const perDay = Math.floor(quantity / 365)

  return (
    <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]">
      <div className="text-3xl mb-3">{item.emoji}</div>
      <div className="font-display text-2xl sm:text-3xl font-black text-white tabular-nums">
        {formatNumber(animated)}
      </div>
      <div className="font-body text-sm font-semibold text-gray-300 mt-1">
        {item.name}
      </div>
      <div className="text-xs text-gray-500 mt-2 leading-relaxed">
        {item.description}
      </div>
      {perDay > 0 && (
        <div className="text-xs text-gold-500/70 mt-2 font-medium">
          ~{formatNumber(perDay)} на кожен день року
        </div>
      )}
      {/* Icon visualization — up to 80 icons */}
      {quantity > 0 && (
        <div className="mt-3 flex flex-wrap gap-[2px] opacity-30 leading-none text-[8px]">
          {Array.from({ length: Math.min(Math.ceil(quantity / Math.max(Math.floor(quantity / 60), 1)), 80) }, (_, i) => (
            <span key={i}>{item.emoji}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// ResultsGrid
// ============================================================
function ResultsGrid({ costUAH }) {
  return (
    <section className="px-4 sm:px-6 max-w-4xl mx-auto mt-12">
      <h2 className="font-display text-lg sm:text-xl font-bold text-white mb-5 tracking-tight">
        На цю суму можна купити
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {DATA.equipment.map(item => (
          <EquipmentCard
            key={item.id}
            item={item}
            quantity={calcQuantity(costUAH, item.unitCostUSD)}
          />
        ))}
      </div>
    </section>
  )
}

// ============================================================
// ContextBlock — defense gap %, daily equivalents
// ============================================================
function ContextBlock({ costUAH }) {
  const pct = ((costUAH / DATA.context.defenseGapUAH) * 100).toFixed(1)
  const dailyCostUAH = costUAH / 365
  const dailyDrones = Math.floor(dailyCostUAH / DATA.exchangeRate.usdToUah / 500)
  const dailyCostFormatted = formatNumber(dailyCostUAH)

  return (
    <section className="px-4 sm:px-6 max-w-4xl mx-auto mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">Дефіцит на оборону</div>
          <div className="font-display text-2xl font-bold text-gold-400">{pct}%</div>
          <div className="text-xs text-gray-500 mt-1">від діри у {formatBillions(DATA.context.defenseGapUAH)} на військові видатки</div>
          {/* progress bar */}
          <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(parseFloat(pct), 100)}%` }}
            />
          </div>
          <a
            href={DATA.context.defenseGapSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-600 hover:text-gold-500 underline decoration-dotted underline-offset-2 mt-2 inline-block transition-colors"
          >
            Железняк, ВРУ, 12.03.2026
          </a>
        </div>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
          <div className="text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">За один день програми</div>
          <div className="font-display text-2xl font-bold text-white">₴{dailyCostFormatted}</div>
          <div className="text-xs text-gray-500 mt-1">
            = <span className="text-gold-400 font-semibold">{formatNumber(dailyDrones)}</span> FPV-дронів щодня
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// ShareButton
// ============================================================
function ShareButton({ programName, costUAH }) {
  const [copied, setCopied] = useState(false)
  const drones = calcQuantity(costUAH, 500)
  const siteUrl = 'https://velgaks.github.io/populism-price/'

  const handleShare = useCallback(() => {
    const text = `Ціна популізму: ${programName} = ₴${formatBillions(costUAH)} = ${formatNumber(drones)} FPV-дронів.\nПеревір: ${siteUrl}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [programName, costUAH, drones])

  return (
    <section className="px-4 sm:px-6 max-w-4xl mx-auto mt-10 flex justify-center">
      <button
        onClick={handleShare}
        className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-graphite-900 font-body font-bold text-sm transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,160,23,0.3)] cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? 'Скопійовано!' : 'Поділитися'}
      </button>
    </section>
  )
}

// ============================================================
// Footer — methodology, sources, disclaimer
// ============================================================
function Footer() {
  const [open, setOpen] = useState(false)

  return (
    <footer className="px-4 sm:px-6 max-w-4xl mx-auto mt-16 mb-12">
      <div className="border-t border-white/[0.06] pt-8">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          <svg className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Методологія та джерела
        </button>

        {open && (
          <div className="mt-4 space-y-4 text-xs text-gray-500 leading-relaxed animate-[fadeIn_0.3s_ease]">
            <p>{DATA.meta.methodology}</p>
            <p className="text-gray-600 italic">{DATA.meta.disclaimer}</p>
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-gray-600 mb-2">Джерела програм</div>
              <ul className="space-y-1">
                {DATA.programs.map(p => (
                  <li key={p.id}>
                    <span className="text-gray-400">{p.name}:</span>{' '}
                    {p.sourceUrl ? (
                      <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gold-500/60 hover:text-gold-400 underline decoration-dotted underline-offset-2 transition-colors">{p.sourceLabel}</a>
                    ) : (
                      <span>{p.sourceLabel}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-gray-600 mb-2">Вартість озброєння</div>
              <ul className="space-y-1">
                {DATA.equipment.map(e => (
                  <li key={e.id}>
                    <span className="text-gray-400">{e.name} (${e.unitCostUSD}):</span>{' '}
                    {e.sourceUrl ? (
                      <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gold-500/60 hover:text-gold-400 underline decoration-dotted underline-offset-2 transition-colors">{e.sourceLabel}</a>
                    ) : (
                      <span>{e.sourceLabel}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-gray-600">
              Курс: {DATA.exchangeRate.source}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <div>
            <span className="text-gray-400">{DATA.meta.author}</span>
            <span className="mx-1.5">·</span>
            <span>{DATA.meta.affiliation}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={DATA.meta.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-500 hover:text-gold-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <span className="text-gray-700">·</span>
            <span>Дані та код — відкриті</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// App — root component
// ============================================================
export default function App() {
  const [selectedId, setSelectedId] = useState(DATA.programs[0].id)

  const selectedProgram = selectedId === 'total'
    ? { name: 'Усі програми', annualCostUAH: DATA.context.totalProgramsCostUAH, description: '' }
    : DATA.programs.find(p => p.id === selectedId)

  const costUAH = selectedProgram.annualCostUAH

  return (
    <div className="min-h-screen pb-4">
      {/* Hero */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        <div className="mb-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-500/60 font-body font-semibold">
          Інтерактивний калькулятор
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight">
          Ціна
          <br />
          <span className="text-gold-400">популізму</span>
        </h1>
        <p className="mt-4 font-body text-sm sm:text-base text-gray-400 max-w-lg leading-relaxed">
          Скільки дронів, снарядів і пікапів можна купити замість державних роздач
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/[0.08] border border-red-500/[0.15]">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400/80 font-body">
            Дефіцит на оборону — ~{formatBillions(DATA.context.defenseGapUAH)} грн
          </span>
        </div>
      </header>

      {/* Live counter */}
      <div className="max-w-4xl mx-auto mt-6">
        <LiveCounter costPerYear={costUAH} programName={selectedProgram.name} />
      </div>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Program selector */}
      <ProgramSelector selected={selectedId} onSelect={setSelectedId} />

      {/* Results */}
      <ResultsGrid costUAH={costUAH} />

      {/* Context */}
      <ContextBlock costUAH={costUAH} />

      {/* Share */}
      <ShareButton programName={selectedProgram.name} costUAH={costUAH} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
