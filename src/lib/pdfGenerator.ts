/**
 * PDF Generator using pdfmake
 * Creates multi-page PDFs with selectable text
 * Supports multiple template styles: Classic, Modern, Minimal
 */

import type { Profile } from '$lib/db';
// Register fonts dynamically in functions to avoid bundle bloat
// pdfMake imports removed to lazy load

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
        pageSize: 'A4' as any,
        pageMargins: [60, 60, 60, 60] as [number, number, number, number],
        content,
        defaultStyle: { font: 'Roboto' }
    };
}

// ============================================
// EXECUTIVE TEMPLATE
// ============================================
const EXECUTIVE_COLORS = {
    headerBg: '#0f2b4c',   // Dark Blue
    headerText: '#ffffff',
    accent: '#d3cbb8',     // Gold/Tan
    text: '#334155',       // slate-700
    muted: '#64748b',      // slate-500
};

function generateExecutivePDF(profile: Profile) {
    const sidebarContent: any[] = [];
    const mainContent: any[] = [];

    // SIDEBAR CONTENT

    // Contact Info
    const contacts = [];
    if (profile.basics.phone) contacts.push({ icon: 'P', text: profile.basics.phone });
    if (profile.basics.email) contacts.push({ icon: 'M', text: profile.basics.email });
    if (profile.basics.city) contacts.push({ icon: 'L', text: `${profile.basics.city}, ${profile.basics.state}` });
    if (profile.socials.linkedin) contacts.push({ icon: 'in', text: 'LinkedIn' }); // Simplified for PDF
    if (profile.socials.website) contacts.push({ icon: 'W', text: 'Website' });

    if (contacts.length > 0) {
        contacts.forEach(c => {
            sidebarContent.push({
                columns: [
                    {
                        width: 15,
                        canvas: [
                            { type: 'ellipse', x: 7.5, y: 5, r1: 7.5, r2: 7.5, color: EXECUTIVE_COLORS.accent },
                        ]
                    },
                    {
                        width: '*',
                        text: c.text,
                        fontSize: 9,
                        color: EXECUTIVE_COLORS.muted,
                        margin: [5, 1, 0, 0]
                    }
                ],
                margin: [0, 0, 0, 8]
            });
        });
        sidebarContent.push({ text: '', margin: [0, 0, 0, 20] });
    }

    // Summary
    if (profile.basics.summary) {
        sidebarContent.push({
            text: 'SUMMARY',
            fontSize: 10,
            bold: true,
            color: EXECUTIVE_COLORS.accent,
            margin: [0, 0, 0, 2]
        });
        sidebarContent.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 140, y2: 0, lineWidth: 1, lineColor: EXECUTIVE_COLORS.accent }],
            margin: [0, 0, 0, 8]
        });
        sidebarContent.push({
            text: profile.basics.summary,
            fontSize: 9,
            italics: true,
            color: EXECUTIVE_COLORS.text,
            lineHeight: 1.4,
            margin: [0, 0, 0, 20]
        });
    }

    // Skills
    if (profile.skills && profile.skills.length > 0) {
        sidebarContent.push({
            text: 'KEY SKILLS',
            fontSize: 10,
            bold: true,
            color: EXECUTIVE_COLORS.accent,
            margin: [0, 0, 0, 2]
        });
        sidebarContent.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 140, y2: 0, lineWidth: 1, lineColor: EXECUTIVE_COLORS.accent }],
            margin: [0, 0, 0, 8]
        });
        profile.skills.forEach(skill => {
            sidebarContent.push({
                text: skill.name,
                fontSize: 9,
                bold: true,
                color: EXECUTIVE_COLORS.text,
                margin: [0, 0, 0, 4]
            });
        });
    }


    // MAIN CONTENT

    // Experience
    if (profile.experience && profile.experience.length > 0) {
        mainContent.push({
            text: 'PROFESSIONAL EXPERIENCE',
            fontSize: 10,
            bold: true,
            color: EXECUTIVE_COLORS.accent,
            margin: [0, 0, 0, 2]
        });
        mainContent.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 350, y2: 0, lineWidth: 1, lineColor: EXECUTIVE_COLORS.accent }],
            margin: [0, 0, 0, 15]
        });

        profile.experience.forEach(exp => {
            mainContent.push({
                columns: [
                    { text: exp.role.toUpperCase(), fontSize: 10, bold: true, color: '#0f172a', width: '*' },
                    { text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, fontSize: 9, color: EXECUTIVE_COLORS.muted, width: 'auto' }
                ],
                margin: [0, 0, 0, 2]
            });

            mainContent.push({
                text: exp.company,
                fontSize: 9,
                bold: true,
                color: EXECUTIVE_COLORS.muted,
                margin: [0, 0, 0, 5]
            });

            if (exp.raw_context) {
                mainContent.push({
                    text: exp.raw_context,
                    fontSize: 9,
                    color: EXECUTIVE_COLORS.text,
                    lineHeight: 1.4,
                    margin: [0, 0, 0, 15]
                });
            }
        });
    }

    // Education
    if (profile.education && profile.education.length > 0) {
        mainContent.push({
            text: 'EDUCATION',
            fontSize: 10,
            bold: true,
            color: EXECUTIVE_COLORS.accent,
            margin: [0, 10, 0, 2] // extra top margin
        });
        mainContent.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 350, y2: 0, lineWidth: 1, lineColor: EXECUTIVE_COLORS.accent }],
            margin: [0, 0, 0, 15]
        });

        profile.education.forEach(edu => {
            mainContent.push({
                columns: [
                    { text: edu.studyType.toUpperCase(), fontSize: 10, bold: true, color: '#0f172a', width: '*' },
                    { text: `${edu.startDate} - ${edu.endDate}`, fontSize: 9, color: EXECUTIVE_COLORS.muted, width: 'auto' }
                ],
                margin: [0, 0, 0, 2]
            });
            mainContent.push({
                text: edu.institution,
                fontSize: 9,
                bold: true,
                color: EXECUTIVE_COLORS.muted,
                margin: [0, 0, 0, 10]
            });
        });
    }

    return {
        pageSize: 'A4' as any,
        pageMargins: [0, 0, 0, 0] as [number, number, number, number], // Custom margin handling for full header
        content: [
            // Full width header
            {
                table: {
                    widths: ['*'],
                    body: [
                        [{
                            fillColor: EXECUTIVE_COLORS.headerBg,
                            stack: [
                                { text: `${profile.basics.firstName} ${profile.basics.lastName}`.toUpperCase(), fontSize: 28, bold: true, color: 'white', alignment: 'center', margin: [0, 20, 0, 5] },
                                { text: profile.basics.title?.toUpperCase() || '', fontSize: 10, letterSpacing: 2, color: 'white', opacity: 0.8, alignment: 'center', margin: [0, 0, 0, 20] }
                            ],
                            border: [false, false, false, false]
                        }]
                    ]
                }
            },
            // Two column layout below header
            {
                columns: [
                    // Sidebar
                    {
                        width: '32%',
                        stack: sidebarContent,
                        margin: [30, 30, 20, 30] // Left margin for sidebar content
                    },
                    // Vertical Line
                    {
                        width: 0,
                        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 0, y2: 650, lineWidth: 1, lineColor: '#f1f5f9' }]
                    },
                    // Main Content
                    {
                        width: '68%',
                        stack: mainContent,
                        margin: [30, 30, 30, 30] // Right margin for main content
                    }
                ]
            }
        ],
        defaultStyle: { font: 'Roboto' }
    };
}

