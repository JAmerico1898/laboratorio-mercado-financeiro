"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message }),
      });

      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="mx-auto max-w-xl px-6 pb-20 pt-12">
      <div className="mb-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-primary-container font-semibold hover:opacity-70 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="text-xs font-bold uppercase tracking-widest">
            Voltar
          </span>
        </button>
      </div>

      <h1 className="font-headline text-3xl font-extrabold text-primary mb-2 sm:text-4xl">
        Entre em contato
      </h1>
      <p className="text-on-surface-variant mb-8">
        Envie sua dúvida, sugestão ou comentário diretamente ao professor.
      </p>

      {status === "sent" ? (
        <div className="rounded-xl bg-secondary/10 border border-secondary/30 p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-secondary mb-2">
            check_circle
          </span>
          <p className="text-lg font-bold text-secondary">
            Mensagem enviada com sucesso!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Nome (opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Email (opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Mensagem <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva sua mensagem..."
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-on-surface placeholder:text-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors resize-y"
            />
          </div>

          {status === "error" && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              Erro ao enviar mensagem. Tente novamente.
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl px-6 py-3 font-bold text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(0,219,231,0.15)]"
          >
            {status === "sending" ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      )}
    </main>
  );
}
