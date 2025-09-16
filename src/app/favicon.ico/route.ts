import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
  
  try {
    const faviconBuffer = fs.readFileSync(faviconPath)
    
    return new Response(faviconBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    return new Response('Favicon not found', { status: 404 })
  }
}
