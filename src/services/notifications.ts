import { apiService } from './api';

export interface BulkEmailRequest {
  name: string;
  subject: string;
  content: string;
  recipients: {
    type: 'list';
    emails: string[];
  };
}

export interface BulkEmailResponse {
  message: string;
  sent_count: number;
  failed_count: number;
}

class NotificationsService {
  // Send bulk email to a list of recipients
  async sendBulkEmail(data: BulkEmailRequest): Promise<BulkEmailResponse> {
    return apiService.post<BulkEmailResponse>('/notifications/bulk-email/send', data);
  }

  // Send invitation email to a single user
  async sendInvitationEmail(
    recipientEmail: string, 
    circleId: string, 
    circleName: string,
    inviterName: string
  ): Promise<BulkEmailResponse> {
    const invitationLink = `${window.location.origin}/circles?circle_id=${circleId}`;
    
    const emailData: BulkEmailRequest = {
      name: `Trip Invitation - ${circleName}`,
      subject: `${inviterName} invited you to join a trip!`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">You've been invited to join a trip!</h2>
          <p>Hi there!</p>
          <p><strong>${inviterName}</strong> has invited you to join their trip: <strong>${circleName}</strong></p>
          <p>Click the button below to view the trip details and join:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" 
               style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Trip Details
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${invitationLink}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This invitation was sent from Odyss. If you have any questions, please contact support.
          </p>
        </div>
      `,
      recipients: {
        type: 'list',
        emails: [recipientEmail]
      }
    };

    return this.sendBulkEmail(emailData);
  }
}

export const notificationsService = new NotificationsService(); 