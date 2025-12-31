import { Request, Response } from 'express';
import { createEnrollment, listEnrollments, getEnrollmentById } from '../services/enrollment.service';
import { getEnrollmentCounts } from '../services/enrollment.service';
import { requireAuth } from '../middlewares/auth.middleware';
import { createInstantZoomMeeting } from '../utils/zoom';
import { sendEmail } from '../utils/email';
import Enrollment from '../models/enrollment.model';

export async function placeEnrollment(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, phone, courseItems, totalAmount, paymentReference, paymentStatus } = req.body;
    if (!firstName || !lastName || !email) return res.status(400).json({ error: 'Missing required fields' });
    if (!Array.isArray(courseItems) || courseItems.length === 0) return res.status(400).json({ error: 'No course items provided' });

    const created = await createEnrollment({ firstName, lastName, email, phone, courseItems, totalAmount, paymentReference, paymentStatus } as any);

    // Try to create a Zoom meeting (instant) for this enrollment and send confirmation email
    try {
      const courseTitles = (courseItems || []).map((c: any) => c.courseTitle || c.courseId).join(', ');
      const topic = `Smarti — ${courseTitles} — ${firstName} ${lastName}`;

      const zoomResp = await createInstantZoomMeeting({ topic, duration: 60 });

      // persist meeting info on enrollment
      try {
        await Enrollment.findByIdAndUpdate(created._id, { meetingId: String(zoomResp.id), meetingJoinUrl: zoomResp.join_url }).exec();
      } catch (err) {
        console.error('Failed to persist meeting info on enrollment:', err);
      }

      // send confirmation email with meeting link
      try {
        const from = process.env.NOREPLY_SMTP_USER || process.env.SMTP_USER;
        const subject = `Your enrollment is confirmed — ${courseTitles}`;
        const html = `
          <p>Hi ${firstName},</p>
          <p>Thank you for enrolling in <strong>${courseTitles}</strong>. Your enrollment is confirmed.</p>
          <p><strong>Meeting link:</strong> <a href="${zoomResp.join_url}">${zoomResp.join_url}</a></p>
          <p>If prompted for a passcode or waiting room, follow the on-screen instructions. Keep this link safe — it's unique to your session.</p>
          <p>Regards,<br/>Smarti Team</p>
        `;

        if (from) {
          await sendEmail({ from, to: email, subject, html, purpose: 'noreply' });
        } else {
          console.warn('No NOREPLY_SMTP_USER or SMTP_USER set — skipping confirmation email');
        }
      } catch (err) {
        console.error('Failed to send enrollment confirmation email:', err);
      }
    } catch (err) {
      // Zoom creation failure shouldn't block enrollment creation — log and continue
      console.error('Zoom meeting creation error:', err);
    }

    // Return created enrollment (may or may not have meeting fields persisted)
    const fresh = await getEnrollmentById(String(created._id));
    return res.status(201).json(fresh || created);
  } catch (err: any) {
    console.error('Create enrollment error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

export async function getEnrollments(req: Request, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const result = await listEnrollments({ page, limit });
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('List enrollments error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

export async function getEnrollmentCountsHandler(req: Request, res: Response) {
  try {
    const idsRaw = req.query.ids as string | undefined;
    const ids = idsRaw ? idsRaw.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const counts = await getEnrollmentCounts(ids);
    return res.status(200).json(counts);
  } catch (err: any) {
    console.error('Enrollment counts error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

export async function getOneEnrollment(req: Request, res: Response) {
  try {
    const p = await getEnrollmentById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Enrollment not found' });
    return res.status(200).json(p);
  } catch (err: any) {
    console.error('Get enrollment error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

export default {};
