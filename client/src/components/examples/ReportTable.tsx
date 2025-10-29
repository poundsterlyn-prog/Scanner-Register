import ReportTable from '../ReportTable';

export default function ReportTableExample() {
  const mockEntries = [
    {
      scannerId: 'SC-001234',
      driver: 'John Smith',
      assignedTime: '08:30 AM',
      returnTime: '04:45 PM',
      status: 'returned' as const,
    },
    {
      scannerId: 'SC-002345',
      driver: 'Sarah Johnson',
      assignedTime: '09:15 AM',
      returnTime: '05:00 PM',
      status: 'returned' as const,
    },
    {
      scannerId: 'SC-003456',
      driver: 'Mike Davis',
      assignedTime: '07:00 AM',
      status: 'pending' as const,
    },
  ];

  return (
    <div className="p-4">
      <ReportTable
        entries={mockEntries}
        date="Tuesday, October 29, 2025"
      />
    </div>
  );
}
