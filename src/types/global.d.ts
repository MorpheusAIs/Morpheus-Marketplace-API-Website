// Global type declarations for packages without proper TypeScript support

declare module 'hast' {
  export interface Node {
    type: string;
    [key: string]: any;
  }
}

declare module 'mdast' {
  export interface Node {
    type: string;
    [key: string]: any;
  }
}

declare module 'unist' {
  export interface Node {
    type: string;
    [key: string]: any;
  }
}

declare module 'json-schema' {
  export interface Schema {
    [key: string]: any;
  }
}

declare module 'mdx' {
  export interface MDXProps {
    [key: string]: any;
  }
}

declare module 'estree' {
  export interface Node {
    type: string;
    [key: string]: any;
  }
}

declare module 'estree-jsx' {
  export interface JSXNode {
    type: string;
    [key: string]: any;
  }
}
