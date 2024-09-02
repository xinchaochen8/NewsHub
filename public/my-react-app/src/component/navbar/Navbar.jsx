import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const drawerWidth = 240;

const categories = [
    { title: 'Stock', href: '#stockNewsTitle' },

    { title: 'General', href: '#generalNewsTitle' },
    { title: 'Business', href: '#businessNewsTitle' },
    { title: 'Politics', href: '#politicsNewsTitle' },
    { title: 'Technology', href: '#technologyNewsTitle' },
    { title: 'Science', href: '#scienceNewsTitle' },
    { title: 'Education', href: '#educationNewsTitle' },
    { title: 'Entertainment', href: '#entertainmentNewsTitle' },
    { title: 'Health', href: '#healthNewsTitle' }
];

const Navbar = (props) => {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }} href="#">
                InfoFusion
            </Typography>
            <Divider />
            <List>
                {categories.map((item) => (
                    <ListItem key={item.title} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }} component="a" href={item.href}>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window ? window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }} id="navbar" >
            <CssBaseline />

            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        InfoFusion
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {categories.map((item) => (
                            <Button key={item.title} sx={{ color: '#fff' }} href={item.href}>
                                {item.title}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <nav>
                
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}

export default Navbar;
