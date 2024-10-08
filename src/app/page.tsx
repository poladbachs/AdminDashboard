"use client";
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, Grid, ListItemText, CssBaseline, Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const drawerWidth = 200;

export default function Home() {
  const router = useRouter();

  return (
    <Box className="flex">
      <CssBaseline />

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'white',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar className="justify-center">
          <Image src="https://dec-energy.ch/safari-pinned-tab.svg" alt="DEC Logo" width={120} height={40} />
        </Toolbar>
        <List>
          {['Django', 'Website', 'Database'].map((text, index) => (
            <ListItem button key={text} onClick={() => router.push(`/${text.toLowerCase()}`)} className="space-x-3 pl-2">
              <ListItemIcon className="flex justify-end">
                <Box className="w-3 h-3 bg-black" />
              </ListItemIcon>
              <ListItemText primary={text} />
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
