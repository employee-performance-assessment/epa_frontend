import SideMenu from '../../components/SideMenu/SideMenu.jsx';
import PersonalArea from '../../components/PersonalArea/PersonalArea.jsx';
import './AdminPanel.scss';

function AdminPanel() {
  return (
    <div className="admin-panel__conainer">
      <div className="admin-panel__sidebar">
        <SideMenu />
      </div>
      <PersonalArea />
    </div>
  );
}
export default AdminPanel;