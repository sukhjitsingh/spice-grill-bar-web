module.exports=[22099,a=>{"use strict";let b=(0,a.i(57847).registerClientReference)(function(){throw Error("Attempted to call Footer() from the server but Footer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/footer.tsx <module evaluation>","Footer");a.s(["Footer",0,b])},80466,a=>{"use strict";let b=(0,a.i(57847).registerClientReference)(function(){throw Error("Attempted to call Footer() from the server but Footer is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/footer.tsx","Footer");a.s(["Footer",0,b])},20590,a=>{"use strict";a.i(22099);var b=a.i(80466);a.n(b)},48720,a=>{"use strict";let b=(0,a.i(57847).registerClientReference)(function(){throw Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/header.tsx <module evaluation>","Header");a.s(["Header",0,b])},87386,a=>{"use strict";let b=(0,a.i(57847).registerClientReference)(function(){throw Error("Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/header.tsx","Header");a.s(["Header",0,b])},75197,a=>{"use strict";a.i(48720);var b=a.i(87386);a.n(b)},70452,a=>{"use strict";let b=(0,a.i(57847).registerClientReference)(function(){throw Error("Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/theme-provider.tsx <module evaluation>","ThemeProvider");a.s(["ThemeProvider",0,b])},916,a=>{"use strict";let b=(0,a.i(57847).registerClientReference)(function(){throw Error("Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/theme-provider.tsx","ThemeProvider");a.s(["ThemeProvider",0,b])},339,a=>{"use strict";a.i(70452);var b=a.i(916);a.n(b)},68547,a=>{a.v({id:"google-analytics",description:"Install a Google Analytics tag on your website",website:"https://analytics.google.com/analytics/web/",scripts:[{url:"https://www.googletagmanager.com/gtag/js",params:["id"],strategy:"worker",location:"head",action:"append"},{code:"window.dataLayer=window.dataLayer||[];window.gtag=function gtag(){window.dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${args.id}')",strategy:"worker",location:"head",action:"append"}]})},37337,(a,b,c)=>{"use strict";function d(a,b,c=!1){return b?Object.keys(a).filter(a=>c?!b.includes(a):b.includes(a)).reduce((b,c)=>(b[c]=a[c],b),{}):{}}function e(a,b,c,d){let e=d&&Object.keys(d).length>0?new URL(Object.values(d)[0],a):new URL(a);return b&&c&&b.forEach(a=>{c[a]&&e.searchParams.set(a,c[a])}),e.toString()}function f(a,b,c,d,f){var g;if(!b)return`<${a}></${a}>`;let h=(null==(g=b.src)?void 0:g.url)?Object.assign(Object.assign({},b),{src:e(b.src.url,b.src.params,d,f)}):b,i=Object.keys(Object.assign(Object.assign({},h),c)).reduce((a,b)=>{let d=null==c?void 0:c[b],e=h[b],f=null!=d?d:e,g=!0===f?b:`${b}="${f}"`;return f?a+` ${g}`:a},"");return`<${a}${i}></${a}>`}Object.defineProperty(c,"__esModule",{value:!0}),c.formatData=c.createHtml=c.formatUrl=void 0,c.formatUrl=e,c.createHtml=f,c.formatData=function(a,b){var c,g,h,i,j;let k=d(b,null==(c=a.scripts)?void 0:c.reduce((a,b)=>[...a,...Array.isArray(b.params)?b.params:[]],[])),l=d(b,null==(h=null==(g=a.html)?void 0:g.attributes.src)?void 0:h.params),m=d(b,[null==(j=null==(i=a.html)?void 0:i.attributes.src)?void 0:j.slugParam]),n=d(b,[...Object.keys(k),...Object.keys(l),...Object.keys(m)],!0);return Object.assign(Object.assign({},a),{html:a.html?f(a.html.element,a.html.attributes,n,l,m):null,scripts:a.scripts?a.scripts.map(a=>Object.assign(Object.assign({},a),{url:e(a.url,a.params,k)})):null})}},87913,(a,b,c)=>{"use strict";var d=a.e&&a.e.__rest||function(a,b){var c={};for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&0>b.indexOf(d)&&(c[d]=a[d]);if(null!=a&&"function"==typeof Object.getOwnPropertySymbols)for(var e=0,d=Object.getOwnPropertySymbols(a);e<d.length;e++)0>b.indexOf(d[e])&&Object.prototype.propertyIsEnumerable.call(a,d[e])&&(c[d[e]]=a[d[e]]);return c},e=a.e&&a.e.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(c,"__esModule",{value:!0}),c.GoogleAnalytics=void 0;let f=e(a.r(68547)),g=a.r(37337);c.GoogleAnalytics=a=>{var b=d(a,[]);return(0,g.formatData)(f.default,b)}},34954,a=>{a.v({id:"google-maps-embed",description:"Embed a Google Maps embed on your webpage",website:"https://developers.google.com/maps/documentation/embed/get-started",html:{element:"iframe",attributes:{loading:"lazy",src:{url:"https://www.google.com/maps/embed/v1/place",slugParam:"mode",params:["key","q","center","zoom","maptype","language","region"]},referrerpolicy:"no-referrer-when-downgrade",frameborder:"0",style:"border:0",allowfullscreen:!0,width:null,height:null}}})},22160,(a,b,c)=>{"use strict";var d=a.e&&a.e.__rest||function(a,b){var c={};for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&0>b.indexOf(d)&&(c[d]=a[d]);if(null!=a&&"function"==typeof Object.getOwnPropertySymbols)for(var e=0,d=Object.getOwnPropertySymbols(a);e<d.length;e++)0>b.indexOf(d[e])&&Object.prototype.propertyIsEnumerable.call(a,d[e])&&(c[d[e]]=a[d[e]]);return c},e=a.e&&a.e.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(c,"__esModule",{value:!0}),c.GoogleMapsEmbed=void 0;let f=e(a.r(34954)),g=a.r(37337);c.GoogleMapsEmbed=a=>{var b=d(a,[]);return(0,g.formatData)(f.default,b)}},60330,a=>{a.v({id:"youtube-embed",description:"Embed a YouTube embed on your webpage.",website:"https://github.com/paulirish/lite-youtube-embed",html:{element:"lite-youtube",attributes:{videoid:null,playlabel:null}},stylesheets:["https://cdn.jsdelivr.net/gh/paulirish/lite-youtube-embed@master/src/lite-yt-embed.css"],scripts:[{url:"https://cdn.jsdelivr.net/gh/paulirish/lite-youtube-embed@master/src/lite-yt-embed.js",strategy:"idle",location:"head",action:"append"}]})},35133,(a,b,c)=>{"use strict";var d=a.e&&a.e.__rest||function(a,b){var c={};for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&0>b.indexOf(d)&&(c[d]=a[d]);if(null!=a&&"function"==typeof Object.getOwnPropertySymbols)for(var e=0,d=Object.getOwnPropertySymbols(a);e<d.length;e++)0>b.indexOf(d[e])&&Object.prototype.propertyIsEnumerable.call(a,d[e])&&(c[d[e]]=a[d[e]]);return c},e=a.e&&a.e.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(c,"__esModule",{value:!0}),c.YouTubeEmbed=void 0;let f=e(a.r(60330)),g=a.r(37337);c.YouTubeEmbed=a=>{var b=d(a,[]);return(0,g.formatData)(f.default,b)}},11772,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),c.YouTubeEmbed=c.GoogleMapsEmbed=c.GoogleAnalytics=void 0;var d=a.r(87913);Object.defineProperty(c,"GoogleAnalytics",{enumerable:!0,get:function(){return d.GoogleAnalytics}});var e=a.r(22160);Object.defineProperty(c,"GoogleMapsEmbed",{enumerable:!0,get:function(){return e.GoogleMapsEmbed}});var f=a.r(35133);Object.defineProperty(c,"YouTubeEmbed",{enumerable:!0,get:function(){return f.YouTubeEmbed}})},86808,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@next/third-parties/dist/ThirdPartyScriptEmbed.js <module evaluation>"))},20168,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@next/third-parties/dist/ThirdPartyScriptEmbed.js"))},93786,a=>{"use strict";a.i(86808);var b=a.i(20168);a.n(b)},35192,(a,b,c)=>{"use strict";var d=a.e&&a.e.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(c,"__esModule",{value:!0}),c.default=function(a){let{apiKey:b,...c}=a,d={...c,key:b},{html:h}=(0,f.GoogleMapsEmbed)(d);return(0,e.jsx)(g.default,{height:d.height||null,width:d.width||null,html:h,dataNtpc:"GoogleMapsEmbed"})};let e=a.r(9198),f=a.r(11772),g=d(a.r(93786))},91278,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/next/dist/client/script.js <module evaluation>"))},86074,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/next/dist/client/script.js"))},8660,a=>{"use strict";a.i(91278);var b=a.i(86074);a.n(b)},34189,(a,b,c)=>{b.exports=a.r(8660)},73582,(a,b,c)=>{"use strict";var d=a.e&&a.e.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(c,"__esModule",{value:!0}),c.default=function(a){let{html:b,scripts:c,stylesheets:d}=(0,g.YouTubeEmbed)(a);return(0,e.jsx)(h.default,{height:a.height||null,width:a.width||null,html:b,dataNtpc:"YouTubeEmbed",children:null==c?void 0:c.map(a=>(0,e.jsx)(f.default,{src:a.url,strategy:i[a.strategy],stylesheets:d},a.url))})};let e=a.r(9198),f=d(a.r(34189)),g=a.r(11772),h=d(a.r(93786)),i={server:"beforeInteractive",client:"afterInteractive",idle:"lazyOnload",worker:"worker"}},94705,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@next/third-parties/dist/google/gtm.js <module evaluation>"))},16015,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@next/third-parties/dist/google/gtm.js"))},49177,a=>{"use strict";a.i(94705);var b=a.i(16015);a.n(b)},20619,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@next/third-parties/dist/google/ga.js <module evaluation>"))},48146,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(57847);a.n(d("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/@next/third-parties/dist/google/ga.js"))},12100,a=>{"use strict";a.i(20619);var b=a.i(48146);a.n(b)},90819,(a,b,c)=>{"use strict";var d=a.e&&a.e.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(c,"__esModule",{value:!0}),c.sendGAEvent=c.GoogleAnalytics=c.sendGTMEvent=c.GoogleTagManager=c.YouTubeEmbed=c.GoogleMapsEmbed=void 0;var e=a.r(35192);Object.defineProperty(c,"GoogleMapsEmbed",{enumerable:!0,get:function(){return d(e).default}});var f=a.r(73582);Object.defineProperty(c,"YouTubeEmbed",{enumerable:!0,get:function(){return d(f).default}});var g=a.r(49177);Object.defineProperty(c,"GoogleTagManager",{enumerable:!0,get:function(){return g.GoogleTagManager}}),Object.defineProperty(c,"sendGTMEvent",{enumerable:!0,get:function(){return g.sendGTMEvent}});var h=a.r(12100);Object.defineProperty(c,"GoogleAnalytics",{enumerable:!0,get:function(){return h.GoogleAnalytics}}),Object.defineProperty(c,"sendGAEvent",{enumerable:!0,get:function(){return h.sendGAEvent}})},32618,a=>{a.v({className:"inter_c15e96cb-module__0bjUvq__className",variable:"inter_c15e96cb-module__0bjUvq__variable"})},44166,a=>{a.v({className:"playfair_display_3fe9b9c9-module__KpBnya__className",variable:"playfair_display_3fe9b9c9-module__KpBnya__variable"})},17524,a=>{"use strict";var b=a.i(9198),c=a.i(20590),d=a.i(75197),e=a.i(60931),f=a.i(44672);function g(){return(0,b.jsx)("script",{type:"application/ld+json",children:`
        {
          "@context": "https://schema.org",
          "@type": "Menu",
          "name": "Spice Grill & Bar Menu",
          "mainEntityOfPage": "https://spicegrillbar66.com/#menu",
          "hasMenuSection": ${JSON.stringify(f.default.map(a=>({"@type":"MenuSection",name:a.category,hasMenuItem:a.items.map(a=>({"@type":"MenuItem",name:a.name,description:a.description,offers:{"@type":"Offer",price:a.price.toString(),priceCurrency:"USD"},...a.imageUrl?{image:a.imageUrl}:{}}))})))}
        }
      `})}function h(){return(0,b.jsx)("script",{type:"application/ld+json",children:`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Spice Grill & Bar",
          "url": "https://spicegrillbar66.com",
          "logo": "https://spicegrillbar66.com/icon.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-928-277-1292",
            "contactType": "customer service",
            "areaServed": "US",
            "availableLanguage": "en"
          },
          "sameAs": [
            "https://www.facebook.com/profile.php?id=61566349169122",
            "https://www.instagram.com/panjabi_dhaba_sgb"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "33 Lewis Ave",
            "addressLocality": "Ash Fork",
            "addressRegion": "AZ",
            "postalCode": "86320",
            "addressCountry": "US"
          }
        }
      `})}function i(){return(0,b.jsx)("script",{type:"application/ld+json",children:`
        {
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Spice Grill & Bar",
          "url": "https://www.spicegrillbar66.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "33 Lewis Ave",
            "addressLocality": "Ash Fork",
            "addressRegion": "AZ",
            "postalCode": "86320",
            "addressCountry": "US"
          },
          "telephone": "(928) 277-1292",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "http://schema.org/Monday",
                "http://schema.org/Tuesday",
                "http://schema.org/Wednesday",
                "http://schema.org/Thursday",
                "http://schema.org/Friday",
              ],
              "opens": "07:00",
              "closes": "22:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "http://schema.org/Saturday",
                "http://schema.org/Sunday"
              ],
              "opens": "07:00",
              "closes": "22:00"
            }
          ],
          "servesCuisine": ["Indian", "Punjabi", "Vegetarian Friendly", "Vegan Friendly", "Beer", "Wine", "Soft Drinks", "Alcoholic Beverages"],
          "priceRange": "$$",
          "image": "/HomePageBackground.webp",
          "menu": "https://spicegrillbar66.com/#menu",
          "description": "Authentic Indian Restaurant in Ash Fork, AZ. Located on Historic Route 66, the perfect pitstop for Grand Canyon travelers.",
          "areaServed": "Ash Fork",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["#hero-title", "#hero-description", "#philosophy-title"]
          }
        }
      `})}function j(){return(0,b.jsx)("script",{type:"application/ld+json",children:`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://www.spicegrillbar66.com",
  "name": "Spice Grill & Bar",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.spicegrillbar66.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`})}var k=a.i(339),l=a.i(90819),m=a.i(32618);let n={className:m.default.className,style:{fontFamily:"'Inter', 'Inter Fallback'",fontStyle:"normal"}};null!=m.default.variable&&(n.variable=m.default.variable);var o=a.i(44166);let p={className:o.default.className,style:{fontFamily:"'Playfair Display', 'Playfair Display Fallback'",fontStyle:"normal"}};null!=o.default.variable&&(p.variable=o.default.variable);let q={metadataBase:new URL("https://spicegrillbar66.com"),title:"Spice Grill & Bar | Best Indian & Punjabi Food in Ash Fork, AZ (Route 66)",description:"Authentic Punjabi cuisine on historic Route 66 in Ash Fork, AZ. The perfect pit stop for Grand Canyon travelers and riders. Enjoy fresh naan, curry, and tandoori specials. Dine-in & Takeout.",keywords:["Indian Restaurant Ash Fork","Punjabi Food Route 66","Best Indian Food AZ","Spice Grill and Bar","Ash Fork Dining","Route 66 Restaurants","Grand Canyon Food Stop","Biker Friendly Restaurant AZ"],authors:[{name:"Spice Grill & Bar"}],robots:{index:!0,follow:!0,googleBot:{index:!0,follow:!0,"max-video-preview":-1,"max-image-preview":"large","max-snippet":-1}},openGraph:{title:"Spice Grill & Bar | Authentic Punjabi Cuisine on Route 66",description:"Best Indian food in Ash Fork, AZ. Biker-friendly stop on Route 66 near the Grand Canyon. Try our famous butter chicken and garlic naan.",url:"https://spicegrillbar66.com",siteName:"Spice Grill & Bar",locale:"en_US",type:"website",images:[{url:"/opengraph-image.png",width:1200,height:630,alt:"Spice Grill & Bar - Authentic Punjabi Cuisine on Route 66"}]},twitter:{card:"summary_large_image",title:"Spice Grill & Bar | Authentic Punjabi Cuisine on Route 66",description:"Best Indian food in Ash Fork, AZ. Perfect pit stop for Grand Canyon travelers.",images:["/opengraph-image.png"]},other:{"geo.position":"35.2241;-112.4829","geo.placename":"Ash Fork, Arizona","geo.region":"US-AZ"},alternates:{canonical:"/"}};function r({children:a}){return(0,b.jsxs)("html",{lang:"en",suppressHydrationWarning:!0,children:[(0,b.jsx)("body",{className:`${n.variable} ${p.variable} font-sans antialiased transition-colors duration-300`,children:(0,b.jsx)(k.ThemeProvider,{attribute:"class",defaultTheme:"system",enableSystem:!0,disableTransitionOnChange:!0,children:(0,b.jsxs)("div",{className:"flex min-h-screen flex-col",children:[(0,b.jsx)(d.Header,{}),(0,b.jsx)("main",{className:"flex-1",children:a}),(0,b.jsx)(c.Footer,{}),(0,b.jsx)(i,{}),(0,b.jsx)(j,{}),(0,b.jsx)(g,{}),(0,b.jsx)(h,{}),(0,b.jsx)(e.BreadcrumbSchema,{items:[{name:"Home",item:"/"}]})]})})}),(0,b.jsx)(l.GoogleAnalytics,{gaId:"G-Y5QJYGQBL6"})]})}a.s(["default",()=>r,"metadata",0,q],17524)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__c7d187c6._.js.map