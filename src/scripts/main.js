import Alpine from "alpinejs";
import * as prettier from "https://unpkg.com/prettier@3.4.1/standalone.mjs";
import postCSSPrettierPlugin from "https://unpkg.com/prettier@3.4.1/plugins/postcss.mjs";

window.Alpine = Alpine;

Alpine.data("codeDemo", (id) => ({
  codeDisplay: "",

  async logCSS() {
    const stylesheetLink = document.querySelector(`#${id}-styles`);
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
        });

        this.codeDisplay = formatted;
      } else {
        console.error("No CSS rules found or stylesheet is inaccessible.");
      }
    } else {
      console.error('<link rel="stylesheet"> not found.');
    }
  },
}));

Alpine.start();
