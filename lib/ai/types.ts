export interface AIProvider {
  name: string;
  generateText(prompt: string): Promise<string>;
  generateStructured<T>(prompt: string, schema: any): Promise<T>;
}
