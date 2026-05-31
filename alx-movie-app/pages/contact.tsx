import Button from "@/components/commons/Button";
import { useState } from "react";

const initialForm = { name: "", email: "", message: "" };

const Contact: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("success");
    setForm(initialForm);
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/20";

  return (
    <div className="text-foreground">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1485841890310-6a055c88698a?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/85 to-background" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Contact
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold md:text-6xl">
            Let&apos;s talk <span className="text-gradient">movies</span>
          </h1>
          <p className="mt-5 text-lg text-muted md:text-xl">
            Ideas, partnerships, or something broken? Send a note—we read every message.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 lg:px-10">
        <div className="grid gap-8 rounded-3xl glass-panel p-6 md:p-10 lg:grid-cols-[1.4fr_1fr]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm text-muted">
                Full name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Alex Rivera"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm text-muted">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm text-muted">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="What should we know?"
              />
            </div>
            <Button title="Send message" variant="primary" type="submit" />
            {status === "success" && (
              <p className="text-sm text-accent">Thanks—we&apos;ll get back to you shortly.</p>
            )}
          </form>

          <div className="flex flex-col justify-between gap-8 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold">Studio hours</h2>
              <p className="mt-3 text-sm text-muted">
                We&apos;re a small crew building a focused browsing experience—your feedback
                shapes the roadmap.
              </p>
            </div>
            <div className="space-y-4 text-sm text-muted">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  General
                </p>
                <p className="text-foreground/90">hello@cineseek.app</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Press
                </p>
                <p className="text-foreground/90">partners@cineseek.app</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Support
                </p>
                <p className="text-foreground/90">support@cineseek.app</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
