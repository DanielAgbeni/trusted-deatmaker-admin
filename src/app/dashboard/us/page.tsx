import RecentDisputes from "./recent-disputes";
import RecentTransactions from "./recent-transactions";
import StatCards from "./recent-stats";
import CustomersLocation from "./customers-location";

export default function Page() {
  return (
    <section className="p-8 flex flex-col ">
      <StatCards />
      <RecentTransactions />
      {/* <CustomersLocation /> */}
      {/* <RecentDisputes /> */}
    </section>
  );
}
