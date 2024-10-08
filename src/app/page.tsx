"use client";
import { Divider, Select, MenuItem, CssBaseline, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

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
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLogData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false); // End loading
    }
  };



  useEffect(() => {
    const pathModule = pathname === '/' ? 'Django' : pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(2);
    setSelectedModule(pathModule);
  }, [pathname]);

  useEffect(() => {
    fetchLogData();
  }, [selectedModule]);

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

      <Sidebar selectedModule={selectedModule} onModuleClick={setSelectedModule} />

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
                className="text-sm"
              >
                <MenuItem value="newest_first" className="text-sm">Newest First</MenuItem>
                <MenuItem value="oldest_first" className="text-sm">Oldest First</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="mr-2 min-w-[120px] justify-center">
              <InputLabel id="server-label" className="text-black" shrink>Server</InputLabel>
              <Select
                labelId="server-label"
                label="Server"
                value={selectedServer}
                onChange={handleServerChange}
                className="text-sm flex justify-center items-center"
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    marginLeft: '5px',
                  },
                }}
              >
                <MenuItem value="" className="text-sm">Select</MenuItem>
                <MenuItem value="deployment" className="text-sm">Deployment</MenuItem>
                <MenuItem value="testing" className="text-sm">Testing</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="min-w-[120px]">
              <InputLabel id="author-label" className="text-black" shrink>Author</InputLabel>
              <Select
                labelId="author-label"
                label="Author"
                value={sortOrder}
                onChange={handleSortChange}
                className="text-sm"
              >
                <MenuItem value="" className="text-sm">Select Author</MenuItem>
                <MenuItem value="a_to_z" className="text-sm">A-Z</MenuItem>
                <MenuItem value="z_to_a" className="text-sm">Z-A</MenuItem>
              </Select>
            </FormControl>

          </Box>
        </Box>

        <Divider className="my-2 border-gray-300" />

        <Dashboard logData={sortedLogData} loading={loading} selectedModule={selectedModule} />
      </main>
    </Box >
  );
}
