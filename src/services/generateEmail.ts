import { loadServerMessages } from "@/messages/server";

type ServerMessages = Awaited<ReturnType<typeof loadServerMessages>>;

export interface EmailData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
	date: string;
	time: string;
}

function interpolate(template: string, values: Record<string, string>) {
	return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export function generatePlainTextEmail(locale: string, greetingName: string, data: EmailData, userZoomLink: string, managementUrl: string, messages: ServerMessages): string {
	return `${interpolate(messages.server.email.hi, { name: greetingName })}

${messages.server.email.thanks}
${interpolate(messages.server.email.seeYou, { date: data.date, time: data.time })} JST

${messages.server.email.serviceBooked}: ${messages.server.email.serviceName}
${messages.server.email.staff}: ${messages.server.email.staffName}
${messages.server.email.platform}: ${messages.server.email.platformValue}
${messages.server.email.dateTimeLabel}: ${data.date} ${data.time}

Zoom link: ${userZoomLink || ""}
${messages.server.email.rescheduleText}: ${managementUrl}

${messages.server.email.calendar.addToCalendar}
Google Calendar: ${generateGoogleCalendarUrl(data.date, data.time)}
Outlook / Teams: ${generateOutlookUrl(data.date, data.time)}

${messages.server.email.contact}
Email: ${messages.server.email.supportEmail}

${messages.server.email.footerWebsite}: ${locale === "ja" ? "https://profitize.jp/" : "https://profitize.jp/en/"}
${messages.server.email.footerPrivacy}: ${locale === "ja" ? "https://profitize.jp/privacy-policy/" : "https://profitize.jp/en/privacy-policy/"}`;
}

export function generateHTMLEmail(locale: string, htmlGreetingName: string, data: EmailData, userZoomLink: string, managementUrl: string, messages: ServerMessages): string {
	const calendarUrl = generateGoogleCalendarUrl(data.date, data.time);
	const outlookUrl = generateOutlookUrl(data.date, data.time);

	return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="${locale}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:48px;">
              <span style="display:inline-block; background-color:#f0f7ff; color:#1e40af; font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:20px;">
                ${messages.server.email.badge}
              </span>
              <h1 style="margin:0; font-size:24px; font-weight:800; color:#0f172a; line-height:1.2;">
                ${messages.server.email.header}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:0 48px 48px 48px; font-size:15px; line-height:1.6; color:#475569;">
              ${interpolate(messages.server.email.hi, { name: htmlGreetingName })}<br><br>
              ${messages.server.email.thanks}<br>
              ${interpolate(messages.server.email.seeYou, { date: data.date, time: data.time })}

              <!-- Detail Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; border-radius:12px; padding:24px; margin:20px 0; border:1px solid #f1f5f9;">
                <tr>
                  <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-bottom:4px;">${messages.server.email.serviceBooked}</td>
                  <td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.serviceName}</td>
                </tr>
                <tr>
                  <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.staff}</td>
                  <td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.staffName}</td>
                </tr>
                <tr>
                  <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.platform}</td>
                  <td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.platformValue}</td>
                </tr>
                <tr>
                  <td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.dateTimeLabel}</td>
                  <td style="font-size:15px; font-weight:600; color:#1e293b;">${data.date} ${data.time} JST</td>
                </tr>
              </table>

              <!-- Zoom Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0; padding:0;">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <a href="${userZoomLink || ""}"
                       style="display:inline-block; background-color:#0f172a; color:#ffffff !important; text-decoration:none !important; padding:13px 24px; border-radius:10px; font-weight:600; font-size:15px;">
                       ${messages.server.email.zoomLink}
                    </a>
                  </td>
                </tr>
              </table>

              <a href="${managementUrl}" style="display:block; text-align:center; margin-top:24px; font-size:13px; color:#64748b; text-decoration:none; font-weight:500; border-bottom:1px solid transparent;">
                ${messages.server.email.rescheduleText}
              </a>

              <!-- Instructions -->
              <div style="font-size:13px; line-height:1.6; color:#64748b; margin-top:32px; padding-top:24px; border-top:1px solid #f1f5f9;">
                ${messages.server.email.contact.split("\\n")[0]}<br>
                <a href="mailto:${messages.server.email.supportEmail}" style="color:#1e40af; text-decoration:none; font-weight:600;">
                  ${messages.server.email.supportEmail}
                </a>
              </div>

              <!-- Calendar links -->
              <div style="margin-top:32px; text-align:center;">
                <a href="${calendarUrl}" style="font-size:12px; color:#0f172a; text-decoration:none; font-weight:700; margin:0 6px;">${messages.server.email.calendar.google}</a>
                <a href="${outlookUrl}" style="font-size:12px; color:#0f172a; text-decoration:none; font-weight:700; margin:0 6px;">${messages.server.email.calendar.outlook}</a>
              </div>

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="540" cellpadding="0" cellspacing="0" border="0" style="margin:40px auto; text-align:center; font-family:Arial, sans-serif; font-size:12px; color:#666;">
          <tr>
            <td>
              <img src="https://profitize.jp/images/logo.png" alt="Profitize.jp" style="max-width:120px; margin-bottom:24px; opacity:0.9; display:block; margin-left:auto; margin-right:auto;">
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:10px;">
              <a href="${locale === "ja" ? "https://profitize.jp/" : "https://profitize.jp/en/"}" style="color:#1a73e8; text-decoration:none; margin-right:15px;">${messages.server.email.footerWebsite}</a>
              <a href="${locale === "ja" ? "https://profitize.jp/privacy-policy/" : "https://profitize.jp/en/privacy-policy/"}" style="color:#1a73e8; text-decoration:none;">${messages.server.email.footerPrivacy}</a>
            </td>
          </tr>
          <tr>
            <td style="font-size:11px; color:#cbd5e1; line-height:1.6;">
              &copy; 2026 Profitize Inc.<br>
              ${messages.server.email.footerCopyright}
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}

