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

// SVG to Image conversion functions
const convertSvgToImg = (html) => {
    // Convert SVG elements with class names
    html = html.replace(/<svg[^>]*class="([^"]*)"[^>]*>[\s\S]*?<\/svg>/gi, (match, className) => {
        const widthMatch = match.match(/width="?(\d+)"?/);
        const heightMatch = match.match(/height="?(\d+)"?/);
        const width = widthMatch ? widthMatch[1] : '24';
        const height = heightMatch ? heightMatch[1] : '24';
        const iconName = className.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        
        return '<img src="/images/icons/' + iconName + '.png" alt="' + iconName + '" width="' + width + '" height="' + height + '" style="display: inline-block; vertical-align: middle;" class="icon-img" />';
    });
    
    // Convert SVG elements without class names
    html = html.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, (match) => {
        const widthMatch = match.match(/width="?(\d+)"?/);
        const heightMatch = match.match(/height="?(\d+)"?/);
        const width = widthMatch ? widthMatch[1] : '24';
        const height = heightMatch ? heightMatch[1] : '24';
        
        return '<img src="/images/icons/default-icon.png" alt="icon" width="' + width + '" height="' + height + '" style="display: inline-block; vertical-align: middle;" class="icon-img" />';
    });
    
    return html;
};

const convertReactIconsToImgLinks = (html) => {
    html = html.replace(/<a[^>]*>[\s\S]*?<svg[^>]*>[\s\S]*?<\/svg>[\s\S]*?<\/a>/gi, (match) => {
        const hrefMatch = match.match(/href="([^"]*)"/);
        const href = hrefMatch ? hrefMatch[1] : '#';
        const classMatch = match.match(/class="([^"]*)"/);
        const className = classMatch ? classMatch[1] : '';
        const svgMatch = match.match(/<svg[^>]*>/);
        const widthMatch = svgMatch ? svgMatch[0].match(/width="?(\d+)"?/) : null;
        const heightMatch = svgMatch ? svgMatch[0].match(/height="?(\d+)"?/) : null;
        const width = widthMatch ? widthMatch[1] : '24';
        const height = heightMatch ? heightMatch[1] : '24';
        const iconName = className ? className.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'link-icon';
        
        return '<a href="' + href + '" style="text-decoration: none;" class="' + className + '">' +
               '<img src="/images/icons/' + iconName + '.png" alt="' + iconName + '" width="' + width + '" height="' + height + '" style="display: inline-block; vertical-align: middle;" class="icon-img" />' +
               '</a>';
    });
    
    return html;
};

// Variable mapping for HubSpot
const convertVariablesToHubSpot = (html) => {
    // Contact variables
    html = html.replace(/\{\{contact\.first_name\}\}/g, '{{contact.firstname}}');
    html = html.replace(/\{\{contact\.last_name\}\}/g, '{{contact.lastname}}');
    html = html.replace(/\{\{contact\.email\}\}/g, '{{contact.email}}');
    html = html.replace(/\{\{person\.first_name\}\}/g, '{{contact.firstname}}');
    html = html.replace(/\{\{person\.last_name\}\}/g, '{{contact.lastname}}');
    html = html.replace(/\{\{person\.email\}\}/g, '{{contact.email}}');
    
    // Company variables for CAN-SPAM compliance
    html = html.replace(/\{\{company\.name\}\}/g, '{{site_settings.company_name}}');
    html = html.replace(/\{\{organization\.name\}\}/g, '{{site_settings.company_name}}');
    html = html.replace(/\{\{company\.address\}\}/g, '{{site_settings.company_street_address_1}}');
    html = html.replace(/\{\{company\.city\}\}/g, '{{site_settings.company_city}}');
    html = html.replace(/\{\{company\.state\}\}/g, '{{site_settings.company_state}}');
    html = html.replace(/\{\{company\.zip\}\}/g, '{{site_settings.company_zip}}');
    
    // Unsubscribe links
    html = html.replace(/href="#unsubscribe"/g, 'href="{{unsubscribe_link}}"');
    html = html.replace(/href="#manage-preferences"/g, 'href="{{subscription_preference_page_url}}"');
    
    return html;
};

