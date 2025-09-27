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

// Function to detect if code is TypeScript
const isTypeScript = (code) => {
    // Common TypeScript patterns
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

// Platform-specific formatting functions
const addHubSpotFormatting = (html) => {
    // HubSpot-specific modifications
    let hubspotHtml = html;
    
    // Add required HubSpot header and footer includes
    const hubspotHeader = `{{ standard_header_includes }}`;
    const hubspotFooter = `{{ standard_footer_includes }}`;
    
    // Add HubSpot module wrapper with required includes
    hubspotHtml = `<!-- HubSpot Email Template -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <title>{{content.html_title}}</title>
    ${hubspotHeader}
    <style type="text/css">
        /* HubSpot specific styles */
        .hs_cos_wrapper_type_module { width: 100% !important; }
        .hs_cos_wrapper { display: block !important; }
        @media only screen and (max-width: 480px) {
            .mobile-hide { display: none !important; }
            .mobile-center { text-align: center !important; }
        }
    </style>
</head>
<body>
    <div id="hs_cos_wrapper_main" class="hs_cos_wrapper hs_cos_wrapper_type_module" style="width:100%;">
        ${hubspotHtml}
    </div>
    <!-- HubSpot tracking -->
    <img src="{{brand_settings.logo.link}}" width="1" height="1" style="display:none;" />
    ${hubspotFooter}
</body>
</html>`;
    
    // Replace deprecated tokens with current ones
    hubspotHtml = hubspotHtml.replace(/\{\{site_settings\.company_domain\}\}/g, '{{brand_settings.logo.link}}');
    hubspotHtml = hubspotHtml.replace(/href="http/g, 'href="{{brand_settings.logo.link}}/');
    hubspotHtml = hubspotHtml.replace(/\{\{site_settings\.email_tracking_pixel\}\}/g, '{{brand_settings.logo.link}}');
    
    // Replace common patterns with HubSpot tokens
    hubspotHtml = hubspotHtml.replace(/\{\{contact\.first_name\}\}/g, '{{contact.firstname}}');
    hubspotHtml = hubspotHtml.replace(/\{\{contact\.last_name\}\}/g, '{{contact.lastname}}');
    hubspotHtml = hubspotHtml.replace(/\{\{company\.name\}\}/g, '{{company.name}}');
    
    return hubspotHtml;
};

const addMailchimpFormatting = (html) => {
    // Mailchimp-specific modifications
    let mailchimpHtml = html;
    
    // Add Mailchimp template structure
    mailchimpHtml = `<!-- Mailchimp Email Template -->
<!-- Mailchimp Email Template -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no"/>
    <meta name="color-scheme" content="light dark"/>
    <meta name="supported-color-schemes" content="light dark"/>
    <title>*|MC:SUBJECT|*</title>
    <style type="text/css">
        /* Reset styles */
        body {
            margin: 0;
            padding: 0;
            min-width: 100% !important;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
            background-color: #ffffff;
        }
        p { margin: 10px 0; padding: 0; }
        table { border-collapse: collapse; }
        h1,h2,h3,h4,h5,h6 { display: block; margin: 0; padding: 0; }
        img,a img { border: 0; height: auto; outline: none; text-decoration: none; display: block; }
        #bodyTable,#bodyCell { height: 100%; margin: 0; padding: 0; width: 100%; }
        .mcnPreviewText { display: none !important; }
        
        /* Responsive styles */
        @media only screen and (min-width: 768px) {
            .templateContainer { width: 600px !important; }
        }
        @media only screen and (max-width: 480px) {
            body,table,td,p,a,li,blockquote { -webkit-text-size-adjust: none !important; }
            body { width: 100% !important; min-width: 100% !important; }
            .mcnImage { width: 100% !important; }
            .mcnTextContent,.mcnBoxedTextContentContainer { padding-right: 18px !important; padding-left: 18px !important; }
            .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent { padding-top: 18px !important; }
            .mcnTextContent { word-break: break-word; }
            h1 { font-size: 22px !important; line-height: 125% !important; }
            h2 { font-size: 20px !important; line-height: 125% !important; }
            h3 { font-size: 18px !important; line-height: 125% !important; }
            h4 { font-size: 16px !important; line-height: 150% !important; }
            .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p { font-size: 14px !important; line-height: 150% !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body { background-color: #1a1a1a !important; color: #ffffff !important; }
            .mcnTextContent,.mcnTextContent p { color: #ffffff !important; }
            a { color: #4da8ff !important; }
        }
    </style>
</head>
<body style="background-color: #ffffff;">
    <!-- Preheader -->
    <span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC:PREVIEW_TEXT|*</span>
    
    <center>
        <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="background-color: #f4f4f4;">
            <tr>
                <td align="center" valign="top" id="bodyCell" style="padding: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer" style="max-width: 600px;">
                        <tr>
                            <td valign="top" id="templateBody">
                                <!-- Main content -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextContentContainer">
                                    <tr>
                                        <td class="mcnTextContent" style="padding: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #333333;">
                                            <h1>Welcome, *|FNAME|*!</h1>
                                            <p>This is a placeholder for your email content. Customize this section with your message, images, and links.</p>
                                            <a href="https://example.com" style="display: inline-block; padding: 10px 20px; background-color: #007c89; color: #ffffff; text-decoration: none; border-radius: 5px;">Call to Action</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td valign="top" id="templateFooter">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextContentContainer">
                                    <tr>
                                        <td class="mcnTextContent" style="padding: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #666666; text-align: center;">
                                            *|LIST:ADDRESSLINE|*<br>
                                            <a href="*|UNSUB|*" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | 
                                            <a href="*|UPDATE_PROFILE|*" style="color: #666666; text-decoration: underline;">Update Preferences</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
    
    <!-- Mailchimp merge tags -->
    <div style="display: none;">
        *|UNSUB|* *|UPDATE_PROFILE|* *|LIST:ADDRESSLINE|* *|REWARDS|*
    </div>
</body>
</html>`;
    
    // Replace common patterns with Mailchimp merge tags
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.first_name\}\}/g, '*|FNAME|*');
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.last_name\}\}/g, '*|LNAME|*');
    mailchimpHtml = mailchimpHtml.replace(/\{\{contact\.email\}\}/g, '*|EMAIL|*');
    mailchimpHtml = mailchimpHtml.replace(/href="#unsubscribe"/g, 'href="*|UNSUB|*"');
    
    return mailchimpHtml;
};

