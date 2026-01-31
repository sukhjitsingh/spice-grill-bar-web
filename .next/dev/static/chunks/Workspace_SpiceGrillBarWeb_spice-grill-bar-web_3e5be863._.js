(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FAQSection",
    ()=>FAQSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const faqData = [
    {
        question: "What type of food does Spice Grill & Bar serve?",
        answer: "Spice Grill & Bar serves authentic Punjabi Indian cuisine, featuring Tandoori specialties, rich curries, and freshly baked naans, blending traditional spices with modern culinary excellence."
    },
    {
        question: "Is Spice Grill & Bar halal certified?",
        answer: "Yes, Spice Grill & Bar is 100% Halal certified, ensuring all our meat dishes meet strict halal standards for our guests."
    },
    {
        question: "What are the operating hours for Spice Grill & Bar?",
        answer: "We are open Monday through Thursday from 8:00 AM to 9:00 PM, and Friday through Sunday from 8:00 AM to 10:00 PM."
    },
    {
        question: "Does Spice Grill & Bar have vegetarian or vegan options?",
        answer: "Yes, we offer a wide variety of vegetarian and vegan-friendly dishes, including Shahi Paneer, Dal Tadka, Aloo Gobhi, and Chana Masala, all prepared with authentic spices."
    },
    {
        question: "Where is Spice Grill & Bar located?",
        answer: "We are located at 33 Lewis Ave, Ash Fork, AZ 86320, right on historic Route 66 at Interstate-40 Exit 146, making us a perfect stop for Grand Canyon travelers."
    },
    {
        question: "Do you offer takeout or delivery services?",
        answer: "We offer takeout, pickup, and curbside service. You can place your order online through our secure ordering partner, Toast."
    },
    {
        question: "Is there parking available at the restaurant?",
        answer: "Yes, we have ample parking available for cars and are proud to be a biker-friendly destination with space for motorcycles."
    },
    {
        question: "Does Spice Grill & Bar serve alcohol?",
        answer: "Yes, we serve a selection of Beer, Wine, and other alcoholic beverages to complement your meal."
    },
    {
        question: "What are the most popular dishes at Spice Grill & Bar?",
        answer: "Our guest favorites include Butter Chicken, Goat Curry, Shahi Paneer, Fish Pakora, and our signature Garlic Naan baked over a traditional clay oven."
    },
    {
        question: "Is Spice Grill & Bar kid-friendly or family-friendly?",
        answer: "Yes, we are a family-friendly restaurant with a welcoming atmosphere and seating suitable for both small and large groups, including families with children."
    }
];
function FAQSection() {
    _s();
    const [openIndex, setOpenIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto space-y-4",
        children: faqData.map((faq, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-card rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 transition-all duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setOpenIndex(openIndex === index ? null : index),
                        className: "w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-t-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-lg font-medium text-zinc-900 dark:text-white leading-tight",
                                children: faq.question
                            }, void 0, false, {
                                fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-5 h-5 text-orange-600 dark:text-orange-400 transition-transform duration-300 shrink-0", openIndex === index ? "rotate-180" : "")
                            }, void 0, false, {
                                fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid transition-all duration-300 ease-in-out", openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-6 pb-6 text-zinc-600 dark:text-zinc-300 text-base leading-relaxed",
                                children: faq.answer
                            }, void 0, false, {
                                fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
                                lineNumber: 81,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
                            lineNumber: 80,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                ]
            }, index, true, {
                fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/components/faq-section.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(FAQSection, "7z1SfW1ag/kVV/D8SOtFgmPOJ8o=");
_c = FAQSection;
var _c;
__turbopack_context__.k.register(_c, "FAQSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronDown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }
    ]
];
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("ChevronDown", __iconNode);
;
 //# sourceMappingURL=chevron-down.js.map
}),
"[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Workspace$2f$SpiceGrillBarWeb$2f$spice$2d$grill$2d$bar$2d$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=Workspace_SpiceGrillBarWeb_spice-grill-bar-web_3e5be863._.js.map