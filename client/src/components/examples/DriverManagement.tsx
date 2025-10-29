import { useState } from 'react';
import DriverManagement from '../DriverManagement';

export default function DriverManagementExample() {
  const [drivers, setDrivers] = useState(['John Smith', 'Sarah Johnson', 'Mike Davis']);

  return (
    <div className="p-4 max-w-2xl">
      <DriverManagement
        drivers={drivers}
        onAddDriver={(name) => {
          setDrivers([...drivers, name]);
          console.log('Added:', name);
        }}
        onRemoveDriver={(name) => {
          setDrivers(drivers.filter(d => d !== name));
          console.log('Removed:', name);
        }}
      />
    </div>
  );
}
