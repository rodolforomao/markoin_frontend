import { Icon } from "@iconify/react";
import '../../assets/css/style.css';

interface Props {
  icon: string;
  onClick?: () => void;
  title?: string;
}

const IconBtn = (props: Props) => {
  const { icon, onClick, title } = props;

  return (
  
    <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
      <button style={{ width: '100%', height: '40px', color: 'var(--c-5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }} {...{ title, onClick }} className="btn_sair">
        <Icon style={{ fontSize: '12px' }} icon={icon} />
        <span style={{ fontSize: '13px' }}>Sair </span>
    </button>
</div>
  );
};5

export default IconBtn;