// Function to convert CSS to inline styles
const inlineStyles = (html, css) => {
    // Basic CSS to inline conversion for common properties
    let inlinedHtml = html;
    
    // Apply common email-safe inline styles
    inlinedHtml = inlinedHtml.replace(/<div([^>]*)>/gi, (match, attributes) => {
        const existingStyle = attributes.match(/style="([^"]*)"/);
        let newStyle = existingStyle ? existingStyle[1] : '';
        if (!newStyle.includes('display:')) newStyle += 'display: block;';
        if (!newStyle.includes('width:') && !attributes.includes('width=')) newStyle += 'width: 100%;';
        return `<div${attributes.replace(/style="[^"]*"/, '')} style="${newStyle}">`;
    });
    
    // Apply styles to images
    inlinedHtml = inlinedHtml.replace(/<img([^>]*)>/gi, (match, attributes) => {
        const existingStyle = attributes.match(/style="([^"]*)"/);
        let newStyle = existingStyle ? existingStyle[1] : '';
        if (!newStyle.includes('border:')) newStyle += 'border: 0;';
        if (!newStyle.includes('outline:')) newStyle += 'outline: none;';
        if (!newStyle.includes('text-decoration:')) newStyle += 'text-decoration: none;';
        if (!newStyle.includes('-ms-interpolation-mode:')) newStyle += '-ms-interpolation-mode: bicubic;';
        return `<img${attributes.replace(/style="[^"]*"/, '')} style="${newStyle}">`;
    });
    
    // Apply styles to tables
    inlinedHtml = inlinedHtml.replace(/<table([^>]*)>/gi, (match, attributes) => {
        const existingStyle = attributes.match(/style="([^"]*)"/);
        let newStyle = existingStyle ? existingStyle[1] : '';
        if (!newStyle.includes('border-collapse:')) newStyle += 'border-collapse: collapse;';
        if (!newStyle.includes('width:') && !attributes.includes('width=')) newStyle += 'width: 100%;';
        return `<table${attributes.replace(/style="[^"]*"/, '')} style="${newStyle}">`;
    });
    
    return inlinedHtml;
};

// Platform formatting functions
const addHubSpotFormatting = (html) => {
    let bodyContent = extractBodyContent(html);
    
    // Convert SVGs to images
    bodyContent = convertSvgToImg(bodyContent);
    bodyContent = convertReactIconsToImgLinks(bodyContent);
    
    // Apply inline styles to content
    bodyContent = inlineStyles(bodyContent, '');
    
    // Build HubSpot email module (NO style tags at all)
    let hubspotHtml = '<!-- HubSpot Email Module -->\n';
    
    // Main email content wrapper with inline styles
    hubspotHtml += '<div style="width: 100%; display: block; font-family: Arial, Helvetica, sans-serif;">\n';
    hubspotHtml += bodyContent + '\n';
    hubspotHtml += '</div>\n\n';
    
    // CAN-SPAM footer with all inline styles
    hubspotHtml += '<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px; border-collapse: collapse; width: 100%;">\n';
    hubspotHtml += '    <tr>\n';
    hubspotHtml += '        <td style="padding: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #666666; border-top: 1px solid #eeeeee; line-height: 1.5;">\n';
    hubspotHtml += '            <div style="margin-bottom: 10px;">\n';
    hubspotHtml += '                {{site_settings.company_name}}<br>\n';
    hubspotHtml += '                {{site_settings.company_street_address_1}}<br>\n';
    hubspotHtml += '                {{site_settings.company_city}}, {{site_settings.company_state}} {{site_settings.company_zip}}\n';
    hubspotHtml += '            </div>\n';
    hubspotHtml += '            <div style="margin-top: 15px;">\n';
    hubspotHtml += '                {{unsubscribe_anchor}}\n';
    hubspotHtml += '            </div>\n';
    hubspotHtml += '            <div style="margin-top: 10px;">\n';
    hubspotHtml += '                <a href="{{unsubscribe_link}}" style="color: #666666; text-decoration: underline; font-size: 12px;">Unsubscribe from this list</a> |\n';
    hubspotHtml += '                <a href="{{unsubscribe_link_all}}" style="color: #666666; text-decoration: underline; font-size: 12px;">Unsubscribe from all emails</a> |\n';
    hubspotHtml += '                <a href="{{subscription_preference_page_url}}" style="color: #666666; text-decoration: underline; font-size: 12px;">Manage Preferences</a>\n';
    hubspotHtml += '            </div>\n';
    hubspotHtml += '        </td>\n';
    hubspotHtml += '    </tr>\n';
    hubspotHtml += '</table>\n';
    hubspotHtml += '{{email_tracking_pixel}}';
    
    return convertVariablesToHubSpot(hubspotHtml);
};

