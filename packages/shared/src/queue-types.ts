export type InboundWaJob = {
  tenantId: string;
  from: string; // nomor pengirim
  to: string; // nomor kita
  waMessageId: string;
  content: string;
};

export type OutboundWaJob = {
  tenantId: string;
  to: string; // nomor tujuan
  content: string;
};
