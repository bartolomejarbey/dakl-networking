import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

export default function PodminkyPage() {
  return (
    <>
      <Navbar solid />
      <main>
        <section className="bg-cream pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <div className="max-w-[720px] mx-auto">
              <h1 className="font-serif text-ink text-[clamp(40px,5.2vw,72px)] leading-tight mb-16">
                Obchodní podmínky
              </h1>

              <div className="space-y-12">
                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">1. Úvodní ustanovení</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi provozovatelem
                    platformy Conventus (dále jen &quot;Pořadatel&quot;) a účastníky akcí (dále jen
                    &quot;Účastník&quot;). Pořadatelem je David Kladišovský, IČO: 12345678, se sídlem
                    v Praze, Česká republika. Tyto podmínky se vztahují na všechny akce pořádané pod
                    značkou Conventus a jsou závazné pro všechny účastníky od okamžiku zakoupení
                    vstupenky.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">2. Objednávka a platba</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Objednávka vstupenky je závazná okamžikem jejího odeslání prostřednictvím
                    webového formuláře na stránkách conventus.cz. Po odeslání objednávky obdrží
                    Účastník potvrzení na uvedenou emailovou adresu spolu s platebními údaji.
                    Platba musí být provedena do 48 hodin od objednání, a to bankovním převodem
                    nebo prostřednictvím QR kódu. Pokud platba není připsána na účet Pořadatele
                    v uvedené lhůtě, objednávka se automaticky ruší a místo je uvolněno dalšímu
                    zájemci. Faktura je vystavena a odeslána automaticky po přijetí platby.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">3. Storno podmínky</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Účastník má právo svou účast stornovat nejpozději 48 hodin před začátkem akce.
                    V takovém případě bude Účastníkovi vrácena plná cena vstupenky na bankovní
                    účet, ze kterého byla platba provedena, a to do 14 pracovních dnů. Při stornování
                    méně než 48 hodin před začátkem akce nemá Účastník nárok na vrácení platby.
                    Účastník má však možnost za sebe poslat náhradníka, pokud tuto skutečnost oznámí
                    Pořadateli nejpozději 24 hodin před začátkem akce. Pořadatel si vyhrazuje právo
                    akci zrušit z důvodu vyšší moci nebo nedostatečného počtu účastníků. V takovém
                    případě bude všem účastníkům vrácena plná cena vstupenky.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">4. Odpovědnost</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Pořadatel odpovídá za řádné zajištění akce v souladu s jejím popisem na webových
                    stránkách. Pořadatel neodpovídá za škody vzniklé v důsledku jednání Účastníka
                    nebo třetích osob, ani za škody vzniklé v důsledku vyšší moci. Účastník se
                    zavazuje dodržovat pokyny Pořadatele a respektovat pravidla místa konání akce.
                    Pořadatel si vyhrazuje právo vykázat z akce Účastníka, který hrubě porušuje
                    pravidla chování nebo ohrožuje bezpečnost ostatních účastníků, a to bez nároku
                    na vrácení vstupného.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-ink text-2xl mb-4">5. Závěrečná ustanovení</h2>
                  <p className="font-serif text-ink-soft text-base leading-relaxed">
                    Tyto obchodní podmínky nabývají účinnosti dnem jejich zveřejnění na webových
                    stránkách conventus.cz. Pořadatel si vyhrazuje právo tyto podmínky kdykoli
                    změnit. O změnách bude Pořadatel informovat prostřednictvím webových stránek.
                    Pro objednávky učiněné před změnou podmínek platí podmínky platné v okamžiku
                    odeslání objednávky. Vztahy neupravené těmito podmínkami se řídí právním řádem
                    České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník.
                  </p>
                </section>
              </div>

              <p className="font-mono text-ink-soft text-xs mt-16">
                Poslední aktualizace: duben 2026
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
