import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

export default function NotFound() {
  return (
    <>
      <Navbar solid />
      <main>
        <section className="bg-cream pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px] min-h-[70vh] flex items-center">
          <Container>
            <div className="text-center max-w-[640px] mx-auto">
              <h1 className="font-serif text-ink text-[clamp(40px,5.2vw,72px)] leading-tight mb-6">
                Tohle jsme neplánovali.
              </h1>
              <p className="font-sans text-ink-soft text-lg mb-10">
                Stránka neexistuje, nebo jsme ji přejmenovali, nebo jsi udělal překlep.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-7 py-4 bg-orange text-cream font-mono text-[13px] uppercase tracking-[0.08em] font-medium rounded-[2px] hover:bg-orange-dark transition-colors mb-6"
              >
                Zpátky na domů →
              </Link>
              <div>
                <Link
                  href="/akce"
                  className="font-mono text-teal text-sm hover:underline"
                >
                  Nebo se podívej na kalendář akcí →
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
