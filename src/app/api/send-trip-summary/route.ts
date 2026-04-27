import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/mailer'

export async function POST(req: Request) {
  try {
    const tripData = await req.json()

    const {
      customerEmail,
      customerContact,
      expectedStartDate,
      startingTime,
      guestCount,
      vehicle,
      points,
      totalDistance,
      totalDuration,
      totalCost,
    } = tripData

    // Format points for email
    const pointsList = points.map((p: any, idx: number) => 
      `${idx + 1}. ${p.type.toUpperCase()}: ${p.name} (${p.address})`
    ).join('\n')

    const subject = `New Trip Plan Request - ${expectedStartDate} (${customerEmail})`
    
    const emailText = `
New Trip Plan Request Details:

Customer Email: ${customerEmail}
Customer Contact: ${customerContact}

Starting Date: ${expectedStartDate}
Starting Time: ${startingTime}
Guest Count: ${guestCount}

Vehicle Details:
- Plate Number: ${vehicle.plateNumber}
- Model: ${vehicle.model}
- Type: ${vehicle.vehicleType}

Trip Route:
${pointsList}

Summary:
- Total Distance: ${totalDistance}
- Total Travel Duration: ${totalDuration}
- Total Estimated Cost: LKR ${totalCost.toLocaleString()}

---
This email was generated from the Ceyara Tours Trip Planner.
`

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e1e1e1; padding: 20px; border-radius: 10px;">
  <h2 style="color: #003366; text-align: center;">New Trip Plan Request</h2>
  <hr style="border: 0; border-top: 1px solid #eee;" />
  
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="margin-top: 0; color: #003366; font-size: 1.1rem;">Customer Information</h3>
    <p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>
    <p style="margin: 5px 0;"><strong>Contact:</strong> ${customerContact}</p>
  </div>

  <div style="margin-bottom: 20px;">
    <p><strong>Starting Date:</strong> ${expectedStartDate}</p>
    <p><strong>Starting Time:</strong> ${startingTime}</p>
    <p><strong>Guest Count:</strong> ${guestCount}</p>
  </div>
  
  <h3 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 5px;">Vehicle Details</h3>
  <p><strong>Plate Number:</strong> ${vehicle.plateNumber}</p>
  <p><strong>Model:</strong> ${vehicle.model}</p>
  <p><strong>Type:</strong> ${vehicle.vehicleType}</p>
  
  <h3 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 5px;">Trip Route</h3>
  <ul style="padding-left: 20px; list-style-type: none;">
    ${points.map((p: any, idx: number) => `
      <li style="margin-bottom: 8px;">
        <span style="display: inline-block; width: 25px; height: 25px; background: #003366; color: white; border-radius: 50%; text-align: center; line-height: 25px; font-size: 0.8rem; margin-right: 10px;">${idx + 1}</span>
        <strong>${p.type.toUpperCase()}:</strong> ${p.name}
      </li>
    `).join('')}
  </ul>
  
  <h3 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 5px;">Summary</h3>
  <p><strong>Total Distance:</strong> ${totalDistance}</p>
  <p><strong>Total Travel Duration:</strong> ${totalDuration}</p>
  <p style="font-size: 1.4rem; color: #008080; background: #e6f7f7; padding: 10px; border-radius: 8px; text-align: center;">
    <strong>Total Estimated Cost:</strong><br />
    LKR ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </p>
  
  <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
  <p style="font-size: 0.8rem; color: #999; text-align: center;">This email was generated from the Ceyara Tours Trip Planner.</p>
</div>
`

    await sendEmail({
      to: process.env.SMTP_USER as string,
      subject,
      text: emailText,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in send-trip-summary API:', error)
    return NextResponse.json(
      { error: 'Failed to send trip summary email' },
      { status: 500 }
    )
  }
}