// ============================================
// ELEGANT TEMPLATE (AMANDA BAKER STYLE)
// ============================================
function generateElegantPDF(profile: Profile) {
    const content: any[] = [];
    const PRIMARY = '#111827'; // slate-900

    // 1. NAME (Centered, Large)
    content.push({
        text: `${profile.basics.firstName} ${profile.basics.lastName}`.toUpperCase(),
        fontSize: 28,
        bold: true,
        color: PRIMARY,
        alignment: 'center',
        margin: [0, 10, 0, 10]
    });

    // 2. CONTACT (Centered, One Line)
    const contacts = [];
    if (profile.basics.phone) contacts.push(profile.basics.phone);
    if (profile.basics.email) contacts.push(profile.basics.email);
    if (profile.socials.linkedin) contacts.push('LinkedIn');
    if (profile.socials.website) contacts.push('Portfolio');
    if (profile.basics.city) contacts.push(`${profile.basics.city}, ${profile.basics.state}`);

    if (contacts.length > 0) {
        content.push({
            text: contacts.join(' | '),
            fontSize: 9,
            alignment: 'center',
            margin: [0, 0, 0, 10]
        });
    }

    // 3. THICK SEPARATOR
    content.push({
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: PRIMARY }],
        margin: [0, 0, 0, 20]
    });

    // 4. PROFILE (Centered Header)
    if (profile.basics.summary) {
        content.push({ text: 'PROFILE', fontSize: 11, bold: true, alignment: 'center', margin: [0, 0, 0, 8] });
        content.push({ text: profile.basics.summary, fontSize: 10, alignment: 'justify', lineHeight: 1.4, margin: [0, 0, 0, 15] });
        // Separator
        content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#94a3b8' }], margin: [0, 5, 0, 15] });
    }

    // 5. EXPERIENCE
    if (profile.experience.length > 0) {
        content.push({ text: 'PROFESSIONAL EXPERIENCE', fontSize: 11, bold: true, alignment: 'center', margin: [0, 0, 0, 15] });

        profile.experience.forEach(exp => {
            content.push({
                columns: [
                    {
                        width: '*',
                        text: [
                            { text: exp.role, bold: true, fontSize: 10 },
                            { text: `, ${exp.company}`, fontSize: 10, italics: true },
                            { text: exp.location ? `, ${exp.location}` : '', fontSize: 10, italics: true }
                        ]
                    },
                    {
                        width: 'auto',
                        text: `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`,
                        fontSize: 9,
                        bold: true,
                        alignment: 'right'
                    }
                ],
                margin: [0, 0, 0, 5]
            });

            if (exp.raw_context) {
                // Simple bullet logic or just text
                const bullets = exp.raw_context.split('\n').filter(line => line.trim().length > 0).map(line => ({
                    text: line.replace(/^•\s*/, ''),
                    fontSize: 10,
                    margin: [0, 2, 0, 2]
                }));

                if (bullets.length > 0) {
                    content.push({
                        ul: bullets,
                        margin: [15, 0, 0, 15]
                    });
                } else {
                    content.push({ text: exp.raw_context, fontSize: 10, margin: [0, 0, 0, 15] });
                }
            } else {
                content.push({ text: '', margin: [0, 0, 0, 10] });
            }
        });

        // Separator
        content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#94a3b8' }], margin: [0, 5, 0, 15] });
    }

    // 6. EDUCATION
    if (profile.education.length > 0) {
        content.push({ text: 'EDUCATION', fontSize: 11, bold: true, alignment: 'center', margin: [0, 0, 0, 15] });

        profile.education.forEach(edu => {
            content.push({
                text: edu.studyType,
                bold: true,
                fontSize: 10,
                alignment: 'center',
                margin: [0, 0, 0, 2]
            });
            content.push({
                text: `${edu.startDate} – ${edu.endDate}`,
                fontSize: 9,
                alignment: 'center',
                margin: [0, 0, 0, 2]
            });
            content.push({
                text: edu.institution,
                fontSize: 10,
                italics: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            });
        });
        // Separator
        content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#94a3b8' }], margin: [0, 5, 0, 15] });
    }

    // 7. SKILLS (Two Columns)
    if (profile.skills.length > 0) {
        content.push({ text: 'KEY SKILLS', fontSize: 11, bold: true, alignment: 'center', margin: [0, 0, 0, 15] });

        const mid = Math.ceil(profile.skills.length / 2);
        const col1 = profile.skills.slice(0, mid);
        const col2 = profile.skills.slice(mid);

        content.push({
            columns: [
                {
                    width: '50%',
                    ul: col1.map(s => ({ text: s.name, fontSize: 10, margin: [0, 2, 0, 2] }))
                },
                {
                    width: '50%',
                    ul: col2.map(s => ({ text: s.name, fontSize: 10, margin: [0, 2, 0, 2] }))
                }
            ],
            margin: [20, 0, 0, 15]
        });

        // Separator
        content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#94a3b8' }], margin: [0, 5, 0, 15] });
    }

    return {
        pageSize: 'A4' as any,
        pageMargins: [40, 40, 40, 40] as [number, number, number, number],
        content,
        defaultStyle: { font: 'Roboto' }
    };
}

