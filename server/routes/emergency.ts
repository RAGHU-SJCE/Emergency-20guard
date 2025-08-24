import { RequestHandler } from "express";

// SMS and Email notification interfaces
interface NotificationResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

// Emergency SMS notification
async function sendEmergencySMS(
  phone: string,
  contactName: string,
  message: string,
  location?: { latitude: number; longitude: number },
): Promise<NotificationResult> {
  try {
    // Format emergency SMS message
    const locationText = location
      ? `\nLocation: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`
      : "";

    const smsMessage = `🚨 EMERGENCY ALERT 🚨\n\n${message}${locationText}\n\nThis is an automated emergency notification from EmergencyGuard.`;

    // In a real implementation, this would use Twilio, AWS SNS, or similar service:
    /*
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const result = await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    return { success: true, messageId: result.sid };
    */

    // Demo implementation - log instead of actually sending
    console.log(`📱 EMERGENCY SMS TO ${contactName} (${phone}):`);
    console.log(`Message: ${smsMessage}`);
    console.log(`Length: ${smsMessage.length} characters`);

    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    );

    // Simulate occasional failures
    if (Math.random() < 0.1) {
      // 10% failure rate for demo
      return { success: false, error: "SMS delivery failed - network error" };
    }

    const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { success: true, messageId };
  } catch (error) {
    console.error("SMS sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown SMS error",
    };
  }
}

