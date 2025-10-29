import ScannerCard from '../ScannerCard';

export default function ScannerCardExample() {
  return (
    <div className="space-y-4 p-4">
      <ScannerCard
        scannerId="SC-001234"
        status="available"
      />
      <ScannerCard
        scannerId="SC-002345"
        driver="John Smith"
        assignedTime="08:30 AM"
        status="assigned"
      />
      <ScannerCard
        scannerId="SC-003456"
        driver="Sarah Johnson"
        assignedTime="09:15 AM"
        returnTime="04:45 PM"
        status="returned"
      />
      <ScannerCard
        scannerId="SC-004567"
        driver="Mike Davis"
        assignedTime="07:00 AM"
        status="overdue"
      />
    </div>
  );
}
