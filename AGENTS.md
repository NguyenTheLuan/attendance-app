### For commit:

Follow `.clinerules\commit-rule.md`

### For coding:

Follow `.clinerules\code-style.md`
Follow `.clinerules\design-patterns-architecture.md`
Follow `.clinerules\design-system.md`
Follow `.clinerules\react-architecture.md`

### Rule (must be FOLLOW):

- Avoid style in `App.css`. Should style in specific component with structure:

```
    feature-a/
        feature-a.tsx
        feature-a.css
    ....
```

- Think create component first, easy to reuse - avoid hard code component
- If you are unclear, not force to code - ask user to get information until you are clear. You just do what you know
