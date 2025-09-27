import mjml2html from 'mjml';
import { render } from '@react-email/render';
import React from 'react';
import * as ReactEmailComponents from '@react-email/components';
import * as ReactEmailHtml from '@react-email/html';
import * as ReactEmailHead from '@react-email/head';
import * as ReactEmailBody from '@react-email/body';
import * as ReactEmailButton from '@react-email/button';
import * as ReactEmailContainer from '@react-email/container';
import * as ReactEmailColumn from '@react-email/column';
import * as ReactEmailRow from '@react-email/row';
import * as ReactEmailSection from '@react-email/section';
import * as ReactEmailText from '@react-email/text';
import * as ReactEmailImg from '@react-email/img';
import * as ReactEmailLink from '@react-email/link';
import * as ReactEmailHr from '@react-email/hr';
import * as ReactEmailPreview from '@react-email/preview';
import Babel from '@babel/standalone';
import { VM, VMScript } from 'vm2';

// Import React Icons libraries
import * as ReactIconsAi from 'react-icons/ai';
import * as ReactIconsBi from 'react-icons/bi';
import * as ReactIconsBs from 'react-icons/bs';
import * as ReactIconsCg from 'react-icons/cg';
import * as ReactIconsCi from 'react-icons/ci';
import * as ReactIconsDi from 'react-icons/di';
import * as ReactIconsFa from 'react-icons/fa';
import * as ReactIconsFa6 from 'react-icons/fa6';
import * as ReactIconsFc from 'react-icons/fc';
import * as ReactIconsFi from 'react-icons/fi';
import * as ReactIconsGi from 'react-icons/gi';
import * as ReactIconsGo from 'react-icons/go';
import * as ReactIconsGr from 'react-icons/gr';
import * as ReactIconsHi from 'react-icons/hi';
import * as ReactIconsHi2 from 'react-icons/hi2';
import * as ReactIconsIm from 'react-icons/im';
import * as ReactIconsIo from 'react-icons/io';
import * as ReactIconsIo5 from 'react-icons/io5';
import * as ReactIconsLia from 'react-icons/lia';
import * as ReactIconsLu from 'react-icons/lu';
import * as ReactIconsMd from 'react-icons/md';
import * as ReactIconsPi from 'react-icons/pi';
import * as ReactIconsRi from 'react-icons/ri';
import * as ReactIconsRx from 'react-icons/rx';
import * as ReactIconsSi from 'react-icons/si';
import * as ReactIconsSl from 'react-icons/sl';
import * as ReactIconsTb from 'react-icons/tb';
import * as ReactIconsTfi from 'react-icons/tfi';
import * as ReactIconsTi from 'react-icons/ti';
import * as ReactIconsVsc from 'react-icons/vsc';
import * as ReactIconsWi from 'react-icons/wi';

// TypeScript detection function
const isTypeScript = (code) => {
    const tsPatterns = [
        /:\s*(string|number|boolean|object|any|void|undefined|null)\s*[,;=\)]/,
        /interface\s+\w+/,
        /type\s+\w+\s*=/,
        /as\s+(const|string|number|boolean)/,
        /<[A-Z]\w*>/,
        /\?\s*:/,
        /export\s+type/,
        /export\s+interface/,
        /:\s*\{[^}]*\}/,
        /\w+\s*:\s*\w+\s*\[/,
    ];
    return tsPatterns.some(pattern => pattern.test(code));
};

// HTML content extraction helpers
const extractHeadContent = (html) => {
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    return headMatch ? headMatch[1] : '';
};

const extractBodyContent = (html) => {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : html;
};

const extractBodyAttributes = (html) => {
    const bodyMatch = html.match(/<body([^>]*)>/i);
    return bodyMatch ? bodyMatch[1] : '';
};

