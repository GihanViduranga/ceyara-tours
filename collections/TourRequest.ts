import { sendEmail } from '@/lib/email/mailer'
import type { CollectionConfig } from 'payload'

export const TourRequest: CollectionConfig = {
  slug: 'tour-requests',
  admin: {
    useAsTitle: 'touristName',
    defaultColumns: [
      'touristName',
      'driverOrGuideName',
      'type',
      'status',
      'startDate',
      'endDate',
      'createdAt',
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      // Only admins/editors can read
      return user?.role === 'admin' || user?.role === 'editor'
    },
    create: () => true, // Allow public to create requests
    update: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Driver', value: 'driver' },
        { label: 'Guide', value: 'guide' },
      ],
      admin: {
        description: 'Type of service requested',
      },
    },
    {
      name: 'driverOrGuideId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the driver or guide',
      },
    },
    {
      name: 'driverOrGuideName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the driver or guide',
      },
    },
    {
      name: 'driverOrGuideEmail',
      type: 'email',
      required: false,
      admin: {
        description: 'Email of the driver or guide',
      },
    },
    {
      name: 'driverOrGuideContact',
      type: 'text',
      required: true,
      admin: {
        description: 'Contact number of the driver or guide',
      },
    },
    {
      name: 'touristName',
      type: 'text',
      required: true,
      admin: {
        description: 'Tourist name',
      },
    },
    {
      name: 'touristEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Tourist email',
      },
    },
    {
      name: 'touristContact',
      type: 'text',
      required: true,
      admin: {
        description: 'Tourist contact number',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Tour start date',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Tour end date',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Done', value: 'done' },
        { label: 'Cancel', value: 'cancel' },
      ],
      admin: {
        description: 'Request status',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Send email notification when a new tour request is created
        if (operation === 'create') {
          console.log('🔔 Tour request detected, preparing email notification...')

          // Check email configuration
          if (
            !process.env.SMTP_HOST ||
            !process.env.SMTP_PORT ||
            !process.env.SMTP_USER ||
            !process.env.SMTP_PASS
          ) {
            console.error('⚠️  Email configuration incomplete. Cannot send request email.')
            return doc
          }

          try {
            const startDate = doc.startDate
              ? new Date(doc.startDate as string).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Not provided'
            const endDate = doc.endDate
              ? new Date(doc.endDate as string).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Not provided'

            const emailSubject = `New Tour Request: ${doc.type === 'driver' ? 'Driver' : 'Guide'} - ${doc.driverOrGuideName}`
            const emailText = `
New Tour Request

Request Type: ${doc.type === 'driver' ? 'Driver' : 'Guide'}

${doc.type === 'driver' ? 'Driver' : 'Guide'} Information:
- Name: ${doc.driverOrGuideName}
- Contact: ${doc.driverOrGuideContact}
${doc.driverOrGuideEmail ? `- Email: ${doc.driverOrGuideEmail}` : ''}

Tourist Information:
- Name: ${doc.touristName}
- Email: ${doc.touristEmail}
- Contact: ${doc.touristContact}

Tour Dates:
- Start Date: ${startDate}
- End Date: ${endDate}

Request Date: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' })}
            `.trim()

            const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .section-title { font-weight: bold; color: #FF9800; margin-bottom: 10px; font-size: 18px; }
    .field { margin-bottom: 8px; }
    .field-label { font-weight: bold; display: inline-block; min-width: 200px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Tour Request</h1>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Request Type: ${doc.type === 'driver' ? 'Driver' : 'Guide'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">${doc.type === 'driver' ? 'Driver' : 'Guide'} Information</div>
        <div class="field"><span class="field-label">Name:</span> ${doc.driverOrGuideName}</div>
        <div class="field"><span class="field-label">Contact:</span> ${doc.driverOrGuideContact}</div>
        ${doc.driverOrGuideEmail ? `<div class="field"><span class="field-label">Email:</span> ${doc.driverOrGuideEmail}</div>` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Tourist Information</div>
        <div class="field"><span class="field-label">Name:</span> ${doc.touristName}</div>
        <div class="field"><span class="field-label">Email:</span> ${doc.touristEmail}</div>
        <div class="field"><span class="field-label">Contact:</span> ${doc.touristContact}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Tour Dates</div>
        <div class="field"><span class="field-label">Start Date:</span> ${startDate}</div>
        <div class="field"><span class="field-label">End Date:</span> ${endDate}</div>
      </div>
      
      <div class="section">
        <div class="field"><span class="field-label">Request Date:</span> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' })}</div>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from Ceyara Tours Registration System</p>
    </div>
  </div>
</body>
</html>
            `.trim()

            await sendEmail({
              to: 'gihanvidu123@gmail.com',
              subject: emailSubject,
              text: emailText,
              html: emailHtml,
            })

            console.log('✓ Tour request email sent successfully')
          } catch (error) {
            console.error('❌ Failed to send tour request email')
            console.error('Error details:', error)
          }
        }

        return doc
      },
    ],
  },
}
