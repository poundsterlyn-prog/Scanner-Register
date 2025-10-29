import SummaryCards from '../SummaryCards';

export default function SummaryCardsExample() {
  return (
    <div className="p-4">
      <SummaryCards
        totalAssigned={12}
        totalReturned={8}
        pending={4}
      />
    </div>
  );
}
