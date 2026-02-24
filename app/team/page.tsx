import Footer from "@/components/Footer";

const TEAM = [
  {
    name: "Cedric Boutsen",
    role: "CSO",
    background: "Fidinam, Boutsen Classic, RM Sotheby's",
    initials: "CB",
  },
  {
    name: "Craig Inglis",
    role: "CEO",
    background: "RTX, SHG, Ubiquity, BOHO",
    initials: "CI",
  },
  {
    name: "Will Wilde",
    role: "CTO",
    background: "ShareMatch, Jersey Trust",
    initials: "WW",
  },
  {
    name: "Phil Crosbie",
    role: "C3O / Head of Web3",
    background: "Superteam, Colosseum, Ignition, Breakout",
    initials: "PC",
  },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-4">
            Who We Are
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            The Labs Team
          </h1>
          <p className="text-lg text-muted max-w-2xl mb-16">
            A multidisciplinary team across finance, technology, and regulated
            markets — building institutional infrastructure for real-world
            commodities.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="p-6 rounded-xl bg-card border border-border text-center"
              >
                {/* Avatar placeholder */}
                <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">
                    {member.initials}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-medium mt-1">
                  {member.role}
                </p>
                <p className="text-xs text-muted mt-2">{member.background}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
