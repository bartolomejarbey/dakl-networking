'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'O akcích',
    items: [
      {
        question: 'Kdo může přijít na akci?',
        answer:
          'Naše akce jsou určeny pro aktivní podnikatele, freelancery a profesionály, kteří chtějí rozšířit svou síť kontaktů a inspirovat se od ostatních. Pokud podnikáš nebo o podnikání uvažuješ, jsi vítán/a.',
      },
      {
        question: 'Co je zahrnuto v ceně?',
        answer:
          'V ceně vstupenky je zahrnuto vše — vstup na akci, občerstvení, nápoje, networking program a veškerý doprovodný program. Nemusíš se starat o nic dalšího.',
      },
      {
        question: 'Jaký je dress code?',
        answer:
          'Dress code závisí na typu akce. U neformálních networkingů (beach bar, grilování) stačí smart casual. U business dinner doporučujeme formálnější oblečení. Vždy to upřesníme v pozvánce.',
      },
      {
        question: 'Můžu přijít sám/sama?',
        answer:
          'Samozřejmě! Většina našich účastníků přichází sama. Celý program je navržen tak, aby ses rychle seznámil/a s ostatními. Postaráme se o to, aby ses cítil/a pohodlně.',
      },
    ],
  },
  {
    title: 'Platba a faktury',
    items: [
      {
        question: 'Jak probíhá platba?',
        answer:
          'Platba probíhá převodem na účet nebo pomocí QR kódu, který ti pošleme po registraci. Platbu je třeba provést do 48 hodin od objednávky, jinak místo uvolníme dalšímu zájemci.',
      },
      {
        question: 'Dostanu fakturu?',
        answer:
          'Ano, fakturu ti pošleme automaticky na email po přijetí platby. Faktura je vystavena jako daňový doklad a můžeš si ji uplatnit jako náklad na vzdělávání nebo reprezentaci.',
      },
    ],
  },
  {
    title: 'Storno',
    items: [
      {
        question: 'Můžu akci stornovat?',
        answer:
          'Ano, akci můžeš stornovat nejpozději 48 hodin před jejím začátkem a vrátíme ti plnou cenu. Při pozdějším stornování bohužel nemůžeme platbu vrátit, ale můžeš za sebe poslat náhradníka.',
      },
    ],
  },
  {
    title: 'Technické',
    items: [
      {
        question: 'Nedostal/a jsem potvrzovací email',
        answer:
          'Zkontroluj prosím složku spam/nevyžádaná pošta. Pokud tam email také není, napiš nám na david@daklnetworking.cz a my ti potvrzení pošleme znovu. Ujisti se, že jsi zadal/a správnou emailovou adresu při registraci.',
      },
    ],
  },
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-ink/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-sans text-ink text-lg pr-8 group-hover:text-forest transition-colors">
          {item.question}
        </span>
        <span className="font-mono text-ink-soft text-2xl shrink-0 w-8 h-8 flex items-center justify-center">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-sans text-ink-soft text-base leading-relaxed pr-12 pb-6">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Navbar solid />
      <main>
        {/* Hero */}
        <section className="bg-cream pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <h1 className="font-serif text-ink text-[clamp(40px,5.2vw,72px)] leading-tight">
              Nejčastější otázky
            </h1>
          </Container>
        </section>

        {/* FAQ Content */}
        <section className="bg-cream pb-[140px] max-md:pb-[100px]">
          <Container>
            <div className="max-w-[820px]">
              {faqData.map((category) => (
                <div key={category.title} className="mb-16 last:mb-0">
                  <h2 className="font-mono text-ink-soft text-xs uppercase tracking-widest mb-8">
                    {category.title}
                  </h2>
                  <div>
                    {category.items.map((item) => (
                      <FAQAccordionItem key={item.question} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
