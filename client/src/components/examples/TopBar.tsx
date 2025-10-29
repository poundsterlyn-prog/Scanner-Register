import TopBar from '../TopBar';

export default function TopBarExample() {
  return (
    <TopBar
      currentDate="Tuesday, October 29, 2025"
      onLogout={() => console.log('Logout clicked')}
    />
  );
}
