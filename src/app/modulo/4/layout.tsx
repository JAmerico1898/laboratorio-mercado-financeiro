import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banking as a Service (BaaS) | Laboratório de Mercado Financeiro",
  description:
    "Inovação em infraestrutura bancária modular permitindo que empresas não financeiras ofereçam serviços bancários integrados via APIs.",
};

export default function Module4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
