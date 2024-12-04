import Alpine from "alpinejs";
import * as prettier from "https://unpkg.com/prettier@3.4.1/standalone.mjs";
import postCSSPrettierPlugin from "https://unpkg.com/prettier@3.4.1/plugins/postcss.mjs";
import htmlPrettierPlugin from "https://unpkg.com/prettier@3.4.1/plugins/html.mjs";

window.Alpine = Alpine;

const getBreakpoint = () => {
  const breakpoints = {
    base: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  };

  const breakpoint = Object.entries(breakpoints).reduce((acc, [k, v]) => {
    if (window.matchMedia(`(min-width: ${v}px)`).matches) {
      acc = k;
    }

    return acc;
  }, null);

  return breakpoint;
};

const getPrintWidth = () => {
  const breakpoint = getBreakpoint();
  const printWidths = {
    base: 40,
    sm: 50,
    md: 60,
    lg: 70,
    xl: 80,
  };

  return printWidths[breakpoint];
};

Alpine.data("modal", () => ({
  targetExample: null,
  cssDisplay: null,
  htmlDisplay: null,
  cssOrHtml: "css",

  init() {
    this.$watch("targetExample", async (value) => {
      if (value) {
        const rootDialogEl = this.$root;
        if (rootDialogEl instanceof HTMLDialogElement) {
          rootDialogEl.showModal();
        }

        // GET CSS
        const stylesheetLink = document.querySelector(`#${value}-styles`);
        if (stylesheetLink) {
          // Access the stylesheet object
          const stylesheet = stylesheetLink.sheet;

          if (stylesheet && stylesheet.cssRules) {
            // Initialize an array to hold the CSS text
            const rules = [];

            // Iterate over the CSS rules
            for (const rule of stylesheet.cssRules) {
              rules.push(rule.cssText); // Add each rule as a string
            }

            // Join the rules with line breaks to simulate how it would look in a text editor
            const fullStylesheetText = rules.join("\n");

            const formatted = await prettier.format(fullStylesheetText, {
              parser: "css",
              plugins: [postCSSPrettierPlugin],
              printWidth: getPrintWidth(),
            });

            this.cssDisplay = formatted;
          } else {
            console.error("No CSS rules found or stylesheet is inaccessible.");
          }
        } else {
          console.error('<link rel="stylesheet"> not found.');
        }

        // GET HTML
        const htmlElement = document.querySelector(`.q4-spinner--${value}`);
        if (htmlElement) {
          const html = htmlElement.outerHTML;

          const formatted = await prettier.format(html, {
            parser: "html",
            plugins: [htmlPrettierPlugin],
            printWidth: getPrintWidth(),
          });

          this.htmlDisplay = formatted;
        } else {
          console.error("Spinner HTML not found.");
        }
      }
    });
  },

  get cssOrHtmlDisplay() {
    return this.cssOrHtml === "css" ? this.cssDisplay : this.htmlDisplay;
  },

  handleShowCode(evt) {
    const { targetSelected } = evt.detail;
    this.targetExample = targetSelected;
  },

  closeModal() {
    const rootEl = this.$root;
    if (rootEl instanceof HTMLDialogElement) {
      this.$root.close();
    }

    this.targetExample = null;
    this.cssDisplay = null;
    this.htmlDisplay = null;
  },
}));

Alpine.start();