export function generateLecturerNotificationHTML(data: EmailData, messages: ServerMessages): string {
	const phoneRow = data.phone.trim() ? `<div class="row"><span class="label">Phone Number:</span><span class="value">${data.phone}</span></div>` : "";

	const messageRow = data.message.trim() ? `<div class="row"><span class="label">Message:</span><span class="value">${data.message}</span></div>` : "";

	return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body { margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  .wrapper { width:100%; table-layout:fixed; padding:40px 0; background-color:#f8fafc; }
  .container { max-width:540px; margin:0 auto; background-color:#fff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden; }
  .header { padding:32px 32px 24px 32px; text-align:center; }
  h2 { margin:0; font-size:20px; font-weight:700; color:#0f172a; }
  .content { padding:0 32px 32px 32px; font-size:15px; color:#475569; line-height:1.6; }
  .detail-card { background-color:#f8fafc; border-radius:12px; padding:20px; border:1px solid #f1f5f9; margin-top:20px; }
  .row { margin-bottom:12px; }
  .label { font-weight:600; color:#94a3b8; margin-right:6px; text-transform:uppercase; font-size:12px; }
  .value { font-weight:500; color:#1e293b; }
  @media screen and (max-width:600px) {
    .wrapper { padding:20px 0; }
    .header, .content { padding:24px; }
  }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h2>New Free Consultation Session Booking</h2>
      </div>

      <div class="content">
        <p>A new user has booked a free consultation session.</p>

        <div class="detail-card">
          <div class="row"><span class="label">Name:</span><span class="value">${data.firstName} ${data.lastName}</span></div>
          <div class="row"><span class="label">Email:</span><span class="value">${data.email}</span></div>
          ${phoneRow}
          ${messageRow}
          <div class="row"><span class="label">Date:</span><span class="value">${data.date}</span></div>
          <div class="row"><span class="label">Time:</span><span class="value">${data.time} (JST)</span></div>
        </div>

        <p style="margin-top:24px;">You can find the event details and the Zoom link in the calendar event description.</p>
        <p>— Booking Notification System</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

export function generateICS({ start, end, title, description, location }: { start: Date; end: Date; title: string; description: string; location: string }): string {
	const formatICSDate = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, "") + "Z";
	return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Profitize//Consultation Session//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT", `UID:${crypto.randomUUID()}@profitize.jp`, `DTSTAMP:${formatICSDate(new Date())}`, `DTSTART:${formatICSDate(start)}`, `DTEND:${formatICSDate(end)}`, `SUMMARY:${title}`, `DESCRIPTION:${description}`, `LOCATION:${location}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}

function generateGoogleCalendarUrl(date: string, time: string): string {
	const start = new Date(`${date}T${time}:00+09:00`);
	const end = new Date(start.getTime() + 30 * 60 * 1000);
	const formatForGoogle = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, "");

	return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Free+Consultation+Session&dates=${formatForGoogle(start)}/${formatForGoogle(end)}&details=Your+free+consultation+session&location=Online`;
}

function generateOutlookUrl(date: string, time: string): string {
	const start = new Date(`${date}T${time}:00+09:00`);
	const end = new Date(start.getTime() + 30 * 60 * 1000);

	return `https://outlook.office.com/calendar/0/deeplink/compose?subject=Free+Consultation+Session&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=Your+free+consultation+session&location=Online`;
}

export function generateRescheduleHTMLEmail(locale: string, firstName: string, lastName: string, oldEventDate: Date, newStart: Date, newEnd: Date, userZoomLink: string, managementUrl: string, messages: ServerMessages): string {
	const calendarUrl = generateGoogleCalendarUrl(newStart.toISOString().split("T")[0], newStart.toISOString().split("T")[1].substring(0, 5));
	const outlookUrl = generateOutlookUrl(newStart.toISOString().split("T")[0], newStart.toISOString().split("T")[1].substring(0, 5));

	const greetingName = locale === "ja" ? lastName : firstName;

	return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0; background-color:#f8fafc;">
  <tr>
    <td align="center">
      <table width="540" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden;">
        
        <tr>
          <td style="padding:48px; text-align:center;">
            <h1 style="margin:0; font-size:24px; font-weight:800; color:#0f172a;">${messages.server.email.rescheduledHeader}</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 48px 48px; font-size:15px; line-height:1.6; color:#475569;">
            <p>${interpolate(messages.server.email.hi, { name: greetingName })}</p>
            <p>${messages.server.email.rescheduledIntro}</p>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; border-radius:12px; padding:24px; margin:20px 0; border:1px solid #f1f5f9;">
              <tr>
                <td style="font-weight:600; color:#94a3b8; text-transform:uppercase; font-size:12px; padding-bottom:4px;">${messages.server.email.originalDate}</td>
                <td style="font-weight:600; color:#1e293b; font-size:15px;">${oldEventDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo", dateStyle: "full", timeStyle: "short" })} JST</td>
              </tr>
              <tr>
                <td style="font-weight:600; color:#94a3b8; text-transform:uppercase; font-size:12px; padding-top:8px; padding-bottom:4px;">${messages.server.email.newDate}</td>
                <td style="font-weight:600; color:#1e293b; font-size:15px;">${newStart.toLocaleString("en-US", { timeZone: "Asia/Tokyo", dateStyle: "full", timeStyle: "short" })} JST</td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
              <tr>
                <td align="center">
                  <a href="${userZoomLink}" style="display:inline-block; background-color:#0f172a; color:#ffffff !important; text-decoration:none !important; padding:13px 24px; border-radius:10px; font-weight:600; font-size:15px;">
                    ${messages.server.email.zoomLink}
                  </a>
                </td>
              </tr>
            </table>

            <p style="text-align:center; margin-top:12px; font-size:13px; color:#64748b;">
              <a href="${managementUrl}" style="text-decoration:none; color:#64748b; font-weight:500; border-bottom:1px solid transparent;">${messages.server.email.changeBooking}</a>
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
              <tr>
                <td align="center">
                  <a href="${calendarUrl}" style="font-size:12px; color:#0f172a; text-decoration:none; font-weight:700; margin:0 6px;">${messages.server.email.calendar.google}</a>
                  <a href="${outlookUrl}" style="font-size:12px; color:#0f172a; text-decoration:none; font-weight:700; margin:0 6px;">${messages.server.email.calendar.outlook}</a>
                </td>
              </tr>
            </table>

            <p style="margin-top:32px; font-size:14px; color:#666;">
              ${messages.server.email.contact} 
              <a href="mailto:${messages.server.email.supportEmail}" style="color:#2563eb; text-decoration:none;">${messages.server.email.supportEmail}</a>
            </p>

            <p style="margin-top:32px;">— ${messages.server.email.teamName}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

</body>
</html>
`;
}

export function generateCancelHTMLEmail(locale: string, firstName: string, lastName: string, eventDate: Date, messages: ServerMessages): string {
	const greetingName = locale === "ja" ? lastName : firstName;

	return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0; background-color:#f8fafc;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden;">
<tr><td style="padding:48px; text-align:center;">
<h1 style="margin:0; font-size:24px; font-weight:800; color:#0f172a;">${messages.server.email.cancelledHeader}</h1>
</td></tr>
<tr><td style="padding:0 48px 48px 48px; font-size:15px; line-height:1.6; color:#475569;">
<p>${interpolate(messages.server.email.hi, { name: greetingName })}</p>
<p>${messages.server.email.cancelledIntro}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; border-radius:12px; padding:24px; margin:20px 0; border:1px solid #f1f5f9;">
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-bottom:4px;">${messages.server.email.serviceBooked}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.serviceName}</td>
</tr>
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.staff}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.staffName}</td>
</tr>
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.platform}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${messages.server.email.platformValue}</td>
</tr>
<tr>
<td style="font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; padding-top:8px; padding-bottom:4px;">${messages.server.email.dateTimeLabel}</td>
<td style="font-size:15px; font-weight:600; color:#1e293b;">${eventDate.toLocaleString(locale === "ja" ? "ja-JP" : "en-US", { timeZone: "Asia/Tokyo", dateStyle: "long", timeStyle: "short" })} JST</td>
</tr>
</table>
<p>${messages.server.email.cancelledAction}</p>
<p style="margin-top:32px; font-size:13px; line-height:1.6; color:#64748b;">
<a href="mailto:${messages.server.email.supportEmail}" style="color:#1e40af; font-weight:600; text-decoration:none;">${messages.server.email.supportEmail}</a>
</p>
<p style="margin-top:32px;">— ${messages.server.email.teamName}</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
`;
}

export function generateLecturerRescheduleNotificationHTML(firstName: string, lastName: string, oldEventDate: Date, newEventDate: Date): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0; background-color:#f8fafc;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04);">
<tr><td style="padding:32px; text-align:center;">
<h2 style="margin:0; font-size:20px; font-weight:700; color:#0f172a;">Consultation Session Rescheduled</h2>
</td></tr>
<tr><td style="padding:0 32px 32px 32px; font-size:15px; color:#475569; line-height:1.6;">
<p>A user has rescheduled their consultation session.</p>
<div style="background-color:#f8fafc; border-radius:12px; padding:20px; border:1px solid #f1f5f9; margin-top:20px;">
<div style="margin-bottom:12px;"><span style="font-weight:600; color:#94a3b8; font-size:12px; text-transform:uppercase;">Name:</span> <span style="color:#1e293b;">${firstName} ${lastName}</span></div>
<div style="margin-bottom:12px;"><span style="font-weight:600; color:#94a3b8; font-size:12px; text-transform:uppercase;">Original Date:</span> <span style="color:#1e293b;">${oldEventDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo", dateStyle: "long", timeStyle: "short" })} JST</span></div>
<div><span style="font-weight:600; color:#94a3b8; font-size:12px; text-transform:uppercase;">New Date:</span> <span style="color:#1e293b;">${newEventDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo", dateStyle: "long", timeStyle: "short" })} JST</span></div>
</div>
<p style="margin-top:24px;">— Booking Notification System</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`;
}

export function generateLecturerCancelNotificationHTML(firstName: string, lastName: string, email: string, eventDate: Date): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body>
A consultation session has been cancelled.
<p>Name: ${firstName} ${lastName}</p>
<p>Email: ${email}</p>
<p>Date: ${eventDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo", dateStyle: "long", timeStyle: "short" })} JST</p>
</body>
</html>
`;
}

/**
 * CONTACT NOTIFICATION - HTML for Lecturer
 */
export function generateContactNotificationHTML(params: { messageId: string; sessionId: string; firstName: string; lastName: string; email: string; safeMessage: string }): string {
	return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 10px 15px -3px rgba(0,0,0,0.04); overflow:hidden;">
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px 0; font-size:20px; font-weight:800; color:#2563eb; line-height:1.2;">
                New Contact Message
              </h2>

              <div style="font-size:15px; line-height:1.6; color:#333;">
                <p style="margin: 0 0 10px 0;"><strong>Message ID:</strong> ${params.messageId}</p>
                <p style="margin: 0 0 10px 0;"><strong>Session ID:</strong> ${params.sessionId}</p>
                <p style="margin: 0 0 10px 0;"><strong>First Name:</strong> ${params.firstName}</p>
                <p style="margin: 0 0 10px 0;"><strong>Last Name:</strong> ${params.lastName}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${params.email}</p>
                
                <div style="margin-top: 20px; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;">
                  <strong style="display: block; margin-bottom: 8px; color: #64748b; font-size: 12px; text-transform: uppercase;">Message:</strong>
                  <div style="color: #1e293b;">${params.safeMessage}</div>
                </div>

                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                
                <p style="margin:0; font-size:13px; color:#666; text-align: center;">
                  — Contact Notification System
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
}
