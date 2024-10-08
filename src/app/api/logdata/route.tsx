import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';
import https from 'https';

export async function GET(req: NextRequest) {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await axios.get('https://185.56.151.204/deployment.log', { httpsAgent: agent });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching log data:', error);
    return NextResponse.json({ error: 'Error fetching log data' }, { status: 500 });
  }
}