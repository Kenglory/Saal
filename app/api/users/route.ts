import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public/data/users.json');
  const file = await fs.readFile(filePath, 'utf8');
  const users = JSON.parse(file);
  return NextResponse.json(users);
}