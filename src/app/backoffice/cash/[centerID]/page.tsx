import { CashTable } from "../_components/shiftsTable";

export async function CashPage({ params }: { params: Promise<{ centerID: string }> }) {
  return (
    <>
      <CashTable centerID={(await params).centerID} />
    </>
  );
}

export default CashPage;