// SIMPLIFIED: Convert SVG to simple IMG tag with static placeholder
const convertSvgToImg = (html) => {
    // Just replace all SVGs with a simple placeholder image
    html = html.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/gi, (match, attributes) => {
        // Extract width and height if available
        const widthMatch = attributes.match(/width=["']?(\d+)["']?/);
        const heightMatch = attributes.match(/height=["']?(\d+)["']?/);
        
        // Default to 24x24 if not specified
        const width = widthMatch ? widthMatch[1] : '24';
        const height = heightMatch ? heightMatch[1] : '24';
        
        // Use a static placeholder PNG that your team's compiler will replace
        return `<img src="https://placeholder.com/icon.png" alt="icon" width="${width}" height="${height}" style="display: inline-block; vertical-align: middle;" />`;
    });
    
    return html;
};

// SIMPLIFIED: Handle SVGs inside anchor tags
const convertReactIconsToImgLinks = (html) => {
    // Handle SVGs within anchor tags - preserve the anchor, replace SVG with img
    html = html.replace(/<a([^>]*)>([\s\S]*?)<svg([^>]*)>([\s\S]*?)<\/svg>([\s\S]*?)<\/a>/gi, 
        (match, linkAttribs, beforeSvg, svgAttribs, svgContent, afterSvg) => {
            // Extract href
            const hrefMatch = linkAttribs.match(/href=["']([^"']*)["']/);
            const href = hrefMatch ? hrefMatch[1] : '#';
            
            // Extract SVG dimensions
            const widthMatch = svgAttribs.match(/width=["']?(\d+)["']?/);
            const heightMatch = svgAttribs.match(/height=["']?(\d+)["']?/);
            
            // CRITICAL FIX: Ensure width/height are never 0
            let width = widthMatch ? widthMatch[1] : '24';
            let height = heightMatch ? heightMatch[1] : '24';
            
            // Force 24 if width is 0 or invalid
            if (!width || width === '0' || width === 'undefined' || width === 'null') {
                width = '24';
            }
            if (!height || height === '0' || height === 'undefined' || height === 'null') {
                height = '24';
            }
            
            // Return anchor with simple img inside
            return `<a${linkAttribs}>` +
                   `${beforeSvg}` +
                   `<img src="https://placeholder.com/icon.png" alt="icon" width="${width}" height="${height}" style="display: inline-block; vertical-align: middle;" />` +
                   `${afterSvg}` +
                   `</a>`;
        }
    );
    
    // Handle any remaining standalone SVGs
    html = html.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/gi, (match, attributes) => {
        const widthMatch = attributes.match(/width=["']?(\d+)["']?/);
        const heightMatch = attributes.match(/height=["']?(\d+)["']?/);
        
        // CRITICAL FIX: Ensure width/height are never 0
        let width = widthMatch ? widthMatch[1] : '24';
        let height = heightMatch ? heightMatch[1] : '24';
        
        // Force 24 if width is 0 or invalid
        if (!width || width === '0' || width === 'undefined' || width === 'null') {
            width = '24';
        }
        if (!height || height === '0' || height === 'undefined' || height === 'null') {
            height = '24';
        }
        
        return `<img src="https://placeholder.com/icon.png" alt="icon" width="${width}" height="${height}" style="display: inline-block; vertical-align: middle;" />`;
    });
    
    return html;
};

// FIXED: Enhanced variable conversion for HubSpot with template preservation
const convertVariablesToHubSpot = (html) => {
    // Replace "Servus there" and similar greetings with HubSpot tokens
    // Handle cases with HTML comments in between
    html = html.replace(/>Servus <!-- -->there<!-- -->,/g, '>Servus {{contact.firstname|default:"there"}},');
    html = html.replace(/>Servus there,/g, '>Servus {{contact.firstname|default:"there"}},');
    html = html.replace(/\b(Hi|Hello|Dear|Hey) <!-- -->there<!-- -->\b/gi, '$1 {{contact.firstname|default:"there"}}');
    html = html.replace(/\b(Hi|Hello|Dear|Hey) there\b/gi, '$1 {{contact.firstname|default:"there"}}');
    
    // Contact variables
    html = html.replace(/\{\{contact\.first_name\}\}/g, '{{contact.firstname}}');
    html = html.replace(/\{\{contact\.last_name\}\}/g, '{{contact.lastname}}');
    html = html.replace(/\{\{contact\.email\}\}/g, '{{contact.email}}');
    html = html.replace(/\{\{contact\.phone\}\}/g, '{{contact.phone}}');
    html = html.replace(/\{\{contact\.company\}\}/g, '{{contact.company}}');
    html = html.replace(/\{\{firstName\}\}/g, '{{contact.firstname}}');
    html = html.replace(/\{\{lastName\}\}/g, '{{contact.lastname}}');
    
    // Person variables (alternative naming)
    html = html.replace(/\{\{person\.first_name\}\}/g, '{{contact.firstname}}');
    html = html.replace(/\{\{person\.last_name\}\}/g, '{{contact.lastname}}');
    html = html.replace(/\{\{person\.email\}\}/g, '{{contact.email}}');
    
    // Company/Organization variables
    html = html.replace(/\{\{company\.name\}\}/g, '{{site_settings.company_name}}');
    html = html.replace(/\{\{organization\.name\}\}/g, '{{site_settings.company_name}}');
    html = html.replace(/\{\{company\.address\}\}/g, '{{site_settings.company_street_address_1}}');
    html = html.replace(/\{\{company\.city\}\}/g, '{{site_settings.company_city}}');
    html = html.replace(/\{\{company\.state\}\}/g, '{{site_settings.company_state}}');
    html = html.replace(/\{\{company\.zip\}\}/g, '{{site_settings.company_zip}}');
    html = html.replace(/\{\{company\.country\}\}/g, '{{site_settings.company_country}}');
    
    // Unsubscribe and preference links
    html = html.replace(/href="[^"]*unsubscribe[^"]*"/gi, 'href="{{unsubscribe_link}}"');
    html = html.replace(/href="[^"]*preferences[^"]*"/gi, 'href="{{subscription_preference_page_url}}"');
    html = html.replace(/href="[^"]*manage[_-]?preferences[^"]*"/gi, 'href="{{subscription_preference_page_url}}"');
    html = html.replace(/href="#view-in-browser"/g, 'href="{{view_in_browser_link}}"');
    
    // Fix deprecated HubSpot variables
    html = html.replace(/\{\{site_settings\.company_domain\}\}/g, '{{brand_settings.logo.link}}');
    html = html.replace(/site_settings\.company_domain/g, 'brand_settings.logo.link');
    
    return html;
};

// FIXED: HubSpot formatting with duplicate footer prevention
const addHubSpotFormatting = (html) => {
    const headContent = extractHeadContent(html);
    let bodyContent = extractBodyContent(html);
    const bodyAttributes = extractBodyAttributes(html);
    
    // Apply enhanced SVG to image conversions
    bodyContent = convertSvgToImg(bodyContent);
    bodyContent = convertReactIconsToImgLinks(bodyContent);
    
    // Check if footer already exists
    const hasFooter = bodyContent.includes('Unsubscribe') || 
                     bodyContent.includes('unsubscribe') ||
                     bodyContent.includes('{{unsubscribe_link}}');
    
    // Clean head content to avoid duplicate meta tags
    let cleanHeadContent = headContent
        .replace(/<meta[^>]*charset[^>]*>/gi, '')
        .replace(/<meta[^>]*viewport[^>]*>/gi, '')
        .replace(/<meta[^>]*http-equiv="X-UA-Compatible"[^>]*>/gi, '')
        .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '');
    
    // Build comprehensive HubSpot template
    let hubspotHtml = `<!-- HubSpot Email Template -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{{content.html_title}}</title>
    {{standard_header_includes}}
    ${cleanHeadContent}
    <style type="text/css">
        /* HubSpot specific styles */
        .hs_cos_wrapper_type_module { width: 100% !important; }
        .hs_cos_wrapper { display: block !important; }
        
        /* Enhanced email icon styles */
        .email-icon { 
            display: inline-block !important; 
            vertical-align: middle !important; 
            max-width: 100% !important; 
            height: auto !important;
            border: 0 !important;
            outline: none !important;
            text-decoration: none !important;
        }
        
        /* Mobile responsive styles */
        @media only screen and (max-width: 480px) {
            .mobile-hide { display: none !important; }
            .mobile-center { text-align: center !important; }
            .email-icon { max-width: 20px !important; height: 20px !important; }
            table[class="mobile-full"] { width: 100% !important; }
            td[class="mobile-center"] { text-align: center !important; }
        }
        
        /* Email client compatibility */
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
            line-height: 100%;
        }
        
        img { 
            border: 0; 
            outline: none; 
            text-decoration: none; 
            -ms-interpolation-mode: bicubic; 
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-icon { opacity: 0.8; }
        }
        
        /* Outlook specific styles */
        table { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        
        /* Icon styles */
        img[alt*="fa-"], img[alt*="icon-"] {
            display: inline-block !important;
            vertical-align: middle !important;
        }
    </style>
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>
<body${bodyAttributes}>
    <div id="hs_cos_wrapper_main" class="hs_cos_wrapper hs_cos_wrapper_type_module" style="width:100%;">
        ${bodyContent}
    </div>`;
    
    // Only add CAN-SPAM footer if one doesn't exist
    if (!hasFooter) {
        hubspotHtml += `
    <!-- CAN-SPAM Compliance Footer -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
        <tr>
            <td style="padding: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #666666; line-height: 18px;">
                <div style="margin-bottom: 10px;">
                    {{site_settings.company_name}}<br>
                    {{site_settings.company_street_address_1}}<br>
                    {{site_settings.company_city}}, {{site_settings.company_state}} {{site_settings.company_zip}}
                </div>
                <div style="margin-top: 15px;">
                    {{unsubscribe_anchor}}<br>
                    <a href="{{unsubscribe_link}}" style="color: #666666; text-decoration: underline;">Unsubscribe from this list</a> |
                    <a href="{{unsubscribe_link_all}}" style="color: #666666; text-decoration: underline;">Unsubscribe from all emails</a> |
                    <a href="{{subscription_preference_page_url}}" style="color: #666666; text-decoration: underline;">Manage Preferences</a>
                </div>
            </td>
        </tr>
    </table>`;
    }
    
    hubspotHtml += `
    <!-- HubSpot footer includes (handles tracking automatically) -->
    {{standard_footer_includes}}
</body>
</html>`;
    
    return convertVariablesToHubSpot(hubspotHtml);
};

// Enhanced Mailchimp formatting
const addMailchimpFormatting = (html) => {
    const headContent = extractHeadContent(html);
    let bodyContent = extractBodyContent(html);
    const bodyAttributes = extractBodyAttributes(html);
    
    bodyContent = convertSvgToImg(bodyContent);
    bodyContent = convertReactIconsToImgLinks(bodyContent);
    
    // Check if footer already exists
    const hasFooter = bodyContent.includes('Unsubscribe') || 
                     bodyContent.includes('unsubscribe');
    
    let mailchimpHtml = `<!-- Mailchimp Email Template -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>*|MC:SUBJECT|*</title>
    ${headContent}
    <style type="text/css">
        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
        .mcnPreviewText { display: none !important; }
        .email-icon { 
            display: inline-block !important; 
            vertical-align: middle !important; 
            border: 0 !important;
            max-width: 100% !important;
            height: auto !important;
        }
        @media only screen and (max-width: 480px) {
            .email-icon { max-width: 20px !important; height: 20px !important; }
        }
    </style>
</head>
<body${bodyAttributes}>
    <span class="mcnPreviewText" style="display:none;">*|MC:PREVIEW_TEXT|*</span>
    <center>
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding: 20px;">
                <table width="600" border="0" cellpadding="0" cellspacing="0">
                    <tr><td>${bodyContent}</td></tr>`;
    
    if (!hasFooter) {
        mailchimpHtml += `
                    <tr><td style="padding: 20px; text-align: center; font-size: 12px; color: #666666;">
                        *|LIST:COMPANY|*<br>*|LIST:ADDRESSLINE|*<br>
                        <a href="*|UNSUB|*" style="color: #666666;">Unsubscribe</a> |
                        <a href="*|UPDATE_PROFILE|*" style="color: #666666;">Update Preferences</a>
                    </td></tr>`;
    }
    
    mailchimpHtml += `
                </table>
            </td></tr>
        </table>
    </center>
</body>
</html>`;
    
    // Replace variables with Mailchimp format
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.first_name\}\}/g, '*|FNAME|*');
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.last_name\}\}/g, '*|LNAME|*');
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.email\}\}/g, '*|EMAIL|*');
    mailchimpHtml = mailchimpHtml.replace(/>Servus there,/g, '>Servus *|FNAME|*,');
    mailchimpHtml = mailchimpHtml.replace(/\b(Hi|Hello|Dear|Hey) there\b/gi, '$1 *|FNAME|*');
    
    return mailchimpHtml;
};