const addMailchimpFormatting = (html) => {
    const headContent = extractHeadContent(html);
    let bodyContent = extractBodyContent(html);
    const bodyAttributes = extractBodyAttributes(html);
    
    bodyContent = convertSvgToImg(bodyContent);
    bodyContent = convertReactIconsToImgLinks(bodyContent);
    
    let mailchimpHtml = '<!-- Mailchimp Email Template -->\n';
    mailchimpHtml += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n';
    mailchimpHtml += '<html xmlns="http://www.w3.org/1999/xhtml">\n';
    mailchimpHtml += '<head>\n';
    mailchimpHtml += '    <meta charset="UTF-8">\n';
    mailchimpHtml += '    <meta name="viewport" content="width=device-width, initial-scale=1">\n';
    mailchimpHtml += '    <title>*|MC:SUBJECT|*</title>\n';
    mailchimpHtml += '    ' + headContent + '\n';
    mailchimpHtml += '    <style type="text/css">\n';
    mailchimpHtml += '        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }\n';
    mailchimpHtml += '        .mcnPreviewText { display: none !important; }\n';
    mailchimpHtml += '        .icon-img { display: inline-block; vertical-align: middle; }\n';
    mailchimpHtml += '        @media only screen and (max-width: 480px) {\n';
    mailchimpHtml += '            .icon-img { max-width: 20px !important; }\n';
    mailchimpHtml += '        }\n';
    mailchimpHtml += '    </style>\n';
    mailchimpHtml += '</head>\n';
    mailchimpHtml += '<body' + bodyAttributes + '>\n';
    mailchimpHtml += '    <span class="mcnPreviewText" style="display:none;">*|MC:PREVIEW_TEXT|*</span>\n';
    mailchimpHtml += '    <center>\n';
    mailchimpHtml += '        <table width="100%" border="0" cellpadding="0" cellspacing="0">\n';
    mailchimpHtml += '            <tr><td align="center" style="padding: 20px;">\n';
    mailchimpHtml += '                <table width="600" border="0" cellpadding="0" cellspacing="0">\n';
    mailchimpHtml += '                    <tr><td>' + bodyContent + '</td></tr>\n';
    mailchimpHtml += '                    <tr><td style="padding: 20px; text-align: center; font-size: 12px; color: #666666;">\n';
    mailchimpHtml += '                        *|LIST:COMPANY|*<br>*|LIST:ADDRESSLINE|*<br>\n';
    mailchimpHtml += '                        <a href="*|UNSUB|*" style="color: #666666;">Unsubscribe</a> |\n';
    mailchimpHtml += '                        <a href="*|UPDATE_PROFILE|*" style="color: #666666;">Update Preferences</a>\n';
    mailchimpHtml += '                    </td></tr>\n';
    mailchimpHtml += '                </table>\n';
    mailchimpHtml += '            </td></tr>\n';
    mailchimpHtml += '        </table>\n';
    mailchimpHtml += '    </center>\n';
    mailchimpHtml += '</body>\n';
    mailchimpHtml += '</html>';
    
    // Replace variables
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.first_name\}\}/g, '*|FNAME|*');
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.last_name\}\}/g, '*|LNAME|*');
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.email\}\}/g, '*|EMAIL|*');
    
    return mailchimpHtml;
};

