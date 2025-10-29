import DriverSelector from '../DriverSelector';

export default function DriverSelectorExample() {
  const mockDrivers = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson'];

  return (
    <div className="p-4 max-w-md">
      <DriverSelector
        drivers={mockDrivers}
        scannerId="SC-001234"
        onAssign={(driver) => console.log('Assigned to:', driver)}
        onCancel={() => console.log('Cancelled')}
      />
    </div>
  );
}
