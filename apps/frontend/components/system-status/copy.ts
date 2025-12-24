//apps/frontend/components/system-stateus/copy.ts

export const SYSTEM_STATUS_COPY_BY_LOCALE = {
  en: {
    headline: "System Preparation in Progress",
    subheadline: "AberoAI is preparing its operational environment.",
    body: "We’re configuring the system for structured deployment. Access will resume once initialization is complete.",
  },
  tr: {
    headline: "Sistem Hazırlığı Devam Ediyor",
    subheadline: "AberoAI, operasyonel ortamını hazırlamaktadır.",
    body: "Sistem, yapılandırılmış bir dağıtım için yapılandırılmaktadır. Başlatma tamamlandığında erişim yeniden sağlanacaktır.",
  },
} as const;

export const SYSTEM_STATUS_COLORS = {
  background: "#F9FCFD",
  headline: "#3A3A3A",
  text: "#404040",
} as const;
