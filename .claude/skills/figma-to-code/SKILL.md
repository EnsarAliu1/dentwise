---
name: figma-to-code
description: Convert a Figma frame (link or exported PNG) into DentWise components using shadcn/ui and Tailwind tokens, using as few Figma MCP calls as possible (free plan).
argument-hint: <figma frame link or image> [target route/component]
disable-model-invocation: true
---

Input: $ARGUMENTS

Figma is on the **free plan — only a handful of MCP calls per month**. Spend them carefully.

1. If given a Figma link: extract `fileKey` and `node-id` (convert `-` to `:`). Make ONE
   `get_design_context` call for that frame. Only if needed, ONE `get_screenshot`.
   If the limit is reached, stop and ask for a PNG export instead.
   If given an image: work from the image, no Figma calls.
2. Hand the work to the `ui-designer` agent (or follow its principles):
   - Extract colors, type scale, radius, spacing → map to existing tokens in `src/app/globals.css`;
     propose new tokens if needed (list them).
   - Map each part to existing `src/components/ui` components; list new components to create.
3. Post a plan (tokens, components, files) and WAIT for OK.
4. Build, responsive + dark mode + accessible, with loading/empty/error states.
5. `npm run lint` + `npx tsc --noEmit`, then the Summary format from `CLAUDE.md`. In **Your turn**,
   ask the owner to check the page in the browser at the specific URL.
