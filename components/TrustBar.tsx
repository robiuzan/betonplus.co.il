import { Container } from "@/components/ui";
import Icon from "@/components/Icon";
import { trustStats } from "@/lib/site";

export default function TrustBar() {
  return (
    <div className="border-b border-line bg-white">
      <Container>
        <dl className="grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {trustStats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mist text-steel">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <span>
                <dd className="font-heading text-lg font-extrabold text-brand">{s.value}</dd>
                <dt className="text-xs text-muted">{s.label}</dt>
              </span>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
