// apps/frontend/app/about/types.ts
export type AboutCopy = {
  title: string;
  mission: { title: string; ps: string[] };
  what: { title: string; p1: string };
  features: { title: string; items: string[] };
  value: { title: string; items: string[] };
  how: { title: string; p1: string };
  principles: { title: string; items: string[] };
  outcomes: { title: string; items: string[]; closer: string };
  contact: { prefix: string; link: string };
};
