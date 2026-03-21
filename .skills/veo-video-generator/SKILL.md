# Veo Video Generator

Use this skill to generate high-fidelity cinematic videos using Veo (Google's generative video model) for any project. This skill handles prompt engineering, API interaction, polling for completion, and final download.

## When to Use
- When the user asks to "generate a video", "create a cinematic loop", "make a video background", or "generate a veo video".
- When you identify a "slot" in the UI (like a Hero background or feature card) that would benefit from premium video content.
- When working on a project that requires a "crypto-native", "premium", or "lux" aesthetic.

## Usage Workflow
1. **Identify the Slot**: Determine where the video will be used (e.g., `public/video/hero.mp4`).
2. **Engineer the Prompt**: Create a high-fidelity prompt following the "Agri-DeFi Noir" or project-specific aesthetic.
3. **Execute Generation**: Run the bundled Python script using `run_shell_command`.
4. **Integration**: Update the React/HTML code to point to the newly generated file.

## Execution Pattern
You must use the bundled `generate.py` script. The Gemini API key is available in your global context or `AIzaSyDp14ZICeOgFQs2lCRNKqnzlB_fNTYiXPY`.

```bash
python3 path/to/scripts/generate.py \
  --prompt "[YOUR_ENHANCED_PROMPT]" \
  --output "public/video/[FILENAME].mp4" \
  --api_key "AIzaSyDp14ZICeOgFQs2lCRNKqnzlB_fNTYiXPY"
```

## Prompt Engineering Guidelines
- **Lighting**: Specify lighting (e.g., "deep purple and indigo ultraviolet light", "neon neon accents").
- **Camera**: Use cinematic terms (e.g., "Extreme macro", "Slow drone shot", "First-person cockpit").
- **Atmosphere**: Define the mood (e.g., "hyper-realistic", "crystalline", "dark atmospheric").
- **Loops**: For backgrounds, ensure the prompt implies a repeatable or slow-moving state.

## Troubleshooting
- **AttributeError**: If polling fails with `'str' object has no attribute 'name'`, ensure you are passing the `GenerateVideosOperation` object itself to `client.operations.get(op)`.
- **Download Failure**: Ensure the `x-goog-api-key` header is included in the download request.
