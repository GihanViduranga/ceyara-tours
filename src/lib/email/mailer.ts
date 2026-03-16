import nodemailer, { Transporter } from 'nodemailer'

type TransporterConfig = {
  host: string
  port: number
  user: string
  pass: string
  fromAddress: string
  secure: boolean
  rejectUnauthorized: boolean
}

class EmailConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EmailConfigurationError'
  }
}

class EmailSendError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'EmailSendError'
  }
}

const requiredEnvVars: Array<keyof NodeJS.ProcessEnv> = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
]

const resolveTransporterConfig = (): TransporterConfig => {
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new EmailConfigurationError(`Missing required environment variable: ${key}`)
    }
  }

  const host = process.env.SMTP_HOST as string
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER as string
  const pass = process.env.SMTP_PASS as string
  const fromAddress = process.env.SMTP_FROM ?? `"Ceyara Tours" <${user}>`

  if (Number.isNaN(port)) {
    throw new EmailConfigurationError('SMTP_PORT must be a valid number')
  }

  const secure = port === 465
  const rejectUnauthorized =
    process.env.NODE_ENV === 'production' ? process.env.SMTP_REJECT_UNAUTHORIZED !== 'false' : false

  return {
    host,
    port,
    user,
    pass,
    fromAddress,
    secure,
    rejectUnauthorized,
  }
}

let cachedTransporter: Transporter | undefined
let cachedConfig: TransporterConfig | undefined

const getTransporter = () => {
  if (!cachedTransporter || !cachedConfig) {
    cachedConfig = resolveTransporterConfig()
    cachedTransporter = nodemailer.createTransport({
      host: cachedConfig.host,
      port: cachedConfig.port,
      secure: cachedConfig.secure,
      auth: {
        user: cachedConfig.user,
        pass: cachedConfig.pass,
      },
      tls: {
        rejectUnauthorized: cachedConfig.rejectUnauthorized,
      },
    })
  }

  return { transporter: cachedTransporter, config: cachedConfig }
}

type SendEmailArgs = {
  to: string
  subject: string
  text: string
  html?: string
  from?: string
}

export const sendEmail = async ({ to, subject, text, html, from }: SendEmailArgs) => {
  if (!to || !subject || !text) {
    throw new EmailSendError('Missing required email fields: to, subject, text')
  }

  const { transporter, config } = getTransporter()

  try {
    const info = await transporter.sendMail({
      from: from ?? config.fromAddress,
      to,
      subject,
      text,
      html: html ?? text,
    })

    return info
  } catch (error) {
    throw new EmailSendError('Failed to send email', error)
  }
}

export { EmailConfigurationError, EmailSendError }
