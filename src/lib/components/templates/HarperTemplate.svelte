<script lang="ts">
  import type { Profile } from '$lib/db';

  interface Props {
    profile: Profile;
  }

  let { profile } = $props<Props>();
</script>

<div class="bg-white text-black min-h-[297mm]" style="font-family: 'Georgia', 'Times New Roman', serif; padding: 36px 44px;">

  <!-- Header -->
  <header class="flex justify-between items-start pb-3 mb-1" style="border-bottom: 2px solid #111;">
    <div>
      <h1 style="font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.1; color: #111;">
        {profile.basics.firstName} {profile.basics.lastName}
      </h1>
      {#if profile.basics.title}
        <p style="font-size: 11px; color: #555; font-style: italic; margin-top: 4px; font-family: 'Georgia', serif; letter-spacing: 0.3px;">
          {profile.basics.title}
        </p>
      {/if}
    </div>

    <div style="text-align: right; font-size: 9.5px; color: #444; line-height: 1.7; font-family: Arial, sans-serif; padding-top: 2px;">
      {#if profile.basics.email}<div>{profile.basics.email}</div>{/if}
      {#if profile.basics.phone}<div>{profile.basics.phone}</div>{/if}
      {#if profile.basics.city}
        <div>{profile.basics.city}{profile.basics.state ? `, ${profile.basics.state}` : ''}</div>
      {/if}
      {#if profile.socials.linkedin}
        <div>{profile.socials.linkedin.replace('https://www.', '').replace('https://', '')}</div>
      {/if}
      {#if profile.socials.github}
        <div>{profile.socials.github.replace('https://', '')}</div>
      {/if}
      {#if profile.socials.website}
        <div>{profile.socials.website.replace('https://', '')}</div>
      {/if}
    </div>
  </header>

  <!-- Personal Summary -->
  {#if profile.basics.summary}
    <section style="margin-top: 20px; margin-bottom: 18px;">
      <h2 style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #111; border-bottom: 0.75px solid #aaa; padding-bottom: 3px; margin-bottom: 8px; font-family: Arial, sans-serif;">
        Personal Summary
      </h2>
      <p style="font-size: 10.5px; line-height: 1.65; color: #222; text-align: justify; font-family: 'Georgia', serif;">
        {profile.basics.summary}
      </p>
    </section>
  {/if}

  <!-- Education -->
  {#if profile.education.length > 0}
    <section style="margin-bottom: 18px;">
      <h2 style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #111; border-bottom: 0.75px solid #aaa; padding-bottom: 3px; margin-bottom: 10px; font-family: Arial, sans-serif;">
        Education
      </h2>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        {#each profile.education as edu}
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <div style="font-size: 10.5px; font-weight: 700; color: #111;">{edu.institution}</div>
              <div style="font-size: 10px; color: #444; margin-top: 1px; font-style: italic;">
                {edu.studyType}{edu.area ? ` in ${edu.area}` : ''}
              </div>
              {#if edu.raw_context}
                <div style="font-size: 9.5px; color: #555; margin-top: 4px; line-height: 1.55; font-family: Arial, sans-serif;">
                  {edu.raw_context}
                </div>
              {/if}
            </div>
            <div style="text-align: right; font-size: 9.5px; color: #666; flex-shrink: 0; margin-left: 20px; font-family: Arial, sans-serif; padding-top: 1px;">
              <div>{edu.startDate} – {edu.endDate}</div>
              {#if edu.location}<div style="margin-top: 1px;">{edu.location}</div>{/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Work Experience -->
  {#if profile.experience.length > 0}
    <section style="margin-bottom: 18px;">
      <h2 style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #111; border-bottom: 0.75px solid #aaa; padding-bottom: 3px; margin-bottom: 10px; font-family: Arial, sans-serif;">
        Work Experience
      </h2>
      <div style="display: flex; flex-direction: column; gap: 14px;">
        {#each profile.experience as exp}
          <div style="break-inside: avoid; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <div>
                <span style="font-size: 10.5px; font-weight: 700; color: #111;">{exp.role}</span>
                <span style="font-size: 10px; color: #777; margin: 0 5px;">—</span>
                <span style="font-size: 10px; color: #333; font-style: italic;">{exp.company}</span>
              </div>
              <div style="font-size: 9.5px; color: #666; flex-shrink: 0; margin-left: 16px; font-family: Arial, sans-serif; text-align: right;">
                {#if exp.location}<span>{exp.location} &nbsp;|&nbsp; </span>{/if}
                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
              </div>
            </div>
            {#if exp.raw_context}
              <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 2px;">
                {#each exp.raw_context.split('\n').filter(l => l.trim()) as line}
                  <div style="display: flex; gap: 6px; font-size: 10px; color: #333; line-height: 1.55; font-family: Arial, sans-serif;">
                    <span style="flex-shrink: 0; margin-top: 1px; color: #777;">•</span>
                    <span>{line.replace(/^[•\-]\s*/, '')}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Projects -->
  {#if profile.projects && profile.projects.length > 0}
    <section style="margin-bottom: 18px;">
      <h2 style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #111; border-bottom: 0.75px solid #aaa; padding-bottom: 3px; margin-bottom: 10px; font-family: Arial, sans-serif;">
        Projects
      </h2>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        {#each profile.projects as proj}
          <div style="break-inside: avoid; page-break-inside: avoid;">
            <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px;">
              <span style="font-size: 10.5px; font-weight: 700; color: #111;">{proj.name}</span>
              {#if proj.url}
                <span style="color: #ccc; font-size: 10px;">|</span>
                <a href={proj.url} target="_blank" style="font-size: 9.5px; color: #666; font-family: Arial, sans-serif; text-decoration: none;">
                  {proj.url.replace('https://', '')}
                </a>
              {/if}
            </div>
            {#if proj.raw_context}
              <div style="margin-top: 3px; display: flex; flex-direction: column; gap: 2px;">
                {#each proj.raw_context.split('\n').filter(l => l.trim()) as line}
                  <div style="display: flex; gap: 6px; font-size: 10px; color: #333; line-height: 1.55; font-family: Arial, sans-serif;">
                    <span style="flex-shrink: 0; margin-top: 1px; color: #777;">•</span>
                    <span>{line.replace(/^[•\-]\s*/, '')}</span>
                  </div>
                {/each}
              </div>
            {:else if proj.description}
              <p style="font-size: 10px; color: #444; margin-top: 3px; line-height: 1.5; font-family: Arial, sans-serif;">{proj.description}</p>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Skills -->
  {#if profile.skills.length > 0}
    <section>
      <h2 style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #111; border-bottom: 0.75px solid #aaa; padding-bottom: 3px; margin-bottom: 10px; font-family: Arial, sans-serif;">
        Skills &amp; Technologies
      </h2>
      <p style="font-size: 10px; color: #333; line-height: 1.7; font-family: Arial, sans-serif;">
        {profile.skills.map(s => s.name).join(' • ')}
      </p>
    </section>
  {/if}

</div>
