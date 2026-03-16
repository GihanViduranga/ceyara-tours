import { sendEmail } from '@/lib/email/mailer'
import type { CollectionConfig } from 'payload'

export const Guides: CollectionConfig = {
  slug: 'guides',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'contactNumber', 'district', 'approved', 'createdAt'],
  },
  access: {
    read: () => true, // Public read access
    create: () => true, // Allow public registration
    update: ({ req: { user } }) => {
      return !!user // Only authenticated users can update
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'admin' || user?.role === 'editor' // Only admins/editors can delete
    },
  },
  fields: [
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approved',
      defaultValue: false,
      required: true,
      admin: {
        description: 'Only approved guides are visible on the website',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full Name as per NIC/Passport',
      },
    },
    {
      name: 'nicPassportNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'NIC or Passport Number',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      required: true,
      admin: {
        description: 'Date of Birth',
      },
    },
    {
      name: 'contactNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Primary Contact Number',
      },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      required: false,
      admin: {
        description: 'WhatsApp Number (if different from contact number)',
      },
    },
    {
      name: 'emailAddress',
      type: 'email',
      required: false,
      admin: {
        description: 'Email Address (Optional)',
      },
    },
    {
      name: 'residentialAddress',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Residential Address',
      },
    },
    {
      name: 'district',
      type: 'text',
      required: true,
      admin: {
        description: 'District/Province',
      },
    },
    {
      name: 'emergencyContactName',
      type: 'text',
      required: true,
      admin: {
        description: 'Emergency Contact Name',
      },
    },
    {
      name: 'emergencyContactNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Emergency Contact Number',
      },
    },
    {
      name: 'profilePhoto',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Profile Photo',
      },
    },
    {
      name: 'nicPhotoFront',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'NIC Photo (Front)',
      },
    },
    {
      name: 'nicPhotoBack',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'NIC Photo (Back)',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Send email notification when a new guide registers
        if (operation === 'create') {
          console.log('🔔 Guide registration detected, preparing email notification...')

          // Check email configuration before attempting to send
          if (
            !process.env.SMTP_HOST ||
            !process.env.SMTP_PORT ||
            !process.env.SMTP_USER ||
            !process.env.SMTP_PASS
          ) {
            console.error('⚠️  Email configuration incomplete. Cannot send registration email.')
            console.error('   Missing environment variables. Please check your .env file.')
            return doc
          }

          if (process.env.SMTP_PASS === 'your-app-password-here') {
            console.error('⚠️  SMTP_PASS is still set to placeholder value!')
            console.error('   Please set your actual Gmail App Password in .env file.')
            return doc
          }

          try {
            const profilePhotoUrl =
              doc.profilePhoto && typeof doc.profilePhoto === 'object' && 'url' in doc.profilePhoto
                ? (doc.profilePhoto as { url?: string }).url
                : doc.profilePhoto &&
                    typeof doc.profilePhoto === 'object' &&
                    'publicUrl' in doc.profilePhoto
                  ? (doc.profilePhoto as { publicUrl?: string }).publicUrl
                  : null

            const nicPhotoFrontUrl =
              doc.nicPhotoFront &&
              typeof doc.nicPhotoFront === 'object' &&
              'url' in doc.nicPhotoFront
                ? (doc.nicPhotoFront as { url?: string }).url
                : doc.nicPhotoFront &&
                    typeof doc.nicPhotoFront === 'object' &&
                    'publicUrl' in doc.nicPhotoFront
                  ? (doc.nicPhotoFront as { publicUrl?: string }).publicUrl
                  : null

            const nicPhotoBackUrl =
              doc.nicPhotoBack && typeof doc.nicPhotoBack === 'object' && 'url' in doc.nicPhotoBack
                ? (doc.nicPhotoBack as { url?: string }).url
                : doc.nicPhotoBack &&
                    typeof doc.nicPhotoBack === 'object' &&
                    'publicUrl' in doc.nicPhotoBack
                  ? (doc.nicPhotoBack as { publicUrl?: string }).publicUrl
                  : null

            // Format date of birth
            const dateOfBirth = doc.dateOfBirth
              ? new Date(doc.dateOfBirth as string).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Not provided'

            // Build email content
            const emailSubject = `New Tour Guide Registration: ${doc.fullName}`
            const emailText = `
New Tour Guide Registration

Personal Information:
- Full Name: ${doc.fullName}
- NIC/Passport Number: ${doc.nicPassportNumber}
- Date of Birth: ${dateOfBirth}
- District: ${doc.district}
- Residential Address: ${doc.residentialAddress}

Contact Information:
- Contact Number: ${doc.contactNumber}
${doc.whatsappNumber ? `- WhatsApp Number: ${doc.whatsappNumber}` : ''}
${doc.emailAddress ? `- Email Address: ${doc.emailAddress}` : ''}

Emergency Contact:
- Name: ${doc.emergencyContactName}
- Contact Number: ${doc.emergencyContactNumber}

${profilePhotoUrl ? `Profile Photo: ${profilePhotoUrl}` : 'Profile Photo: Not provided'}
${nicPhotoFrontUrl ? `NIC Photo (Front): ${nicPhotoFrontUrl}` : 'NIC Photo (Front): Not provided'}
${nicPhotoBackUrl ? `NIC Photo (Back): ${nicPhotoBackUrl}` : 'NIC Photo (Back): Not provided'}

Registration Date: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' })}
            `.trim()

            const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .section-title { font-weight: bold; color: #2196F3; margin-bottom: 10px; font-size: 18px; }
    .field { margin-bottom: 8px; }
    .field-label { font-weight: bold; display: inline-block; min-width: 180px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Tour Guide Registration</h1>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="field"><span class="field-label">Full Name:</span> ${doc.fullName}</div>
        <div class="field"><span class="field-label">NIC/Passport Number:</span> ${doc.nicPassportNumber}</div>
        <div class="field"><span class="field-label">Date of Birth:</span> ${dateOfBirth}</div>
        <div class="field"><span class="field-label">District:</span> ${doc.district}</div>
        <div class="field"><span class="field-label">Residential Address:</span> ${doc.residentialAddress}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Contact Information</div>
        <div class="field"><span class="field-label">Contact Number:</span> ${doc.contactNumber}</div>
        ${doc.whatsappNumber ? `<div class="field"><span class="field-label">WhatsApp Number:</span> ${doc.whatsappNumber}</div>` : ''}
        ${doc.emailAddress ? `<div class="field"><span class="field-label">Email Address:</span> ${doc.emailAddress}</div>` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Emergency Contact</div>
        <div class="field"><span class="field-label">Name:</span> ${doc.emergencyContactName}</div>
        <div class="field"><span class="field-label">Contact Number:</span> ${doc.emergencyContactNumber}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Documents</div>
        ${profilePhotoUrl ? `<div class="field"><span class="field-label">Profile Photo:</span> <a href="${profilePhotoUrl}" target="_blank">View Photo</a></div>` : '<div class="field"><span class="field-label">Profile Photo:</span> Not provided</div>'}
        ${nicPhotoFrontUrl ? `<div class="field"><span class="field-label">NIC Photo (Front):</span> <a href="${nicPhotoFrontUrl}" target="_blank">View Photo</a></div>` : '<div class="field"><span class="field-label">NIC Photo (Front):</span> Not provided</div>'}
        ${nicPhotoBackUrl ? `<div class="field"><span class="field-label">NIC Photo (Back):</span> <a href="${nicPhotoBackUrl}" target="_blank">View Photo</a></div>` : '<div class="field"><span class="field-label">NIC Photo (Back):</span> Not provided</div>'}
      </div>
      
      <div class="section">
        <div class="field"><span class="field-label">Registration Date:</span> ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' })}</div>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from Ceyara Tours Registration System</p>
    </div>
  </div>
</body>
</html>
            `.trim()

            console.log('📧 Attempting to send registration email for guide:', doc.fullName)

            await sendEmail({
              to: process.env.SMTP_USER as string,
              subject: emailSubject,
              text: emailText,
              html: emailHtml,
            })

            console.log('✓ Registration email sent successfully for guide:', doc.fullName)
          } catch (error) {
            // Log detailed error but don't fail the registration
            console.error('❌ Failed to send registration email for guide:', doc.fullName)
            console.error('Error details:', error)

            if (error instanceof Error) {
              console.error('Error name:', error.name)
              console.error('Error message:', error.message)
              if ('cause' in error && error.cause) {
                console.error('Error cause:', error.cause)
              }
            }

            // Check if it's a configuration error
            if (
              error &&
              typeof error === 'object' &&
              'name' in error &&
              error.name === 'EmailConfigurationError'
            ) {
              console.error('⚠️  Email configuration issue. Please check your .env file:')
              console.error('   - SMTP_HOST:', process.env.SMTP_HOST ? '✓ Set' : '✗ Missing')
              console.error(
                '   - SMTP_PORT:',
                process.env.SMTP_PORT ? `✓ Set (${process.env.SMTP_PORT})` : '✗ Missing',
              )
              console.error('   - SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Missing')
              console.error(
                '   - SMTP_PASS:',
                process.env.SMTP_PASS
                  ? process.env.SMTP_PASS === 'your-app-password-here'
                    ? '⚠️  Still using placeholder!'
                    : '✓ Set'
                  : '✗ Missing',
              )
            }
          }
        }
        return doc
      },
    ],
  },
}
