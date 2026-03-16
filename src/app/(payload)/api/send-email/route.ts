import { NextRequest, NextResponse } from 'next/server'

import { EmailConfigurationError, EmailSendError, sendEmail } from '@/lib/email/mailer'

type EmailRequestBody = {
  to?: string
  subject?: string
  message?: string
  htmlMessage?: string
  from?: string
}

const parseRequestBody = async (request: NextRequest): Promise<EmailRequestBody> => {
  try {
    return (await request.json()) as EmailRequestBody
  } catch {
    throw new EmailSendError('Invalid JSON payload received')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, htmlMessage, from } = await parseRequestBody(request)

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: ['to', 'subject', 'message'] },
        { status: 400 },
      )
    }

    const html = htmlMessage ?? message.replace(/\n/g, '<br>')

    const info = await sendEmail({
      to,
      subject,
      text: message,
      html,
      from,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        messageId: info?.messageId,
        envelope: info?.envelope,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof EmailConfigurationError) {
      return NextResponse.json(
        {
          error: 'Email configuration error',
          message: error.message,
        },
        { status: 500 },
      )
    }

    if (error instanceof EmailSendError) {
      return NextResponse.json(
        {
          error: 'Failed to send email',
          message: error.message,
          details:
            error.cause instanceof Error
              ? {
                  name: error.cause.name,
                  message: error.cause.message,
                }
              : undefined,
        },
        { status: 502 },
      )
    }

    const unknownError = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Unexpected error',
        message: unknownError,
      },
      { status: 500 },
    )
  }
}
