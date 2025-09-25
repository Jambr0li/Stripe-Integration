import ngrok from '@ngrok/ngrok'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})
;(async () => {
  // Check for required environment variables
  if (!process.env.NGROK_AUTHTOKEN) {
    console.error('NGROK_AUTHTOKEN is not set')
    process.exit(1)
  }
  if (!process.env.NGROK_DOMAIN) {
    console.error('NGROK_DOMAIN is not set')
    process.exit(1)
  }

  try {
    // Establish connectivity
    const session = await new ngrok.SessionBuilder().authtokenFromEnv().connect()
    const listener = await session.httpEndpoint().domain(process.env.NGROK_DOMAIN).listen()
    listener.forward('http://localhost:3001')

    // Output ngrok url to console
    console.log(`Ingress established at: ${listener.url()} for: ${listener.forwardsTo()}`)
  } catch (error) {
    console.error('Failed to establish ngrok tunnel:', error)
    process.exit(1)
  }

  // Handle shutdown gracefully
  const shutdown = async () => {
    console.log('Shutting down ngrok...')
    await ngrok.disconnect()
    await ngrok.kill()
    process.exit(0)
  }

  // Listen for termination signals
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
})()
