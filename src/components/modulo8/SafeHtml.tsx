import type { ElementType } from "react";

// Renderiza HTML inline restrito (apenas <strong>, <em>, <br>) de forma sanitizada.
// Todo o resto é escapado. Conteúdo vem de scenarios.ts (confiável), mas o
// allowlist garante que nenhuma outra tag/atributo seja interpretado.
function sanitizeInline(input: string): string {
  const escaped = input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/&lt;strong&gt;/g, "<strong>")
    .replace(/&lt;\/strong&gt;/g, "</strong>")
    .replace(/&lt;em&gt;/g, "<em>")
    .replace(/&lt;\/em&gt;/g, "</em>")
    .replace(/&lt;br\s*\/?&gt;/g, "<br/>");
}

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: ElementType;
}

export default function SafeHtml({ html, className, as: Tag = "span" }: SafeHtmlProps) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizeInline(html) }} />;
}
