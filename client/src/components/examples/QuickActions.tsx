import QuickActions from '../QuickActions';

export default function QuickActionsExample() {
  return (
    <div className="p-4 max-w-2xl">
      <QuickActions
        onScanForAssignment={() => console.log('Scan for assignment')}
        onScanForReturn={() => console.log('Scan for return')}
        onRegisterScanner={() => console.log('Register scanner')}
        onViewReport={() => console.log('View report')}
        onManageDrivers={() => console.log('Manage drivers')}
      />
    </div>
  );
}
