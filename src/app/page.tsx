"use client";
import { AppBar, Toolbar, Drawer, Divider, Select, MenuItem, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
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
  const [selectedServer, setSelectedServer] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('desc');

  const dateSelectRef = useRef<HTMLSelectElement>(null);
  const serverSelectRef = useRef<HTMLSelectElement>(null);
  const authorSelectRef = useRef<HTMLSelectElement>(null);

  const handleSelectChange = (event: SelectChangeEvent<string>, ref: React.RefObject<HTMLSelectElement>) => {
    if (ref.current) {
      ref.current.blur();
    }
    switch (event.target.name) {
      case 'date':
        handleDateSortChange(event);
        break;
      case 'server':
        handleServerChange(event);
        break;
      case 'author':
        handleSortChange(event);
        break;
      default:
        break;
    }
  };

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

  useEffect(() => {
    fetchLogData();
  }, [selectedModule]);

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

  const handleDateSortChange = (event: SelectChangeEvent<string>) => {
    const order = event.target.value === 'newest_first' ? 'desc' : 'asc';
    setDateSortOrder(order);
  };

  const filteredLogData = selectedServer
    ? logData.filter(entry => entry.server.toLowerCase() === selectedServer)
    : logData;

  const sortedLogData = [...filteredLogData]
    .sort((a, b) => {
      if (dateSortOrder === 'asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.author.localeCompare(b.author);
      } else {
        return b.author.localeCompare(a.author);
      }
    });

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

          <Box
            display="flex"
            alignItems="center"
            sx={{
              padding: '0 !important',
              '& .MuiSelect-select': {
                padding: '0 !important',
                display: 'flex',
                alignItems: 'center',
              },
            }}>
            <FormControl className="mr-2 min-w-[120px]">
              <InputLabel id="date-label" className="text-black" shrink>Date</InputLabel>
              <Select
                labelId="date-label"
                label="Date"
                value={dateSortOrder}
                onChange={handleDateSortChange}
              >
                <MenuItem value="newest_first">Newest First</MenuItem>
                <MenuItem value="oldest_first">Oldest First</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="mr-2 min-w-[120px]">
              <InputLabel id="server-label" className="text-black" shrink>Server</InputLabel>
              <Select
                labelId="server-label"
                label="Server"
                value={selectedServer}
                onChange={handleServerChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="deployment">Deployment</MenuItem>
                <MenuItem value="testing">Testing</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="min-w-[120px]">
              <InputLabel id="author-label" className="text-black text-sm" shrink>Author</InputLabel>
              <Select
                labelId="author-label"
                label="Author"
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

        <TableContainer>
          <Table className="border-separate" style={{ borderSpacing: '0 15px' }}>
            <TableHead
            >
              <TableRow
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell className="pb-0 text-[11px]">DATE</TableCell>
                <TableCell className="pb-0 text-[11px]">TIME</TableCell>
                <TableCell className="pb-0 text-[11px]">SERVER</TableCell>
                <TableCell className="pb-0 text-[11px]">AUTHOR</TableCell>
                <TableCell className="pb-0 text-[11px]">CURRENT HASH</TableCell>
                <TableCell className="pb-0 text-[11px]">PREVIOUS HASH</TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                backgroundColor: '#F7F8FA',
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              {sortedLogData.map((entry, index) => (
                <TableRow key={index} >
                  <TableCell className="text-gray-700 rounded-l-[20px] text-md font-medium">
                    {entry.date}
                  </TableCell>
                  <TableCell className="text-gray-700 text-md font-medium">
                    {entry.time}
                  </TableCell>
                  <TableCell className="text-gray-700 text-md font-medium">
                    {entry.server}
                  </TableCell>
                  <TableCell className="text-gray-700 text-md font-medium">
                    {entry.author}
                  </TableCell>
                  <TableCell className="text-gray-700 text-md font-medium">
                    {entry.currentHash.slice(0, 6)}
                  </TableCell>
                  <TableCell className="text-gray-700 text-md rounded-r-[20px] font-medium">
                    {entry.previousHash.slice(0, 6)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </Box >
  );
}
