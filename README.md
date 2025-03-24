# request-template-parsing

Examples

## Hard-coded values

```typescript
processTemplate({ type: "ADDRESS" }, {});
// Returns: { type: "ADDRESS" }
```

## Template values (required)

```typescript
processTemplate({ type: "%type" }, { type: "HOME" });
// Returns: { type: "HOME" }
```

## Template values (optional)

```typescript
processTemplate({ type: "?type" }, {});
// Returns: {} // property is omitted since it's optional and not provided
```

## Mixed usage

```typescript
processTemplate(
  {
    type: "ADDRESS",
    street: "%street",
    unit: "?unit",
  },
  {
    street: "123 Main St",
  }
);
// Returns: {
//   type: "ADDRESS",
//   street: "123 Main St"
// }
```