const addKlaviyoFormatting = (html) => {
    const headContent = extractHeadContent(html);
    let bodyContent = extractBodyContent(html);
    const bodyAttributes = extractBodyAttributes(html);
    
    bodyContent = convertSvgToImg(bodyContent);
    bodyContent = convertReactIconsToImgLinks(bodyContent);
    
    let klaviyoHtml = '<!-- Klaviyo Email Template -->\n';
    klaviyoHtml += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n';
    klaviyoHtml += '<html xmlns="http://www.w3.org/1999/xhtml">\n';
    klaviyoHtml += '<head>\n';
    klaviyoHtml += '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n';
    klaviyoHtml += '    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n';
    klaviyoHtml += '    <title>{% if event.subject %}{{ event.subject }}{% else %}Email Update{% endif %}</title>\n';
    klaviyoHtml += '    ' + headContent + '\n';
    klaviyoHtml += '    <style type="text/css">\n';
    klaviyoHtml += '        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }\n';
    klaviyoHtml += '        .icon-img { display: inline-block; vertical-align: middle; }\n';
    klaviyoHtml += '        @media only screen and (max-width: 480px) {\n';
    klaviyoHtml += '            .icon-img { max-width: 20px !important; }\n';
    klaviyoHtml += '        }\n';
    klaviyoHtml += '    </style>\n';
    klaviyoHtml += '</head>\n';
    klaviyoHtml += '<body' + bodyAttributes + '>\n';
    klaviyoHtml += '    <table width="100%" border="0" cellpadding="0" cellspacing="0">\n';
    klaviyoHtml += '        <tr><td align="center">\n';
    klaviyoHtml += '            <table width="600" border="0" cellpadding="0" cellspacing="0">\n';
    klaviyoHtml += '                <tr><td style="padding: 20px;">' + bodyContent + '</td></tr>\n';
    klaviyoHtml += '            </table>\n';
    klaviyoHtml += '        </td></tr>\n';
    klaviyoHtml += '    </table>\n';
    klaviyoHtml += '    <table width="100%" border="0" cellpadding="0" cellspacing="0">\n';
    klaviyoHtml += '        <tr><td style="padding: 20px; text-align: center; font-size: 12px; color: #666666;">\n';
    klaviyoHtml += '            {{ organization.name|default:"Your Company Name" }}<br>\n';
    klaviyoHtml += '            {% if organization.address %}{{ organization.address }}{% endif %}<br>\n';
    klaviyoHtml += '            <a href="{% unsubscribe_url %}" style="color: #666666;">Unsubscribe</a> |\n';
    klaviyoHtml += '            <a href="{% manage_preferences_url %}" style="color: #666666;">Manage Preferences</a>\n';
    klaviyoHtml += '        </td></tr>\n';
    klaviyoHtml += '    </table>\n';
    klaviyoHtml += '    {% track_opened %}\n';
    klaviyoHtml += '</body>\n';
    klaviyoHtml += '</html>';
    
    // Replace variables
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.first_name\}\}/g, '{{ person.first_name|default:"" }}');
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.last_name\}\}/g, '{{ person.last_name|default:"" }}');
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.email\}\}/g, '{{ person.email }}');
    
    return klaviyoHtml;
};

// Main handler function
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
                minify: true
            });

            if (result.errors.length > 0) {
                console.warn('MJML warnings:', result.errors);
                return res.status(400).json({
                    error: 'MJML validation errors',
                    details: result.errors
                });
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

        // Apply platform-specific formatting
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

        res.status(200).json({ result: htmlOutput });

    } catch (err) {
        console.error('Conversion error:', err);
        res.status(500).json({
            error: 'Conversion failed: ' + err.message
        });
    }
};