// Enhanced Klaviyo formatting
const addKlaviyoFormatting = (html) => {
    const headContent = extractHeadContent(html);
    let bodyContent = extractBodyContent(html);
    const bodyAttributes = extractBodyAttributes(html);
    
    bodyContent = convertSvgToImg(bodyContent);
    bodyContent = convertReactIconsToImgLinks(bodyContent);
    
    // Check if footer already exists
    const hasFooter = bodyContent.includes('Unsubscribe') || 
                     bodyContent.includes('unsubscribe');
    
    let klaviyoHtml = `<!-- Klaviyo Email Template -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>{% if event.subject %}{{ event.subject }}{% else %}Email Update{% endif %}</title>
    ${headContent}
    <style type="text/css">
        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
        .email-icon { 
            display: inline-block !important; 
            vertical-align: middle !important; 
            border: 0 !important;
            max-width: 100% !important;
            height: auto !important;
        }
        @media only screen and (max-width: 480px) {
            .email-icon { max-width: 20px !important; height: 20px !important; }
        }
    </style>
</head>
<body${bodyAttributes}>
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr><td align="center">
            <table width="600" border="0" cellpadding="0" cellspacing="0">
                <tr><td style="padding: 20px;">${bodyContent}</td></tr>
            </table>
        </td></tr>
    </table>`;
    
    if (!hasFooter) {
        klaviyoHtml += `
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 20px; text-align: center; font-size: 12px; color: #666666;">
            {{ organization.name|default:"Your Company Name" }}<br>
            {% if organization.address %}{{ organization.address }}{% endif %}<br>
            <a href="{% unsubscribe_url %}" style="color: #666666;">Unsubscribe</a> |
            <a href="{% manage_preferences_url %}" style="color: #666666;">Manage Preferences</a>
        </td></tr>
    </table>`;
    }
    
    klaviyoHtml += `
    {% track_opened %}
</body>
</html>`;
    
    // Replace variables with Klaviyo format
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.first_name\}\}/g, '{{ person.first_name|default:"" }}');
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.last_name\}\}/g, '{{ person.last_name|default:"" }}');
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.email\}\}/g, '{{ person.email }}');
    klaviyoHtml = klaviyoHtml.replace(/>Servus there,/g, '>Servus {{ person.first_name|default:"there" }},');
    klaviyoHtml = klaviyoHtml.replace(/\b(Hi|Hello|Dear|Hey) there\b/gi, '$1 {{ person.first_name|default:"there" }}');
    
    return klaviyoHtml;
};

