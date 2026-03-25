export type VaccineEntry = {
  type: string;
  count: string;
  date: string;
};

export type HepBEntry = {
  type: string;
  count: string;
  date: string;
  firstDate: string;
};

export type MrEntry = {
  type: string;
  count: string;
  date: string;
};

export type FormValues = {
  birthday: string;
  rota: VaccineEntry;
  hib: VaccineEntry;
  hai: VaccineEntry;
  bcg: string;
  yon: VaccineEntry;
  go: VaccineEntry;
  hb: HepBEntry;
  mr: MrEntry;
  sui: VaccineEntry;
  mumpus: VaccineEntry;
  niti: VaccineEntry;
};

export const vaccineTypeOptions = [
  "なし",
  "ロタリックス",
  "ロタテック",
  "ヒブ",
  "肺炎球菌",
  "四種混合",
  "五種混合",
  "B型肝炎",
  "MR",
  "水痘",
  "ムンプス",
  "日本脳炎",
] as const;

export const countOptions = [
  "未接種",
  "1回目",
  "2回目",
  "3回目",
  "追加",
  "不明",
] as const;

export const mrCountOptions = [
  "未接種",
  "1期",
  "2期",
  "不明",
] as const;

export const emptyFormValues = (): FormValues => ({
  birthday: "",
  rota: { type: "なし", count: "未接種", date: "" },
  hib: { type: "なし", count: "未接種", date: "" },
  hai: { type: "なし", count: "未接種", date: "" },
  bcg: "",
  yon: { type: "なし", count: "未接種", date: "" },
  go: { type: "なし", count: "未接種", date: "" },
  hb: { type: "なし", count: "未接種", date: "", firstDate: "" },
  mr: { type: "なし", count: "未接種", date: "" },
  sui: { type: "なし", count: "未接種", date: "" },
  mumpus: { type: "なし", count: "未接種", date: "" },
  niti: { type: "なし", count: "未接種", date: "" },
});