import Footer from "@/components/Footer";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Contact</h1>
        <p className="text-sm text-muted">
          Get in touch with the ClearMarket Labs team.
        </p>

        <div className="grid gap-4">
          <div className="bg-card-bg border border-border rounded-xl p-5 flex items-start gap-4">
            <Mail size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-foreground">Email</h3>
              <p className="text-sm text-muted mt-0.5">hello@clearmarketlabs.com</p>
              <p className="text-xs text-muted mt-1">General enquiries and partnership proposals</p>
            </div>
          </div>

          <div className="bg-card-bg border border-border rounded-xl p-5 flex items-start gap-4">
            <MessageSquare size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-foreground">Support</h3>
              <p className="text-sm text-muted mt-0.5">support@clearmarketlabs.com</p>
              <p className="text-xs text-muted mt-1">Technical issues, account questions, and disputes</p>
            </div>
          </div>

          <div className="bg-card-bg border border-border rounded-xl p-5 flex items-start gap-4">
            <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-foreground">Office</h3>
              <p className="text-sm text-muted mt-0.5">London, United Kingdom</p>
              <p className="text-xs text-muted mt-1">Meetings by appointment only</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-foreground">Send a Message</h2>
          <div className="grid gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                placeholder="Name"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
              />
              <input
                placeholder="Email"
                type="email"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
              />
            </div>
            <input
              placeholder="Subject"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
            />
            <textarea
              placeholder="Your message"
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50 resize-none"
            />
            <button className="w-full py-2.5 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
