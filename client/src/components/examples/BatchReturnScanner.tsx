import BatchReturnScanner from '../BatchReturnScanner';

export default function BatchReturnScannerExample() {
  return (
    <div className="p-4">
      <BatchReturnScanner
        onComplete={(ids) => console.log('Completed batch return:', ids)}
        onCancel={() => console.log('Cancelled batch return')}
        validateScanner={(id) => {
          if (id.startsWith('SC-')) {
            return { valid: true, message: 'Scanner marked for return' };
          }
          return { valid: false, message: 'Invalid scanner ID' };
        }}
      />
    </div>
  );
}