const addKlaviyoFormatting = (html) => {
    // Klaviyo-specific modifications
    let klaviyoHtml = html;
    
    // Add Klaviyo template structure
    klaviyoHtml = `<!-- Klaviyo Email Template -->
<!-- Klaviyo Email Template -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="format-detection" content="date=no"/>
    <meta name="format-detection" content="address=no"/>
    <meta name="format-detection" content="email=no"/>
    <meta name="color-scheme" content="light dark"/>
    <meta name="supported-color-schemes" content="light dark"/>
    <title>{% if event.subject %}{{ event.subject }}{% else %}Your Email Subject{% endif %}</title>
    <style type="text/css">
        /* Reset styles */
        body {
            margin: 0;
            padding: 0;
            min-width: 100% !important;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
        }
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; display: block; }
        
        /* Responsive styles */
        @media only screen and (max-width: 480px) {
            .kl-mobile-hide { display: none !important; }
            .kl-mobile-center { text-align: center !important; }
            .kl-mobile-stack { display: block !important; width: 100% !important; }
            .kl-mobile-full-width { width: 100% !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .dark-mode-bg { background-color: #1a1a1a !important; }
            .dark-mode-text { color: #ffffff !important; }
        }
        
        /* Klaviyo specific classes */
        .kl-container { width: 100%; max-width: 600px; margin: 0 auto; }
        .kl-section { width: 100%; }
        .kl-column { display: inline-block; vertical-align: top; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <!-- Preheader (hidden preview text) -->
    <div style="display: none; max-height: 0; overflow: hidden;">
        {% if event.preview_text %}{{ event.preview_text }}{% else %}Discover our latest offers!{% endif %}
    </div>
    
    <!-- Wrapper table for better Outlook compatibility -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center">
                <table role="presentation" class="kl-container" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 20px;">
                            <!-- Main content goes here -->
                            <!-- Replace ${klaviyoHtml} with actual content -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #333333;">
                                        <!-- Example content -->
                                        <h1>Welcome to Our Newsletter!</h1>
                                        <p>This is a placeholder for your email content. Customize this section with your message, images, and links.</p>
                                        <a href="{{ cta_url | default: 'https://example.com' }}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Call to Action</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    
    <!-- Klaviyo tracking pixel -->
    {% track_opened %}
    
    <!-- Klaviyo unsubscribe footer -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td style="padding: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #666666;">
                {% if organization.name %}{{ organization.name }}{% else %}Your Company Name{% endif %}<br>
                {% if organization.address %}{{ organization.address }}{% else %}123 Example St, City, Country{% endif %}<br>
                <a href="{% unsubscribe_url %}" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | 
                <a href="{% manage_preferences_url %}" style="color: #666666; text-decoration: underline;">Manage Preferences</a>
            </td>
        </tr>
    </table>
</body>
</html>`;
    
    // Replace common patterns with Klaviyo template variables
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.first_name\}\}/g, '{{ person.first_name|default:"there" }}');
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.last_name\}\}/g, '{{ person.last_name }}');
    klaviyoHtml = klaviyoHtml.replace(/\{\{contact\.email\}\}/g, '{{ person.email }}');
    klaviyoHtml = klaviyoHtml.replace(/href="#unsubscribe"/g, 'href="{% unsubscribe_url %}"');
    klaviyoHtml = klaviyoHtml.replace(/\{\{company\.name\}\}/g, '{{ organization.name }}');
    
    // Add Klaviyo-specific attributes for tracking
    klaviyoHtml = klaviyoHtml.replace(/<a\s+href="([^"]*)"([^>]*)>/g, '<a href="$1" data-kl-track-click="true"$2>');
    
    return klaviyoHtml;
};

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
            // Validate MJML structure
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
            // Check if the code is TypeScript
            const isTS = isTypeScript(code);
            
            // Configure Babel presets based on detected language
            const babelPresets = [
                'react',
                ['env', { modules: 'commonjs' }]
            ];
            
            if (isTS) {
                babelPresets.push(['typescript', { 
                    allowDeclareFields: true,
                    allowNamespaces: true,
                    onlyRemoveTypeImports: true
                }]);
            }

            // Transpile JSX/TSX code and convert ES modules to CommonJS
            let transpiledCode;
            try {
                const babelConfig = {
                    filename: isTS ? 'component.tsx' : 'component.jsx', // Required for TypeScript preset
                    presets: babelPresets
                };

                // Only add plugins that are available in @babel/standalone
                if (isTS) {
                    // For TypeScript, we rely mainly on the typescript preset
                    babelConfig.plugins = [];
                } else {
                    // For regular JavaScript, we can use some basic plugins
                    babelConfig.plugins = [];
                }

                transpiledCode = Babel.transform(code, babelConfig).code;
            } catch (babelError) {
                console.error('Babel transformation error:', babelError);
                return res.status(400).json({
                    error: `Code transformation failed: ${babelError.message}. Make sure your ${isTS ? 'TypeScript' : 'JavaScript'} syntax is valid.`
                });
            }

            // Define a comprehensive module map for the sandbox
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
                
                // React Icons modules
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

            // Initialize the module system
            const moduleExports = {};
            const moduleObject = { 
                exports: moduleExports,
                get default() {
                    return this.exports.default;
                }
            };

            // Use a VM to safely execute the transpiled code
            const vm = new VM({
                timeout: 10000, // Increased timeout for complex templates
                sandbox: {
                    React,
                    exports: moduleExports,
                    module: moduleObject,
                    __esModule: true,
                    require: (moduleName) => {
                        if (moduleMap[moduleName]) {
                            return moduleMap[moduleName];
                        }
                        throw new Error(`Module "${moduleName}" is not supported in the sandbox. Available modules: ${Object.keys(moduleMap).join(', ')}`);
                    },
                    console: {
                        log: (...args) => console.log('[Sandbox]', ...args),
                        error: (...args) => console.error('[Sandbox]', ...args),
                        warn: (...args) => console.warn('[Sandbox]', ...args)
                    }
                }
            });

            // Execute the code in the sandbox
            try {
                const script = new VMScript(transpiledCode);
                vm.run(script);
            } catch (vmError) {
                console.error('VM execution error:', vmError);
                return res.status(500).json({
                    error: `Code execution failed: ${vmError.message}`
                });
            }

            // Get the default export - try multiple approaches
            let EmailComponent = moduleExports.default || moduleObject.exports.default || moduleExports;

            // Debug: log what we actually got
            console.log('Module exports:', Object.keys(moduleExports));
            console.log('Module exports default:', moduleExports.default);
            console.log('Component type:', typeof EmailComponent);

            // If the default export is an object, try to find a component within it
            if (EmailComponent && typeof EmailComponent === 'object') {
                console.log('Default export is object, keys:', Object.keys(EmailComponent));
                
                // Common patterns for React components in objects
                const possibleComponentKeys = ['default', 'component', 'Component', 'Email', 'Template'];
                
                for (const key of possibleComponentKeys) {
                    if (EmailComponent[key] && typeof EmailComponent[key] === 'function') {
                        console.log(`Found component at key: ${key}`);
                        EmailComponent = EmailComponent[key];
                        break;
                    }
                }
                
                // If still an object, try the first function property
                if (typeof EmailComponent === 'object') {
                    const functionKeys = Object.keys(EmailComponent).filter(key => 
                        typeof EmailComponent[key] === 'function'
                    );
                    
                    if (functionKeys.length > 0) {
                        console.log(`Using first function property: ${functionKeys[0]}`);
                        EmailComponent = EmailComponent[functionKeys[0]];
                    }
                }
            }

            // If still no component, check if the entire exports object is the component
            if (!EmailComponent && typeof moduleExports === 'function') {
                EmailComponent = moduleExports;
            }

            // Final validation
            if (!EmailComponent) {
                throw new Error(`No default export found. Module exports: ${Object.keys(moduleExports).join(', ') || 'none'}. Make sure your component has 'export default ComponentName'`);
            }

            if (typeof EmailComponent !== 'function') {
                const availableExports = Object.keys(moduleExports).map(key => 
                    `${key}: ${typeof moduleExports[key]}`
                ).join(', ');
                
                throw new Error(`Default export is not a function/component. Got: ${typeof EmailComponent}. Available exports: ${availableExports || 'none'}`);
            }

            // Try to create and validate the component
            let componentElement;
            try {
                componentElement = React.createElement(EmailComponent);
                if (!React.isValidElement(componentElement)) {
                    throw new Error("Component does not return a valid React element");
                }
            } catch (componentError) {
                throw new Error(`Component creation failed: ${componentError.message}`);
            }

            // Render the component to HTML
            try {
                htmlOutput = await render(componentElement);
            } catch (renderError) {
                console.error('Render error:', renderError);
                throw new Error(`Email rendering failed: ${renderError.message}`);
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
            error: `Conversion failed: ${err.message}`
        });
    }
};
