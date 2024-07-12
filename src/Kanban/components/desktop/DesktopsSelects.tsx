import React, { useState, useEffect } from 'react';
import '../../assets/css/style.css';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { LuUserPlus2 } from "react-icons/lu";
import { Link } from "react-router-dom";



interface DesktopSelectProps {
  title: string;
  id: number;
  onTitleClick: () => void; // Adicionando a prop onTitleClick
}


const DesktopsSelects = ({ title, onTitleClick, id }: DesktopSelectProps) => {

  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);


  const handleClick = () => {
    setOpen(!open);
  };



  return (

    <List
      sx={{ width: '100%', maxWidth: 360 }}
      component="nav"
      className='list_area_trabalho'
    >
      <ListItemButton key="title" onClick={handleClick} style={{ height: '30px' }}>
        <ListItemText primary={<span style={{ fontSize: '12px' }}>{title}</span>} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse key="collapse" in={open} timeout="auto" unmountOnExit>
        <List key="sublist" component="div" disablePadding>
          <ListItemButton key="quadros" sx={{ pl: 4, height: '30px' }}>
            <HiOutlineMenuAlt1 style={{ marginRight: '10px' }} />
            <ListItemText
              onClick={onTitleClick}
              primary={<span style={{ fontSize: '12px' }}>Quadros</span>}
            />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4, height: '30px' }} disabled>
            <LuUserPlus2 style={{ marginRight: '8px' }} />
            <Link to={`/users/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemText primary={<span style={{ fontSize: '12px' }}>Membros</span>} />
            </Link>
          </ListItemButton>
        </List>
      </Collapse>
    </List>


  );
};

export default DesktopsSelects;