// ============================================
// CUPERTINO TEMPLATE (Clean, Apple-inspired)
// ============================================
const CUPERTINO_COLORS = {
    primary: '#111827',    // slate-900 (Text)
    accent: '#000000',     // pure black (Headings)
    secondary: '#6b7280',  // slate-500 (Subtext)
    line: '#e5e7eb',       // slate-200 (Dividers)
};

function generateCupertinoPDF(profile: Profile) {
    const content: any[] = [];

    // 1. Header (Centered)
    // Name
    content.push({
        text: `${profile.basics.firstName} ${profile.basics.lastName}`,
        fontSize: 24,
        bold: true,
        alignment: 'center',
        color: CUPERTINO_COLORS.accent,
        margin: [0, 0, 0, 8]
    });

    // Contact Info (Single Line)
    const contacts = [
        profile.basics.city ? `${profile.basics.city}, ${profile.basics.state}` : '',
        profile.basics.email,
        profile.basics.phone,
        profile.socials.linkedin ? 'LinkedIn' : '',
        profile.socials.github ? 'GitHub' : '',
        profile.socials.website ? 'Portfolio' : ''
    ].filter(Boolean);

    if (contacts.length > 0) {
        content.push({
            text: contacts.join(' • '),
            fontSize: 10,
            color: CUPERTINO_COLORS.primary,
            alignment: 'center',
            margin: [0, 0, 0, 20]
        });
    }

    // 2. Professional Summary
    if (profile.basics.summary) {
        content.push({
            text: 'PROFESSIONAL SUMMARY',
            fontSize: 10,
            bold: true,
            color: CUPERTINO_COLORS.accent,
            margin: [0, 0, 0, 3]
        });
        content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: CUPERTINO_COLORS.primary }],
            margin: [0, 0, 0, 8]
        });
        content.push({
            text: profile.basics.summary,
            fontSize: 10,
            color: CUPERTINO_COLORS.primary,
            lineHeight: 1.4,
            alignment: 'justify',
            margin: [0, 0, 0, 20]
        });
    }

    // 3. Work Experience
    if (profile.experience.length > 0) {
        content.push({
            text: 'WORK EXPERIENCE',
            fontSize: 10,
            bold: true,
            color: CUPERTINO_COLORS.accent,
            margin: [0, 0, 0, 3]
        });
        content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: CUPERTINO_COLORS.primary }],
            margin: [0, 0, 0, 10]
        });

        profile.experience.forEach(exp => {
            // Header Row: Role | Company .............. Location | Dates
            // To achieve "Role | Company", we concat them.
            // Split: Left (Role | Company), Right (City | Dates)
            content.push({
                columns: [
                    {
                        text: [
                            { text: exp.role, bold: true, fontSize: 11, color: CUPERTINO_COLORS.accent },
                            { text: ` | ${exp.company}`, fontSize: 11, color: CUPERTINO_COLORS.primary }
                        ],
                        width: '*'
                    },
                    {
                        text: [
                            { text: exp.location ? `${exp.location} | ` : '', fontSize: 10, color: CUPERTINO_COLORS.primary, italics: true },
                            { text: `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`, fontSize: 10, color: CUPERTINO_COLORS.primary, italics: true }
                        ],
                        width: 'auto',
                        alignment: 'right'
                    }
                ],
                margin: [0, 0, 0, 5]
            });

            if (exp.raw_context) {
                const bullets = exp.raw_context.split('\n').filter(l => l.trim()).map(l => ({
                    text: l.replace(/^•\s*/, ''),
                    fontSize: 10,
                    margin: [0, 3, 0, 3],
                    lineHeight: 1.3
                }));
                content.push({
                    ul: bullets,
                    margin: [15, 0, 0, 15],
                    color: CUPERTINO_COLORS.primary
                });
            } else {
                content.push({ text: '', margin: [0, 0, 0, 15] });
            }
        });
    }

    // 4. Education
    if (profile.education.length > 0) {
        content.push({
            text: 'EDUCATION',
            fontSize: 10,
            bold: true,
            color: CUPERTINO_COLORS.accent,
            margin: [0, 0, 0, 3]
        });
        content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: CUPERTINO_COLORS.primary }],
            margin: [0, 0, 0, 10]
        });

        profile.education.forEach(edu => {
            content.push({
                columns: [
                    { text: edu.institution, bold: true, fontSize: 11, color: CUPERTINO_COLORS.accent, width: '*' },
                    { text: `${edu.startDate} – ${edu.endDate}`, fontSize: 10, color: CUPERTINO_COLORS.primary, alignment: 'right', width: 'auto' }
                ],
                margin: [0, 0, 0, 2]
            });
            content.push({
                columns: [
                    { text: `${edu.studyType} in ${edu.area}`, fontSize: 10, color: CUPERTINO_COLORS.primary, italics: true, width: '*' },
                    { text: edu.location || '', fontSize: 10, color: CUPERTINO_COLORS.primary, italics: true, alignment: 'right', width: 'auto' }
                ],
                margin: [0, 0, 0, 10]
            });
        });
        content.push({ text: '', margin: [0, 5, 0, 5] });
    }

    // 5. Technical Projects (Optional - using Projects array if populated)
    if (profile.projects && profile.projects.length > 0) {
        content.push({
            text: 'TECHNICAL PROJECTS',
            fontSize: 10,
            bold: true,
            color: CUPERTINO_COLORS.accent,
            margin: [0, 0, 0, 3]
        });
        content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: CUPERTINO_COLORS.primary }],
            margin: [0, 0, 0, 10]
        });

        profile.projects.forEach(proj => {
            content.push({
                columns: [
                    {
                        text: [
                            { text: proj.name, bold: true, fontSize: 11, color: CUPERTINO_COLORS.accent },
                            { text: proj.url ? ' | Repository' : '', fontSize: 10, color: CUPERTINO_COLORS.secondary, link: proj.url }
                        ],
                        width: '*'
                    },
                    { text: '', width: 'auto' } // Date usually not in project object, if needed add later
                ],
                margin: [0, 0, 0, 5]
            });

            if (proj.raw_context) {
                const bullets = proj.raw_context.split('\n').filter(l => l.trim()).map(l => ({
                    text: l.replace(/^•\s*/, ''),
                    fontSize: 10,
                    margin: [0, 3, 0, 3],
                    lineHeight: 1.3
                }));
                content.push({
                    ul: bullets,
                    margin: [15, 0, 0, 15],
                    color: CUPERTINO_COLORS.primary
                });
            }
        });
    }

    // 6. Skills
    if (profile.skills.length > 0) {
        content.push({
            text: 'SKILLS',
            fontSize: 10,
            bold: true,
            color: CUPERTINO_COLORS.accent,
            margin: [0, 0, 0, 3]
        });
        content.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: CUPERTINO_COLORS.primary }],
            margin: [0, 0, 0, 10]
        });

        // Simple comma separated list to match the "John Doe" example style (SQL, Python, etc)
        const skillList = profile.skills.map(s => s.name).join(' • ');
        content.push({
            text: skillList,
            fontSize: 10,
            color: CUPERTINO_COLORS.primary,
            lineHeight: 1.5
        });
    }

    return {
        pageSize: 'A4' as any,
        pageMargins: [40, 40, 40, 40] as [number, number, number, number],
        content,
        defaultStyle: { font: 'Roboto' }
    };
}

