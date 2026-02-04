/**
 * PDF Generator using pdfmake
 * Creates multi-page PDFs with selectable text
 * Supports multiple template styles: Classic, Modern, Minimal
 */

import type { Profile } from '$lib/db';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Register fonts
pdfMake.vfs = pdfFonts.vfs;

// A4 dimensions
const MARGIN = 40;

// ============================================
// CLASSIC TEMPLATE
// ============================================
const CLASSIC_COLORS = {
    primary: '#1e293b',    // slate-800
    secondary: '#64748b',  // slate-500
    accent: '#2563eb',     // blue-600
    muted: '#94a3b8',      // slate-400
    border: '#e2e8f0',     // slate-200
};

function generateClassicPDF(profile: Profile) {
    const content: any[] = [];

    // Header: Name & Title (Centered)
    content.push({
        text: `${profile.basics.firstName} ${profile.basics.lastName}`.toUpperCase(),
        fontSize: 28,
        bold: true,
        color: CLASSIC_COLORS.primary,
        alignment: 'center',
        margin: [0, 0, 0, 5]
    });

    if (profile.basics.title) {
        content.push({
            text: profile.basics.title,
            fontSize: 12,
            bold: true,
            color: CLASSIC_COLORS.accent,
            alignment: 'center',
            margin: [0, 0, 0, 10]
        });
    }

    // Contact Info (Centered row)
    const contactItems = [];
    if (profile.basics.email) contactItems.push(profile.basics.email);
    if (profile.basics.phone) contactItems.push(profile.basics.phone);
    if (profile.basics.city) contactItems.push(`${profile.basics.city}, ${profile.basics.state}`);

    if (contactItems.length > 0) {
        content.push({
            text: contactItems.join('  •  '),
            fontSize: 9,
            color: CLASSIC_COLORS.secondary,
            alignment: 'center',
            margin: [0, 0, 0, 25]
        });
    }

    // Summary
    if (profile.basics.summary) {
        content.push({
            text: 'PROFESSIONAL PROFILE',
            fontSize: 10,
            bold: true,
            color: CLASSIC_COLORS.muted,
            margin: [0, 0, 0, 8]
        });
        content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: CLASSIC_COLORS.border }],
            margin: [0, 0, 0, 8]
        });
        content.push({
            text: profile.basics.summary,
            fontSize: 10,
            color: CLASSIC_COLORS.secondary,
            lineHeight: 1.4,
            margin: [0, 0, 0, 20]
        });
    }

    // Two-column layout: Skills/Education on left, Experience on right
    const leftColumn: any[] = [];
    const rightColumn: any[] = [];

    // LEFT: Skills
    if (profile.skills && profile.skills.length > 0) {
        leftColumn.push({
            text: 'SKILLS',
            fontSize: 10,
            bold: true,
            color: CLASSIC_COLORS.muted,
            margin: [0, 0, 0, 8]
        });
        profile.skills.forEach(skill => {
            leftColumn.push({
                text: skill.name,
                fontSize: 9,
                color: CLASSIC_COLORS.primary,
                background: CLASSIC_COLORS.border,
                margin: [0, 0, 0, 4]
            });
        });
        leftColumn.push({ text: '', margin: [0, 0, 0, 15] });
    }

    // LEFT: Education
    if (profile.education && profile.education.length > 0) {
        leftColumn.push({
            text: 'EDUCATION',
            fontSize: 10,
            bold: true,
            color: CLASSIC_COLORS.muted,
            margin: [0, 0, 0, 8]
        });
        profile.education.forEach(edu => {
            leftColumn.push({
                text: edu.studyType,
                fontSize: 10,
                bold: true,
                color: CLASSIC_COLORS.primary,
                margin: [0, 5, 0, 2]
            });
            leftColumn.push({
                text: edu.institution,
                fontSize: 9,
                color: CLASSIC_COLORS.secondary,
                margin: [0, 0, 0, 2]
            });
            leftColumn.push({
                text: `${edu.startDate} - ${edu.endDate}`,
                fontSize: 8,
                color: CLASSIC_COLORS.muted,
                margin: [0, 0, 0, 8]
            });
        });
    }

    // RIGHT: Experience
    if (profile.experience && profile.experience.length > 0) {
        rightColumn.push({
            text: 'EXPERIENCE',
            fontSize: 10,
            bold: true,
            color: CLASSIC_COLORS.muted,
            margin: [0, 0, 0, 8]
        });
        profile.experience.forEach(exp => {
            rightColumn.push({
                text: exp.role,
                fontSize: 11,
                bold: true,
                color: CLASSIC_COLORS.primary,
                margin: [0, 5, 0, 2]
            });
            rightColumn.push({
                text: exp.company,
                fontSize: 10,
                bold: true,
                color: CLASSIC_COLORS.accent,
                margin: [0, 0, 0, 2]
            });
            rightColumn.push({
                text: `${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}`,
                fontSize: 8,
                color: CLASSIC_COLORS.muted,
                margin: [0, 0, 0, 5]
            });
            if (exp.raw_context) {
                rightColumn.push({
                    text: exp.raw_context,
                    fontSize: 9,
                    color: CLASSIC_COLORS.secondary,
                    lineHeight: 1.3,
                    margin: [0, 0, 0, 12]
                });
            }
        });
    }

    // Add columns
    content.push({
        columns: [
            { width: '30%', stack: leftColumn },
            { width: '5%', text: '' },
            { width: '65%', stack: rightColumn }
        ]
    });

    return {
        pageSize: 'A4',
        pageMargins: [MARGIN, MARGIN, MARGIN, MARGIN] as [number, number, number, number],
        content,
        defaultStyle: { font: 'Roboto' }
    };
}

