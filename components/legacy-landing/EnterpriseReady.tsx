import { FileSearch, Globe, Handshake, ShieldCheck } from "lucide-react";

const COMPLIANCE = [
  {
    icon: FileSearch,
    title: "Audit Trails",
    description:
      "Every price update, data source, and calculation is logged with full provenance for regulatory review.",
  },
  {
    icon: Globe,
    title: "Jurisdiction-Aware",
    description:
      "Market access controls and reporting adapt to local regulatory requirements across operating jurisdictions.",
  },
  {
    icon: Handshake,
    title: "Partner-Led Distribution",
    description:
      "Institutional distribution through licensed partners, brokers, and regulated intermediaries.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance by Design",
    description:
      "KYC/AML, market surveillance, and trade reporting built into the core architecture — not bolted on.",
  },
];

export default function EnterpriseReady() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Built for Regulation
        </h2>
        <p className="text-muted text-lg mb-12 max-w-3xl">
          Enterprise-grade compliance infrastructure from day one.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {COMPLIANCE.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <item.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
