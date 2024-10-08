"use client";
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, Grid, ListItemText, CssBaseline, Box, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const drawerWidth = 200;

export default function Home() {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState<string | null>('Django');

  useEffect(() => {
    if (!selectedModule) {
      router.push('/django');
    }
  }, [selectedModule, router]);

  const handleModuleClick = (module: string) => {
    setSelectedModule(module);
    router.push(`/${module.toLowerCase()}`);
  };

  return (
    <Box className="flex">
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar className="justify-center">
          <Image src="https://dec-energy.ch/safari-pinned-tab.svg" alt="DEC Logo" width={120} height={40} />
        </Toolbar>
        <List className="ml-4">
          {['Django', 'Website', 'Database'].map((text) => (
            <ListItem
              component="button"
              key={text}
              onClick={() => handleModuleClick(text)}
              className={`space-x-3 rounded-l-lg rounded-r-none ${selectedModule === text ? 'bg-[#F0F0F0]' : ''} hover:bg-[#F0F0F0]`}
              >
              <ListItemIcon className="min-w-0">
                <Box className="w-5 h-5 bg-black" />
              </ListItemIcon>
              <ListItemText primary={text} className="flex justify-start"/>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main>
        <Grid
          component="main"
          sx={{ flexGrow: 1, bgcolor: '#f4f7f9', p: 3, marginLeft: `${drawerWidth}px` }}
        >
          <AppBar position="static" className="bg-white">
            <Toolbar>
              <Typography variant="h6" noWrap color="black">
                Dashboard
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
      </main>
    </Box>
  );
}