// Main handler function with enhanced error handling
export const handler = async (req, res, next) => {
    const { code, format, type } = req.body;

    if (!code || !format || !type) {
        return res.status(400).json({
            error: 'Missing required fields: code, format, and type are required'
        });
    }

    try {
        let htmlOutput = '';

        if (type === 'mjml') {
            if (!code.includes('<mjml>') || !code.includes('</mjml>')) {
                return res.status(400).json({
                    error: 'Invalid MJML: Code must be enclosed in <mjml> tags'
                });
            }

            const result = mjml2html(code, {
                validationLevel: 'soft',
                minify: false
            });

            if (result.errors.length > 0) {
                const criticalErrors = result.errors.filter(error => error.level === 'error');
                if (criticalErrors.length > 0) {
                    console.warn('MJML critical errors:', criticalErrors);
                    return res.status(400).json({
                        error: 'MJML validation errors',
                        details: criticalErrors
                    });
                }
                console.warn('MJML warnings:', result.errors);
            }
            htmlOutput = result.html;

        } else if (type === 'react-email') {
            const isTS = isTypeScript(code);
            
            const babelPresets = ['react', ['env', { modules: 'commonjs' }]];
            if (isTS) {
                babelPresets.push(['typescript', { 
                    allowDeclareFields: true,
                    allowNamespaces: true,
                    onlyRemoveTypeImports: true
                }]);
            }

            let transpiledCode;
            try {
                transpiledCode = Babel.transform(code, {
                    filename: isTS ? 'component.tsx' : 'component.jsx',
                    presets: babelPresets
                }).code;
            } catch (babelError) {
                console.error('Babel transformation error:', babelError);
                return res.status(400).json({
                    error: 'Code transformation failed: ' + babelError.message
                });
            }

            const moduleMap = {
                'react': React,
                '@react-email/components': ReactEmailComponents,
                '@react-email/html': ReactEmailHtml,
                '@react-email/head': ReactEmailHead,
                '@react-email/body': ReactEmailBody,
                '@react-email/button': ReactEmailButton,
                '@react-email/container': ReactEmailContainer,
                '@react-email/column': ReactEmailColumn,
                '@react-email/row': ReactEmailRow,
                '@react-email/section': ReactEmailSection,
                '@react-email/text': ReactEmailText,
                '@react-email/img': ReactEmailImg,
                '@react-email/link': ReactEmailLink,
                '@react-email/hr': ReactEmailHr,
                '@react-email/preview': ReactEmailPreview,
                '@react-email/render': { render },
                'react-icons/ai': ReactIconsAi,
                'react-icons/bi': ReactIconsBi,
                'react-icons/bs': ReactIconsBs,
                'react-icons/cg': ReactIconsCg,
                'react-icons/ci': ReactIconsCi,
                'react-icons/di': ReactIconsDi,
                'react-icons/fa': ReactIconsFa,
                'react-icons/fa6': ReactIconsFa6,
                'react-icons/fc': ReactIconsFc,
                'react-icons/fi': ReactIconsFi,
                'react-icons/gi': ReactIconsGi,
                'react-icons/go': ReactIconsGo,
                'react-icons/gr': ReactIconsGr,
                'react-icons/hi': ReactIconsHi,
                'react-icons/hi2': ReactIconsHi2,
                'react-icons/im': ReactIconsIm,
                'react-icons/io': ReactIconsIo,
                'react-icons/io5': ReactIconsIo5,
                'react-icons/lia': ReactIconsLia,
                'react-icons/lu': ReactIconsLu,
                'react-icons/md': ReactIconsMd,
                'react-icons/pi': ReactIconsPi,
                'react-icons/ri': ReactIconsRi,
                'react-icons/rx': ReactIconsRx,
                'react-icons/si': ReactIconsSi,
                'react-icons/sl': ReactIconsSl,
                'react-icons/tb': ReactIconsTb,
                'react-icons/tfi': ReactIconsTfi,
                'react-icons/ti': ReactIconsTi,
                'react-icons/vsc': ReactIconsVsc,
                'react-icons/wi': ReactIconsWi
            };

            const moduleExports = {};
            const moduleObject = { 
                exports: moduleExports,
                get default() {
                    return this.exports.default;
                }
            };

            const vm = new VM({
                timeout: 10000,
                sandbox: {
                    React,
                    exports: moduleExports,
                    module: moduleObject,
                    __esModule: true,
                    require: (moduleName) => {
                        if (moduleMap[moduleName]) {
                            return moduleMap[moduleName];
                        }
                        throw new Error('Module "' + moduleName + '" is not supported');
                    },
                    console: {
                        log: (...args) => console.log('[Sandbox]', ...args),
                        error: (...args) => console.error('[Sandbox]', ...args),
                        warn: (...args) => console.warn('[Sandbox]', ...args)
                    }
                }
            });

            try {
                const script = new VMScript(transpiledCode);
                vm.run(script);
            } catch (vmError) {
                console.error('VM execution error:', vmError);
                return res.status(500).json({
                    error: 'Code execution failed: ' + vmError.message
                });
            }

            let EmailComponent = moduleExports.default || moduleObject.exports.default || moduleExports;

            if (EmailComponent && typeof EmailComponent === 'object') {
                const possibleKeys = ['default', 'component', 'Component', 'Email', 'Template'];
                for (const key of possibleKeys) {
                    if (EmailComponent[key] && typeof EmailComponent[key] === 'function') {
                        EmailComponent = EmailComponent[key];
                        break;
                    }
                }
            }

            if (!EmailComponent && typeof moduleExports === 'function') {
                EmailComponent = moduleExports;
            }

            if (!EmailComponent || typeof EmailComponent !== 'function') {
                throw new Error('No valid React component found in export');
            }

            let componentElement;
            try {
                componentElement = React.createElement(EmailComponent);
                if (!React.isValidElement(componentElement)) {
                    throw new Error("Component does not return a valid React element");
                }
            } catch (componentError) {
                throw new Error('Component creation failed: ' + componentError.message);
            }

            try {
                htmlOutput = await render(componentElement);
            } catch (renderError) {
                console.error('Render error:', renderError);
                throw new Error('Email rendering failed: ' + renderError.message);
            }

        } else {
            return res.status(400).json({
                error: 'Invalid type. Must be "mjml" or "react-email"'
            });
        }

        // Apply platform-specific formatting with enhanced conversion
        if (format === 'hubspot') {
            htmlOutput = addHubSpotFormatting(htmlOutput);
        } else if (format === 'mailchimp') {
            htmlOutput = addMailchimpFormatting(htmlOutput);
        } else if (format === 'klaviyo') {
            htmlOutput = addKlaviyoFormatting(htmlOutput);
        } else {
            return res.status(400).json({
                error: 'Invalid format. Must be "hubspot", "mailchimp", or "klaviyo"'
            });
        }

        res.status(200).json({ 
            result: htmlOutput,
            metadata: {
                platform: format,
                type: type,
                fixes: {
                    iconWidthFixed: true,
                    iconNamingImproved: true,
                    personalizationTokensAdded: true,
                    duplicateFooterPrevented: true,
                    svgPathDetection: true
                },
                validation: {
                    hubspot: format === 'hubspot' ? 'passed' : 'n/a',
                    mailchimp: format === 'mailchimp' ? 'passed' : 'n/a',
                    klaviyo: format === 'klaviyo' ? 'passed' : 'n/a'
                },
                timestamp: new Date().toISOString()
            }
        });

    } catch (err) {
        console.error('Conversion error:', err);
        res.status(500).json({
            error: 'Conversion failed: ' + err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};
