"use client";
import { Divider, CssBaseline, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Filters from './Filters';

export interface LogEntry {
  date: string;
  time: string;
  server: string;
  author: string;
  currentHash: string;
  previousHash: string;
  submodule: string;
}

export default function Home() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [logData, setLogData] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLogData = async () => {
    if (!selectedModule) return;
    try {
      setLoading(true);
      const response = await axios.get('/api/logdata');
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModule = sessionStorage.getItem('selectedModule');
      if (savedModule) {
        setSelectedModule(savedModule);
      } else {
        setSelectedModule('Django');
      }
    }
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchLogData();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedModule', selectedModule);
      }
    }
  }, [selectedModule]);

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

    const serverMessage = selectedServer 
    ? `Dashboard is empty. There are no log entries available for the ${selectedModule} submodule on the ${selectedServer} server.`
    : `Dashboard is empty. There are no log entries available for the ${selectedModule} submodule.`;

  return (
    <Box className="flex">
      <CssBaseline />

      <Sidebar selectedModule={selectedModule || 'Django'} onModuleClick={setSelectedModule} />

      <main style={{ flexGrow: 1, padding: '60px', paddingTop: '120px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" className="text-black font-bold">
            {selectedModule}
          </Typography>

          <Filters
            dateSortOrder={dateSortOrder}
            setDateSortOrder={setDateSortOrder}
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            logData={logData}
            setLogData={setLogData}
          />
        </Box>

        <Divider className="my-2 border-gray-300" />

        <Dashboard
          logData={sortedLogData}
          loading={loading}
          selectedModule={selectedModule || 'Django'}
          serverMessage={serverMessage} />
      </main>
    </Box >
  );
}
