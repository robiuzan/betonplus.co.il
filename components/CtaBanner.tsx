import { Container, Button } from "@/components/ui";
import Icon from "@/components/Icon";
import { site, telHref, whatsappHref } from "@/lib/site";

export default function CtaBanner({
  title = "צריכים לנסר או לקדוח בטון?",
  text = "קבלו הצעת מחיר ללא התחייבות — מענה מהיר בטלפון ובוואטסאפ.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="hero-grad text-white">
      <Container className="flex flex-col items-center gap-6 py-14 text-center">
        <div>
          <h2 className="text-white text-3xl sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">{text}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href={telHref} variant="cta" className="text-base">
            <Icon name="phone" className="h-5 w-5" />
            התקשרו {site.phoneDisplay}
          </Button>
          <Button href={whatsappHref} variant="whatsapp" className="text-base">
            <Icon name="whatsapp" className="h-5 w-5" />
            שלחו וואטסאפ
          </Button>
        </div>
      </Container>
    </section>
  );
}
