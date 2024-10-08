import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface LogEntry {
  date: string;
  time: string;
  server: string;
  author: string;
  currentHash: string;
  previousHash: string;
}

interface DashboardProps {
  logData: LogEntry[];
  loading: boolean;
  selectedModule: string;
}

export default function Dashboard({ logData, loading, selectedModule }: DashboardProps) {
  if (loading) {
    return <Typography variant="h6" className="text-gray-700 text-center">Loading log entries...</Typography>;
  }

  if (logData.length === 0) {
    return <Typography variant="h6" className="text-gray-700 text-center">Dashboard is empty. There are no log entries available for the {selectedModule} submodule.</Typography>;
  }

  return (
    <TableContainer>
      <Table className="border-separate" style={{ borderSpacing: '0 15px' }}>
        <TableHead>
          <TableRow>
            <TableCell className="pb-0 text-[11px]">DATE</TableCell>
            <TableCell className="pb-0 text-[11px]">TIME</TableCell>
            <TableCell className="pb-0 text-[11px]">SERVER</TableCell>
            <TableCell className="pb-0 text-[11px]">AUTHOR</TableCell>
            <TableCell className="pb-0 text-[11px]">CURRENT HASH</TableCell>
            <TableCell className="pb-0 text-[11px]">PREVIOUS HASH</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: '#F7F8FA' }}>
          {logData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell className="text-gray-700 rounded-l-[20px] text-md font-medium">{entry.date}</TableCell>
              <TableCell className="text-gray-700 text-md font-medium">{entry.time}</TableCell>
              <TableCell className="text-gray-700 text-md font-medium">{entry.server}</TableCell>
              <TableCell className="text-gray-700 text-md font-medium">{entry.author}</TableCell>
              <TableCell className="text-gray-700 text-md font-medium">{entry.currentHash.slice(0, 6)}</TableCell>
              <TableCell className="text-gray-700 text-md rounded-r-[20px] font-medium">{entry.previousHash.slice(0, 6)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
