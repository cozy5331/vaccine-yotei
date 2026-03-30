import VaccinationForm from "@/components/VaccinationForm";
import { FormValues, emptyFormValues } from "@/lib/types";

type FormPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getString(
  value: string | string[] | undefined,
  fallback = ""
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return value ?? fallback;
}

function buildInitialValues(
  params: Record<string, string | string[] | undefined>
): FormValues {
  const form = emptyFormValues();

  form.birthday = getString(params.birthday);

  form.rota.type = getString(params.rota_syu, "なし");
  form.rota.count = getString(params.rota_kai, "未接種");
  form.rota.date = getString(params.rota_hi);

  form.hib.type = getString(params.hib, "なし");
  form.hib.count = getString(params.hib_kai, "未接種");
  form.hib.date = getString(params.hib_hi);

  form.hai.type = getString(params.hai, "なし");
  form.hai.count = getString(params.hai_kai, "未接種");
  form.hai.date = getString(params.hai_hi);

  form.bcg = getString(params.bcg);

  form.yon.type = getString(params.yon, "なし");
  form.yon.count = getString(params.yon_kai, "未接種");
  form.yon.date = getString(params.yon_hi);

  form.go.type = getString(params.go, "なし");
  form.go.count = getString(params.go_kai, "未接種");
  form.go.date = getString(params.go_hi);

  form.hb.type = getString(params.hb, "なし");
  form.hb.count = getString(params.hb_kai, "未接種");
  form.hb.date = getString(params.hb_hi);
  form.hb.firstDate = getString(params.hb1_hi);

  form.mr.type = getString(params.mr, "なし");
  form.mr.count = getString(params.mr_ki, "未接種");
  form.mr.date = getString(params.mr_hi);

  form.sui.type = getString(params.sui, "なし");
  form.sui.count = getString(params.sui_kai, "未接種");
  form.sui.date = getString(params.sui_hi);

  form.mumpus.type = getString(params.mumpus, "なし");
  form.mumpus.count = getString(params.mumpus_kai, "未接種");
  form.mumpus.date = getString(params.mumpus_hi);

  form.niti.type = getString(params.niti, "なし");
  form.niti.count = getString(params.niti_kai, "未接種");
  form.niti.date = getString(params.niti_hi);

  return form;
}

export default async function FormPage({ searchParams }: FormPageProps) {
  const params = await searchParams;

  const mode =
    getString(params.mode) === "renewal" ? "renewal" : "initial";

  const parentRequestId = getString(params.parent_request_id);
  const initialValues = buildInitialValues(params);

  return (
    <main className="min-h-screen p-6">
      <VaccinationForm
        initialValues={initialValues}
        mode={mode}
        parentRequestId={parentRequestId}
      />
    </main>
  );
}