// ============================================
// MODERN TEMPLATE (Dark sidebar)
// ============================================
const MODERN_COLORS = {
    dark: '#0f172a',       // slate-900
    light: '#ffffff',
    accent: '#3b82f6',     // blue-500
    muted: '#94a3b8',      // slate-400
    text: '#334155',       // slate-700
};

function generateModernPDF(profile: Profile) {
    const content: any[] = [];

    // Header with name
    content.push({
        columns: [
            {
                width: '35%',
                stack: [
                    // Name in dark section
                    {
                        text: profile.basics.firstName,
                        fontSize: 24,
                        bold: true,
                        color: MODERN_COLORS.dark,
                        margin: [0, 0, 0, 0]
                    },
                    {
                        text: profile.basics.lastName,
                        fontSize: 24,
                        bold: true,
                        color: MODERN_COLORS.dark,
                        margin: [0, 0, 0, 5]
                    },
                    {
                        text: profile.basics.title?.toUpperCase() || '',
                        fontSize: 9,
                        bold: true,
                        color: MODERN_COLORS.accent,
                        margin: [0, 0, 0, 20]
                    },
                    // Contact
                    {
                        text: 'CONTACT',
                        fontSize: 8,
                        bold: true,
                        color: MODERN_COLORS.muted,
                        margin: [0, 0, 0, 8]
                    },
                    ...(profile.basics.email ? [{
                        text: profile.basics.email,
                        fontSize: 9,
                        color: MODERN_COLORS.text,
                        margin: [0, 0, 0, 4]
                    }] : []),
                    ...(profile.basics.phone ? [{
                        text: profile.basics.phone,
                        fontSize: 9,
                        color: MODERN_COLORS.text,
                        margin: [0, 0, 0, 4]
                    }] : []),
                    ...(profile.basics.city ? [{
                        text: `${profile.basics.city}, ${profile.basics.state}`,
                        fontSize: 9,
                        color: MODERN_COLORS.text,
                        margin: [0, 0, 0, 15]
                    }] : []),
                    // Skills
                    ...(profile.skills && profile.skills.length > 0 ? [
                        {
                            text: 'EXPERTISE',
                            fontSize: 8,
                            bold: true,
                            color: MODERN_COLORS.muted,
                            margin: [0, 10, 0, 8]
                        },
                        ...profile.skills.map(s => ({
                            text: s.name,
                            fontSize: 9,
                            color: MODERN_COLORS.text,
                            margin: [0, 0, 0, 3]
                        }))
                    ] : []),
                    // Education
                    ...(profile.education && profile.education.length > 0 ? [
                        {
                            text: 'EDUCATION',
                            fontSize: 8,
                            bold: true,
                            color: MODERN_COLORS.muted,
                            margin: [0, 15, 0, 8]
                        },
                        ...profile.education.flatMap(edu => [
                            { text: edu.studyType, fontSize: 9, bold: true, color: MODERN_COLORS.dark, margin: [0, 0, 0, 2] },
                            { text: edu.institution, fontSize: 8, color: MODERN_COLORS.muted, margin: [0, 0, 0, 8] }
                        ])
                    ] : [])
                ]
            },
            {
                width: '65%',
                stack: [
                    // Summary
                    ...(profile.basics.summary ? [
                        {
                            text: 'PROFILE',
                            fontSize: 12,
                            bold: true,
                            color: MODERN_COLORS.dark,
                            margin: [0, 0, 0, 8]
                        },
                        {
                            text: profile.basics.summary,
                            fontSize: 10,
                            color: MODERN_COLORS.text,
                            lineHeight: 1.4,
                            margin: [0, 0, 0, 20]
                        }
                    ] : []),
                    // Experience
                    ...(profile.experience && profile.experience.length > 0 ? [
                        {
                            text: 'EXPERIENCE',
                            fontSize: 12,
                            bold: true,
                            color: MODERN_COLORS.dark,
                            margin: [0, 0, 0, 12]
                        },
                        ...profile.experience.flatMap(exp => [
                            {
                                columns: [
                                    { text: exp.role, fontSize: 11, bold: true, color: MODERN_COLORS.dark, width: '*' },
                                    { text: `${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}`, fontSize: 8, color: MODERN_COLORS.muted, width: 'auto' }
                                ],
                                margin: [0, 0, 0, 3]
                            },
                            { text: exp.company, fontSize: 10, bold: true, color: MODERN_COLORS.accent, margin: [0, 0, 0, 5] },
                            ...(exp.raw_context ? [{ text: exp.raw_context, fontSize: 9, color: MODERN_COLORS.text, lineHeight: 1.3, margin: [0, 0, 0, 15] }] : [])
                        ])
                    ] : [])
                ]
            }
        ]
    });

    return {
        pageSize: 'A4',
        pageMargins: [MARGIN, MARGIN, MARGIN, MARGIN] as [number, number, number, number],
        content,
        defaultStyle: { font: 'Roboto' }
    };
}

