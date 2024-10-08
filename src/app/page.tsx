"use client";
import { AppBar, Toolbar, Drawer, Divider, Select, MenuItem, List, ListItem, ListItemIcon, Grid, ListItemText, CssBaseline, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const drawerWidth = 240;

interface LogEntry {
  date: string;
  time: string;
  server: string;
  author: string;
  currentHash: string;
  previousHash: string;
  submodule: string;
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedModule, setSelectedModule] = useState<string>('Django');
  const [logData, setLogData] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchLogData = async () => {
    try {
      const response = await axios.get('/api/logdata');
      console.log('Fetched Log Data:', response.data);
      const logData: string = response.data;

      const parsedData = logData.split('\n').map((line) => {
        const regex = /(\d{1,2} \w+ \d{4}) (\d{2}:\d{2}:\d{2}) .*Submodule (\w+) has changed from (\w+) to (\w+)/;
        const match = line.match(regex);

        if (match) {
          const moduleName = match[3].toLowerCase();
          return {
            date: match[1],
            time: match[2],
            server: moduleName === 'django' ? 'Deployment' : 'Testing',
            author: 'Your GitHub Name',
            currentHash: match[5],
            previousHash: match[4],
            submodule: moduleName,
          };
        }
        return null;
      }).filter(Boolean) as LogEntry[];

      setLogData(parsedData.filter(entry => entry.submodule === selectedModule.toLowerCase()));
    } catch (error) {
      setError('Error fetching log data');
      console.error('Error fetching log data:', error);
    }
  };



  useEffect(() => {
    const pathModule = pathname === '/' ? 'Django' : pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(2);
    setSelectedModule(pathModule);
  }, [pathname]);

  // useEffect(() => {
  //   fetchLogData();
  // }, [selectedModule]);

  const handleModuleClick = (module: string) => {
    setSelectedModule(module);
    router.push(`/${module.toLowerCase()}`);
  };

  const handleServerChange = (event: SelectChangeEvent<string>) => {
    setSelectedServer(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const order = event.target.value === 'a_to_z' ? 'asc' : 'desc';
    setSortOrder(order);
  };

  const filteredLogData = selectedServer
    ? logData.filter(entry => entry.server.toLowerCase() === selectedServer)
    : logData;

  const sortedLogData = [...filteredLogData].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.author.localeCompare(b.author);
    } else {
      return b.author.localeCompare(a.author);
    }
  });

  useEffect(() => {
    const mockLogData: LogEntry[] = [
      { date: '1 Jan 2024', time: '12:00:00', server: 'Deployment', author: 'Alice', currentHash: 'abc123', previousHash: 'def456', submodule: 'django' },
      { date: '2 Jan 2024', time: '13:00:00', server: 'Testing', author: 'Bob', currentHash: 'ghi789', previousHash: 'jkl012', submodule: 'website' },
      { date: '3 Jan 2024', time: '14:00:00', server: 'Deployment', author: 'Charlie', currentHash: 'mno345', previousHash: 'pqr678', submodule: 'database' },
      { date: '4 Jan 2024', time: '15:00:00', server: 'Testing', author: 'Alice', currentHash: 'stu901', previousHash: 'vwx234', submodule: 'django' },
      { date: '5 Jan 2024', time: '16:00:00', server: 'Deployment', author: 'Bob', currentHash: 'yz1234', previousHash: 'abcd567', submodule: 'website' },
    ];

    setLogData(mockLogData);
  }, []);

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

      <main style={{ flexGrow: 1, padding: '60px', paddingTop: '120px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" className="text-black font-bold">
            {selectedModule}
          </Typography>

          <Box display="flex" alignItems="center">
            <FormControl className="mr-2 min-w-[100px]">
              <InputLabel id="server-label" className="text-black">Server</InputLabel>
              <Select
                labelId="server-label"
                label="Server"
                className="h-10 text-sm"
                value={selectedServer}
                onChange={handleServerChange}
              >
                <MenuItem value="">Select Server</MenuItem>
                <MenuItem value="deployment">Deployment</MenuItem>
                <MenuItem value="testing">Testing</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="min-w-[100px]">
              <InputLabel id="author-label" className="text-black">Author</InputLabel>
              <Select
                labelId="author-label"
                label="Author"
                className="h-10 text-sm"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <MenuItem value="">Select Author</MenuItem>
                <MenuItem value="a_to_z">A-Z</MenuItem>
                <MenuItem value="z_to_a">Z-A</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider className="my-2 border-gray-300" />

        <Table>
          <TableHead>
            <TableRow className="">
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Server</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Current Hash</TableCell>
              <TableCell>Previous Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLogData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.time}</TableCell>
                <TableCell>{entry.server}</TableCell>
                <TableCell>{entry.author}</TableCell>
                <TableCell>{entry.currentHash}</TableCell>
                <TableCell>{entry.previousHash}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </Box>
  );
}