// ============================================
// MAIN EXPORT (Existing)
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
        case 'executive':
            return generateExecutivePDF(profile);
        case 'elegant':
            return generateElegantPDF(profile);
        case 'cupertino':
            return generateCupertinoPDF(profile);
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

    // Dynamic import to save bundle size
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;

    // Register fonts
    (pdfMake as any).vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

    pdfMake.createPdf(docDefinition).download(pdfName);
}

/**
 * Cover Letter Data Interface
 */
export interface CoverLetterData {
    recipient_name: string;
    company_name: string;
    subject?: string;
    content: string;
}

/**
 * Generate Cover Letter PDF
 */
export async function generateCoverLetterPDF(profile: Profile, data: CoverLetterData, filename?: string) {
    const content: any[] = [];

    // 1. Header removed as per user request
    // Content starts directly with Date


    // 2. Date
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    content.push({ text: today, fontSize: 10, margin: [0, 0, 0, 15] });

    // 3. Recipient
    if (data.recipient_name) {
        content.push({ text: data.recipient_name, fontSize: 10, bold: true, margin: [0, 0, 0, 2] });
    }
    if (data.company_name) {
        content.push({ text: data.company_name, fontSize: 10, margin: [0, 0, 0, 15] });
    }

    // 4. Subject (Optional)
    if (data.subject) {
        content.push({ text: `RE: ${data.subject}`, fontSize: 10, bold: true, margin: [0, 0, 0, 15] });
    }

    // 5. Salutation
    content.push({
        text: `Dear ${data.recipient_name || 'Hiring Manager'},`,
        fontSize: 10,
        margin: [0, 0, 0, 10]
    });

    // 6. Body Content
    // Handle content which might be a single string or paragraphs
    const paragraphs = data.content.split('\n\n');
    paragraphs.forEach(para => {
        if (para.trim()) {
            content.push({ text: para.trim(), fontSize: 10, lineHeight: 1.5, margin: [0, 0, 0, 10], alignment: 'justify' });
        }
    });

    // 7. Sign-off
    content.push({ text: 'Sincerely,', fontSize: 10, margin: [0, 20, 0, 30] });

    content.push({ text: `${profile.basics.firstName} ${profile.basics.lastName}`, fontSize: 10, bold: true });

    // 8. Contact Details (Moved to bottom)
    const contacts = [
        profile.basics.email,
        profile.basics.phone,
        profile.basics.city ? `${profile.basics.city}, ${profile.basics.state}` : ''
    ].filter(Boolean);

    if (contacts.length > 0) {
        content.push({
            text: contacts.join(' | '),
            fontSize: 9,
            color: '#64748b',
            margin: [0, 5, 0, 0]
        });
    }

    const docDefinition = {
        pageSize: 'A4' as any,
        pageMargins: [40, 40, 40, 40] as [number, number, number, number],
        content,
        defaultStyle: { font: 'Roboto' }
    };

    const pdfName = filename || `Cover_Letter_${profile.basics.lastName}.pdf`;

    // Dynamic import
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;

    // Register fonts
    (pdfMake as any).vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

    pdfMake.createPdf(docDefinition).download(pdfName);
}