// ============================================
// MINIMAL TEMPLATE
// ============================================
const MINIMAL_COLORS = {
    primary: '#0f172a',    // slate-900
    secondary: '#64748b',  // slate-500
    muted: '#cbd5e1',      // slate-300
};

function generateMinimalPDF(profile: Profile) {
    const content: any[] = [];

    // Name
    content.push({
        text: `${profile.basics.firstName} ${profile.basics.lastName}`,
        fontSize: 28,
        color: MINIMAL_COLORS.primary,
        margin: [0, 0, 0, 3]
    });

    // Title
    if (profile.basics.title) {
        content.push({
            text: profile.basics.title.toUpperCase(),
            fontSize: 9,
            bold: true,
            color: MINIMAL_COLORS.secondary,
            letterSpacing: 2,
            margin: [0, 0, 0, 15]
        });
    }

    // Contact (simple row)
    const contacts = [profile.basics.email, profile.basics.city].filter(Boolean);
    if (contacts.length > 0) {
        content.push({
            text: contacts.join('  •  '),
            fontSize: 8,
            color: MINIMAL_COLORS.muted,
            margin: [0, 0, 0, 25]
        });
    }

    // Summary
    if (profile.basics.summary) {
        content.push({
            text: profile.basics.summary,
            fontSize: 10,
            color: MINIMAL_COLORS.secondary,
            lineHeight: 1.5,
            margin: [0, 0, 0, 30]
        });
    }

    // Experience
    if (profile.experience && profile.experience.length > 0) {
        content.push({
            text: 'EXPERIENCE',
            fontSize: 8,
            bold: true,
            color: MINIMAL_COLORS.muted,
            letterSpacing: 3,
            margin: [0, 0, 0, 15]
        });

        profile.experience.forEach(exp => {
            content.push({
                columns: [
                    {
                        width: '25%',
                        text: `${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}`,
                        fontSize: 8,
                        color: MINIMAL_COLORS.muted
                    },
                    {
                        width: '75%',
                        stack: [
                            { text: exp.role, fontSize: 11, bold: true, color: MINIMAL_COLORS.primary, margin: [0, 0, 0, 2] },
                            { text: exp.company, fontSize: 9, color: MINIMAL_COLORS.secondary, margin: [0, 0, 0, 5] },
                            ...(exp.raw_context ? [{ text: exp.raw_context, fontSize: 9, color: MINIMAL_COLORS.secondary, lineHeight: 1.3, margin: [0, 0, 0, 0] }] : [])
                        ]
                    }
                ],
                margin: [0, 0, 0, 20]
            });
        });
    }

    // Skills & Education side by side
    const hasSkills = profile.skills && profile.skills.length > 0;
    const hasEducation = profile.education && profile.education.length > 0;

    if (hasSkills || hasEducation) {
        content.push({
            columns: [
                hasSkills ? {
                    width: '50%',
                    stack: [
                        { text: 'SKILLS', fontSize: 8, bold: true, color: MINIMAL_COLORS.muted, letterSpacing: 3, margin: [0, 0, 0, 10] },
                        ...profile.skills!.map(s => ({ text: `• ${s.name}`, fontSize: 9, color: MINIMAL_COLORS.secondary, margin: [0, 0, 0, 3] }))
                    ]
                } : { width: '50%', text: '' },
                hasEducation ? {
                    width: '50%',
                    stack: [
                        { text: 'EDUCATION', fontSize: 8, bold: true, color: MINIMAL_COLORS.muted, letterSpacing: 3, margin: [0, 0, 0, 10] },
                        ...profile.education!.flatMap(edu => [
                            { text: edu.studyType, fontSize: 10, bold: true, color: MINIMAL_COLORS.primary, margin: [0, 0, 0, 2] },
                            { text: edu.institution, fontSize: 9, color: MINIMAL_COLORS.secondary, margin: [0, 0, 0, 10] }
                        ])
                    ]
                } : { width: '50%', text: '' }
            ],
            margin: [0, 20, 0, 0]
        });
    }

    return {
        pageSize: 'A4',
        pageMargins: [60, 60, 60, 60] as [number, number, number, number],
        content,
        defaultStyle: { font: 'Roboto' }
    };
}

// ============================================
// MAIN EXPORT
// ============================================

/**
 * Generate PDF document definition based on template
 */
export function generateResumeDocDefinition(profile: Profile, templateId: string = 'classic') {
    switch (templateId) {
        case 'modern':
            return generateModernPDF(profile);
        case 'minimal':
            return generateMinimalPDF(profile);
        case 'classic':
        default:
            return generateClassicPDF(profile);
    }
}

/**
 * Generate and download PDF
 */
export async function downloadResumePDF(profile: Profile, templateId: string = 'classic', filename?: string) {
    const docDefinition = generateResumeDocDefinition(profile, templateId);
    const pdfName = filename || `${profile.basics.firstName}_${profile.basics.lastName}_Resume.pdf`;

    pdfMake.createPdf(docDefinition).download(pdfName);
}