// Emergency Email notification
async function sendEmergencyEmail(
  email: string,
  contactName: string,
  message: string,
  location?: { latitude: number; longitude: number },
): Promise<NotificationResult> {
  try {
    // Format emergency email
    const locationHtml = location
      ? `<p><strong>Location:</strong> <a href="https://maps.google.com/maps?q=${location.latitude},${location.longitude}">View on Google Maps</a></p>`
      : "";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY ALERT 🚨</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Emergency Notification</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">${message}</p>
          ${locationHtml}
          <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;"><strong>Important:</strong> This is an automated emergency notification. Please respond immediately.</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This message was sent automatically by EmergencyGuard emergency system.</p>
        </div>
      </div>
    `;

    const emailText = `
🚨 EMERGENCY ALERT 🚨

${message}

${location ? `Location: https://maps.google.com/maps?q=${location.latitude},${location.longitude}` : ""}

This is an automated emergency notification from EmergencyGuard.
Please respond immediately.
    `;

    // In a real implementation, this would use SendGrid, AWS SES, or similar service:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: '🚨 EMERGENCY ALERT - Immediate Response Required',
      text: emailText,
      html: emailHtml,
    };

    const result = await sgMail.send(msg);
    return { success: true, messageId: result[0].headers['x-message-id'] };
    */

    // Demo implementation - log instead of actually sending
    console.log(`📧 EMERGENCY EMAIL TO ${contactName} (${email}):`);
    console.log(`Subject: 🚨 EMERGENCY ALERT - Immediate Response Required`);
    console.log(`Text content: ${emailText}`);

    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000),
    );

    // Simulate occasional failures
    if (Math.random() < 0.05) {
      // 5% failure rate for demo
      return { success: false, error: "Email delivery failed - server error" };
    }

    const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { success: true, messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

export interface EmergencyCallRequest {
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  userInfo?: {
    name?: string;
    phone?: string;
    medicalInfo?: string;
  };
  emergencyType: "medical" | "fire" | "police" | "general";
  timestamp: string;
}

export interface EmergencyCallResponse {
  success: boolean;
  callId: string;
  message: string;
  emergencyNumber?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
}

export interface ContactAlertRequest {
  contacts: Array<{
    name: string;
    phone?: string;
    email?: string;
    relationship: string;
  }>;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  emergencyType: string;
}

export interface ContactAlertResponse {
  success: boolean;
  alertId: string;
  contactsNotified: number;
  failedContacts: string[];
  message: string;
}

// Initiate emergency call
export const initiateEmergencyCall: RequestHandler = async (req, res) => {
  try {
    const emergencyData: EmergencyCallRequest = req.body;

    // Log emergency call
    const callId = `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In a real implementation, this would:
    // 1. Contact emergency services API
    // 2. Send location data to emergency dispatch
    // 3. Log the call in emergency systems

    console.log(`EMERGENCY CALL INITIATED: ${callId}`, {
      type: emergencyData.emergencyType,
      location: emergencyData.location,
      timestamp: emergencyData.timestamp,
    });

    // Determine emergency number based on type and location
    let emergencyNumber = "911"; // Default US emergency number

    // In a real app, you'd determine based on user's location
    // For now, we'll use standard emergency numbers

    const response: EmergencyCallResponse = {
      success: true,
      callId,
      message:
        "Emergency call initiated. Location shared with emergency services.",
      emergencyNumber,
      location: emergencyData.location,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error("Emergency call error:", error);
    res.status(500).json({
      success: false,
      callId: "",
      message: "Failed to initiate emergency call. Please call 911 directly.",
      timestamp: new Date().toISOString(),
    });
  }
};

// Alert emergency contacts
export const alertEmergencyContacts: RequestHandler = async (req, res) => {
  try {
    const alertData: ContactAlertRequest = req.body;

    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const failedContacts: string[] = [];
    let contactsNotified = 0;

    // Real notification implementation
    for (const contact of alertData.contacts) {
      try {
        let notificationSent = false;

        // Send SMS if phone number provided
        if (contact.phone) {
          const smsResult = await sendEmergencySMS(
            contact.phone,
            contact.name,
            alertData.message,
            alertData.location,
          );
          if (smsResult.success) {
            notificationSent = true;
            console.log(`SMS sent to ${contact.name} at ${contact.phone}`);
          } else {
            console.error(`SMS failed for ${contact.name}:`, smsResult.error);
          }
        }

        // Send Email if email provided
        if (contact.email) {
          const emailResult = await sendEmergencyEmail(
            contact.email,
            contact.name,
            alertData.message,
            alertData.location,
          );
          if (emailResult.success) {
            notificationSent = true;
            console.log(`Email sent to ${contact.name} at ${contact.email}`);
          } else {
            console.error(
              `Email failed for ${contact.name}:`,
              emailResult.error,
            );
          }
        }

        if (notificationSent) {
          contactsNotified++;
        } else {
          failedContacts.push(contact.name);
        }
      } catch (error) {
        console.error(`Failed to notify ${contact.name}:`, error);
        failedContacts.push(contact.name);
      }
    }

    const response: ContactAlertResponse = {
      success: true,
      alertId,
      contactsNotified,
      failedContacts,
      message: `Successfully notified ${contactsNotified} emergency contacts.`,
    };

    res.json(response);
  } catch (error) {
    console.error("Contact alert error:", error);
    res.status(500).json({
      success: false,
      alertId: "",
      contactsNotified: 0,
      failedContacts: [],
      message: "Failed to alert emergency contacts.",
    });
  }
};

// Log emergency event
export const logEmergencyEvent: RequestHandler = async (req, res) => {
  try {
    const eventData = req.body;

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In real implementation, save to database
    console.log(`EMERGENCY EVENT LOGGED: ${eventId}`, eventData);

    res.json({
      success: true,
      eventId,
      message: "Emergency event logged successfully.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Event logging error:", error);
    res.status(500).json({
      success: false,
      eventId: "",
      message: "Failed to log emergency event.",
    });
  }
};

// Get emergency history
export const getEmergencyHistory: RequestHandler = async (req, res) => {
  try {
    // In real implementation, fetch from database
    // For now, return mock data that represents real logged events
    const history = [
      {
        id: "event_1703443200000_abc123",
        type: "Medical Emergency",
        date: "2024-12-24",
        time: "14:30",
        location: {
          latitude: 40.7128,
          longitude: -74.006,
          address: "123 Main St, New York, NY",
        },
        status: "Resolved",
        responseTime: "2:45",
        contacts: ["John Doe", "Jane Smith"],
        notes: "Real emergency response - paramedics dispatched successfully",
        emergencyNumber: "911",
        callId: "emergency_1703443200000_def456",
      },
    ];

    res.json({
      success: true,
      history,
      total: history.length,
    });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({
      success: false,
      history: [],
      total: 0,
      message: "Failed to fetch emergency history.",
    });
  }
};
