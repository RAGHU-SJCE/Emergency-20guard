import { EmergencyContact, EmergencyLocation } from "./emergencyService";

export interface NotificationResult {
  success: boolean;
  contactName: string;
  method: "sms" | "email";
  messageId?: string;
  error?: string;
}

export interface EmergencyAlertOptions {
  alertId: string;
  contacts: EmergencyContact[];
  message: string;
  location?: EmergencyLocation;
  emergencyType: string;
}

export class NotificationService {
  /**
   * Send emergency alerts to all contacts
   */
  async sendEmergencyAlerts(
    options: EmergencyAlertOptions,
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const contact of options.contacts) {
      // Send SMS if phone number provided
      if (contact.phone) {
        const smsResult = await this.sendEmergencySMS(
          contact.phone,
          contact.name,
          options.message,
          options.location,
          options.emergencyType,
        );
        results.push({
          ...smsResult,
          contactName: contact.name,
          method: "sms",
        });
      }

      // Send Email if email provided
      if (contact.email) {
        const emailResult = await this.sendEmergencyEmail(
          contact.email,
          contact.name,
          options.message,
          options.location,
          options.emergencyType,
        );
        results.push({
          ...emailResult,
          contactName: contact.name,
          method: "email",
        });
      }
    }

    return results;
  }

  /**
   * Send emergency SMS notification
   */
  private async sendEmergencySMS(
    phone: string,
    contactName: string,
    message: string,
    location?: EmergencyLocation,
    emergencyType?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Format emergency SMS message
      const locationText = location
        ? `\nLocation: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`
        : "";

      const smsMessage = `🚨 EMERGENCY ALERT 🚨\n\n${message}${locationText}\n\nThis is an automated emergency notification from EmergencyGuard.`;

      // In a real implementation, this would use Twilio:
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

      // Demo implementation
      console.log(`📱 EMERGENCY SMS TO ${contactName} (${phone}):`);
      console.log(`Message: ${smsMessage}`);
      console.log(`Length: ${smsMessage.length} characters`);

      // Simulate network delay
      await this.simulateNetworkDelay(500, 1500);

      // Simulate occasional failures (10% failure rate)
      if (Math.random() < 0.1) {
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

  /**
   * Send emergency email notification
   */
  private async sendEmergencyEmail(
    email: string,
    contactName: string,
    message: string,
    location?: EmergencyLocation,
    emergencyType?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Format emergency email
      const locationHtml = location
        ? `<p><strong>Location:</strong> <a href="https://maps.google.com/maps?q=${location.latitude},${location.longitude}" target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>`
        : "";

      const emergencyTypeText = emergencyType
        ? ` - ${emergencyType.toUpperCase()}`
        : "";

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY ALERT${emergencyTypeText} 🚨</h1>
          </div>
          <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin-top: 0;">Emergency Notification</h2>
            <p style="font-size: 16px; line-height: 1.5; color: #374151; background: white; padding: 15px; border-left: 4px solid #ef4444;">${message}</p>
            ${locationHtml}
            <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong> This is an automated emergency notification. Please respond immediately if possible.</p>
            </div>
            <div style="margin: 20px 0; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e3a8a;"><strong>What to do:</strong></p>
              <ul style="color: #1e3a8a; margin: 10px 0;">
                <li>Try to contact the person immediately</li>
                <li>If you cannot reach them, consider calling emergency services</li>
                <li>Check the location provided above if available</li>
              </ul>
            </div>
            <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
              This message was sent automatically by the EmergencyGuard emergency response system.<br>
              Time: ${new Date().toLocaleString()}<br>
              If this is a false alarm, please contact the sender directly.
            </p>
          </div>
        </div>
      `;

      const emailText = `
🚨 EMERGENCY ALERT${emergencyTypeText} 🚨

${message}

${location ? `Location: https://maps.google.com/maps?q=${location.latitude},${location.longitude}` : ""}

⚠️ IMPORTANT: This is an automated emergency notification. Please respond immediately if possible.

What to do:
- Try to contact the person immediately
- If you cannot reach them, consider calling emergency services
- Check the location provided above if available

This message was sent automatically by the EmergencyGuard emergency response system.
Time: ${new Date().toLocaleString()}
If this is a false alarm, please contact the sender directly.
      `;

      // In a real implementation, this would use SendGrid, AWS SES, or similar:
      /*
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: email,
        from: {
          email: process.env.FROM_EMAIL,
          name: 'EmergencyGuard Alert System'
        },
        subject: `🚨 EMERGENCY ALERT${emergencyTypeText} - Immediate Response Required`,
        text: emailText,
        html: emailHtml,
        priority: 1, // High priority
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };
      
      const result = await sgMail.send(msg);
      return { success: true, messageId: result[0].headers['x-message-id'] };
      */

      // Demo implementation
      console.log(`📧 EMERGENCY EMAIL TO ${contactName} (${email}):`);
      console.log(
        `Subject: 🚨 EMERGENCY ALERT${emergencyTypeText} - Immediate Response Required`,
      );
      console.log(`Text length: ${emailText.length} characters`);
      console.log(`HTML length: ${emailHtml.length} characters`);

      // Simulate network delay
      await this.simulateNetworkDelay(1000, 3000);

      // Simulate occasional failures (5% failure rate)
      if (Math.random() < 0.05) {
        return {
          success: false,
          error: "Email delivery failed - server error",
        };
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

  /**
   * Send push notification (for future implementation)
   */
  async sendPushNotification(
    deviceToken: string,
    title: string,
    body: string,
    data?: any,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Implementation would use FCM, APNS, or similar service
    console.log(`📲 PUSH NOTIFICATION: ${title} - ${body}`);

    // Simulate for demo
    await this.simulateNetworkDelay(200, 500);

    return {
      success: true,
      messageId: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * Validate contact information
   */
  validateContact(contact: EmergencyContact): string[] {
    const errors: string[] = [];

    if (!contact.name || contact.name.trim().length === 0) {
      errors.push("Contact name is required");
    }

    if (!contact.phone && !contact.email) {
      errors.push("At least one contact method (phone or email) is required");
    }

    if (contact.phone && !this.isValidPhoneNumber(contact.phone)) {
      errors.push("Invalid phone number format");
    }

    if (contact.email && !this.isValidEmail(contact.email)) {
      errors.push("Invalid email format");
    }

    return errors;
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Simulate network delay for demo purposes
   */
  private async simulateNetworkDelay(
    minMs: number,
    maxMs: number,
  ): Promise<void> {
    const delay = minMs + Math.random() * (maxMs - minMs);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<{
    totalSent: number;
    successRate: number;
    avgDeliveryTime: number;
  }> {
    // In production, this would query the notifications table
    return {
      totalSent: 0,
      successRate: 0.95, // 95% success rate
      avgDeliveryTime: 1.2, // 1.2 seconds average
    };
  }
}

export default NotificationService;
