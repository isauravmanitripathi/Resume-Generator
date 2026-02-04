/**
 * PDF Generator using pdfmake
 * Creates multi-page PDFs with selectable text
 */

import type { Profile } from '$lib/db';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Register fonts
pdfMake.vfs = pdfFonts.vfs;

// A4 dimensions in points (1 point = 1/72 inch)
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;

// Color palette (converted from Tailwind)
const COLORS = {
    primary: '#1e293b',    // slate-800
    secondary: '#64748b',  // slate-500
    accent: '#2563eb',     // blue-600
    muted: '#94a3b8',      // slate-400
    light: '#f1f5f9',      // slate-100
};

/**
 * Generate PDF document definition from profile
 */
export function generateResumeDocDefinition(profile: Profile) {
    const content: any[] = [];

    // Header: Name & Title
    content.push({
        text: `${profile.basics.firstName} ${profile.basics.lastName}`.toUpperCase(),
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 5]
    });

    if (profile.basics.title) {
        content.push({
            text: profile.basics.title,
            style: 'title',
            alignment: 'center',
            margin: [0, 0, 0, 10]
        });
    }

    // Contact Info
    const contactItems = [];
    if (profile.basics.email) contactItems.push(profile.basics.email);
    if (profile.basics.phone) contactItems.push(profile.basics.phone);
    if (profile.basics.city) contactItems.push(`${profile.basics.city}, ${profile.basics.state}`);

    if (contactItems.length > 0) {
        content.push({
            text: contactItems.join('  •  '),
            style: 'contact',
            alignment: 'center',
            margin: [0, 0, 0, 20]
        });
    }

    // Professional Summary
    if (profile.basics.summary) {
        content.push({ text: 'PROFESSIONAL PROFILE', style: 'sectionHeader' });
        content.push({ text: profile.basics.summary, style: 'body', margin: [0, 5, 0, 15] });
    }

    // Experience
    if (profile.experience && profile.experience.length > 0) {
        content.push({ text: 'EXPERIENCE', style: 'sectionHeader' });

        profile.experience.forEach((exp, index) => {
            content.push({
                columns: [
                    { text: exp.role, style: 'itemTitle', width: '*' },
                    { text: `${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}`, style: 'date', width: 'auto' }
                ],
                margin: [0, index === 0 ? 5 : 10, 0, 2]
            });

            content.push({ text: exp.company, style: 'company', margin: [0, 0, 0, 3] });

            if (exp.raw_context) {
                content.push({ text: exp.raw_context, style: 'body', margin: [0, 0, 0, 5] });
            }
        });

        content.push({ text: '', margin: [0, 0, 0, 10] });
    }

    // Education
    if (profile.education && profile.education.length > 0) {
        content.push({ text: 'EDUCATION', style: 'sectionHeader' });

        profile.education.forEach((edu, index) => {
            content.push({
                columns: [
                    { text: edu.studyType, style: 'itemTitle', width: '*' },
                    { text: `${edu.startDate} — ${edu.endDate}`, style: 'date', width: 'auto' }
                ],
                margin: [0, index === 0 ? 5 : 10, 0, 2]
            });

            content.push({ text: edu.institution, style: 'company', margin: [0, 0, 0, 3] });

            if (edu.raw_context) {
                content.push({ text: edu.raw_context, style: 'body', margin: [0, 0, 0, 5] });
            }
        });

        content.push({ text: '', margin: [0, 0, 0, 10] });
    }

    // Skills
    if (profile.skills && profile.skills.length > 0) {
        content.push({ text: 'SKILLS', style: 'sectionHeader' });

        const skillNames = profile.skills.map(s => s.name).join('  •  ');
        content.push({ text: skillNames, style: 'skills', margin: [0, 5, 0, 15] });
    }

    // Achievements
    if (profile.achievements && profile.achievements.length > 0) {
        content.push({ text: 'ACHIEVEMENTS', style: 'sectionHeader' });

        profile.achievements.forEach((ach) => {
            content.push({
                text: `• ${ach.title}${ach.date ? ` (${ach.date})` : ''}`,
                style: 'body',
                margin: [0, 3, 0, 0]
            });
        });
    }

    return {
        pageSize: 'A4',
        pageMargins: [MARGIN, MARGIN, MARGIN, MARGIN],
        content,
        styles: {
            header: {
                fontSize: 24,
                bold: true,
                color: COLORS.primary,
            },
            title: {
                fontSize: 12,
                color: COLORS.accent,
                bold: true,
            },
            contact: {
                fontSize: 9,
                color: COLORS.secondary,
            },
            sectionHeader: {
                fontSize: 10,
                bold: true,
                color: COLORS.muted,
                margin: [0, 10, 0, 0],
            },
            itemTitle: {
                fontSize: 11,
                bold: true,
                color: COLORS.primary,
            },
            company: {
                fontSize: 10,
                color: COLORS.accent,
                bold: true,
            },
            date: {
                fontSize: 9,
                color: COLORS.muted,
            },
            body: {
                fontSize: 10,
                color: COLORS.secondary,
                lineHeight: 1.4,
            },
            skills: {
                fontSize: 10,
                color: COLORS.secondary,
            },
        },
        defaultStyle: {
            font: 'Roboto',
        },
    };
}

/**
 * Generate and download PDF
 */
export async function downloadResumePDF(profile: Profile, filename?: string) {
    const docDefinition = generateResumeDocDefinition(profile);
    const pdfName = filename || `${profile.basics.firstName}_${profile.basics.lastName}_Resume.pdf`;

    pdfMake.createPdf(docDefinition).download(pdfName);
}
