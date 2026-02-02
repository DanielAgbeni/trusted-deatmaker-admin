import DepositsWithdrawalReport from "./deposit-withdrawal-report";
import RecentTransactions from "./recent-transactions";
import StatCards from "./recent-stats";
import { EcrowDisputeStats } from "./ecrow-dispute-stats";

export default function Page() {
  return (
    <section className="p-4 md:p-8 flex flex-col gap-4">
      <StatCards />
      <EcrowDisputeStats />
      {/* <DepositsWithdrawalReport /> */}
      <RecentTransactions />
    </section>
  );
}
