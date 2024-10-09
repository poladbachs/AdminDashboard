import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Box } from '@mui/material';
import { LogEntry } from './page';

interface FiltersProps {
    dateSortOrder: 'asc' | 'desc';
    setDateSortOrder: (order: 'asc' | 'desc') => void;
    selectedServer: string;
    setSelectedServer: (server: string) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
    logData: LogEntry[];
    setLogData: (data: LogEntry[]) => void;
}

export default function Filters({ 
    dateSortOrder, 
    setDateSortOrder, 
    selectedServer, 
    setSelectedServer, 
    sortOrder, 
    setSortOrder, 
    logData, 
    setLogData 
}: FiltersProps) {
    const handleDateSortChange = (event: SelectChangeEvent<string>) => {
        const order = event.target.value === 'newest_first' ? 'desc' : 'asc';
        setDateSortOrder(order);
    };

    const handleServerChange = (event: SelectChangeEvent<string>) => {
        setSelectedServer(event.target.value);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        const order = event.target.value === 'a_to_z' ? 'asc' : 'desc';
        setSortOrder(order);
    };
    

    return (
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
            }}
            >
            <FormControl className="mr-2 min-w-[120px]">
                <InputLabel id="date-label" className="text-black" shrink>Date</InputLabel>
                <Select labelId="date-label" value={dateSortOrder} onChange={handleDateSortChange} notched label="Date" className="text-sm">
                    <MenuItem value="newest_first" className="text-sm">Newest First</MenuItem>
                    <MenuItem value="oldest_first" className="text-sm">Oldest First</MenuItem>
                </Select>
            </FormControl>

            <FormControl className="mr-2 min-w-[120px]">
                <InputLabel id="server-label" className="text-black" shrink>Server</InputLabel>
                <Select
                    labelId="server-label"
                    value={selectedServer}
                    onChange={handleServerChange}
                    notched
                    label="Server"
                    className="text-sm"
                    sx={{
                        '& .MuiSelect-select': {
                            display: 'flex',
                            marginLeft: '5px',
                        },
                    }}>
                    <MenuItem value="" className="text-sm">Select Server</MenuItem>
                    <MenuItem value="deployment" className="text-sm">Deployment</MenuItem>
                    <MenuItem value="testing" className="text-sm">Testing</MenuItem>
                </Select>
            </FormControl>

            <FormControl className="min-w-[120px]">
                <InputLabel id="author-label" className="text-black" shrink>Author</InputLabel>
                <Select labelId="author-label" value={sortOrder} onChange={handleSortChange} notched label="Author" className="text-sm">
                    <MenuItem value="a_to_z" className="text-sm">A-Z</MenuItem>
                    <MenuItem value="z_to_a" className="text-sm">Z-A</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
