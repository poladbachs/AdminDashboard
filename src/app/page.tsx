"use client";
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, Grid, ListItemText, CssBaseline, Box, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const drawerWidth = 240;

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedModule, setSelectedModule] = useState<string>('Django');

    useEffect(() => {
        const pathModule = pathname === '/' ? 'Django' : pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(2);
        setSelectedModule(pathModule);
    }, [pathname]);

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
                    flexShrink: 0,
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
                            className={`space-x-3 rounded-l-lg rounded-r-none ${selectedModule === text ? 'bg-[#F0F0F0]' : ''} hover:bg-[#E0E0E0]`}
                        >
                            <ListItemIcon className="min-w-0">
                                <Box className="w-5 h-5 bg-black" />
                            </ListItemIcon>
                            <ListItemText primary={text} className="flex justify-start" />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <main>
              <Typography variant="h6" color="black">
                  {selectedModule}
              </Typography>
            </main>
        </Box>
    );
}
